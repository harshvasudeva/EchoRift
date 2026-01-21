import React from 'react';
import { CSSProperties } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles: Record<string, CSSProperties> = {
    primary: {
        background: 'linear-gradient(135deg, #5865F2 0%, #4752C4 100%)',
        color: '#fff',
        border: 'none',
    },
    secondary: {
        background: 'rgba(79, 84, 92, 0.6)',
        color: '#fff',
        border: '1px solid rgba(255,255,255,0.1)',
    },
    ghost: {
        background: 'transparent',
        color: '#B5BAC1',
        border: 'none',
    },
    danger: {
        background: '#DA373C',
        color: '#fff',
        border: 'none',
    },
};

const sizeStyles: Record<string, CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '12px 24px', fontSize: '16px' },
};

export function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    disabled,
    style,
    ...props
}: ButtonProps) {
    const baseStyle: CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        borderRadius: '4px',
        fontWeight: 500,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        transition: 'all 0.15s ease',
        ...variantStyles[variant],
        ...sizeStyles[size],
        ...style,
    };

    return (
        <button style={baseStyle} disabled={disabled || loading} {...props}>
            {loading ? (
                <span style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid currentColor',
                    borderTopColor: 'transparent',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                }} />
            ) : icon}
            {children}
        </button>
    );
}
