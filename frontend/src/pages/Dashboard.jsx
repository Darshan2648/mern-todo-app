import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import TaskForm from '../components/TaskForm';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
    const { logout, user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [sort, setSort] = useState('-createdAt');
    const [currentTask, setCurrentTask] = useState(null);

    const fetchTasks = async () => {
        try {
            let url = `/tasks?page=${page}&limit=5&sort=${sort}`;
            if (statusFilter) url += `&status=${statusFilter}`;
            
            const res = await api.get(url);
            setTasks(res.data.data);
            setPages(res.data.pages);
        } catch (error) {
            console.error('Error fetching tasks', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [page, statusFilter, sort]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                <h1 style={{ color: 'white' }}>Hi, {user?.username}</h1>
                <button onClick={logout} className="btn-primary" style={{ width: 'auto', padding: '8px 16px', background: 'var(--danger)' }}>Logout</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div>
                    <TaskForm fetchTasks={fetchTasks} currentTask={currentTask} clearCurrent={() => setCurrentTask(null)} />
                </div>
                
                <div>
                    <div className="glass-container" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <div>
                            <label style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Filter Status:</label>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                                className="input-field"
                                style={{ width: 'auto', marginBottom: 0, padding: '8px' }}
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="In-Progress">In-Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ marginRight: '10px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Sort By:</label>
                            <select 
                                value={sort} 
                                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                                className="input-field"
                                style={{ width: 'auto', marginBottom: 0, padding: '8px' }}
                            >
                                <option value="-createdAt">Newest First</option>
                                <option value="createdAt">Oldest First</option>
                                <option value="title">Title (A-Z)</option>
                                <option value="-title">Title (Z-A)</option>
                            </select>
                        </div>
                    </div>

                    {tasks.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px', background: 'var(--card-bg)', borderRadius: '8px' }}>No tasks found.</p>
                    ) : (
                        tasks.map(task => (
                            <TaskItem key={task._id} task={task} fetchTasks={fetchTasks} setCurrentTask={setCurrentTask} />
                        ))
                    )}

                    {pages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
                            <button 
                                disabled={page === 1} 
                                onClick={() => setPage(page - 1)}
                                className="btn-primary"
                                style={{ width: 'auto', padding: '8px 16px', background: page === 1 ? 'var(--text-muted)' : 'var(--primary-color)' }}
                            >Prev</button>
                            <span style={{ padding: '8px', color: 'white' }}>Page {page} of {pages}</span>
                            <button 
                                disabled={page === pages} 
                                onClick={() => setPage(page + 1)}
                                className="btn-primary"
                                style={{ width: 'auto', padding: '8px 16px', background: page === pages ? 'var(--text-muted)' : 'var(--primary-color)' }}
                            >Next</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
