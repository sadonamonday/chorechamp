import React from 'react';

const ConversationList = ({ conversations, selectedId, onSelect }) => {
    return (
        <div className="flex flex-col h-full overflow-y-auto bg-gray-50 border-r">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
            </div>
            <div className="flex-1">
                {conversations.length === 0 ? (
                    <p className="p-4 text-gray-500 text-center">No conversations yet.</p>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => onSelect(conv)}
                            className={`p-4 border-b cursor-pointer hover:bg-gray-100 transition-colors ${selectedId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    {conv.otherUser?.profile_photo ? (
                                        <img
                                            src={conv.otherUser.profile_photo}
                                            alt={conv.otherUser.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-600 font-semibold">
                                            {conv.otherUser?.name?.charAt(0) || '?'}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-medium text-gray-900 truncate">
                                            {conv.otherUser?.name || 'Unknown User'}
                                        </h3>
                                        {conv.lastMessage && (
                                            <span className="text-xs text-gray-500">
                                                {new Date(conv.lastMessage.sent_at).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {conv.taskTitle && <span className="font-semibold mr-1">[{conv.taskTitle}]</span>}
                                        {conv.lastMessage?.message || 'No messages yet'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ConversationList;
