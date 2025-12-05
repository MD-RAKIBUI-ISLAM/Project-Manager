import { Send, User } from 'lucide-react';
import { useState } from 'react';

// --- মক কমেন্ট ডাটা ---
const mockComments = {
    // Task ID 101 এর জন্য কমেন্ট
    101: [
        {
            id: 1,
            user: 'Bob Johnson',
            text: 'Schemas are ready. Pushed to dev branch.',
            time: '2025-12-08T10:00:00Z'
        },
        {
            id: 2,
            user: 'Alice Smith',
            text: 'Great! Please start the Auth API next.',
            time: '2025-12-08T11:30:00Z'
        }
    ],
    // Task ID 202 এর জন্য কমেন্ট
    202: [
        {
            id: 3,
            user: 'Chris Lee',
            text: 'Starting work on the TaskModal component structure.',
            time: '2025-12-15T14:00:00Z'
        }
    ]
    // অন্যান্য টাস্ক আইডির জন্য কমেন্ট যোগ করুন
};

function CommentSection({ taskId }) {
    // টাস্ক আইডি অনুযায়ী কমেন্ট লোড করুন
    const [comments, setComments] = useState(mockComments[taskId] || []);
    const [newComment, setNewComment] = useState('');

    const handlePostComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const commentToAdd = {
            id: Date.now(),
            user: 'Current User (Mock)', // এখানে আসল ব্যবহারকারীর তথ্য ব্যবহার করুন
            text: newComment,
            time: new Date().toISOString()
        };

        // নতুন কমেন্ট state এ যোগ করা হলো
        setComments([...comments, commentToAdd]);
        setNewComment('');
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
                Comments ({comments.length})
            </h3>

            {/* কমেন্ট লিস্ট */}
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
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

            {/* নতুন কমেন্ট ইনপুট ফর্ম */}
            <form onSubmit={handlePostComment} className="pt-4 border-t">
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
    );
}

export default CommentSection;
