import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Issue, IssueStatus, Department } from '../types';
import { BuildingOffice2Icon, XMarkIcon } from './icons';

interface AdminActionsProps {
    issue: Issue;
    updateIssue: (issue: Issue) => void;
}

const departments = Object.values(Department);
const statuses = Object.values(IssueStatus);
const priorities: Issue['priority'][] = ['Low', 'Medium', 'High', 'Critical'];

// Type for a single change summary item
interface ChangeSummaryItem {
    field: string;
    from: string;
    to: string;
}

const AdminActions: React.FC<AdminActionsProps> = ({ issue, updateIssue }) => {
    const [formState, setFormState] = useState({
        department: issue.assignedDepartment || '',
        status: issue.status,
        priority: issue.priority,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    // FIX: Assign motion component to a capitalized variable to resolve TypeScript type inference issue.
    const MotionDiv = motion.div;

    useEffect(() => {
        setFormState({
            department: issue.assignedDepartment || '',
            status: issue.status,
            priority: issue.priority,
        });
    }, [issue]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSaveChanges = () => {
        const timelineNote = generateTimelineNote();
        if (!timelineNote) return;

        const newStatus = formState.status;
        
        const isAcknowledging = issue.status === IssueStatus.Reported && newStatus !== IssueStatus.Reported;

        const updatedIssue: Issue = {
            ...issue,
            status: newStatus,
            priority: formState.priority as Issue['priority'],
            assignedDepartment: formState.department as Department || undefined,
            timeline: [
                ...issue.timeline,
                {
                    status: isAcknowledging ? IssueStatus.Acknowledged : newStatus,
                    date: new Date(),
                    notes: timelineNote,
                },
            ],
        };
        updateIssue(updatedIssue);
        setIsModalOpen(false);
    };

    // Updated to provide a structured summary for better UI rendering in the modal.
    const generateChangeSummary = (): ChangeSummaryItem[] => {
        const changes: ChangeSummaryItem[] = [];
        if (formState.status !== issue.status) {
            changes.push({ field: 'Status', from: issue.status, to: formState.status });
        }
        if (formState.priority !== issue.priority) {
            changes.push({ field: 'Priority', from: issue.priority, to: formState.priority });
        }
        if (formState.department !== (issue.assignedDepartment || '')) {
            changes.push({ field: 'Department', from: issue.assignedDepartment || 'None', to: formState.department || 'None' });
        }
        return changes;
    };

    const generateTimelineNote = () => {
        const notes: string[] = [];
        if (formState.status !== issue.status) notes.push(`Status updated to ${formState.status}.`);
        if (formState.priority !== issue.priority) notes.push(`Priority changed to ${formState.priority}.`);
        if (formState.department !== (issue.assignedDepartment || '')) {
            notes.push(formState.department ? `Assigned to ${formState.department}.` : 'Un-assigned from department.');
        }
        return notes.join(' ');
    };

    const hasChanges =
        formState.department !== (issue.assignedDepartment || '') ||
        formState.status !== issue.status ||
        formState.priority !== issue.priority;
        
    const changeSummary = generateChangeSummary();

    return (
        <>
            <div className="p-6 bg-yellow-500/10 rounded-lg border border-yellow-500/50">
                <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
                    <BuildingOffice2Icon className="w-6 h-6 mr-2" />
                    Admin Controls
                </h3>
                
                <div className="space-y-4">
                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-yellow-200 mb-1">Status</label>
                        <select id="status" name="status" value={formState.status} onChange={handleInputChange} className="admin-select">
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    {/* Priority */}
                    <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-yellow-200 mb-1">Priority</label>
                        <select id="priority" name="priority" value={formState.priority} onChange={handleInputChange} className="admin-select">
                            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </div>
                    {/* Department */}
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-yellow-200 mb-1">Department</label>
                        <select id="department" name="department" value={formState.department} onChange={handleInputChange} className="admin-select">
                            <option value="">None</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        disabled={!hasChanges}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-full transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <MotionDiv
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <MotionDiv
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md border border-gray-700"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white">Confirm Changes</h2>
                                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-gray-400 mt-2 mb-4">Please review the changes before applying:</p>
                                <div className="space-y-3 text-gray-300 bg-gray-900/50 p-4 rounded-md text-sm">
                                    {changeSummary.map((change) => (
                                        <div key={change.field} className="flex items-center justify-between gap-4">
                                            <span className="font-semibold">{change.field}</span>
                                            <div className="flex items-center space-x-2 text-xs">
                                                <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded font-mono">{change.from}</span>
                                                <span className="font-bold text-cyan-400">&rarr;</span>
                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded font-mono">{change.to}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-gray-700/50 px-6 py-4 flex justify-end space-x-4 rounded-b-lg">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-md text-white bg-gray-600 hover:bg-gray-500 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveChanges}
                                    className="px-4 py-2 rounded-md text-white bg-cyan-500 hover:bg-cyan-600 font-semibold transition-colors"
                                >
                                    Confirm & Update
                                </button>
                            </div>
                        </MotionDiv>
                    </MotionDiv>
                )}
            </AnimatePresence>

            <style>{`
                .admin-select {
                    display: block;
                    width: 100%;
                    border-radius: 0.375rem;
                    border-width: 0;
                    background-color: rgba(55, 65, 81, 0.5);
                    padding: 0.5rem 0.75rem;
                    color: white;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    ring: 1px solid inset rgba(245, 158, 11, 0.6);
                }
                .admin-select:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    --tw-ring-color: #f59e0b;
                    box-shadow: 0 0 0 2px #f59e0b;
                }
            `}</style>
        </>
    );
};

export default AdminActions;