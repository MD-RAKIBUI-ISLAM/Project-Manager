// src/components/projects/ProjectForm.jsx
import { Briefcase, FileText, Save, UserCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import Button from '../common/Button';

// Helper function to format date (YYYY-MM-DD)
const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

function ProjectForm({ project, onClose, onSave, availableMembers = [] }) {
    const isEditing = !!project;

    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        startDate: formatDate(project?.startDate) || formatDate(new Date()),
        endDate: formatDate(project?.endDate) || '',
        // Members state: store IDs
        members: project?.members
            ? project.members
                  .map((name) => availableMembers.find((m) => m.name === name)?.id)
                  .filter((id) => id !== undefined)
            : []
    });

    const [errors, setErrors] = useState({});

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
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleMemberChange = (e) => {
        const value = Array.from(e.target.selectedOptions, (option) => Number(option.value));
        setFormData((prev) => ({ ...prev, members: value }));
        if (errors.members) setErrors((prev) => ({ ...prev, members: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Project title is required.';
        if (!formData.description.trim()) newErrors.description = 'Description cannot be empty.';

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required.';
        } else if (new Date(formData.startDate) > new Date(formData.endDate)) {
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
            /**
             * @BACKEND_TEAM_NOTE:
             * বর্তমানে মক ডাটার স্ট্রাকচার অনুযায়ী ID থেকে Name ম্যাপ করে পাঠানো হচ্ছে।
             * ইন্টিগ্রেশনের সময় শুধু 'formData.members' (IDs) পাঠালেই চলবে।
             */
            const selectedMembersNames = formData.members
                .map((id) => availableMembers.find((m) => m.id === id)?.name)
                .filter(Boolean);

            const dataToSave = {
                ...formData,
                members: selectedMembersNames,
                id: isEditing ? project.id : undefined,
                status: isEditing ? project.status : 'To Do',
                progress: isEditing ? project.progress : 0
            };

            onSave(dataToSave, isEditing);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100">
                {/* Header */}
                <div className="bg-white px-6 py-4 border-b flex justify-between items-center sticky top-0 z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">
                            {isEditing ? 'Edit Project' : 'Create New Project'}
                        </h2>
                        <p className="text-xs text-gray-500">
                            Enter project details and assign team members.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSubmit}
                    className="p-6 space-y-5 max-h-[70vh] overflow-y-auto"
                >
                    {/* Project Title */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="title"
                            className="text-sm font-semibold text-gray-700 flex items-center"
                        >
                            <Briefcase className="w-4 h-4 mr-2 text-indigo-500" /> Project Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className={`w-full p-3 border ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                            placeholder="Project name..."
                        />
                        {errors.title && (
                            <p className="text-xs font-medium text-red-500 flex items-center mt-1">
                                ● {errors.title}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="description"
                            className="text-sm font-semibold text-gray-700 flex items-center"
                        >
                            <FileText className="w-4 h-4 mr-2 text-indigo-500" /> Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            className={`w-full p-3 border ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`}
                            placeholder="What is this project about?"
                        />
                        {errors.description && (
                            <p className="text-xs font-medium text-red-500 mt-1">
                                ● {errors.description}
                            </p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="startDate"
                                className="text-sm font-semibold text-gray-700"
                            >
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label
                                htmlFor="endDate"
                                className="text-sm font-semibold text-gray-700"
                            >
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className={`w-full p-3 border ${errors.endDate ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none`}
                            />
                            {errors.endDate && (
                                <p className="text-xs font-medium text-red-500 mt-1">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Team Selection */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="members"
                            className="text-sm font-semibold text-gray-700 flex items-center"
                        >
                            <UserCheck className="w-4 h-4 mr-2 text-indigo-500" /> Assign Team
                            Members
                        </label>
                        <select
                            id="members"
                            name="members"
                            multiple
                            value={formData.members.map(String)}
                            onChange={handleMemberChange}
                            className={`w-full p-3 border ${errors.members ? 'border-red-500 bg-red-50' : 'border-gray-200'} rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none h-32 transition-all`}
                        >
                            {availableMembers.map((member) => (
                                <option
                                    key={member.id}
                                    value={member.id}
                                    className="p-2 cursor-pointer hover:bg-indigo-50"
                                >
                                    {member.name} — {member.role}
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-400">
                            Tip: Keep Ctrl (Win) or Cmd (Mac) pressed to select multiple.
                        </p>

                        {/* Selected Badges */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {formData.members.map((id) => {
                                const member = availableMembers.find((m) => m.id === id);
                                return member ? (
                                    <span
                                        key={id}
                                        className="inline-flex items-center px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100"
                                    >
                                        {member.name}
                                    </span>
                                ) : null;
                            })}
                        </div>
                        {errors.members && (
                            <p className="text-xs font-medium text-red-500 mt-1">
                                ● {errors.members}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <Button
                            variant="primary"
                            type="submit"
                            className="flex items-center gap-2 shadow-lg shadow-indigo-200 px-6"
                        >
                            <Save className="w-4 h-4" />
                            {isEditing ? 'Update Project' : 'Create Project'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProjectForm;
