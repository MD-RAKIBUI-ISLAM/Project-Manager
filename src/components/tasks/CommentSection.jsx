// src/components/tasks/CommentSection.jsx

import { Send, User, X } from 'lucide-react';
import { useState } from 'react';

// --- মক কমেন্ট ডাটা ---
const mockComments = {
    // Task ID 101 এর জন্য কমেন্ট (TaskBoard.jsx এ ব্যবহৃত ID অনুযায়ী আপডেট করুন)
    1: [
        {
            id: 1,
            user: 'Bob Johnson',
            text: 'Frontend structure with Tailwind is initialized.',
            time: '2025-12-08T10:00:00Z'
        }
    ],
    2: [
        {
            id: 2,
            user: 'Alice Smith',
            text: 'Please ensure input validation is handled correctly on the client side for auth forms.',
            time: '2025-12-08T11:30:00Z'
        }
    ]
    // অন্যান্য টাস্ক আইডির জন্য কমেন্ট যোগ করুন
};

/**
 * Task Comment Section Component (FR-14)
 * Displays comments and allows posting new ones in a slide-over pane.
 *
 * @param {object} props
 * @param {object} props.task - The full task object.
 * @param {function} props.onClose - Handler to close the comment section (sidebar).
 */
function CommentSection({ task, onClose }) {
    const taskId = task.id;
    const taskTitle = task.title;

    // টাস্ক আইডি অনুযায়ী কমেন্ট লোড করুন
    const [comments, setComments] = useState(mockComments[taskId] || []);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const commentToAdd = {
            id: Date.now(),
            user: 'Current User (Mock)',
            text: newComment,
            time: new Date().toISOString()
        };

        // নতুন কমেন্ট state এ যোগ করা হলো
        setComments([...comments, commentToAdd]);
        setNewComment('');
    };

    return (
        // Outer Sidebar Container (fixed positioning)
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* ✅ Accessibility Fix: 
            role="button", tabIndex={0} এবং onKeyDown যোগ করা হলো 
            যাতে কিবোর্ড ব্যবহারকারীরাও Esc বাটন ছাড়াও Enter/Space ব্যবহার করে ওভারলে বন্ধ করতে পারে। 
            */}
            <div
                className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        onClose();
                    }
                }}
            />

            {/* Sidebar Content */}
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full transform transition-transform ease-in-out duration-300 translate-x-0">
                    {/* Header with Close Button (FR-14 Request) */}
                    <div className="flex justify-between items-start p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 leading-tight">
                                Comments ({comments.length})
                            </h3>
                            <p className="text-sm text-gray-500 truncate">Task: {taskTitle}</p>
                        </div>

                        {/* Close Icon */}
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-red-500 p-1"
                            title="Close Comments"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Main Content Area (Scrollable) */}
                    <div className="flex-1 overflow-y-auto p-4 flex flex-col">
                        {/* কমেন্ট লিস্ট */}
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                            {comments.length === 0 ? (
                                <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                    <p>No comments yet.</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center mb-1">
                                            <User className="w-4 h-4 mr-2 text-indigo-500" />
                                            <span className="font-semibold text-sm text-gray-800">
                                                {comment.user}
                                            </span>
                                            <span className="text-xs text-gray-400 ml-auto">
                                                {new Date(comment.time).toLocaleDateString()}{' '}
                                                {new Date(comment.time).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                            {comment.text}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* নতুন কমেন্ট ইনপুট ফর্ম (Stuck at the bottom) */}
                        <div className="flex-shrink-0 pt-4 border-t mt-4">
                            <form onSubmit={handlePostComment}>
                                <textarea
                                    rows="3"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                                    placeholder="Write a comment..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="mt-2 w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
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
