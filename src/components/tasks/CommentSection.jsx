// src/components/tasks/CommentSection.jsx মডিফাইড ভার্সন

import { Send, User, X } from 'lucide-react';
import { useState } from 'react';

// 👇 আপনার তৈরি করা context ব্যবহার করা হচ্ছে
import { useComments } from '../../context/CommentContext';

function CommentSection({ task, onClose }) {
    const taskId = task.id;
    const taskTitle = task.title;

    // কনটেক্সট থেকে ডাটা এবং ফাংশন নেয়া হচ্ছে
    const { taskComments, addComment } = useComments();

    // নির্দিষ্ট টাস্কের জন্য কমেন্টগুলো ফিল্টার করা
    const comments = taskComments[taskId] || [];
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const commentToAdd = {
            id: Date.now(),
            user: 'Alice Smith', // এটি আপনার AuthContext থেকে আসা উচিত, আপাতত মক।
            text: newComment,
            time: new Date().toISOString()
        };

        // গ্লোবাল স্টেটে ডাটা সেভ করা
        addComment(taskId, commentToAdd);
        setNewComment('');
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') onClose();
                }}
            />

            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform ease-in-out duration-300">
                    <div className="flex justify-between items-start p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 leading-tight">
                                Comments ({comments.length})
                            </h3>
                            <p className="text-sm text-gray-500 truncate">Task: {taskTitle}</p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-500 p-1"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                            {comments.length === 0 ? (
                                <div className="text-center py-4 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-sm">
                                    No comments yet.
                                </div>
                            ) : (
                                [...comments].reverse().map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-3 bg-gray-50 rounded-lg border border-gray-100"
                                    >
                                        <div className="flex items-center mb-1">
                                            <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center mr-2">
                                                <User className="w-3 h-3 text-indigo-600" />
                                            </div>
                                            <span className="font-semibold text-sm text-gray-800">
                                                {comment.user}
                                            </span>
                                            <span className="text-[10px] text-gray-400 ml-auto">
                                                {new Date(comment.time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap pl-8">
                                            {comment.text}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="flex-shrink-0 pt-4 border-t mt-4 bg-white">
                            <form onSubmit={handlePostComment}>
                                <textarea
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none text-sm outline-none"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
                                    disabled={!newComment.trim()}
                                >
                                    <Send className="w-4 h-4 mr-2" /> Post Comment
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommentSection;
