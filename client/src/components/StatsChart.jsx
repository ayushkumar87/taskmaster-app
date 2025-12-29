import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { motion } from 'framer-motion';

const StatsChart = ({ todos }) => {
    // Data for Pie Chart (Status)
    const statusData = [
        { name: 'Pending', value: todos.filter(t => t.status === 'Pending').length, color: '#9CA3AF' },
        { name: 'In Progress', value: todos.filter(t => t.status === 'In Progress').length, color: '#3B82F6' },
        { name: 'Completed', value: todos.filter(t => t.status === 'Completed').length, color: '#10B981' },
    ].filter(item => item.value > 0);

    // Data for Bar Chart (Priority)
    const priorityData = [
        { name: 'Low', count: todos.filter(t => t.priority === 'Low').length },
        { name: 'Medium', count: todos.filter(t => t.priority === 'Medium').length },
        { name: 'High', count: todos.filter(t => t.priority === 'High').length },
    ];

    if (todos.length === 0) return null;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Task Status Distribution</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {statusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
            >
                <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Tasks by Priority</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={priorityData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </motion.div>
        </div>
    );
};

export default StatsChart;
