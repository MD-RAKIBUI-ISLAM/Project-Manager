// src/components/projects/ProjectCard.jsx

import { Calendar, Edit, Trash2, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom'; // Used for FR-6: Navigation to Project Details

/**
 * Renders a single project card with options for viewing details, editing, and deleting.
 * This component is responsible for displaying the Edit/Delete icons and handling navigation.
 * * @param {object} props
 * @param {object} props.project - The project data object.
 * @param {function} [props.onEdit] - Handler function to open the edit modal.
 * @param {function} [props.onDelete] - Handler function to delete the project.
 */
function ProjectCard({ project, onEdit, onDelete }) {
    // Determine the color for the status pill
    const statusColor = (status) => {
        switch (status) {
            case 'In Progress':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'To Do':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    // Determine the color for the progress bar
    const progressColor = (progress) => {
        if (progress === 100) return 'bg-green-500';
        if (progress >= 50) return 'bg-indigo-500';
        return 'bg-yellow-500';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-gray-100">
            {/* Header and Actions */}
            <div className="p-5 pb-3 flex justify-between items-start">
                {/* Status Pill */}
                <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColor(project.status)} flex items-center space-x-1`}
                >
                    <TrendingUp className="w-3 h-3" />
                    <span>{project.status}</span>
                </span>

                {/* Actions (Edit and Delete) - Shown only if handlers are provided */}
                <div className="flex space-x-2">
                    {/* FR-7: Edit Icon (Triggers Modal in ProjectListPage) */}
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(project)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
                            title="Edit Project"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    {/* FR-7: Delete Icon (Triggers deletion in ProjectListPage) */}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(project.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
                            title="Delete Project"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Body */}
            <div className="flex flex-col p-5 pt-0 flex-grow">
                {/* FR-6: Title (Link to Details Page) */}
                <Link
                    to={`/projects/${project.id}`} // Navigates to Project Details Page
                    className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 mb-2"
                    title={project.title}
                >
                    {project.title}
                </Link>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                    {project.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Manager:</span>
                        <span>{project.manager.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">Team Members:</span>
                        <span>
                            {project.members.length} Team Member
                            {project.members.length !== 1 ? 's' : ''}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Start:</span>
                        <span>{project.startDate}</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-medium">Due:</span>
                        <span>{project.endDate}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div>
                    <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className={`h-2.5 rounded-full transition-all duration-500 ${progressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
