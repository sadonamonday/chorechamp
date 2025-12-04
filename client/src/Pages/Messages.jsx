import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import chatService from '../services/chatService';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';

const Messages = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Fetch conversations on mount
    useEffect(() => {
        if (user) {
            loadConversations();
        }
    }, [user]);

    const loadConversations = async () => {
        try {
            setLoadingConversations(true);
            const data = await chatService.getConversations(user.id);
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations', error);
        } finally {
            setLoadingConversations(false);
        }
    };

    // Handle conversation selection
    const handleSelectConversation = async (conversation) => {
        setSelectedConversation(conversation);
        setLoadingMessages(true);
        try {
            // Mark as read
            await chatService.markAsRead(conversation.id, user.id);

            const msgs = await chatService.getMessages(conversation.id);
            setMessages(msgs);

            // Update local conversation state to show read
            setConversations(prev => prev.map(c => {
                if (c.id === conversation.id && c.lastMessage) {
                    return { ...c, lastMessage: { ...c.lastMessage, is_read: true } };
                }
                return c;
            }));

        } catch (error) {
            console.error('Failed to load messages', error);
        } finally {
            setLoadingMessages(false);
        }
    };

    // Subscribe to new messages for the selected conversation
    useEffect(() => {
        if (!selectedConversation) return;

        const subscription = chatService.subscribeToMessages(selectedConversation.id, (newMessage) => {
            setMessages((prev) => [...prev, newMessage]);

            // Also update the conversation list last message
            setConversations(prev => prev.map(c => {
                if (c.id === selectedConversation.id) {
                    return { ...c, lastMessage: newMessage };
                }
                return c;
            }));
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [selectedConversation]);

    const handleSendMessage = async (text) => {
        if (!selectedConversation || !user) return;

        try {
            // Optimistic update (optional, but good for UX)
            // For now we'll rely on the subscription to update the UI

            await chatService.sendMessage(selectedConversation.id, user.id, text);
            // The subscription will catch the new message and update the UI
        } catch (error) {
            console.error('Failed to send message', error);
            alert('Failed to send message');
        }
    };

    if (!user) {
        return <div className="p-8 text-center">Please log in to view messages.</div>;
    }

    return (
        <div className="flex h-[calc(100vh-64px)] bg-white"> {/* Adjust height based on navbar height */}
            <div className="w-1/3 min-w-[300px] border-r h-full">
                {loadingConversations ? (
                    <div className="p-4 text-center">Loading conversations...</div>
                ) : (
                    <ConversationList
                        conversations={conversations}
                        selectedId={selectedConversation?.id}
                        onSelect={handleSelectConversation}
                    />
                )}
            </div>
            <div className="flex-1 h-full">
                <ChatWindow
                    conversation={selectedConversation}
                    messages={messages}
                    currentUser={user}
                    onSendMessage={handleSendMessage}
                    loading={loadingMessages}
                />
            </div>
        </div>
    );
};

export default Messages;
