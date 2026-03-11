import React from 'react';
import { Edit2, Trash2, Users } from 'lucide-react';

const StudentTable = ({ students, onEdit, onDelete }) => {
    if (students.length === 0) {
        return (
            <div className="empty-state">
                <Users />
                <h3>No students found</h3>
                <p>Try adjusting your filters, or add a new student to get started.</p>
            </div>
        );
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {students.map(student => (
                    <tr key={student.id}>
                        <td className="td-name">{student.name}</td>
                        <td className="td-email">{student.email}</td>
                        <td>
                            <span className="age-badge">{student.age} yrs</span>
                        </td>
                        <td>
                            <div className="td-actions">
                                <button
                                    className="btn btn-ghost-primary"
                                    onClick={() => onEdit(student)}
                                    title="Edit student"
                                >
                                    <Edit2 size={15} />
                                </button>
                                <button
                                    className="btn btn-ghost-danger"
                                    onClick={() => onDelete(student)}
                                    title="Delete student"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default StudentTable;
