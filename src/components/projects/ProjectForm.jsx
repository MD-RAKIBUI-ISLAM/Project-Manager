// src/components/projects/ProjectForm.jsx
import { Briefcase, Calendar, FileText, Save, UserCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import Button from '../common/Button'; // Assuming Button is in this path

// Helper function to format date (YYYY-MM-DD)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

function ProjectForm({ project, onClose, onSave, availableMembers = [] }) {
    // Determine if we are creating or editing
    const isEditing = !!project;

    // Initial state based on whether a project is passed for editing
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        startDate: formatDate(project?.startDate) || formatDate(new Date()),
        endDate: formatDate(project?.endDate) || '',
        // Members state: store IDs of selected members
        members: project?.members
            ? project.members
                  .map((name) => availableMembers.find((m) => m.name === name)?.id)
                  .filter((id) => id !== undefined)
            : []
    });
    const [errors, setErrors] = useState({});

    // Update form data if project prop changes (e.g., if modal is reused)
    useEffect(() => {
        if (project) {
            setFormData({
                title: project.title,
                description: project.description,
                startDate: formatDate(project.startDate),
                endDate: formatDate(project.endDate),
                members: project.members
                    .map((name) => availableMembers.find((m) => m.name === name)?.id)
                    .filter((id) => id !== undefined)
            });
        }
    }, [project, availableMembers]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleMemberChange = (e) => {
        const value = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        setFormData((prev) => ({ ...prev, members: value }));
        setErrors((prev) => ({ ...prev, members: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Project title is required.';
        if (!formData.description.trim()) newErrors.description = 'Description cannot be empty.';
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            newErrors.endDate = 'End date must be after start date.';
        }
        if (formData.members.length === 0)
            newErrors.members = 'At least one team member is required.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Map selected member IDs back to names for consistency with mock data structure
            const selectedMembersNames = formData.members
                .map((id) => availableMembers.find((m) => m.id === id)?.name)
                .filter(Boolean);

            const dataToSave = {
                ...formData,
                members: selectedMembersNames, // Use names for mock structure
                id: isEditing ? project.id : undefined, // Pass ID if editing
                status: isEditing ? project.status : 'To Do', // Preserve status if editing
                progress: isEditing ? project.progress : 0 // Preserve progress if editing
                // Note: Manager is set in ProjectListPage.jsx based on the current user
            };

            onSave(dataToSave, isEditing);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center z-10">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {isEditing ? 'Edit Project' : 'Create New Project'}
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Project Title */}
                    <div className="space-y-1">
                        <label
                            htmlFor="title"
                            className="text-sm font-medium text-gray-700 flex items-center"
                        >
                            <Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full p-3 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="e.g., TaskMaster Core API"
                            required
                        />
                        {errors.title && (
                            <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label
                            htmlFor="description"
                            className="text-sm font-medium text-gray-700 flex items-center"
                        >
                            <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                            placeholder="Provide a brief summary of the project scope and goals."
                            required
                        />
                        {errors.description && (
                            <p className="text-xs text-red-500 mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Dates (Start and End) */}
                    <div className="flex space-x-4">
                        <div className="space-y-1 w-1/2">
                            <label
                                htmlFor="startDate"
                                className="text-sm font-medium text-gray-700 flex items-center"
                            >
                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div className="space-y-1 w-1/2">
                            <label
                                htmlFor="endDate"
                                className="text-sm font-medium text-gray-700 flex items-center"
                            >
                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`w-full p-3 border ${errors.endDate ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                                required
                            />
                            {errors.endDate && (
                                <p className="text-xs text-red-500 mt-1">{errors.endDate}</p>
                            )}
                        </div>
                    </div>

                    {/* Team Members Selection (Multi-select) */}
                    <div className="space-y-1">
                        <label
                            htmlFor="members"
                            className="text-sm font-medium text-gray-700 flex items-center"
                        >
                            <UserCheck className="w-4 h-4 mr-2 text-indigo-500" /> Team Members
                            (Hold Ctrl/Cmd to select multiple)
                        </label>
                        <select
                            id="members"
                            name="members"
                            multiple
                            size={Math.min(availableMembers.length, 5)} // Limit size for aesthetics
                            value={formData.members.map(String)} // Convert numbers to strings for select value
                            onChange={handleMemberChange}
                            className={`w-full p-3 border ${errors.members ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-indigo-500 focus:border-indigo-500`}
                            required
                        >
                            {availableMembers.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name} ({member.role})
                                </option>
                            ))}
                        </select>
                        {errors.members && (
                            <p className="text-xs text-red-500 mt-1">{errors.members}</p>
                        )}

                        {/* Display selected members as badges */}
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.members.map((id) => {
                                const member = availableMembers.find((m) => m.id === id);
                                return member ? (
                                    <span
                                        key={id}
                                        className="inline-flex items-center px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full"
                                    >
                                        {member.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                    </div>

                    {/* Footer / Action Buttons */}
                    <div className="flex justify-end space-x-3 pt-4">
                        <Button variant="secondary" onClick={onClose} type="button">
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit" className="space-x-2">
                            <Save className="w-5 h-5" />
                            <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectForm;
