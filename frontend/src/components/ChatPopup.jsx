import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { useState, useEffect } from 'react';
import { X, Send, MessageSquare, Users } from 'lucide-react';

const ChatPopup = ({ setShowChat }) => {
    const queryClient = useQueryClient();
    const [activeChat, setActiveChat] = useState(null);
    const [message, setMessage] = useState('');
    const [connections, setConnections] = useState([]);
    
    // Fetch user's connections
    const { data: userConnections } = useQuery({
        queryKey: ['connections'],
        queryFn: async () => {
            const res = await axiosInstance.get('/connections');
            return res.data;
        }
    });

    // Fetch chats
    const { data: chats } = useQuery({
        queryKey: ['chats'],
        queryFn: async () => {
            const res = await axiosInstance.get('/chat');
            return res.data;
        }
    });

    // Fetch messages for active chat
    const { data: messages } = useQuery({
        queryKey: ['messages', activeChat],
        queryFn: async () => {
            if (!activeChat) return [];
            const res = await axiosInstance.get(`/chat/${activeChat}/messages`);
            return res.data;
        },
        enabled: !!activeChat
    });

    const { mutate: sendMessage } = useMutation({
        mutationFn: async () => {
            const res = await axiosInstance.post('/chat/message', {
                chatId: activeChat,
                content: message
            });
            return res.data;
        },
        onSuccess: () => {
            setMessage('');
            queryClient.invalidateQueries(['messages', activeChat]);
            queryClient.invalidateQueries(['chats']);
        }
    });

    // Start a new chat
    const startNewChat = async (userId) => {
        try {
            const res = await axiosInstance.post('/chat', { receiverId: userId });
            setActiveChat(res.data._id);
        } catch (error) {
            console.error("Error starting chat:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 bg-white shadow-xl rounded-lg overflow-hidden z-50 border border-gray-200">
            {/* Header */}
            <div className="bg-primary text-white p-3 flex justify-between items-center">
                <h3 className="font-semibold flex items-center gap-2">
                    <MessageSquare size={18} />
                    {activeChat ? "Chat" : "Messages"}
                </h3>
                <button 
                    onClick={() => setShowChat(false)} 
                    className="text-white hover:text-gray-200"
                >
                    <X size={20} />
                </button>
            </div>
            
            {/* Content Area */}
            <div className="h-96 flex flex-col">
                {activeChat ? (
                    <>
                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                            {messages?.length > 0 ? (
                                messages.map((msg) => (
                                    <div key={msg._id} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-xs p-2 rounded-lg ${msg.sender._id === user._id ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs opacity-70 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No messages yet</p>
                                    <p className="text-sm">Start the conversation!</p>
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="p-3 border-t border-gray-200 bg-white">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 border rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    className="bg-primary text-white p-2 rounded-lg disabled:opacity-50"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Chat List */}
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-3 border-b border-gray-200 bg-gray-50">
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                    <Users size={16} />
                                    Your Connections
                                </h4>
                            </div>
                            
                            {chats?.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {chats.map((chat) => (
                                        <div 
                                            key={chat._id} 
                                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                                            onClick={() => setActiveChat(chat._id)}
                                        >
                                            <img 
                                                src={chat.participants.find(p => p._id !== user._id)?.profilePicture || '/avatar.png'} 
                                                className="w-8 h-8 rounded-full"
                                            />
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {chat.participants.find(p => p._id !== user._id)?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {chat.latestMessage?.content || "No messages yet"}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <p>No chats yet</p>
                                    <p className="text-sm">Connect with people to start chatting</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ChatPopup;