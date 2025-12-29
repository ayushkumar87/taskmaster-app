import { useState } from 'react';
import { format } from 'date-fns';
import { FaTrash, FaEdit, FaCheck, FaUndo, FaClock, FaYoutube } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-youtube';

const TodoCard = ({ todo, onDelete, onUpdate }) => {
    const [showPlayer, setShowPlayer] = useState(false);

    const handleStatusToggle = () => {
        const newStatus = todo.status === 'Completed' ? 'Pending' : 'Completed';
        onUpdate(todo._id, { status: newStatus });
    };

    const getPlaylistId = (url) => {
        if (!url) return null;
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('list');
        } catch (e) {
            return null;
        }
    };

    const playlistId = todo.playlist ? getPlaylistId(todo.playlist.link) : null;

    const checkPlaylistInfo = (player) => {
        if (player && player.getPlaylist) {
            const playlist = player.getPlaylist();
            if (playlist && Array.isArray(playlist) && playlist.length > 0) {
                const actualTotal = playlist.length;
                if (todo.playlist.totalVideos !== actualTotal) {
                    onUpdate(todo._id, {
                        playlist: { ...todo.playlist, totalVideos: actualTotal }
                    });
                }
            }
        }
    };

    const handleVideoEnd = (event) => {
        // Automatically increment watched count when video ends
        const newCount = Math.min(todo.playlist.totalVideos, todo.playlist.watchedVideos + 1);
        onUpdate(todo._id, {
            playlist: { ...todo.playlist, watchedVideos: newCount }
        });
        checkPlaylistInfo(event.target);
    };

    const onPlayerReady = (event) => {
        checkPlaylistInfo(event.target);
    };

    const onPlayerStateChange = (event) => {
        // YouTube Player States: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
        // Check info on Buffering (3) and Playing (1)
        if (event.data === 1 || event.data === 3) {
            checkPlaylistInfo(event.target);
        }
    };

    const priorityClass = `priority-${todo.priority.toLowerCase()}`;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            className="todo-card"
        >
            <div className={`priority-indicator ${priorityClass}`}></div>

            <div className="todo-header">
                <h3 className={`todo-title ${todo.status === 'Completed' ? 'completed' : ''}`}>
                    {todo.title}
                </h3>
                <span className={`todo-badge ${priorityClass}`}>
                    {todo.priority}
                </span>
            </div>

            <p className="todo-desc">
                {todo.description || 'No description provided.'}
            </p>

            {todo.playlist && todo.playlist.link && (
                <div className="playlist-section">
                    <div className="playlist-header">
                        <span className="playlist-label">
                            <FaYoutube style={{ verticalAlign: 'middle', marginRight: '5px', color: '#FF0000' }} />
                            Playlist Progress
                        </span>
                        <a href={todo.playlist.link} target="_blank" rel="noopener noreferrer" className="playlist-link">
                            Open ↗
                        </a>
                    </div>

                    <div className="progress-mini-container">
                        <div
                            className="progress-mini-fill"
                            style={{ width: `${Math.min(100, (todo.playlist.watchedVideos / (todo.playlist.totalVideos || 1)) * 100)}%` }}
                        ></div>
                    </div>

                    <div className="playlist-controls">
                        <span className="playlist-count">
                            {todo.playlist.watchedVideos} / {todo.playlist.totalVideos} Videos
                        </span>

                        {playlistId && (
                            <button
                                onClick={() => setShowPlayer(!showPlayer)}
                                className="mini-btn"
                                style={{ width: 'auto', padding: '0 8px', fontSize: '0.8rem' }}
                            >
                                {showPlayer ? 'Hide Player' : 'Watch Here'}
                            </button>
                        )}
                    </div>

                    <AnimatePresence>
                        {showPlayer && playlistId && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                style={{ marginTop: '10px', overflow: 'hidden' }}
                            >
                                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                                    <YouTube
                                        videoId={null} // Load by playlist opts
                                        opts={{
                                            height: '100%',
                                            width: '100%',
                                            playerVars: {
                                                listType: 'playlist',
                                                list: playlistId,
                                                index: todo.playlist.watchedVideos, // Start at current progress
                                            },
                                        }}
                                        onEnd={handleVideoEnd}
                                        onReady={onPlayerReady}
                                        onStateChange={onPlayerStateChange}
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}

            <div className="todo-meta">
                <div className="flex items-center gap-2">
                    <FaClock />
                    <span>{todo.dueDate ? format(new Date(todo.dueDate), 'MMM d, yyyy') : 'No Date'}</span>
                </div>
                <span>{todo.status}</span>
            </div>

            <div className="todo-actions">
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleStatusToggle}
                    className="action-btn"
                    style={{ color: todo.status === 'Completed' ? 'var(--warning-color)' : 'var(--secondary-color)' }}
                    title={todo.status === 'Completed' ? 'Mark Pending' : 'Mark Completed'}
                >
                    {todo.status === 'Completed' ? <FaUndo /> : <FaCheck />}
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onUpdate(todo._id, null, true)}
                    className="action-btn"
                    style={{ color: 'var(--info-color)' }}
                    title="Edit"
                >
                    <FaEdit />
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDelete(todo._id)}
                    className="action-btn"
                    style={{ color: 'var(--danger-color)' }}
                    title="Delete"
                >
                    <FaTrash />
                </motion.button>
            </div>
        </motion.div>
    );
};

export default TodoCard;
