// src/pages/Projects/ProjectListPage.jsx

import { Filter, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../components/common/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
// import useAuth from '../../hooks/useAuth'; // ✅ রিয়েল অ্যাপে এটিকে আনকমেন্ট করতে হবে

// --- MOCK AUTH HOOK FOR TESTING ---
// এই মকটি এখন ইউজার ক্রিয়েট/এডিট বাটন দেখতে পাচ্ছেন তা নিশ্চিত করছে।
const MOCK_CURRENT_USER = { name: 'Alice Smith', role: 'PROJECT_MANAGER' };

const useAuth = () => {
    // Faking user and permission check to force buttons/icons to display
    const isPermitted = () =>
        // For development/mock purposes, always permit ADMIN/PROJECT_MANAGER roles here
        true;
    return {
        user: MOCK_CURRENT_USER,
        isPermitted,
        userRole: MOCK_CURRENT_USER.role
    };
};
// --- END MOCK AUTH HOOK ---

// --- MOCK DATA ---
const initialProjects = [
    {
        id: 1,
        title: 'TaskMaster Core Backend',
        description:
            'Design and implement the core Django backend, including API endpoints for Auth, Projects, and Tasks. Focus on security and performance (NFR-1, NFR-3).',
        startDate: '2025-12-01',
        endDate: '2026-01-15',
        status: 'In Progress',
        progress: 45, // Percentage
        manager: 'Alice Smith (PM)',
        members: ['Alice Smith', 'Bob Johnson', 'Eve Adams']
    },
    {
        id: 2,
        title: 'Frontend UI/UX Implementation',
        description:
            'Develop the React frontend using Tailwind CSS. Focus on responsive design (NFR-7) and Task Board (Kanban) implementation (FR-15).',
        startDate: '2025-11-25',
        endDate: '2026-01-30',
        status: 'In Progress',
        progress: 60,
        manager: 'Bob Johnson (PM)',
        members: ['Alice Smith', 'Bob Johnson', 'Chris Lee']
    },
    {
        id: 3,
        title: 'Database Migration & Setup',
        description:
            'Set up production PostgreSQL database and handle initial data migration and environment configuration.',
        startDate: '2025-11-10',
        endDate: '2025-12-05',
        status: 'Completed',
        progress: 100,
        manager: 'Chris Lee (Admin)',
        members: ['Chris Lee']
    }
];

// Mock User Data for ProjectForm's availableMembers
const mockProjectMembers = [
    { id: 1, name: 'Alice Smith', role: 'Project Manager' },
    { id: 2, name: 'Bob Johnson', role: 'Team Member' },
    { id: 3, name: 'Chris Lee', role: 'Admin' },
    { id: 4, name: 'David Kim', role: 'Team Member' },
    { id: 5, name: 'Eve Adams', role: 'Team Member' }
];

// --- END MOCK DATA ---

function ProjectListPage() {
    const { user, isPermitted } = useAuth();
    const [projects, setProjects] = useState(initialProjects);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // ✅ FR-8: নতুন স্টেট যোগ করা হলো ফিল্টারিংয়ের জন্য
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All'); // 'All', 'To Do', 'In Progress', 'Completed'
    const [filterAssignment, setFilterAssignment] = useState('Assigned to me'); // 'Assigned to me', 'All'

    // FR-5 & FR-7: New Project Save/Edit Handler
    const handleSaveProject = (projectData, isEditing) => {
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
                manager: `${user?.name || 'Current User'} (PM)`
            };
            setProjects((prevProjects) => [...prevProjects, newProject]);
            console.log(`New Project ${newProject.title} created!`);
        }
        setIsModalOpen(false);
        setProjectToEdit(null);
    };

    // FR-7: Edit Project Handler (Opens Modal)
    const handleEditProject = (project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    };

    // ✅ FR-7: Delete Project Handler (Custom Modal Placeholder)
    const handleDeleteProject = (projectId) => {
        // ⚠️ CRITICAL CHANGE: window.confirm/alert বাদ দেওয়া হলো।
        // প্রোডাকশনে ব্যবহারের জন্য এখানে অবশ্যই একটি কাস্টম কনফার্মেশন মোডাল রেন্ডার করতে হবে।
        console.warn(
            'Deletion attempted. A custom modal is required before permanent deletion. Simulating confirmation...'
        );

        // --- START: Temporary Simulated Deletion Logic ---
        // ধরে নেওয়া হলো ইউজার কাস্টম মোডালে "Confirm" করেছেন
        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));
        console.log(`Project ID ${projectId} deleted.`);
        // --- END: Temporary Simulated Deletion Logic ---
    };

    // FR-3: Check if the user is Project Manager or Admin (Now returns true via MOCK)
    const canCreateProject = isPermitted();

    // ✅ FR-8 & Filtering Logic: useMemo আপডেট করা হলো নতুন ফিল্টার স্টেটগুলির জন্য
    const filteredAndSearchedProjects = useMemo(() => {
        const userName = user?.name || 'Alice Smith';
        let filtered = projects;

        // 1. Filter by User Assignment (FR-8 refinement)
        if (filterAssignment === 'Assigned to me') {
            filtered = filtered.filter(
                (project) =>
                    project.manager.includes(userName) || project.members.includes(userName)
            );
        }

        // 2. Filter by Status (FR-8 refinement)
        if (filterStatus !== 'All') {
            filtered = filtered.filter((project) => project.status === filterStatus);
        }

        // 3. Filter by Search Term
        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(
                (project) =>
                    project.title.toLowerCase().includes(lowerCaseSearch) ||
                    project.description.toLowerCase().includes(lowerCaseSearch) ||
                    project.manager.toLowerCase().includes(lowerCaseSearch) ||
                    project.members.some((member) => member.toLowerCase().includes(lowerCaseSearch))
            );
        }

        // 4. Sort by Status (In Progress first)
        return filtered.sort((a, b) => {
            if (a.status === 'In Progress' && b.status !== 'In Progress') return -1;
            if (a.status !== 'In Progress' && b.status === 'In Progress') return 1;
            return 0;
        });
    }, [projects, user, searchTerm, filterStatus, filterAssignment]); // Dependency Array আপডেট করা হলো

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Projects</h1>

                {/* Button is now guaranteed to show because canCreateProject is true */}
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
                        placeholder="Search projects by title, manager, or member..."
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

            {/* ✅ FR-8: Filter UI Implementaion */}
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
                            >
                                <option value="Assigned to me">Assigned to me</option>
                                <option value="All">All Projects</option>
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
                                <option value="In Progress">In Progress</option>
                                <option value="To Do">To Do</option>
                                <option value="Completed">Completed</option>
                                <option value="On Hold">On Hold</option>
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
                            // onEdit and onDelete icons are shown based on permission
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
                    availableMembers={mockProjectMembers}
                />
            )}
        </div>
    );
}

export default ProjectListPage;
