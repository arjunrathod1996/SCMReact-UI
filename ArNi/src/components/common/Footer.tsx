import React from 'react';

const FooterComponent: React.FC = () => {
    return (
        <div>
            <footer className="footer">
                <span>
                    Phegon Dev | All Rights Reserved &copy; {new Date().getFullYear()}
                </span>
            </footer>
        </div>
    );
};

export default FooterComponent;