// src/utils/projectUtils.js

/**
 * লগইন করা ইউজারের ID ব্যবহার করে সেই ইউজারের সাথে একই প্রজেক্টে থাকা
 * সকল সহকর্মীর (Teammates) তালিকা খুঁজে বের করার লজিক।
 *
 * @param {number | string} loggedInUserId - লগইন করার পর পাওয়া ইউজারের ID।
 * @param {Array} projects - সমস্ত প্রজেক্টের তালিকা (INITIAL_PROJECTS)।
 * @param {Array} membersList - সমস্ত সদস্যদের তালিকা (mockProjectMembers)।
 * @returns ইউজারটির সকল সহকর্মীর সম্পূর্ণ তথ্যের একটি Array।
 */
const getLoggedInUserTeammates = (loggedInUserId, projects, membersList) => {
    // ID কে Number এ কনভার্ট করা হচ্ছে
    const userId = Number(loggedInUserId);

    // বৈধতা যাচাই: Number.isNaN ব্যবহার করা হলো (ESLint Fix) এবং userId 0 বা null কিনা দেখা হলো।
    if (Number.isNaN(userId) || !userId) {
        return [];
    }

    // ১. ইউজার যে সব প্রজেক্টে আছেন, সেগুলি খুঁজুন।
    const userProjects = projects.filter((project) => project.members.includes(userId));

    // ২. এই প্রজেক্টগুলোর সকল মেম্বার আইডি একত্রিত করুন (ডুপ্লিকেট বাদ দিতে Set ব্যবহার করা হলো)।
    const allTeammateIds = new Set();
    userProjects.forEach((project) => {
        project.members.forEach((memberId) => {
            // ৩. নিজেকে তালিকা থেকে বাদ দিন।
            if (memberId !== userId) {
                allTeammateIds.add(memberId);
            }
        });
    });

    // ৪. ইউনিক আইডিগুলোর সাথে মেম্বার লিস্ট থেকে সম্পূর্ণ তথ্য ম্যাপ করুন।
    const uniqueTeammates = Array.from(allTeammateIds)
        .map((teammateId) => membersList.find((member) => member.id === teammateId))
        .filter((member) => member !== undefined);

    return uniqueTeammates;
};

export default getLoggedInUserTeammates;
export { getLoggedInUserTeammates };
