import { CheckCircle, Clock, Link as LinkIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

import Button from '../../components/common/Button';
import { useNotifications } from '../../context/NotificationContext';

function NotificationListPage() {
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

    if (loading) {
        return (
            <div className="p-6 text-center text-lg text-gray-500">Loading Notifications...</div>
        );
    }

    // Helper function to format the notification message (FR-17)
    const getNotificationMessage = (n) => (
        <p className="text-gray-800">
            <span className="font-semibold">{n.actor}</span> {n.verb}{' '}
            <span className="text-indigo-600 font-medium">{n.relatedObject}</span>
        </p>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Notifications ({unreadCount} Unread)
                </h1>
                {/* Mark All as Read Button (FR-18) */}
                <Button
                    variant="secondary"
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                    className="space-x-2"
                >
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark All as Read</span>
                </Button>
            </div>

            {/* Notification List */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden divide-y divide-gray-200">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center text-gray-500 text-lg">
                        You are all caught up! No notifications yet.
                    </div>
                ) : (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`flex items-start p-4 transition duration-200 ${
                                n.is_read
                                    ? 'bg-white hover:bg-gray-50'
                                    : 'bg-indigo-50 hover:bg-indigo-100 border-l-4 border-indigo-500'
                            }`}
                        >
                            <div
                                className={`flex-shrink-0 mt-1 mr-3 ${n.is_read ? 'text-gray-400' : 'text-indigo-600'}`}
                            >
                                <LinkIcon className="w-5 h-5" />
                            </div>

                            <div className="flex-grow min-w-0">
                                {/* Actor, Verb, Related Object (FR-17) */}
                                {getNotificationMessage(n)}

                                <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    {/* Timestamp (FR-17) */}
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {new Date(n.timestamp).toLocaleString()}
                                    </span>

                                    {/* Link to related task (FR-17) */}
                                    <Link
                                        to={n.link}
                                        className="text-indigo-500 hover:underline"
                                        onClick={() => markAsRead(n.id)} // Mark as read on click
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>

                            <div className="flex-shrink-0 ml-4">
                                {/* Mark Read/Unread Status */}
                                {!n.is_read ? (
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => markAsRead(n.id)}
                                    >
                                        Mark Read
                                    </Button>
                                ) : (
                                    <span className="text-xs text-green-500 flex items-center pt-1">
                                        <CheckCircle className="w-3 h-3 mr-1" /> Read
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default NotificationListPage;
