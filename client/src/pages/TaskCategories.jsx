import { useState, useEffect } from 'react';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import { FaRedo, FaTrash, FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const TaskCategories = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTodos = async () => {
        try {
            const { data } = await api.get('/todos');
            setTodos(data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleResetTask = async (todo) => {
        try {
            const updatedTodo = { ...todo, status: 'Not Started' }; // Or 'Pending' if your backend differs
            const { data } = await api.put(`/todos/${todo._id}`, updatedTodo);
            setTodos(todos.map(t => (t._id === data._id ? data : t)));
        } catch (error) {
            console.error('Error resetting task:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            await api.delete(`/todos/${id}`);
            setTodos(todos.filter(t => t._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        if (status === 'Completed') return '#10B981'; // Green
        if (status === 'In Progress') return '#F59E0B'; // Yellow
        return '#EF4444'; // Red/Pending
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'High') return <FaExclamationCircle color="#EF4444" />;
        if (priority === 'Medium') return <FaClock color="#F59E0B" />;
        return <FaCheckCircle color="#10B981" />;
    };

    return (
        <DashboardLayout>
            <TopHeader onSearch={setSearchQuery} />
            <div className="dashboard-content">
                <h2 className="welcome-text">Task Archives & Categories</h2>

                <div className="card" style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                <th style={{ padding: '1rem' }}>Task Title</th>
                                <th style={{ padding: '1rem' }}>Priority</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTodos.map(todo => (
                                <tr key={todo._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500, color: 'var(--text-primary)' }}>{todo.title}</td>
                                    <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
                                        {getPriorityIcon(todo.priority)} {todo.priority}
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '999px',
                                            fontSize: '0.85rem',
                                            backgroundColor: `${getStatusColor(todo.status)}20`,
                                            color: getStatusColor(todo.status),
                                            border: `1px solid ${getStatusColor(todo.status)}40`
                                        }}>
                                            {todo.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleResetTask(todo)}
                                                title="Reset Status"
                                                style={{ background: 'none', border: 'none', color: '#6366F1', cursor: 'pointer', fontSize: '1.1rem' }}
                                            >
                                                <FaRedo />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(todo._id)}
                                                title="Delete"
                                                style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', fontSize: '1.1rem' }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTodos.length === 0 && (
                        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            No tasks found.
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default TaskCategories;
