import React, { ReactNode } from 'react';

interface FeatureCardBaseProps {
    children: ReactNode;
}

const FeatureCardBase: React.FC<FeatureCardBaseProps> = ({ children }) => {
    return (
        <div className='grid grid-cols-12 md:gap-10 gap-5 w-10/12 mx-auto'>
            {children}
        </div>
    );
};

export default FeatureCardBase;
