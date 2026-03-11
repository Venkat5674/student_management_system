import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, Plus } from 'lucide-react';
import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import SearchBar from '../components/SearchBar';
import Loader from '../components/Loader';
import ConfirmationModal from '../components/ConfirmationModal';
import { exportToExcel } from '../utils/excelExport';
import { useMemo } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/students';

const Dashboard = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [ageFilter, setAgeFilter] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [error, setError] = useState(null);
    const [confirmModal, setConfirmModal] = useState({
        isOpen: false,
        action: null,
        student: null,
        message: ''
    });

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(API_URL);
            setStudents(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch students. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (studentData) => {
        try {
            if (editingStudent) {
                const res = await axios.put(`${API_URL}/${editingStudent.id}`, studentData);
                setStudents(students.map(s => s.id === editingStudent.id ? res.data.data : s));
            } else {
                const res = await axios.post(API_URL, studentData);
                setStudents([...students, res.data.data]);
            }
            setIsFormOpen(false);
            setEditingStudent(null);
        } catch (err) {
            alert(err.response?.data?.message || 'An error occurred while saving.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            setStudents(students.filter(s => s.id !== id));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete student.');
        }
    };

    const openEditForm = (student) => {
        setEditingStudent(student);
        setIsFormOpen(true);
    };

    const confirmAction = (action, student) => {
        setConfirmModal({
            isOpen: true,
            action,
            student,
            message: action === 'delete'
                ? `Are you sure you want to permanently delete ${student.name}?`
                : `Do you want to update the details for ${student.name}?`
        });
    };

    const handleConfirm = () => {
        if (confirmModal.action === 'delete') {
            handleDelete(confirmModal.student.id);
        } else if (confirmModal.action === 'update') {
            openEditForm(confirmModal.student);
        }
        setConfirmModal({ ...confirmModal, isOpen: false });
    };

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const matchesSearch =
                student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                student.email.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAge = ageFilter ? student.age?.toString() === ageFilter.toString() : true;
            return matchesSearch && matchesAge;
        });
    }, [students, searchQuery, ageFilter]);

    return (
        <div className="page-wrapper fade-in">
            <div className="page-content">

                {/* Header */}
                <div className="card header-card">
                    <div className="header-text">
                        <h1>Student Management</h1>
                        <p>Track, manage and export your student records with ease.</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => exportToExcel(students, 'all_students.xlsx')}
                        >
                            <Download size={15} />
                            Export All
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => exportToExcel(filteredStudents, 'filtered_students.xlsx')}
                            disabled={filteredStudents.length === 0}
                        >
                            <Download size={15} />
                            Export Filtered
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditingStudent(null); setIsFormOpen(true); }}
                        >
                            <Plus size={15} />
                            Add Student
                        </button>
                    </div>
                </div>

                {/* Table Card */}
                <div className="card">
                    <div className="table-toolbar">
                        <h2>All Students <span style={{ fontWeight: 400, color: 'var(--gray-400)', fontSize: '0.8rem', marginLeft: 6 }}>({filteredStudents.length})</span></h2>
                        <div className="toolbar-filters">
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
                            <input
                                type="number"
                                className="input age-input"
                                placeholder="Filter by age"
                                value={ageFilter}
                                onChange={e => setAgeFilter(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <div className="error-banner">{error}</div>}

                    <div className="table-wrapper">
                        {loading ? <Loader /> : (
                            <StudentTable
                                students={filteredStudents}
                                onEdit={student => confirmAction('update', student)}
                                onDelete={student => confirmAction('delete', student)}
                            />
                        )}
                    </div>
                </div>
            </div>

            <StudentForm
                isOpen={isFormOpen}
                onClose={() => { setIsFormOpen(false); setEditingStudent(null); }}
                onSubmit={handleCreateOrUpdate}
                initialData={editingStudent}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
                onConfirm={handleConfirm}
                action={confirmModal.action}
                message={confirmModal.message}
            />
        </div>
    );
};

export default Dashboard;
