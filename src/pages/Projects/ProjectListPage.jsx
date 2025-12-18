// src/pages/Projects/ProjectListPage.jsx

import { Filter, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../components/common/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import { useAuth } from '../../context/AuthContext';
// ✅ mockProjectMembers এবং USER_ROLES ইমপোর্ট করা হলো
import {
    INITIAL_PROJECTS,
    mockProjectMembers,
    PROJECT_STATUSES,
    USER_ROLES
} from '../../utils/constants';

// ধাপ ১: মেম্বার লিস্ট থেকে আইডি-টু-নেম ম্যাপ তৈরি করা
/**
 * @BACKEND_TEAM_NOTE:
 * ইউজার ডেটা বর্তমানে লোকাল মক ফাইল থেকে আসছে। ইন্টিগ্রেশনের সময় ইউজারদের
 * লিস্ট পাওয়ার জন্য একটি ডেডিকেটেড এন্ডপয়েন্ট (GET /api/users) লাগবে।
 */
const userMap = mockProjectMembers.reduce((acc, user) => {
    // আইডিকে স্ট্রিং এ কনভার্ট করা হচ্ছে যেন সকল ক্ষেত্রে সামঞ্জস্য থাকে
    acc[String(user.id)] = user.name;
    return acc;
}, {});

function ProjectListPage() {
    const { user, hasRole } = useAuth();
    const canCreateProject = hasRole(['admin', 'project_manager']);

    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');

    // ✅ পরিবর্তন: 'Assigned to me' ডিফল্ট ফিল্টার স্টেট
    const [filterAssignment, setFilterAssignment] = useState('Assigned to me');

    // FR-5 & FR-7: New Project Save/Edit Handler
    const handleSaveProject = (projectData, isEditing) => {
        /**
         * @BACKEND_TEAM_NOTE:
         * - isEditing === true হলে: PUT/PATCH `/api/projects/${projectData.id}`
         * - isEditing === false হলে: POST `/api/projects`
         * সার্ভার সাইড ভ্যালিডেশন নিশ্চিত করুন যাতে শুধুমাত্র Admin/PM প্রজেক্ট তৈরি/এডিট করতে পারে।
         */
        if (isEditing) {
            // Edit Logic (FR-7)
            setProjects((prevProjects) =>
                prevProjects.map((p) => (p.id === projectData.id ? { ...p, ...projectData } : p))
            );
            console.log(`Project ${projectData.title} updated!`);
        } else {
            // Create Logic (FR-5)
            const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
            const newProject = {
                ...projectData,
                id: newId,
                status: 'To Do',
                progress: 0,
                manager: user?.name || 'Current User',
                managerId: user?.id || null,
                members: projectData.members || []
            };
            setProjects((prevProjects) => [...prevProjects, newProject]);
            console.log(`New Project ${newProject.title} created!`);
        }
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    // ✅ handler: Edit Project Handler
    const handleEditProject = (project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    // ✅ handler: Delete Project Handler
    const handleDeleteProject = (projectId) => {
        /**
         * @BACKEND_TEAM_NOTE:
         * DELETE `/api/projects/${projectId}` কল করতে হবে।
         * ডিলিট করার আগে সংশ্লিষ্ট টাস্ক এবং ফাইলগুলোর ম্যানেজমেন্ট পলিসি ঠিক করতে হবে।
         */
        console.warn(
            'Deletion attempted. A custom modal is required before permanent deletion. Simulating confirmation...'
        );

        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
        console.log(`Project ID ${projectId} deleted.`);
    };

    // FR-8 & Filtering Logic: useMemo আপডেট করা হলো (রোল-ভিত্তিক অ্যাক্সেস কন্ট্রোল যুক্ত)
    const filteredAndSearchedProjects = useMemo(() => {
        /**
         * @BACKEND_TEAM_NOTE:
         * সিকিউরিটির জন্য প্রজেক্ট লিস্ট ফিল্টারিং ব্যাকএন্ড (GET /api/projects) থেকে হওয়া উচিত।
         * বিশেষ করে সাধারণ ইউজার যেন API কল করে অন্যের প্রজেক্টের ডেটা না পায় তা নিশ্চিত করতে হবে।
         * এখানে ব্যবহৃত লজিকটি (Role-based access) ব্যাকএন্ড কুয়েরিতে ইমপ্লিমেন্ট করুন।
         */
        const currentUserId = String(user?.id);
        const userRole = user?.role;

        let filtered = projects;

        if (!user || !userRole) {
            return projects;
        }

        const isManagerOrAdmin =
            userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.PROJECT_MANAGER;

        // --- ✅ রোল-ভিত্তিক অ্যাক্সেস এবং অ্যাসাইনমেন্ট ফিল্টারিং লজিক ---

        // যদি ইউজার সাধারণ ইউজার হন:
        if (!isManagerOrAdmin) {
            // সাধারণ ইউজাররা সর্বদা শুধুমাত্র তাদের অ্যাসাইন করা প্রজেক্টগুলোই দেখতে পাবেন,
            // filterAssignment-এর মান যাই হোক না কেন (এটি অ্যাক্সেস কন্ট্রোল)।
            filtered = filtered.filter(
                (project) =>
                    // Manager: managerId-এর সাথে ইউজার ID হুবহু মিলানো হচ্ছে
                    String(project.managerId) === currentUserId ||
                    // Members: members অ্যারেতে ID আছে কিনা দেখা হচ্ছে
                    (project.members && project.members.map(String).includes(currentUserId))
            );
        }
        // যদি ইউজার Admin/Manager হন:
        else if (filterAssignment === 'Assigned to me') {
            // Admin/Manager যদি ম্যানুয়ালি 'Assigned to me' ফিল্টার সিলেক্ট করেন:
            filtered = filtered.filter(
                (project) =>
                    String(project.managerId) === currentUserId ||
                    (project.members && project.members.map(String).includes(currentUserId))
            );
        }
        // Admin/Manager যখন filterAssignment 'All' হবে, তখন কোনো ফিল্টারিং হবে না,
        // ফলে তারা filtered = projects পাবে (অর্থাৎ সব প্রজেক্ট দেখতে পাবে)।

        // --- শেষ রোল-ভিত্তিক অ্যাক্সেস এবং অ্যাসাইনমেন্ট ফিল্টারিং লজিক ---

        // 2. Filter by Status (FR-8 refinement)
        if (filterStatus !== 'All') {
            filtered = filtered.filter((project) => project.status === filterStatus);
        }

        // 3. Filter by Search Term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((project) => {
                // মেম্বারদের নাম বের করে সার্চের জন্য একটি অস্থায়ী তালিকা তৈরি
                const memberNames = (project.members || [])
                    .map((memberId) => userMap[String(memberId)] || '')
                    .join(' ')
                    .toLowerCase();

                return (
                    project.title.toLowerCase().includes(lowerCaseSearch) ||
                    project.description.toLowerCase().includes(lowerCaseSearch) ||
                    project.manager.toLowerCase().includes(lowerCaseSearch) || // manager name
                    memberNames.includes(lowerCaseSearch) // মেম্বারদের নামের মধ্যে সার্চ
                );
            });
        }

        // 4. Sort by Status (In Progress first)
        return filtered.sort((a, b) => {
            if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
            if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
            return 0;
        });
    }, [projects, user, searchTerm, filterStatus, filterAssignment]);

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Projects</h1>

                {/* Button is shown based on AuthContext's hasRole check */}
                {canCreateProject && (
                    <Button
                        variant="primary"
                        size="md"
                        className="space-x-2"
                        onClick={() => {
                            setProjectToEdit(null); // Set to null for create mode
                            setIsModalOpen(true);
                        }}
                    >
                        <Plus className="h-5 w-5" />
                        <span>Create New Project</span>
                    </Button>
                )}
            </header>

            {/* Search and Filters Section */}
            <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects by title, manager, or member name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition"
                    />
                </div>

                {/* Filter Button: Added onClick handler (FR-8) */}
                <Button
                    variant="secondary"
                    className="flex items-center space-x-2 w-full md:w-auto"
                    onClick={() => {
                        setIsFilterOpen(!isFilterOpen);
                    }}
                >
                    <Filter className="w-5 h-5" />
                    <span>
                        Filter (
                        {filterStatus !== 'All' || filterAssignment !== 'Assigned to me'
                            ? 'Active'
                            : 'Inactive'}
                        )
                    </span>
                </Button>
            </div>

            {/* FR-8: Filter UI Implementaion */}
            {isFilterOpen && (
                <div className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-800 mb-3">
                        Refine Projects (FR-8)
                    </p>

                    <div className="flex flex-wrap gap-4">
                        {/* Assignment Filter */}
                        <div className="flex flex-col space-y-1 w-full sm:w-auto">
                            <label
                                htmlFor="filterAssignment"
                                className="text-xs font-medium text-gray-500"
                            >
                                Assignment
                            </label>
                            <select
                                id="filterAssignment"
                                value={filterAssignment}
                                onChange={(e) => setFilterAssignment(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                // ✅ UI পরিবর্তন: যদি সাধারণ ইউজার হয়, তবে 'All Projects' অপশনটি disabled করা হলো
                                // এবং এটি নির্বাচিত হলেও লজিক অনুযায়ী ফিল্টারডই থাকবে।
                                disabled={
                                    !hasRole(['admin', 'project_manager']) &&
                                    filterAssignment === 'All'
                                }
                            >
                                <option value="Assigned to me">Assigned to me</option>
                                {/* Admin এবং Manager-এর জন্য 'All' অপশনটি রাখা হলো */}
                                {hasRole(['admin', 'project_manager']) && (
                                    <option value="All">All Projects</option>
                                )}
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex flex-col space-y-1 w-full sm:w-auto">
                            <label
                                htmlFor="filterStatus"
                                className="text-xs font-medium text-gray-500"
                            >
                                Status
                            </label>
                            <select
                                id="filterStatus"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="p-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="All">All Statuses</option>
                                {/* PROJECT_STATUSES কন্সট্যান্ট থেকে অপশনগুলি ম্যাপ করা হলো */}
                                {PROJECT_STATUSES.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Project List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSearchedProjects.length > 0 ? (
                    filteredAndSearchedProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            // userMap প্রপস হিসেবে ProjectCard-এ পাস করা হলো
                            userMap={userMap}
                            // ✅ handleEditProject এবং handleDeleteProject ফাংশনগুলো ব্যবহার করা হলো
                            onEdit={canCreateProject ? handleEditProject : null}
                            onDelete={canCreateProject ? handleDeleteProject : null}
                        />
                    ))
                ) : (
                    <div className="lg:col-span-4 text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
                        <p className="text-lg font-medium mb-2">No Projects Found.</p>
                        <p>
                            You haven't been assigned to any project yet, or no projects match your
                            search/filters.
                        </p>
                    </div>
                )}
            </div>

            {/* Project Modal (for Create/Edit) */}
            {isModalOpen && (
                <ProjectForm
                    project={projectToEdit}
                    onClose={() => {
                        setIsModalOpen(false);
                        setProjectToEdit(null);
                    }}
                    onSave={handleSaveProject}
                    // mockProjectMembers কন্সট্যান্ট থেকে ডেটা লোড করা হলো
                    availableMembers={mockProjectMembers}
                />
            )}
        </div>
    );
}

export default ProjectListPage;
