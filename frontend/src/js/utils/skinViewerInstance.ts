import * as skinview3d from 'skinview3d';
import {SkinViewer} from 'skinview3d';

let globalViewer: SkinViewer | null = null;
let currentSkinUrl: string | null = null;

export function getOrCreateSkinViewer(container: HTMLElement, skinUrl: string, isSettingsPage: boolean | undefined): SkinViewer | null {
    if (globalViewer) {
        if(!isSettingsPage) return null;

        const oldCanvas = globalViewer.canvas;
        if (oldCanvas && container) {
            container.innerHTML = '';
            container.appendChild(oldCanvas);
        }

        if (globalViewer.height == 1) {
            globalViewer.width = 300;
            globalViewer.height = 320;
            oldCanvas.width = 300;
            oldCanvas.height = 320;
            oldCanvas.style.width = '100%';
            oldCanvas.style.height = '100%';
        }

        if (skinUrl !== currentSkinUrl) {
            globalViewer.loadSkin(skinUrl).then();
            currentSkinUrl = skinUrl;
        }

        return globalViewer;
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    const viewer = new SkinViewer({
        canvas,
        width: 1,
        height: 1,
        skin: skinUrl
    });

    viewer.animation = new skinview3d.WalkingAnimation();
    viewer.animation.speed = 1;
    viewer.controls.enableZoom = true;
    viewer.controls.enableRotate = true;

    globalViewer = viewer;
    currentSkinUrl = skinUrl;
    return null;
}