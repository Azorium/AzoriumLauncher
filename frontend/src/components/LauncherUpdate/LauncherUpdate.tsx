import './LauncherUpdate.css';
import Header from '../Header/Header';
import React, { useEffect, useRef, useState } from 'react';
import '../Servers/ServersPage.css';
import { LauncherUpdateGO } from '../../../wailsjs/go/main/App';
import { EventsOff, EventsOn } from '../../../wailsjs/runtime';

export const LauncherUpdate = () => {
    const [showProgress, setShowProgress] = useState(false);

    const [currentStage, setCurrentStage] = useState('Проверка обновлений');
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        window.setCurrentStage = (stage: string) => {
            setCurrentStage(stage);
        };

        const showProgressCallback = (optionalData: any) => {
            setProgress(optionalData);
        };

        const setCurrentStageCallback = (optionalData: any) => {
            setShowProgress(optionalData.showProgress);
            setCurrentStage(optionalData.stage);
        };

        const offLUEventsCallback = () => {
            EventsOff('setProgress');
            EventsOff('setCurrentStage');
            EventsOff('offLUEvents');
        };

        EventsOn('setProgress', showProgressCallback);
        EventsOn('setCurrentStage', setCurrentStageCallback);
        EventsOn('offLUEvents', offLUEventsCallback);

        LauncherUpdateGO().then();
    }, []);

    return (
        <>
            <Header />
            <div className="update-checker-page">
                <div className="video-background">
                    <img src="/assets/images/background.jpg" alt="Background" className="bg-gif" />
                    <div className="video-overlay"></div>
                </div>

                <div className="update-checker-center">
                    <div className="update-checker-card">
                        <div className="update-checker-header">
                            <h1 className="update-checker-title">Обновление лаунчера</h1>
                            <p className="update-checker-subtitle">Проверка наличия обновлений</p>
                        </div>

                        <div className="update-checker-content">
                            <div className="update-checker-loading">
                                <div className="update-checker-spinner" />
                                <p className="update-checker-message">
                                    <span className="current-stage-name">{currentStage}</span>
                                </p>
                                {showProgress ? (
                                    <div className="progress-container" ref={intervalRef}>
                                        <div className="progress-bar">
                                            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <div className="progress-percent">{Math.round(progress)}%</div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
