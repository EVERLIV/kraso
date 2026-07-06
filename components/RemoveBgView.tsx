import React from 'react';
import ImageToolView from './upscale/ImageToolView';
import { REMOVE_BG_TOOL } from '../lib/imageToolConfig';

interface RemoveBgViewProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    isFreeTier: boolean;
    initialImage?: string | null;
}

function RemoveBgView(props: RemoveBgViewProps) {
    return <ImageToolView config={REMOVE_BG_TOOL} {...props} />;
}

export default RemoveBgView;
