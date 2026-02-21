import React from 'react';

const Skeleton = ({ width, height, borderRadius, className = '' }) => {
    return (
        <div
            className={`skeleton-loader ${className}`}
            style={{
                width: width || '100%',
                height: height || '20px',
                borderRadius: borderRadius || '4px'
            }}
        />
    );
};

export const SkeletonCircle = ({ size, className = '' }) => (
    <Skeleton
        width={size || '40px'}
        height={size || '40px'}
        borderRadius="50%"
        className={className}
    />
);

export const SkeletonCard = () => (
    <div className="skeleton-card">
        <Skeleton height="150px" borderRadius="12px" />
        <div style={{ marginTop: '1rem' }}>
            <Skeleton width="60%" height="24px" />
            <Skeleton width="40%" height="16px" style={{ marginTop: '0.5rem' }} />
        </div>
    </div>
);

export default Skeleton;
