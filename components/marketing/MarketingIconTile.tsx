import React from 'react';

export type MsTileVariant = 'lime' | 'pink' | 'blue' | 'purple' | 'amber' | 'empty';

const TILE_CLASS: Record<Exclude<MsTileVariant, 'empty'>, string> = {
    lime: 'ms-tile-lime',
    pink: 'ms-tile-pink',
    blue: 'ms-tile-blue',
    purple: 'ms-tile-purple',
    amber: 'ms-tile-amber',
};

interface MarketingIconTileProps {
    variant: MsTileVariant;
    size?: 'nav' | 'card' | 'brand' | 'tool';
    children?: React.ReactNode;
    className?: string;
}

const SIZE_CLASS = {
    nav: 'size-5 rounded-md',
    card: 'size-[34px] rounded-[9px]',
    brand: 'size-[26px] rounded-lg',
    tool: 'size-12 rounded-[var(--ms-radius-btn)]',
};

function MarketingIconTile({ variant, size = 'nav', children, className = '' }: MarketingIconTileProps) {
    if (variant === 'empty') {
        return (
            <span className={`${SIZE_CLASS[size]} ms-slot ms-slot--dashed flex items-center justify-center text-[var(--ms-dim)] shrink-0 ${className}`}>
                {children}
            </span>
        );
    }
    return (
        <span className={`${SIZE_CLASS[size]} ${TILE_CLASS[variant]} flex items-center justify-center shrink-0 ${className}`}>
            {children}
        </span>
    );
}

export default MarketingIconTile;
