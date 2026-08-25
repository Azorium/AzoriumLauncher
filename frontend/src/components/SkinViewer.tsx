import React, { useEffect, useRef } from 'react';
import { API_URL } from '../js/appConsts';
import * as skinview3d from 'skinview3d';
import { User } from '../js/Interfaces';

export const SkinViewer = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<skinview3d.SkinViewer | null>(null);
    const user = window.user as User;

    useEffect(() => {
        if (!canvasRef.current) return;
        if (viewerRef.current) return;

        const skinUrl = window.__preloadedSkin;

        const canvas = canvasRef.current;
        canvas.width = 400;
        canvas.height = 420;

        const viewer = new skinview3d.SkinViewer({
            canvas,
            width: 400,
            height: 420,
            skin: skinUrl,
        });

        viewer.animation = new skinview3d.IdleAnimation();
        viewer.animation.speed = 1;
        viewer.controls.enableZoom = false;
        viewer.controls.enableRotate = false;

        const controls = viewer.controls;

        const angle = 0.5;
        const position = viewer.camera.position.clone();
        const radius = position.length();

        const currentAngle = Math.atan2(position.x, position.z);
        const newAngle = currentAngle + angle;

        position.x = radius * Math.sin(newAngle);
        position.z = radius * Math.cos(newAngle);

        viewer.resetCameraPose();

        viewer.camera.position.copy(position);
        viewer.camera.lookAt(controls.target);
        controls.update();

        viewerRef.current = viewer;

        const loadCape = async () => {
            try {
                let res = await fetch(`${API_URL}/uploads/capes/${user.capeHash}.png`);

                if (res.ok && viewer) viewer.loadCape(res.url).then();
            } catch (err) {
                console.error('Ошибка загрузки плаща:', err);
            }
        };
        loadCape().then();

        return () => {
            viewer.dispose?.();
            viewerRef.current = null;
        };
    }, []);

    return <canvas ref={canvasRef} />;
};
