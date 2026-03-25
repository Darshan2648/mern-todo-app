import React, { useState, useEffect } from 'react';
import api from '../services/api';

const TaskForm = ({ fetchTasks, currentTask, clearCurrent }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (currentTask) {
            setTitle(currentTask.title);
            setDescription(currentTask.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [currentTask]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentTask) {
                await api.put(`/tasks/${currentTask._id}`, { title, description });
                clearCurrent();
            } else {
                await api.post('/tasks', { title, description });
            }
            setTitle('');
            setDescription('');
            fetchTasks();
        } catch (error) {
            console.error('Error saving task', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-container" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>{currentTask ? 'Edit Task' : 'Add New Task'}</h3>
            <input
                type="text"
                className="input-field"
                placeholder="Task Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                className="input-field"
                placeholder="Task Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
            />
            <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn-primary">
                    {currentTask ? 'Update Task' : 'Add Task'}
                </button>
                {currentTask && (
                    <button type="button" className="btn-primary" style={{ background: 'var(--text-muted)' }} onClick={clearCurrent}>
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
};

export default TaskForm;
