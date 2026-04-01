import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

interface CustomIconProps extends SvgIconProps {
    alt?: string;
    children?: React.ReactNode;
}

const CustomIcon: React.FC<CustomIconProps> = ({ alt, children, ...props }) => {
    return (
        <SvgIcon
            {...props}
            role="img"
            aria-label={alt || "icon"}
        >
            {children}
        </SvgIcon>
    );
};

export default CustomIcon;
