// src/pages/Team/AllMembersView.jsx

import { useNavigate } from 'react-router-dom';

import { mockProjectMembers } from '../../utils/constants';

function AllMembersView() {
    const allMembers = mockProjectMembers;
    const navigate = useNavigate();

    // কার্ডে ক্লিক করলে ইউজার ডিটেইলস পেজে নেভিগেট করবে
    const handleMemberClick = (memberId) => {
        navigate(`/members/${memberId}`);
    };

    // কিবোর্ড ইভেন্ট হ্যান্ডলার: Enter বা Space প্রেস হলে ক্লিক ট্রিগার করে
    const handleKeyDown = (event, memberId) => {
        if (event.key === 'Enter' || event.key === ' ') {
            handleMemberClick(memberId);
        }
    };

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-2 pt-4">Our Members</h1>
                <p className="text-gray-500 mb-8 max-w-lg mx-auto md:mx-0">
                    Credibly innovate granular internal or organic sources
                </p>

                <div className="w-16 h-1 bg-red-500 mb-10" />

                {allMembers.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 rounded-lg shadow-inner">
                        <p className="font-medium text-lg">
                            No members found in the organization list.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                        {allMembers.map((member) => (
                            // ক্লিকেবল কার্ড
                            <div
                                key={member.id}
                                onClick={() => handleMemberClick(member.id)}
                                onKeyDown={(event) => handleKeyDown(event, member.id)} // ✅ কিবোর্ড হ্যান্ডলার যোগ করা হলো
                                role="button" // ✅ রোল যোগ করা হলো
                                tabIndex={0} // ✅ কিবোর্ড নেভিগেশন সাপোর্ট যোগ করা হলো
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
        </div>
    );
}

export default AllMembersView;
