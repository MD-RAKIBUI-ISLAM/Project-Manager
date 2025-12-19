// src/pages/Projects/ProjectListPage.jsx

import { Filter, Plus, Search } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import Button from '../../components/common/Button';
import ProjectCard from '../../components/projects/ProjectCard';
import ProjectForm from '../../components/projects/ProjectForm';
import { useActivity } from '../../context/ActivityContext';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext'; // ✅ Notification Context ইম্পোর্ট
import {
    INITIAL_PROJECTS,
    mockProjectMembers,
    PROJECT_STATUSES,
    USER_ROLES
} from '../../utils/constants';

const userMap = mockProjectMembers.reduce((acc, user) => {
    acc[String(user.id)] = user.name;
    return acc;
}, {});

function ProjectListPage() {
    const { user, hasRole } = useAuth();
    const { logActivity } = useActivity();
    const { addNotification } = useNotifications(); // ✅ নোটিফিকেশন পাঠানোর ফাংশন

    const userRole = user?.role;
    const isManagerOrAdmin =
        userRole === USER_ROLES.ADMIN || userRole === USER_ROLES.PROJECT_MANAGER;

    const canCreateProject = hasRole(['admin', 'project_manager']);

    const [projects, setProjects] = useState(INITIAL_PROJECTS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState('All');
    const [filterAssignment, setFilterAssignment] = useState('Assigned to me');

    // ✅ সমন্বিত সেভ ফাংশন (Activity + Notification)
    const handleSaveProject = useCallback(
        (projectData, isEditing) => {
            const currentUserName = user?.name || 'User';

            if (isEditing) {
                setProjects((prevProjects) =>
                    prevProjects.map((p) =>
                        p.id === projectData.id ? { ...p, ...projectData } : p
                    )
                );

                // ১. একটিভিটি লগ আপডেট
                logActivity(currentUserName, 'updated the project', projectData.title);

                // ২. সেন্ট্রাল নোটিফিকেশন পাঠানো
                addNotification(
                    currentUserName,
                    'updated the project',
                    projectData.title,
                    `/projects/${projectData.id}`
                );
            } else {
                const newId = projects.length > 0 ? Math.max(...projects.map((p) => p.id)) + 1 : 1;
                const newProject = {
                    ...projectData,
                    id: newId,
                    status: 'To Do',
                    progress: 0,
                    manager: currentUserName,
                    managerId: user?.id || null,
                    members: projectData.members || []
                };
                setProjects((prevProjects) => [...prevProjects, newProject]);

                // ১. একটিভিটি লগ আপডেট
                logActivity(currentUserName, 'created a new project', newProject.title);

                // ২. সেন্ট্রাল নোটিফিকেশন পাঠানো
                addNotification(
                    currentUserName,
                    'created a new project',
                    newProject.title,
                    `/projects/${newId}`
                );
            }
            setIsModalOpen(false);
            setProjectToEdit(null);
        },
        [projects, user, logActivity, addNotification]
    );

    const handleEditProject = useCallback((project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
    }, []);

    // ✅ সমন্বিত ডিলিট ফাংশন
    const handleDeleteProject = useCallback(
        (projectId) => {
            const projectToDelete = projects.find((p) => p.id === projectId);
            const projectTitle = projectToDelete ? projectToDelete.title : 'Unknown Project';
            const currentUserName = user?.name || 'User';

            setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId));

            // ১. একটিভিটি লগ আপডেট
            logActivity(currentUserName, 'deleted the project', projectTitle);

            // ২. সেন্ট্রাল নোটিফিকেশন পাঠানো
            addNotification(currentUserName, 'deleted the project', projectTitle, '/projects');
        },
        [projects, user, logActivity, addNotification]
    );

    const filteredAndSearchedProjects = useMemo(() => {
        const currentUserId = String(user?.id);
        let filtered = projects;

        if (!user || !userRole) return projects;

        if (!isManagerOrAdmin || filterAssignment === 'Assigned to me') {
            filtered = filtered.filter(
                (project) =>
                    String(project.managerId) === currentUserId ||
                    (project.members && project.members.map(String).includes(currentUserId))
            );
        }

        if (filterStatus !== 'All') {
            filtered = filtered.filter((project) => project.status === filterStatus);
        }

        if (searchTerm) {
            const lowerCaseSearch = searchTerm.toLowerCase();
            filtered = filtered.filter((project) => {
                const memberNames = (project.members || [])
                    .map((memberId) => userMap[String(memberId)] || '')
                    .join(' ')
                    .toLowerCase();

                return (
                    project.title.toLowerCase().includes(lowerCaseSearch) ||
                    project.description.toLowerCase().includes(lowerCaseSearch) ||
                    project.manager.toLowerCase().includes(lowerCaseSearch) ||
                    memberNames.includes(lowerCaseSearch)
                );
            });
        }

        return filtered.sort((a) => (a.status === 'In Progress' ? -1 : 1));
    }, [projects, user, userRole, isManagerOrAdmin, searchTerm, filterStatus, filterAssignment]);

    return (
        <div className="p-6 md:p-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">My Projects</h1>
                {canCreateProject && (
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => {
                            setProjectToEdit(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Plus className="h-5 w-5" />
                        <span>Create New Project</span>
                    </Button>
                )}
            </header>

            <div className="mb-6 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm outline-none transition"
                    />
                </div>

                <Button
                    type="button"
                    variant="secondary"
                    className="flex items-center space-x-2 w-full md:w-auto"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                </Button>
            </div>

            {/* Filter Dropdown UI */}
            {isFilterOpen && (
                <div className="bg-white p-4 rounded-xl shadow mb-6 border border-gray-200 animate-in fade-in duration-200">
                    <div className="flex flex-wrap gap-4">
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
                                className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="Assigned to me">Assigned to me</option>
                                {isManagerOrAdmin && <option value="All">All Projects</option>}
                            </select>
                        </div>

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
                                className="p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                            >
                                <option value="All">All Statuses</option>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSearchedProjects.length > 0 ? (
                    filteredAndSearchedProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            userMap={userMap}
                            onEdit={canCreateProject ? handleEditProject : null}
                            onDelete={canCreateProject ? handleDeleteProject : null}
                        />
                    ))
                ) : (
                    <div className="lg:col-span-4 text-center py-10 bg-white rounded-xl border-2 border-dashed border-gray-300 text-gray-500">
                        <p className="text-lg font-medium mb-2">No Projects Found.</p>
                    </div>
                )}
            </div>

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
