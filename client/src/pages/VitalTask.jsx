import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import TodoCard from '../components/TodoCard';
import TodoForm from '../components/TodoForm';
import { AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

const VitalTask = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);

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

    // Filter for HIGH PRIORITY tasks
    const vitalTodos = todos.filter(todo =>
        todo.priority === 'High' &&
        todo.status !== 'Completed' &&
        todo.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleTodoCreated = (newTodo) => {
        setTodos([newTodo, ...todos]);
        setShowModal(false);
    };

    const handleTodoUpdated = (updatedTodo) => {
        setTodos(todos.map(t => (t._id === updatedTodo._id ? updatedTodo : t)));
    };

    const handleTodoDeleted = (id) => {
        setTodos(todos.filter(t => t._id !== id));
    };

    return (
        <DashboardLayout>
            <TopHeader onSearch={setSearchQuery} />
            <div className="dashboard-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2 className="welcome-text" style={{ color: '#F87171', marginBottom: 0 }}>
                        Vital Tasks <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 400 }}>(High Priority)</span>
                    </h2>
                    <button className="add-task-btn" onClick={() => setShowModal(true)}>
                        <FaPlus /> New Task
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading vital tasks...</div>
                ) : (
                    <div className="tasks-grid">
                        {vitalTodos.length > 0 ? (
                            vitalTodos.map(todo => (
                                <TodoCard
                                    key={todo._id}
                                    todo={todo}
                                    onUpdate={handleTodoUpdated}
                                    onDelete={handleTodoDeleted}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <p>No high-priority tasks found. You're in the clear! 🎉</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        className="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h2 style={{ marginBottom: '1.5rem' }}>Create New Task</h2>
                            <TodoForm onTodoCreated={handleTodoCreated} />
                            <button className="close-modal-btn" onClick={() => setShowModal(false)}>×</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default VitalTask;
