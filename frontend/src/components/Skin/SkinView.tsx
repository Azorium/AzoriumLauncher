import React, {useEffect, useRef} from 'react';
import {API_URL} from "../../js/appConsts";
import {getOrCreateSkinViewer} from "../../js/utils/skinViewerInstance";

interface SkinViewProps {
    isSettingsPage?: boolean;
}

export const SkinView: React.FC<SkinViewProps> = ({isSettingsPage}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const user = window.user;

    useEffect(() => {
        if (!containerRef.current || !user) return;

        const skinUrl = window.__preloadedSkin;
        const viewer = getOrCreateSkinViewer(containerRef.current, skinUrl, isSettingsPage);

        if (!viewer) {
            return;
        }

        viewer.resetCameraPose()

        const loadCape = async () => {
            try {
                let res = await fetch(`${API_URL}/uploads/capes/${user.capeHash}.png`);

                if (res.ok && viewer) viewer.loadCape(res.url).then();
            } catch (err) {
                console.error('Ошибка загрузки плаща:', err);
            }
        };
        loadCape().then();
    }, [user?.username]);

    return <div className="skin-viewer" ref={containerRef}/>;
};