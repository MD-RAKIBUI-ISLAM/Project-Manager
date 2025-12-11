// src/pages/Team/TeamMembersPage.jsx

import { useMemo } from 'react';

import { useAuth } from '../../context/AuthContext'; // src/context/AuthContext.jsx থেকে
import { INITIAL_PROJECTS, mockProjectMembers } from '../../utils/constants'; // src/utils/constants.js থেকে
import { getLoggedInUserTeammates } from './MemberID'; // src/pages/Team/MemberID.jsx থেকে

function TeamMembersView() {
    // 1. Auth Context থেকে লগইন করা ইউজার অবজেক্টটি নিন
    const { user, isAuthenticated } = useAuth();

    // 2. useMemo ব্যবহার করে টিমের সদস্য তালিকা তৈরি করুন
    const teammates = useMemo(() => {
        // লগইন করা user এবং তার ID নিশ্চিত করুন
        if (!user || !user.id) {
            return [];
        }

        // 3. ডায়নামিক user.id ব্যবহার করে টিমের সদস্যদের খুঁজে বের করুন
        return getLoggedInUserTeammates(user.id, INITIAL_PROJECTS, mockProjectMembers);
    }, [user]); // user পরিবর্তন হলেই লজিকটি আবার কাজ করবে

    // --- UI রেন্ডারিং ---

    if (!isAuthenticated) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-lg mx-auto mt-10">
                <p className="font-semibold text-xl mb-2">⚠️ Authentication Required</p>
                {/* ⚠️ লগইন প্রয়োজন */}
                <p>Please log in to your account to view the team members list.</p>
                {/* টিম মেম্বারদের তালিকা দেখতে দয়া করে আপনার অ্যাকাউন্টে লগইন করুন। */}
            </div>
        );
    }

    // যদি user.name না থাকে, তবে 'You' দেখাবে
    const currentUserName = user?.name || 'You';

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-200 pb-3">
                    Teammates of {currentUserName}
                    {/* {currentUserName} এর সহকর্মীগণ */}
                </h1>

                {teammates.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-inner">
                        <p className="font-medium text-lg">
                            You are not currently assigned to any projects.
                            {/* আপনি বর্তমানে কোনো প্রজেক্টে যুক্ত নন। */}
                        </p>
                        <p className="text-sm">
                            You need to be part of a project to see shared team members.
                            {/* অন্য কোনো সদস্যের সাথে কাজ করার জন্য প্রজেক্টে যুক্ত হতে হবে। */}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                        {teammates.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg transform hover:scale-[1.02] hover:shadow-xl transition duration-300 ease-in-out"
                            >
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold text-xl flex-shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm font-medium text-green-600 uppercase tracking-wider">
                                            {member.role} {/* Role প্রদর্শিত হলো */}
                                        </p>
                                    </div>
                                </div>
                                {/* <p className="mt-3 text-sm text-gray-500">ID: {member.id}</p> */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeamMembersView;
