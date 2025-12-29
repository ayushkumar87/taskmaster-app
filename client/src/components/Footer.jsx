const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-content">
                    <p className="footer-text">
                        &copy; {new Date().getFullYear()} <span className="footer-brand">TaskMaster</span>. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
