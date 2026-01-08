import { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaCalendarAlt, FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSidebar } from './DashboardLayout';
import { useSocket } from '../context/SocketContext';
import api from '../utils/api';

const TopHeader = ({ onSearch }) => {
    const { toggleSidebar } = useSidebar() || {};
    const { socket } = useSocket();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState({ scheduled: [], completed: [] });
    const [loading, setLoading] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // Calendar states
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [allTodos, setAllTodos] = useState([]);

    // Scroll detection for hiding/showing navbar
    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar
                setIsVisible(false);
            } else {
                // Scrolling up - show navbar
                setIsVisible(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (showNotifications) {
            fetchNotifications();
        }
    }, [showNotifications]);

    // Real-time notifications listener
    useEffect(() => {
        if (!socket) return;

        socket.on('notification', () => {
            // Re-fetch notifications when a new one comes in
            fetchNotifications();
            // You could also show a toast here
        });

        return () => socket.off('notification');
    }, [socket]);

    useEffect(() => {
        if (showCalendar) {
            fetchAllTodos();
        }
    }, [showCalendar]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/todos');
            const scheduled = data.filter(t => t.status !== 'Completed');
            const completed = data.filter(t => t.status === 'Completed').sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setNotifications({ scheduled, completed });
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllTodos = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/todos');
            setAllTodos(data);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        } finally {
            setLoading(false);
        }
    };

    // Calendar helper functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    };

    const getTasksForDate = (date) => {
        return allTodos.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return isSameDay(taskDate, date);
        });
    };

    const hasTasksOnDate = (date) => {
        return getTasksForDate(date).length > 0;
    };

    const handleDateClick = (day) => {
        const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(clickedDate);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
        setSelectedDate(null);
    };

    const handleNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
        setSelectedDate(null);
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth);
        const days = [];
        const today = new Date();

        // Empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = isSameDay(date, today);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const hasTasks = hasTasksOnDate(date);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                    {hasTasks && <span className="task-indicator"></span>}
                </div>
            );
        }

        return days;
    };

    const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-GB', dateOptions);

    return (
        <header className={`top-header ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button
                    className="header-btn hamburger-btn"
                    onClick={toggleSidebar}
                    style={{ marginRight: '0.5rem' }}
                >
                    <FaBars />
                </button>
                <h1 className="header-title">Dashboard</h1>
            </div>

            <div className="header-search">
                <FaSearch className="search-icon" />
                <input
                    type="text"
                    placeholder="Search your task here..."
                    className="search-input"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>

            <div className="header-actions">
                <div style={{ position: 'relative' }}>
                    <button
                        className="header-btn notification-btn"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <FaBell />
                        {notifications.scheduled.length > 0 && <span className="notif-dot"></span>}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="notification-dropdown">
                            <div className="notif-header">
                                <h3>Notifications</h3>
                                <button className="close-notif" onClick={() => setShowNotifications(false)}>×</button>
                            </div>

                            <div className="notif-content">
                                {loading ? (
                                    <div className="notif-empty">Loading...</div>
                                ) : (
                                    <>
                                        <div className="notif-section">
                                            <h4>Scheduled ({notifications.scheduled.length})</h4>
                                            {notifications.scheduled.length === 0 ? (
                                                <p className="notif-empty">No pending tasks</p>
                                            ) : (
                                                notifications.scheduled.slice(0, 5).map(task => (
                                                    <div key={task._id} className="notif-item">
                                                        <span className={`priority-dot ${task.priority.toLowerCase()}`}></span>
                                                        <div className="notif-info">
                                                            <p className="notif-title">{task.title}</p>
                                                            <p className="notif-time">
                                                                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        <div className="notif-section">
                                            <h4>Completed Recently</h4>
                                            {notifications.completed.length === 0 ? (
                                                <p className="notif-empty">No completed tasks yet</p>
                                            ) : (
                                                notifications.completed.slice(0, 3).map(task => (
                                                    <div key={task._id} className="notif-item completed">
                                                        <div className="notif-info">
                                                            <p className="notif-title" style={{ textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                                                                {task.title}
                                                            </p>
                                                            <p className="notif-time">Good job! 🎉</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="header-date">
                    <div className="date-text">
                        <span className="date-day">{today.toLocaleDateString('en-US', { weekday: 'long' })}</span>
                        <span className="date-full">{today.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <button
                            className="header-btn calendar-btn"
                            onClick={() => setShowCalendar(!showCalendar)}
                        >
                            <FaCalendarAlt />
                        </button>

                        {/* Calendar Dropdown */}
                        {showCalendar && (
                            <div className="calendar-dropdown">
                                <div className="calendar-header">
                                    <button className="calendar-nav-btn" onClick={handlePrevMonth}>
                                        <FaChevronLeft />
                                    </button>
                                    <h3 className="calendar-month-year">
                                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <button className="calendar-nav-btn" onClick={handleNextMonth}>
                                        <FaChevronRight />
                                    </button>
                                    <button className="close-calendar" onClick={() => setShowCalendar(false)}>×</button>
                                </div>

                                <div className="calendar-body">
                                    <div className="calendar-weekdays">
                                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="calendar-weekday">{day}</div>
                                        ))}
                                    </div>
                                    <div className="calendar-grid">
                                        {renderCalendar()}
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className="calendar-tasks-section">
                                        <h4 className="calendar-tasks-title">
                                            Tasks for {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </h4>
                                        {selectedDateTasks.length === 0 ? (
                                            <p className="calendar-no-tasks">No tasks scheduled for this day</p>
                                        ) : (
                                            <div className="calendar-tasks-list">
                                                {selectedDateTasks.map(task => (
                                                    <div key={task._id} className="calendar-task-item">
                                                        <span className={`priority-dot ${task.priority.toLowerCase()}`}></span>
                                                        <div className="calendar-task-info">
                                                            <p className="calendar-task-title">{task.title}</p>
                                                            <p className="calendar-task-meta">
                                                                <span className={`status-badge ${task.status.toLowerCase()}`}>
                                                                    {task.status}
                                                                </span>
                                                                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                                                                    {task.priority}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopHeader;
