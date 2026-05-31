import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router';
import './ServerSettings.css';
import {OptionalMod, Profile} from "../../../js/Interfaces";
import {Quit, WindowMinimise} from "../../../../wailsjs/runtime";
import {SaveSettings} from "../../../../wailsjs/go/main/App";
import {service} from "../../../../wailsjs/go/models";
import SettingsObj = service.SettingsObj;

const ServerSettings = () => {
    const navigate = useNavigate();
    const {clientFolderName} = useParams<{ clientFolderName: string }>();

    const profile = window.profiles.find((p) => p.backend.folderName === clientFolderName) as unknown as Profile;
    const [mods, setMods] = useState<OptionalMod[]>(window.settings.profiles[`${clientFolderName}`].optionalMods);

    const handleBack = () => {
        navigate('/', {replace: true});
    };

    const changeMod = (fileName: string, checked: boolean) => {
        const updatedMods = profile.optionalMods.map((mod) =>
            mod.fileName === fileName ? {...mod, value: checked} : mod
        );

        profile.optionalMods = updatedMods;
        setMods([...updatedMods]);
        window.settings.profiles[`${clientFolderName}`].optionalMods = updatedMods

        SaveSettings(window.settings as unknown as SettingsObj).then();
    };

    return (
        <div className="server-settings-page">
            <div className="video-background">
                <img src="/assets/images/background.png" alt="Background" className="bg-gif"/>
                <div className="video-overlay"></div>
            </div>

            <div className="server-settings-content-wrapper">
                <header className="server-settings-top-bar">
                    <div className="server-settings-title-text">
                        <button className="back-btn" onClick={handleBack} aria-label="Вернуться в лаунчер">
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 5L5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        Профиль {profile.frontend.name}
                    </div>

                    <div className="server-settings-window-actions">
                        <button
                            className="window-control window-control-minimize"
                            onClick={WindowMinimise}
                            aria-label="Свернуть окно"
                            title="Свернуть"
                        >
                            <svg className="window-control-icon" viewBox="0 0 10 10">
                                <rect x="1" y="4.5" width="8" height="1" fill="currentColor"/>
                            </svg>
                        </button>
                        <button
                            className="window-control window-control-close"
                            onClick={Quit}
                            aria-label="Закрыть приложение"
                            title="Закрыть"
                        >
                            <svg className="window-control-icon" viewBox="0 0 10 10">
                                <path
                                    d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="server-settings-main">
                    <div
                        className={`server-settings-mods-list ${mods.length === 0 ? 'server-settings-mods-list--empty' : ''}`}>
                        {mods.length === 0 ? (
                            <div className="server-settings-empty">
                                <div className="server-settings-empty-icon">!</div>
                                <div className="server-settings-empty-text">
                                    Нет доступных опциональных модов
                                </div>
                                <div className="server-settings-empty-hint">
                                    Моды для этого профиля не заданы
                                </div>
                            </div>
                        ) : (
                            mods.map((mod, index) => (
                                <div
                                    className="server-settings-card"
                                    key={mod.fileName}
                                    style={{animationDelay: `${index * 0.05}s`}}
                                >
                                    <div className="server-settings-info">
                                        <h3 className="server-settings-name">{mod.name}</h3>
                                        <p className="server-settings-description">{mod.description}</p>
                                    </div>
                                    <div className="server-settings-control">
                                        <label className="server-settings-switch">
                                            <input
                                                type="checkbox"
                                                checked={mod.value}
                                                onChange={(e) => changeMod(mod.fileName, e.target.checked)}
                                            />
                                            <span className="server-settings-slider"></span>
                                        </label>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServerSettings;