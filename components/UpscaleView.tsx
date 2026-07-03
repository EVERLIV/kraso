import React from 'react';
import ImageToolView from './upscale/ImageToolView';
import { UPSCALE_TOOL } from '../lib/imageToolConfig';

interface UpscaleViewProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    isFreeTier: boolean;
    initialImage?: string | null;
}

function UpscaleView(props: UpscaleViewProps) {
    return <ImageToolView config={UPSCALE_TOOL} {...props} />;
}

export default UpscaleView;
