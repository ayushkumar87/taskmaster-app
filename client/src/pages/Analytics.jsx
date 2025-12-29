import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar,
    PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../utils/api';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';

const Analytics = () => {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

        fetchTodos();
    }, []);

    // 1. Consistency Data (Last 30 Days)
    const getConsistencyData = () => {
        const last30Days = [...Array(30)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (29 - i));
            return d.toISOString().split('T')[0];
        });

        const data = last30Days.map(date => {
            const count = todos.filter(t =>
                t.status === 'Completed' &&
                new Date(t.updatedAt).toISOString().split('T')[0] === date
            ).length;
            // Format date as DD/MM for brevity
            const displayDate = new Date(date).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' });
            return { date: displayDate, count };
        });
        return data;
    };

    // 2. Weekly Productivity (Day of Week)
    const getWeeklyData = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const data = days.map(day => ({ day, count: 0 }));

        todos.filter(t => t.status === 'Completed').forEach(t => {
            const d = new Date(t.updatedAt);
            const dayIndex = d.getDay();
            data[dayIndex].count++;
        });
        return data;
    };

    // 3. Priority Breakdown
    const getPriorityData = () => {
        const counts = { High: 0, Medium: 0, Low: 0 };
        todos.forEach(t => {
            if (counts[t.priority] !== undefined) counts[t.priority]++;
        });
        return [
            { name: 'High', value: counts.High, color: '#EF4444' },
            { name: 'Medium', value: counts.Medium, color: '#F59E0B' },
            { name: 'Low', value: counts.Low, color: '#10B981' },
        ].filter(d => d.value > 0);
    };

    const consistencyData = getConsistencyData();
    const weeklyData = getWeeklyData();
    const priorityData = getPriorityData();

    // Forced Dark Mode Colors
    const axisColor = '#94A3B8'; // Slate 400
    const gridColor = '#334155'; // Slate 700

    // Custom Tooltip Style for Premium Dark
    const tooltipStyle = {
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-lg)',
        backgroundColor: '#1E293B', // Slate 800
        color: '#F8FAFC', // Slate 50
        padding: '0.5rem 1rem'
    };

    return (
        <DashboardLayout>
            <TopHeader onSearch={() => { }} /> {/* Search not implemented for Analytics yet */}
            <div className="dashboard-content">
                <h2 className="welcome-text">Analytics & consistency</h2>

                <div className="analytics-grid">
                    {/* Consistency Chart */}
                    <div className="card chart-card full-width">
                        <h3 className="chart-title">Consistency (Last 30 Days)</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={consistencyData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="date" stroke={axisColor} tick={{ fontSize: 12 }} />
                                    <YAxis stroke={axisColor} allowDecimals={false} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Area type="monotone" dataKey="count" stroke="var(--primary-color)" fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Weekly Productivity */}
                    <div className="card chart-card">
                        <h3 className="chart-title">Productivity by Day</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
                                    <XAxis dataKey="day" stroke={axisColor} />
                                    <YAxis stroke={axisColor} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} />
                                    <Bar dataKey="count" fill="var(--secondary-color)" radius={[4, 4, 0, 0]} barSize={30} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Priority Breakdown */}
                    <div className="card chart-card">
                        <h3 className="chart-title">Task Distribution</h3>
                        <div style={{ height: '300px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={priorityData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {priorityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
