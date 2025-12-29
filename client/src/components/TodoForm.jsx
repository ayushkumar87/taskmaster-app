import { useState, useEffect } from 'react';

const TodoForm = ({ onSubmit, initialData = {}, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
        status: 'Pending',
        playlistLink: '',
        totalVideos: 0,
    });

    useEffect(() => {
        if (initialData._id) {
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                priority: initialData.priority || 'Medium',
                dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
                status: initialData.status || 'Pending',
                playlistLink: initialData.playlist?.link || '',
                totalVideos: initialData.playlist?.totalVideos || 0,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submissionData = {
            ...formData,
            playlist: {
                link: formData.playlistLink,
                totalVideos: parseInt(formData.totalVideos) || 0,
                watchedVideos: initialData.playlist?.watchedVideos || 0
            }
        };
        // Clean up flat fields that are now in playlist object
        delete submissionData.playlistLink;
        delete submissionData.totalVideos;

        onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input-group">
                <label className="input-label">Title</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                />
            </div>

            <div className="input-group">
                <label className="input-label">Description</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="input-field"
                    style={{ minHeight: '100px', resize: 'vertical' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
                <div className="input-group">
                    <label className="input-label">Priority</label>
                    <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="input-field"
                    >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="input-label">Due Date</label>
                    <input
                        type="date"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        className="input-field"
                    />
                </div>
            </div>

            <div style={{ marginTop: 'var(--spacing-md)', padding: 'var(--spacing-md)', background: 'var(--bg-color)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>YouTube Playlist Tracker (Optional)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-md)' }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Playlist Link</label>
                        <input
                            type="url"
                            name="playlistLink"
                            value={formData.playlistLink}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="https://youtube.com/playlist?list=..."
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                        <label className="input-label">Total Videos</label>
                        <input
                            type="number"
                            name="totalVideos"
                            value={formData.totalVideos}
                            onChange={handleChange}
                            className="input-field"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
                <button
                    type="button"
                    onClick={onClose}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                >
                    {initialData._id ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TodoForm;
