// src/components/projects/ProjectCard.jsx

import { Calendar, Edit, ImagePlus, Trash2, TrendingUp, User } from 'lucide-react';
import { Link } from 'react-router-dom';

import { mockProjectMembers } from '../../utils/constants'; // Constant ফাইল থেকে মেম্বার লিস্ট ইম্পোর্ট

function ProjectCard({ project, userMap, onEdit, onDelete }) {
    // ম্যানেজারের ডেটা বের করা (Image এবং Role এর জন্য)
    const managerData = mockProjectMembers.find((m) => m.id === project.managerId);

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

    const progressColor = (progress) => {
        if (progress === 100) return 'bg-green-500';
        if (progress >= 50) return 'bg-indigo-500';
        return 'bg-yellow-500';
    };

    // টিম মেম্বারদের নাম (userMap ব্যবহার করে)
    const memberNames = (project.members || [])
        .map((id) => userMap[String(id)] || 'Unknown')
        .join(', ');

    return (
        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full overflow-hidden border border-gray-100 font-sans">
            {/* Header and Actions */}
            <div className="p-5 pb-3 flex justify-between items-start">
                <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${statusColor(project.status)} flex items-center space-x-1`}
                >
                    <TrendingUp className="w-3 h-3" />
                    <span>{project.status}</span>
                </span>

                <div className="flex space-x-2">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={() => onEdit(project)}
                            className="text-gray-400 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(project.id)}
                            className="text-gray-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 transition"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col p-5 pt-0 flex-grow">
                <Link
                    to={`/projects/${project.id}`}
                    className="text-xl font-semibold text-gray-800 hover:text-indigo-600 transition-colors duration-200 line-clamp-2 mb-2"
                >
                    {project.title}
                </Link>

                <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-grow">
                    {project.description}
                </p>

                {/* Metadata Section */}
                <div className="space-y-4 mb-4">
                    {/* ✅ Manager Image and Info */}
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full border-2 border-indigo-100 p-0.5 overflow-hidden">
                                {managerData?.image ? (
                                    <img
                                        src={managerData.image}
                                        alt={project.manager}
                                        className="h-full w-full object-cover rounded-full"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-gray-100 flex items-center justify-center rounded-full">
                                        <User className="w-5 h-5 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Manager
                            </span>
                            <span className="text-sm font-semibold text-gray-700">
                                {project.manager}
                            </span>
                        </div>
                    </div>

                    {/* ✅ Editable Team Icon and Info */}
                    <div className="flex items-center space-x-3">
                        <label className="cursor-pointer group">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 border-2 border-dashed border-indigo-200 group-hover:bg-indigo-100 group-hover:border-indigo-300 transition-all">
                                <ImagePlus className="w-5 h-5" />
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) =>
                                    console.log('Team photo selected:', e.target.files[0])
                                }
                            />
                        </label>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                Team Members
                            </span>
                            <span
                                className="text-xs text-gray-600 line-clamp-1 italic"
                                title={memberNames}
                            >
                                {memberNames || 'No members assigned'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>
                            Deadline: <strong className="text-gray-700">{project.endDate}</strong>
                        </span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-auto pt-2">
                    <div className="flex justify-between text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-tighter">
                        <span>Project Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-700 ${progressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectCard;
