import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const StudentForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ name: '', email: '', age: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ name: '', email: '', age: '' });
        }
        setError('');
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim() || !formData.email.trim() || !formData.age) {
            setError('All fields are required.');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (isNaN(formData.age) || Number(formData.age) <= 0) {
            setError('Age must be a positive number.');
            return;
        }

        onSubmit({
            ...formData,
            age: parseInt(formData.age, 10)
        });
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <div className="modal-header">
                    <h2>{initialData ? 'Edit Student' : 'Add New Student'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        {error && <p className="form-error">{error}</p>}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                className="input"
                                placeholder="e.g. Amal Perera"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="input"
                                placeholder="e.g. amal@university.edu"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Age</label>
                            <input
                                type="number"
                                className="input"
                                placeholder="e.g. 21"
                                value={formData.age}
                                onChange={e => setFormData({ ...formData, age: e.target.value })}
                                style={{ maxWidth: 120 }}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {initialData ? 'Save Changes' : 'Add Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentForm;
