// src/components/Chat/ChatWidget.jsx

import { Camera, Check, Pencil, Send, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function ChatWidget({ user, teammates, onClose }) {
    const [message, setMessage] = useState('');
    const [showMentionList, setShowMentionList] = useState(false);
    const [isEditingName, setIsEditingName] = useState(false);

    const scrollRef = useRef(null);
    const fileInputRef = useRef(null);
    const editInputRef = useRef(null); // autoFocus এর বিকল্প হিসেবে

    const [groupName, setGroupName] = useState(
        () => localStorage.getItem('chat_group_name') || 'Team Group Chat'
    );

    const [groupImage, setGroupImage] = useState(
        () => localStorage.getItem('chat_group_image') || null
    );

    const [chatHistory, setChatHistory] = useState(() => {
        const savedChat = localStorage.getItem(`team_group_chat`);
        return savedChat ? JSON.parse(savedChat) : [];
    });

    // এডিট মোড অন হলে ইনপুট ফোকাস করার জন্য
    useEffect(() => {
        if (isEditingName && editInputRef.current) {
            editInputRef.current.focus();
        }
    }, [isEditingName]);

    useEffect(() => {
        localStorage.setItem(`team_group_chat`, JSON.stringify(chatHistory));
        localStorage.setItem('chat_group_name', groupName);
        if (groupImage) localStorage.setItem('chat_group_image', groupImage);

        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chatHistory, groupName, groupImage]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setGroupImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const formatMessage = (text) => {
        const mentionRegex = /(@\S+)/g;
        return text.split(mentionRegex).map((part, index) =>
            mentionRegex.test(part) ? (
                <span key={index} className="text-gray-600 font-bold">
                    {part}
                </span>
            ) : (
                part
            )
        );
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const mentionMatch = message.match(/@(\S+)/);
        const mentionedName = mentionMatch ? mentionMatch[1].toLowerCase() : null;

        const newMessage = {
            id: Date.now(),
            text: message,
            senderId: user.id,
            senderName: user.name,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isPrivate: !!mentionedName,
            targetUser: mentionedName
        };

        setChatHistory((prev) => [...prev, newMessage]);
        setMessage('');
        setShowMentionList(false);
    };

    const selectMention = (name) => {
        const parts = message.split('@');
        parts.pop();
        const cleanName = name.replace(/\s+/g, '');
        setMessage(`${parts.join('@')}@${cleanName} `);
        setShowMentionList(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white w-85 h-[500px] shadow-2xl rounded-xl flex flex-col border border-gray-300 relative overflow-hidden">
                {/* Header */}
                <div className="bg-red-500 p-3 text-white flex justify-between items-center shadow-lg">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Profile Image Button */}
                        <button
                            type="button"
                            className="relative group w-12 h-12 rounded-full border-2 border-white/50 overflow-hidden bg-red-600 flex items-center justify-center shrink-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
                            onClick={() => fileInputRef.current?.click()}
                            aria-label="Upload group image"
                        >
                            {groupImage ? (
                                <img
                                    src={groupImage}
                                    alt="Group"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xl font-bold">👥</span>
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera size={16} />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                        </button>

                        <div className="flex flex-col flex-1 min-w-0">
                            {isEditingName ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        ref={editInputRef}
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        onBlur={() => setIsEditingName(false)}
                                        onKeyDown={(e) =>
                                            e.key === 'Enter' && setIsEditingName(false)
                                        }
                                        className="bg-red-700 text-white text-sm font-bold px-2 py-1 rounded outline-none border border-white/30 w-full"
                                    />
                                    <button type="button" onClick={() => setIsEditingName(false)}>
                                        <Check size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    <span className="text-sm font-bold truncate">{groupName}</span>
                                    <Pencil
                                        size={12}
                                        className="opacity-70 group-hover:opacity-100 shrink-0"
                                    />
                                </button>
                            )}
                            <span className="text-[10px] text-red-100 opacity-80">
                                {teammates.length} Members
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="hover:bg-red-600 p-2 rounded-full transition-colors shrink-0"
                        aria-label="Close chat"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Chat History */}
                <div
                    ref={scrollRef}
                    className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4"
                >
                    {chatHistory.map((chat) => {
                        const isMe = chat.senderId === user.id;
                        const amIMentioned =
                            chat.targetUser &&
                            user.name.toLowerCase().replace(/\s+/g, '').includes(chat.targetUser);
                        if (chat.isPrivate && !isMe && !amIMentioned) return null;

                        return (
                            <div
                                key={chat.id}
                                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-[9px] text-gray-500 mb-1 px-1">
                                    {isMe ? 'You' : chat.senderName}
                                </span>
                                <div
                                    className={`p-2.5 rounded-xl text-xs shadow-sm max-w-[85%] break-words ${
                                        chat.isPrivate
                                            ? 'bg-amber-100 border-l-4 border-amber-500 text-gray-800'
                                            : isMe
                                              ? 'bg-red-500 text-white rounded-tr-none'
                                              : 'bg-white border rounded-tl-none'
                                    }`}
                                >
                                    {formatMessage(chat.text)}
                                </div>
                                <span className="text-[9px] text-gray-400 mt-1 px-1">
                                    {chat.time}
                                </span>
                            </div>
                        );
                    })}
                </div>

                {/* Mention Dropdown */}
                {showMentionList && (
                    <div className="absolute bottom-16 left-2 right-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-[60] max-h-40 overflow-y-auto">
                        {teammates.map((member) => (
                            <button
                                key={member.id}
                                type="button"
                                onClick={() => selectMention(member.name)}
                                className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 flex items-center gap-2 border-b last:border-0"
                            >
                                <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="flex items-center justify-center h-full text-[10px]">
                                            {member.name[0]}
                                        </span>
                                    )}
                                </div>
                                <span className="truncate">{member.name}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Input Area */}
                <form className="p-3 bg-white border-t flex gap-2" onSubmit={handleSendMessage}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value);
                            if (e.target.value.endsWith('@')) setShowMentionList(true);
                            else if (!e.target.value.includes('@')) setShowMentionList(false);
                        }}
                        placeholder="Type @ to mention..."
                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                    <button
                        type="submit"
                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-md transition-transform active:scale-90 flex items-center justify-center"
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatWidget;
