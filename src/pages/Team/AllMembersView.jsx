// src/pages/Team/AllMembersView.jsx

import { mockProjectMembers } from '../../utils/constants';

function AllMembersView() {
    const allMembers = mockProjectMembers;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-800 mb-8 border-b-2 border-gray-200 pb-3">
                    Our Members
                    {/* এটি হবে "Our Members" মেনুটির শিরোনাম */}
                </h1>

                {allMembers.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border-b-2 border-gray-200 text-yellow-800 rounded-lg shadow-inner">
                        <p className="font-medium text-lg">
                            No members found in the organization list.
                            {/* সংস্থার তালিকায় কোনো সদস্য পাওয়া যায়নি। */}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                        {allMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white p-5 rounded-xl border border-gray-200 shadow-lg transform hover:scale-[1.02] hover:shadow-xl transition duration-300 ease-in-out"
                            >
                                <div className="flex items-center justify-center space-x-4">
                                    {/* অ্যাভাটার / প্রথম অক্ষর */}
                                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 font-bold text-xl flex-shrink-0">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {member.name}
                                        </h3>
                                        {/* ভূমিকা (Role) দেখানো হচ্ছে */}
                                        <p className="text-sm font-medium text-indigo-600 uppercase tracking-wider">
                                            {member.role}
                                        </p>
                                    </div>
                                </div>
                                {/* ID দেখানো হচ্ছে না, শুধুমাত্র নাম এবং ভূমিকা */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllMembersView;
