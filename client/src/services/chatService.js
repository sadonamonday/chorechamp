import supabase from './supabaseClient';

export const chatService = {
    // Get all conversations for the current user
    getConversations: async (userId) => {
        try {
            // First get the conversation IDs where the user is a member
            const { data: memberData, error: memberError } = await supabase
                .from('conversation_members')
                .select('conversation_id')
                .eq('user_id', userId);

            if (memberError) throw memberError;

            const conversationIds = memberData.map(m => m.conversation_id);

            if (conversationIds.length === 0) return [];

            // Then get the conversations with details
            const { data: conversations, error: convError } = await supabase
                .from('conversations')
                .select(`
          id,
          created_at,
          task_id,
          tasks (
            title
          ),
          conversation_members (
            user_id,
            profiles (
              id,
              name,
              profile_photo
            )
          ),
          messages (
            message,
            sent_at,
            is_read,
            sender_id
          )
        `)
                .in('id', conversationIds)
                .order('created_at', { ascending: false });

            if (convError) throw convError;

            // Process the data to get the other participant and last message
            return conversations.map(conv => {
                const otherMember = conv.conversation_members.find(m => m.user_id !== userId);
                // Sort messages to get the last one. Ideally we should limit this in the query but Supabase complex queries can be tricky
                const lastMessage = conv.messages && conv.messages.length > 0
                    ? conv.messages.sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at))[0]
                    : null;

                return {
                    id: conv.id,
                    otherUser: otherMember ? otherMember.profiles : null,
                    lastMessage,
                    taskTitle: conv.tasks ? conv.tasks.title : 'General Chat'
                };
            });

        } catch (error) {
            console.error('Error fetching conversations:', error);
            throw error;
        }
    },

    // Get messages for a specific conversation
    getMessages: async (conversationId) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select(`
          id,
          conversation_id,
          sender_id,
          message,
          sent_at,
          is_read,
          profiles (
            name,
            profile_photo
          )
        `)
                .eq('conversation_id', conversationId)
                .order('sent_at', { ascending: true });

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }
    },

    // Send a new message
    sendMessage: async (conversationId, senderId, message) => {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert([
                    {
                        conversation_id: conversationId,
                        sender_id: senderId,
                        message: message
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    },

    // Subscribe to new messages in a conversation
    subscribeToMessages: (conversationId, callback) => {
        return supabase
            .channel(`public:messages:conversation_id=eq.${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`
                },
                (payload) => {
                    callback(payload.new);
                }
            )
            .subscribe();
    },

    // Create a new conversation (if it doesn't exist)
    createConversation: async (userId, otherUserId, taskId = null) => {
        try {
            // Check if conversation already exists between these two users for this task
            // This is a simplified check. For a real app you might want more robust checking.

            // 1. Create conversation
            const { data: convData, error: convError } = await supabase
                .from('conversations')
                .insert([{ task_id: taskId }])
                .select()
                .single();

            if (convError) throw convError;

            // 2. Add members
            const { error: membersError } = await supabase
                .from('conversation_members')
                .insert([
                    { conversation_id: convData.id, user_id: userId },
                    { conversation_id: convData.id, user_id: otherUserId }
                ]);

            if (membersError) throw membersError;

            return convData;

        } catch (error) {
            console.error('Error creating conversation:', error);
            throw error;
        }
    },

    markAsRead: async (conversationId, userId) => {
        try {
            const { error } = await supabase
                .from('messages')
                .update({ is_read: true })
                .eq('conversation_id', conversationId)
                .neq('sender_id', userId) // Mark messages sent by others as read
                .eq('is_read', false);

            if (error) throw error;
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    }
};

export default chatService;
