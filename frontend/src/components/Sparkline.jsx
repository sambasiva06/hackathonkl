import React from 'react';

const Sparkline = ({ color = 'var(--primary)' }) => {
    return (
        <div style={{ marginLeft: 'auto', marginRight: '1rem', opacity: 0.6 }}>
            <svg width="40" height="15">
                <path
                    d="M0 15 L5 10 L10 12 L15 5 L20 8 L25 2 L30 10 L35 4 L40 8"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default Sparkline;
