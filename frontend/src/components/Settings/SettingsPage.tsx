import React, {useEffect, useRef, useState} from 'react';
import './SettingsPage.css';
import {useNavigate} from 'react-router';
import {NotificationItem, Settings} from '../../js/Interfaces';
import {OpenLauncherRootFolder, SaveSettings} from '../../../wailsjs/go/main/App';
import {Quit, WindowMinimise} from '../../../wailsjs/runtime';
import {service} from '../../../wailsjs/go/models';
import {SkinView} from '../Skin/SkinView';
import {insertNotification, showNotification} from "../Notification/Notification";
import SettingsObj = service.SettingsObj;

export const SettingsPage = () => {
    const [settings, setSettings] = useState<Settings>(window.settings);
    const [memory, setMemory] = useState<number>(window.settings.dedicatedRamGB);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const user = window.user;

    useEffect(() => {
        if (memory != window.settings.dedicatedRamGB) {
            window.settings.dedicatedRamGB = memory;
            SaveSettings(window.settings as unknown as SettingsObj).then();
        }
    }, [memory])

    const handleBack = () => {
        navigate('/', {replace: true});
    };

    const handleOpenProfile = () => {
        user ? navigate('/profile', {replace: true}) : showNotification('error', `Войдите в аккаунт, чтобы войти в профиль`, setNotifications);
    };

    const changeSettings = (target: React.ChangeEvent<HTMLInputElement>['target'], type: string) => {
        if (settings) {
            let changedSettings = {...settings};
            changedSettings['base'][type]['value'] = target.checked;
            SaveSettings(changedSettings as unknown as SettingsObj).then();
            setSettings(changedSettings);
            window.settings = changedSettings;
        }
    };

    const renderToggleList = () => {
        if (!settings) return null;
        return Object.entries(settings['base']).map(([key, value], idx) => (
            <div className="toggle-row" key={value.index} style={{animationDelay: `${idx * 0.05}s`}}>
                <div className="toggle-text">
                    <span className="toggle-name">{value.name}</span>
                    <span className="toggle-desc">{value.description}</span>
                </div>
                <label className="toggle-switch">
                    <input
                        type="checkbox"
                        checked={value.value}
                        onChange={(e) => changeSettings(e.target, key)}
                    />
                    <span className="toggle-slider"></span>
                </label>
            </div>
        ));
    };

    return (
        <>
            <SkinView isSettingsPage={false}/>
            <div className="settings-page">
                <div className="video-background">
                    <img src="/assets/images/background.png" alt="Background" className="bg-gif"/>
                    <div className="video-overlay"></div>
                </div>

                <div className="settings-content-wrapper">
                    <header className="settings-top-bar">
                        <div className="settings-title-text">
                            <button className="back-btn" onClick={handleBack} aria-label="Вернуться в лаунчер">
                                <svg className="back-icon" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                    <path d="M12 5L5 12L12 19" stroke="currentColor" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                            Настройки
                        </div>

                        <div className="settings-auth-actions">
                            <button
                                className="settings-window-control settings-window-control-minimize"
                                onClick={WindowMinimise}
                                aria-label="Свернуть окно"
                                title="Свернуть"
                            >
                                <svg className="settings-window-control-icon" viewBox="0 0 10 10">
                                    <rect x="1" y="4.5" width="8" height="1" fill="currentColor"/>
                                </svg>
                            </button>
                            <button
                                className="settings-window-control settings-window-control-close"
                                onClick={Quit}
                                aria-label="Закрыть приложение"
                                title="Закрыть"
                            >
                                <svg className="settings-window-control-icon" viewBox="0 0 10 10">
                                    <path
                                        d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </button>
                        </div>
                    </header>

                    <main className="settings-main">
                        <div className="settings-columns">
                            <section className="settings-panel">
                                <h2 className="panel-title">Основные параметры</h2>
                                <div className="toggle-list">
                                    {renderToggleList()}
                                </div>
                            </section>

                            <aside className="settings-actions">
                                <div className="action-cards">
                                    <div className="action-card">
                                        <div className="action-info">
                                            <h3 className="action-name">Профиль игрока</h3>
                                            <p className="action-desc">Статистика и выход из аккаунта</p>
                                        </div>
                                        <button className="action-btn" onClick={handleOpenProfile}>Перейти</button>
                                    </div>
                                    <div className="action-card">
                                        <div className="action-info">
                                            <h3 className="action-name">Место хранения файлов</h3>
                                            <p className="action-desc">Папка с файлами игры и лаунчера</p>
                                        </div>
                                        <button className="action-btn" onClick={OpenLauncherRootFolder}>Открыть</button>
                                    </div>
                                </div>

                                <div className="memory-card">
                                    <div className="action-info">
                                        <h3 className="action-name">Выделенная память</h3>
                                        <p className="action-desc">Объём ОЗУ для игры (ГБ)</p>
                                    </div>
                                    <div className="memory-value-display">{memory} ГБ</div>
                                    <div className="memory-control">
                                        <input
                                            type="range"
                                            min="1"
                                            max="12"
                                            step="1"
                                            value={memory}
                                            onChange={(e) => setMemory(Number(e.target.value))}
                                            className="memory-slider"
                                        />
                                        <div className="memory-labels">
                                            <span>1 ГБ</span>
                                            <span>12 ГБ</span>
                                        </div>
                                    </div>
                                </div>
                            </aside>
                        </div>
                    </main>
                </div>
            </div>
            {insertNotification(notifications, setNotifications)}
        </>
    );
};

export default SettingsPage;