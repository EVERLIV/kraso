import React from 'react';
import ImageToolView from './upscale/ImageToolView';
import { RESTORE_TOOL } from '../lib/imageToolConfig';

interface RestoreViewProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    isFreeTier: boolean;
    initialImage?: string | null;
}

function RestoreView(props: RestoreViewProps) {
    return <ImageToolView config={RESTORE_TOOL} {...props} />;
}

export default RestoreView;
