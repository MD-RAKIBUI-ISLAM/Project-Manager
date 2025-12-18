// src/pages/Team/TeamMembersPage.jsx

import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ChatWidget from '../../components/Chat/ChatWidget';
import { useAuth } from '../../context/AuthContext';
import { INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants'; // BACKEND TEAM: Replace these mock constants with real DB data
import { getLoggedInUserTeammates } from './MemberID';

function TeamMembersView() {
    const { user, isAuthenticated } = useAuth(); // BACKEND TEAM: 'user.id' is used to identify the logged-in user
    const navigate = useNavigate();

    const [selectedTeammate, setSelectedTeammate] = useState(null);

    const teammates = useMemo(() => {
        if (!user || !user.id) {
            return [];
        }
        // BACKEND TEAM: This function currently filters mock data based on projects.
        // It should be replaced with an API call like: GET /api/users/${user.id}/teammates
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

    const handleOpenChat = (e, member) => {
        e.stopPropagation();
        setSelectedTeammate(member);
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
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 pt-4">My Teammates</h1>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto md:mx-0">
                    Active team members from projects shared with {currentUserName}
                </p>

                <div className="w-16 h-1 bg-red-500 mb-10" />

                {teammates.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-inner">
                        <p className="font-medium text-lg">
                            You are not currently assigned to any projects.
                        </p>
                        <p className="text-sm">
                            You need to be part of a project to see shared team members.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {teammates.map((member) => (
                            <div
                                key={member.id} // BACKEND TEAM: Unique User ID from Database
                                onClick={() => handleMemberClick(member.id)}
                                onKeyDown={(event) => handleKeyDown(event, member.id)}
                                role="button"
                                tabIndex={0}
                                className="relative bg-white shadow-xl rounded-xl overflow-hidden cursor-pointer group 
                                           transform hover:shadow-2xl transition duration-300 ease-in-out"
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

                                    <button
                                        type="button"
                                        onClick={(e) => handleOpenChat(e, member)}
                                        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-red-500 hover:text-white p-3 rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                                        title="Chat now"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                                            />
                                        </svg>
                                    </button>
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

            {selectedTeammate && (
                <ChatWidget teammate={selectedTeammate} onClose={() => setSelectedTeammate(null)} />
            )}
        </div>
    );
}

export default TeamMembersView;
