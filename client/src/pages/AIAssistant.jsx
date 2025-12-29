import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TopHeader from '../components/TopHeader';
import { FaRobot, FaPaperPlane, FaCheckCircle, FaPlus } from 'react-icons/fa';
import api from '../utils/api';

const AIAssistant = () => {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: "👋 Hi! I'm your AI Task Assistant. I can help you create and manage tasks. Try saying something like:\n\n• 'Add a task to finish the report by Friday'\n• 'Delete the task about reviewing code'\n• 'Set high priority for meeting task'\n• 'Show me all my tasks'\n\nHow can I help you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [todos, setTodos] = useState([]);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Fetch all tasks
    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const { data } = await api.get('/todos');
                setTodos(data);
            } catch (error) {
                console.error('Error fetching todos:', error);
            }
        };
        fetchTodos();
    }, []);

    // Parse task from natural language
    const parseTask = (text) => {
        const taskPatterns = {
            // Match "add task", "create task", etc.
            taskKeywords: /(?:add|create|make|schedule|set up|plan)\s+(?:a\s+)?(?:task|todo|reminder)/i,
            // Extract title (everything before "by" or "on" or "for")
            title: /(?:add|create|make|schedule|set up|plan)\s+(?:a\s+)?(?:task|todo|reminder)\s+(?:to\s+)?(.+?)(?:\s+(?:by|on|for|due|deadline|priority|category)|\s*$)/i,
            // Extract due date
            dueDate: /(?:by|on|due|deadline)\s+(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|this week|\d{1,2}\/\d{1,2}|\d{1,2}-\d{1,2})/i,
            // Extract priority
            priority: /(?:priority|important|urgent|high|medium|low)\s+(high|medium|low|urgent|important)/i,
            // Extract category
            category: /(?:category|type|for)\s+(work|personal|shopping|health|study|project)/i,
        };

        const isTask = taskPatterns.taskKeywords.test(text);
        if (!isTask) return null;

        const titleMatch = text.match(taskPatterns.title);
        const dueDateMatch = text.match(taskPatterns.dueDate);
        const priorityMatch = text.match(taskPatterns.priority);
        const categoryMatch = text.match(taskPatterns.category);

        // Calculate due date
        let dueDate = null;
        if (dueDateMatch) {
            const dateStr = dueDateMatch[1].toLowerCase();
            const today = new Date();

            if (dateStr === 'today') {
                dueDate = today;
            } else if (dateStr === 'tomorrow') {
                dueDate = new Date(today.setDate(today.getDate() + 1));
            } else if (dateStr === 'next week') {
                dueDate = new Date(today.setDate(today.getDate() + 7));
            }
            // Add more date parsing as needed
        }

        return {
            title: titleMatch ? titleMatch[1].trim() : text.replace(taskPatterns.taskKeywords, '').trim(),
            dueDate: dueDate ? dueDate.toISOString().split('T')[0] : null,
            priority: priorityMatch ? (priorityMatch[1].toLowerCase() === 'urgent' || priorityMatch[1].toLowerCase() === 'important' ? 'High' : priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1)) : 'Medium',
            category: categoryMatch ? categoryMatch[1].charAt(0).toUpperCase() + categoryMatch[1].slice(1) : 'General',
            status: 'Pending'
        };
    };

    // Create task via API
    const createTask = async (taskData) => {
        try {
            const response = await api.post('/todos', taskData);
            setTodos(prev => [...prev, response.data]);
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            return null;
        }
    };

    // Delete task via API
    const deleteTask = async (taskId) => {
        try {
            await api.delete(`/todos/${taskId}`);
            setTodos(prev => prev.filter(t => t._id !== taskId));
            return true;
        } catch (error) {
            console.error('Error deleting task:', error);
            return false;
        }
    };

    // Update task priority
    const updateTaskPriority = async (taskId, priority) => {
        try {
            const response = await api.put(`/todos/${taskId}`, { priority });
            setTodos(prev => prev.map(t => t._id === taskId ? response.data : t));
            return response.data;
        } catch (error) {
            console.error('Error updating task:', error);
            return null;
        }
    };

    // Generate AI response
    const generateResponse = async (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Check for task deletion
        if (lowerMessage.includes('delete') || lowerMessage.includes('remove')) {
            // Try to find task by title match
            const titleMatch = lowerMessage.match(/(?:delete|remove)\s+(?:the\s+)?(?:task\s+)?(?:about\s+)?(.+)/i);
            if (titleMatch && todos.length > 0) {
                const searchTerm = titleMatch[1].trim();
                const taskToDelete = todos.find(t =>
                    t.title.toLowerCase().includes(searchTerm) ||
                    searchTerm.includes(t.title.toLowerCase())
                );

                if (taskToDelete) {
                    const success = await deleteTask(taskToDelete._id);
                    if (success) {
                        return {
                            content: `🗑️ Task deleted successfully:\n\n**${taskToDelete.title}**\n\nThe task has been removed from your dashboard.`,
                            deleted: true
                        };
                    }
                } else {
                    return {
                        content: `I couldn't find a task matching "${searchTerm}". Try:\n\n• 'Show me all my tasks' to see what's available\n• Be more specific with the task name`
                    };
                }
            }
        }

        // Check for priority update
        if (lowerMessage.includes('set') && lowerMessage.includes('priority')) {
            const priorityMatch = lowerMessage.match(/set\s+(high|medium|low)\s+priority\s+(?:for|to)\s+(.+)/i);
            if (priorityMatch && todos.length > 0) {
                const priority = priorityMatch[1].charAt(0).toUpperCase() + priorityMatch[1].slice(1);
                const searchTerm = priorityMatch[2].trim();
                const taskToUpdate = todos.find(t =>
                    t.title.toLowerCase().includes(searchTerm) ||
                    searchTerm.includes(t.title.toLowerCase())
                );

                if (taskToUpdate) {
                    const updated = await updateTaskPriority(taskToUpdate._id, priority);
                    if (updated) {
                        return {
                            content: `⚡ Priority updated successfully:\n\n**${taskToUpdate.title}**\nNew Priority: ${priority}\n\nThe task has been updated in your dashboard.`,
                            updated: true
                        };
                    }
                } else {
                    return {
                        content: `I couldn't find a task matching "${searchTerm}". Try 'Show me all my tasks' to see what's available.`
                    };
                }
            }
        }

        // Check for task listing
        if (lowerMessage.includes('show') && (lowerMessage.includes('tasks') || lowerMessage.includes('list'))) {
            if (todos.length === 0) {
                return {
                    content: "You don't have any tasks yet. Try creating one by saying:\n\n'Add a task to finish the report'"
                };
            }
            const taskList = todos.map((t, i) => `${i + 1}. **${t.title}** - ${t.priority} priority, ${t.status}`).join('\n');
            return {
                content: `📋 Here are your current tasks:\n\n${taskList}\n\nNeed help with any of these?`
            };
        }

        // Check if it's a task creation request
        const parsedTask = parseTask(userMessage);

        if (parsedTask) {
            // Create the task
            const createdTask = await createTask(parsedTask);

            if (createdTask) {
                return {
                    content: `✅ Great! I've created your task:\n\n**${parsedTask.title}**\n${parsedTask.dueDate ? `📅 Due: ${parsedTask.dueDate}` : ''}\n${parsedTask.priority ? `⚡ Priority: ${parsedTask.priority}` : ''}\n${parsedTask.category ? `📁 Category: ${parsedTask.category}` : ''}\n\nYou can view it in your Dashboard. Need anything else?`,
                    task: createdTask
                };
            } else {
                return {
                    content: "I understood your request, but there was an issue creating the task. Please try again or create it manually in the Dashboard."
                };
            }
        }

        // Help/greeting responses
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return {
                content: "I can help you with:\n\n✅ **Creating Tasks** - 'Add a task to review code'\n🗑️ **Deleting Tasks** - 'Delete the task about meeting'\n⚡ **Setting Priorities** - 'Set high priority for report task'\n📋 **Listing Tasks** - 'Show me all my tasks'\n📅 **Scheduling** - Mention dates like 'tomorrow' or 'Friday'\n\nTry any of these commands!"
            };
        }

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return {
                content: "Hello! 👋 Ready to help you manage your tasks. What would you like to do today?"
            };
        }

        // Default response
        return {
            content: "I'm not sure I understood that. Try:\n\n• 'Add a task to [action]'\n• 'Delete the task about [topic]'\n• 'Set [priority] priority for [task]'\n• 'Show me all my tasks'\n\nOr type 'help' to see all commands!"
        };
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        // Simulate typing delay
        setTimeout(async () => {
            const response = await generateResponse(userMessage);
            setMessages(prev => [...prev, { role: 'assistant', content: response.content, task: response.task }]);
            setIsTyping(false);
        }, 800);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <DashboardLayout>
            <TopHeader />
            <div className="ai-assistant-page">
                <div className="ai-header">
                    <div className="ai-header-content">
                        <FaRobot className="ai-header-icon" />
                        <div className="ai-header-text">
                            <h1 className="ai-title">AI Task Assistant</h1>
                            <p className="ai-subtitle">Manage your tasks with natural language</p>
                        </div>
                    </div>
                </div>

                <div className="ai-chat-container">
                    <div className="ai-messages">
                        {messages.map((msg, index) => (
                            <div key={index} className={`ai-message ${msg.role}`}>
                                <div className="ai-message-avatar">
                                    {msg.role === 'assistant' ? <FaRobot /> : <span>{msg.role.charAt(0).toUpperCase()}</span>}
                                </div>
                                <div className="ai-message-content">
                                    <div className="ai-message-text">{msg.content}</div>
                                    {msg.task && (
                                        <div className="ai-task-created">
                                            <FaCheckCircle /> Task added to your dashboard
                                        </div>
                                    )}
                                    {msg.deleted && (
                                        <div className="ai-task-deleted">
                                            <FaCheckCircle /> Task deleted successfully
                                        </div>
                                    )}
                                    {msg.updated && (
                                        <div className="ai-task-updated">
                                            <FaCheckCircle /> Task updated successfully
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message assistant">
                                <div className="ai-message-avatar">
                                    <FaRobot />
                                </div>
                                <div className="ai-message-content">
                                    <div className="ai-typing">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="ai-input-container">
                        <div className="ai-input-wrapper">
                            <input
                                type="text"
                                className="ai-input"
                                placeholder="Type your message... (e.g., 'Add a task to finish report by Friday')"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button
                                className="ai-send-btn"
                                onClick={handleSend}
                                disabled={!input.trim()}
                            >
                                <FaPaperPlane />
                            </button>
                        </div>
                        <div className="ai-suggestions">
                            <button className="ai-suggestion-chip" onClick={() => setInput("Add a task to review code tomorrow")}>
                                <FaPlus /> Review code tomorrow
                            </button>
                            <button className="ai-suggestion-chip" onClick={() => setInput("Create a high priority task for the meeting")}>
                                <FaPlus /> High priority meeting
                            </button>
                            <button className="ai-suggestion-chip" onClick={() => setInput("Schedule a task to call client on Friday")}>
                                <FaPlus /> Call client Friday
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AIAssistant;
