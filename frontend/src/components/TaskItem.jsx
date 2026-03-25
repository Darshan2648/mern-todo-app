import React from 'react';
import api from '../services/api';

const TaskItem = ({ task, fetchTasks, setCurrentTask }) => {
    const statusColors = {
        'Pending': 'var(--warning)',
        'In-Progress': 'var(--primary-color)',
        'Completed': 'var(--success)'
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure?')) {
            try {
                await api.delete(`/tasks/${task._id}`);
                fetchTasks();
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleStatusChange = async (e) => {
        try {
            await api.put(`/tasks/${task._id}`, { status: e.target.value });
            fetchTasks();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="glass-container" style={{ padding: '20px', marginBottom: '15px', borderLeft: `4px solid ${statusColors[task.status]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ marginBottom: '8px', color: 'white' }}>{task.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '15px' }}>{task.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Status:</span>
                        <select 
                            value={task.status} 
                            onChange={handleStatusChange}
                            style={{ 
                                background: 'rgba(0,0,0,0.2)', 
                                color: 'white', 
                                border: '1px solid var(--border-color)', 
                                padding: '4px 8px', 
                                borderRadius: '4px' 
                            }}
                        >
                            <option value="Pending">Pending</option>
                            <option value="In-Progress">In-Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => setCurrentTask(task)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer' }}>Edit</button>
                    <button onClick={handleDelete} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
