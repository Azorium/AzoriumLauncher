import React, {useEffect, useRef, useState} from 'react';
import './ClientStartPage.css';
import Header from '../Header/Header';
import {useNavigate, useParams} from 'react-router';
import {StartClientProcesses} from "../../../wailsjs/go/main/App";
import {service} from "../../../wailsjs/go/models";
import {EventsOff, EventsOn} from "../../../wailsjs/runtime";
import Profile = service.Profile;

export const ClientStartPage = () => {
    const {clientFolderName, clientName} = useParams();
    const navigate = useNavigate()
    const [showProgress, setShowProgress] = useState(false);

    const [currentStage, setCurrentStage] = useState("Инициализация");
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        window.setCurrentStage = (stage: string) => {
            setCurrentStage(stage);
        }

        const showProgressCallback = (optionalData: any) => {
            setProgress(optionalData);
        }

        const setCurrentStageCallback = (optionalData: any) => {
            setShowProgress(optionalData.showProgress);
            setCurrentStage(optionalData.stage);
        }

        const navToDebugPageCallback = () => {
            navigate(`/debug/${clientName}`, {replace: true});
        }

        const setOffEvents = () => {
            setShowProgress(false);
            EventsOff('setProgress');
            EventsOff('setCurrentStage');
            EventsOff('offDownloadBytesEvents');
        }

        EventsOn('setProgress', showProgressCallback);
        EventsOn('setCurrentStage', setCurrentStageCallback);
        EventsOn('navToDebugPage', navToDebugPageCallback);
        EventsOn('offDownloadBytesEvents', setOffEvents);

        const [profile] = window.profiles.filter(profile => profile.backend.folderName.includes(clientFolderName as string)).values();
        StartClientProcesses(profile as unknown as Profile).then();
    }, [])

    return (
        <>
            <Header/>
            <div className="client-start-page">
                <div className="video-background">
                    <img src="/assets/images/background.png" alt="Background" className="bg-gif"/>
                    <div className="video-overlay"></div>
                </div>

                <div className="client-start-center">
                    <div className="client-start-card">
                        <div className="client-start-header">
                            <h1 className="client-start-title">{clientName}</h1>
                            <p className="client-start-subtitle">Запуск клиента</p>
                        </div>

                        <div className="client-start-content">
                            <div className="client-start-loading">
                                <div className="client-start-spinner"></div>
                                <p className="client-start-message">
                                    <span className="current-stage-name">{currentStage}</span>
                                </p>

                                {/*{currentStage == "Запуск Minecraft" ?*/}
                                {/*    <p className="client-lowstart-message">*/}
                                {/*        Возможен продолжительный запуск*/}
                                {/*    </p>*/}
                                {/*    : ''}*/}

                                {showProgress ? (
                                    <div className="progress-container" ref={intervalRef}>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{width: `${progress}%`}}
                                            ></div>
                                        </div>
                                        <div className="progress-percent">{Math.round(progress)}%</div>
                                    </div>
                                ) : ''}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};