// src/pages/Team/TeamMembersPage.jsx

// ✅ Lucide React থেকে আইকন ইমপোর্ট
import { MessageSquareMore } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatWidget from '../../components/Chat/ChatWidget';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants';
import { getLoggedInUserTeammates } from './MemberID';

function TeamMembersView() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);

    const teammates = useMemo(() => {
        if (!user || !user.id) {
            return [];
        }
        return getLoggedInUserTeammates(user.id, INITIAL_PROJECTS, mockProjectMembers);
    }, [user]);

    const currentUserName = user?.name || 'You';

    const handleMemberClick = (memberId) => {
        navigate(`/members/${memberId}`);
    };

    const handleKeyDown = (event, memberId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleMemberClick(memberId);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="font-semibold text-xl mb-2">⚠️ Authentication Required</p>
                <p>Please log in to your account to view the team members list.</p>
            </div>
        );
    }

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen relative">
            <div className="max-w-7xl mx-auto relative">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-800 mb-2 pt-4">
                            My Teammates
                        </h1>
                        <p className="text-gray-500 max-w-lg">
                            Active team members from projects shared with {currentUserName}
                        </p>
                        <div className="w-16 h-1 bg-red-500 mt-4" />
                    </div>

                    {/* ✅ Sticky Group Chat Button */}
                    <div className="sticky top-6 z-30 ml-4 self-start">
                        <button
                            type="button"
                            onClick={() => setIsGroupChatOpen(true)}
                            className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-full hover:bg-red-600 transition-all font-bold shadow-xl hover:scale-105 active:scale-95 whitespace-nowrap border border-white/20"
                        >
                            {/* ✅ Lucide Icon ব্যবহার করা হয়েছে */}
                            <MessageSquareMore className="w-5 h-5" />
                            <span className="text-sm tracking-wide">Chat</span>
                        </button>
                    </div>
                </div>

                {/* Teammates List logic (unchanged) */}
                {teammates.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-inner text-center">
                        <p className="font-medium text-lg">No teammates found.</p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {teammates.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => handleMemberClick(member.id)}
                                onKeyDown={(event) => handleKeyDown(event, member.id)}
                                role="button"
                                tabIndex={0}
                                className="relative bg-white shadow-xl rounded-xl overflow-hidden cursor-pointer group transform hover:shadow-2xl transition duration-300"
                            >
                                <div className="aspect-square w-full relative overflow-hidden">
                                    <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-10 transition-opacity duration-300" />
                                    {member.image ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold text-6xl">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-center">
                                    <h3 className="text-2xl font-bold text-white mb-0">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-gray-200 font-medium uppercase tracking-wider">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isGroupChatOpen && (
                <ChatWidget
                    user={user}
                    teammates={teammates}
                    onClose={() => setIsGroupChatOpen(false)}
                />
            )}
        </div>
    );
}

export default TeamMembersView;
