// এটি একটি ডামি কম্পোনেন্ট। আপনি আপনার প্রয়োজন অনুযায়ী আসল কম্পোনেন্ট তৈরি করবেন।
function TeamMembersPage() {
    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold mb-4">Team Members</h2>
            <p className="text-gray-600">
                This page will show the bio and details of all team members for a project.
            </p>
            {/* এখানে টিমের সদস্যদের তালিকা রেন্ডার হবে */}
        </div>
    );
}

export default TeamMembersPage;
