import { useState, useEffect } from 'react';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import { FaPlus, FaCheckCircle, FaSpinner, FaRegCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { user } = useAuth();
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTodos = async () => {
        try {
            const { data } = await api.get('/todos');
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (editingTodo) {
                await api.put(`/todos/${editingTodo._id}`, formData);
            } else {
                await api.post('/todos', formData);
            }
            fetchTodos();
            setShowModal(false);
            setEditingTodo(null);
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure?')) {
            try {
                setTodos(prev => prev.filter(t => t._id !== id));
                await api.delete(`/todos/${id}`);
            } catch (error) {
                console.error('Error deleting todo:', error);
                fetchTodos();
            }
        }
    };

    const handleUpdateStatus = async (id, updates, isEdit = false) => {
        if (isEdit) {
            const todoToEdit = todos.find(t => t._id === id);
            setEditingTodo(todoToEdit);
            setShowModal(true);
            return;
        }

        try {
            setTodos(prev => prev.map(t =>
                t._id === id ? { ...t, ...updates } : t
            ));
            await api.put(`/todos/${id}`, updates);
        } catch (error) {
            console.error('Error updating status:', error);
            fetchTodos();
        }
    };

    // Filter Logic
    const filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.title.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === 'All') return matchesSearch;
        return todo.status === filter && matchesSearch;
    });

    const pendingTodos = filteredTodos.filter(t => t.status !== 'Completed');
    const completedList = todos.filter(t => t.status === 'Completed').slice(0, 5); // Last 5 completed

    // Radial Stats Data
    const total = todos.length;
    const completedCount = todos.filter(t => t.status === 'Completed').length;
    const progressCount = todos.filter(t => t.status === 'In Progress').length;
    const notStartedCount = todos.filter(t => t.status === 'Pending').length;

    const getPercentage = (count) => total === 0 ? 0 : Math.round((count / total) * 100);

    const RadialChart = ({ percent, color, label }) => {
        const data = [
            { name: 'val', value: percent, color: color },
            { name: 'rem', value: 100 - percent, color: 'transparent' }, // or subtle track
        ];
        return (
            <div style={{ width: '100px', textAlign: 'center' }}>
                <div style={{ position: 'relative', height: '100px' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={30}
                                outerRadius={40}
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                            >
                                <Cell key="val" fill={color} />
                                <Cell key="rem" fill="var(--border-color)" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        fontWeight: 'bold', fontSize: '1.2rem', color: color
                    }}>
                        {percent}%
                    </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '5px' }}>{label}</div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <TopHeader onSearch={setSearchQuery} />

            <div className="dashboard-content">
                <h2 className="welcome-text">Welcome back, {user?.name.split(' ')[0]} 👋</h2>

                <div className="dashboard-2-grid">

                    {/* LEFT COLUMN: Main Tasks */}
                    <div className="main-tasks-area">
                        <div className="section-header">
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                <span style={{ marginRight: '10px' }}>📄</span>
                                <span className="text-gradient">To-Do</span>
                                <span style={{ marginLeft: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400, marginTop: '4px' }}>
                                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                </span>
                            </h3>
                            <button
                                onClick={() => { setEditingTodo(null); setShowModal(true); }}
                                className="btn"
                                style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}
                            >
                                + Add task
                            </button>
                        </div>

                        {/* Task List */}
                        <div className="todo-grid" style={{ gridTemplateColumns: '1fr' }}> {/* Stack vertically */}
                            <AnimatePresence>
                                {pendingTodos.length === 0 ? (
                                    <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>No active tasks found.</p>
                                    </div>
                                ) : (
                                    pendingTodos.map(todo => (
                                        <TodoCard
                                            key={todo._id}
                                            todo={todo}
                                            onDelete={handleDelete}
                                            onUpdate={handleUpdateStatus}
                                        />
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Stats & Completed */}
                    <div className="side-stats-area">

                        {/* Task Status Card */}
                        <div className="card chart-card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <div className="section-header" style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                    <span className="text-gradient">Task Status</span>
                                </h3>
                            </div>
                            <div className="status-grid">
                                <RadialChart percent={getPercentage(completedCount)} color="#10B981" label="Completed" />
                                <RadialChart percent={getPercentage(progressCount)} color="#3B82F6" label="In Progress" />
                                <RadialChart percent={getPercentage(notStartedCount)} color="#EF4444" label="Not Started" />
                            </div>
                        </div>

                        {/* Completed Task List */}
                        <div className="card chart-card">
                            <div className="section-header" style={{ marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                                    <span style={{ marginRight: '8px' }}>✅</span>
                                    <span className="text-gradient">Completed Tasks</span>
                                </h3>
                            </div>
                            <div>
                                {completedList.length === 0 ? (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No completed tasks yet.</p>
                                ) : (
                                    completedList.map(task => (
                                        <div key={task._id} className="completed-item">
                                            <FaCheckCircle className="completed-icon" />
                                            <div style={{ overflow: 'hidden' }}>
                                                <h4 style={{ fontSize: '0.9rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</h4>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed {new Date(task.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="modal-overlay" style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="card"
                            style={{ width: '100%', maxWidth: '500px', padding: 'var(--spacing-xl)' }}
                        >
                            <h3 style={{ marginBottom: 'var(--spacing-lg)', fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {editingTodo ? 'Edit Task' : 'New Task'}
                            </h3>
                            <TodoForm
                                onSubmit={handleCreateOrUpdate}
                                initialData={editingTodo || {}}
                                onClose={() => setShowModal(false)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Dashboard;
