const ProgressBar = ({ total, completed }) => {
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    return (
        <div style={{
            width: '100%', background: '#E5E7EB', borderRadius: '999px',
            height: '1rem', overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            margin: '1rem 0'
        }}>
            <div
                style={{
                    width: `${percentage}%`, background: 'var(--secondary-color)', height: '100%',
                    borderRadius: '999px', transition: 'width 0.5s ease-out',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', color: 'white', fontWeight: 'bold'
                }}
            >
                {percentage}%
            </div>
        </div>
    );
};

export default ProgressBar;
