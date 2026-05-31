import React from 'react';
import './ProfilePage.css';
import { useNavigate } from 'react-router';
import { SkinView } from '../Skin/SkinView';
import { groupFormat } from '../../js/utils/textFormat';
import { WindowMinimise, Quit } from '../../../wailsjs/runtime';
import { User } from "../../js/Interfaces";

const ProfilePage = () => {
    const navigate = useNavigate();
    const user = window.user as User;

    const handleBack = () => navigate('/settings', { replace: true });
    const handleLogout = () => {
        localStorage.removeItem('token');
        window.user = null;
        navigate('/', { replace: true });
    };

    return (
        <div className="profile-page">
            <div className="video-background">
                <img src="/assets/images/background.png" alt="Background" className="bg-gif" />
                <div className="video-overlay"></div>
            </div>

            <div className="profile-content-wrapper">
                <header className="profile-top-bar">
                    <div className="profile-title-text">
                        <button className="back-btn" onClick={handleBack} aria-label="Вернуться в лаунчер">
                            <svg className="back-icon" viewBox="0 0 24 24" fill="none">
                                <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M12 5L5 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        Профиль
                    </div>

                    <div className="profile-auth-actions">
                        <button className="profile-window-control profile-logout-btn" onClick={handleLogout} aria-label="Выйти из аккаунта" title="Выйти из аккаунта">
                            <svg className="profile-window-control-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                        </button>
                        <button className="profile-window-control profile-window-control-minimize" onClick={WindowMinimise} aria-label="Свернуть окно" title="Свернуть">
                            <svg className="profile-window-control-icon" viewBox="0 0 10 10">
                                <rect x="1" y="4.5" width="8" height="1" fill="currentColor" />
                            </svg>
                        </button>
                        <button className="profile-window-control profile-window-control-close" onClick={Quit} aria-label="Закрыть приложение" title="Закрыть">
                            <svg className="profile-window-control-icon" viewBox="0 0 10 10">
                                <path d="M1.70711 0.292893C1.31658 -0.0976311 0.683417 -0.0976311 0.292893 0.292893C-0.0976311 0.683417 -0.0976311 1.31658 0.292893 1.70711L3.58579 5L0.292893 8.29289C-0.0976311 8.68342 -0.0976311 9.31658 0.292893 9.70711C0.683417 10.0976 1.31658 10.0976 1.70711 9.70711L5 6.41421L8.29289 9.70711C8.68342 10.0976 9.31658 10.0976 9.70711 9.70711C10.0976 9.31658 10.0976 8.68342 9.70711 8.29289L6.41421 5L9.70711 1.70711C10.0976 1.31658 10.0976 0.683417 9.70711 0.292893C9.31658 -0.0976311 8.68342 -0.0976311 8.29289 0.292893L5 3.58579L1.70711 0.292893Z" fill="currentColor"/>
                            </svg>
                        </button>
                    </div>
                </header>

                <main className="profile-main">
                    <div className="skin-viewer-wrapper">
                        <div className="profile-user-details">
                            <div className="user-role">{groupFormat(user.groupName)}</div>
                            <div className="username">{user.username}</div>
                        </div>
                        <SkinView isSettingsPage={true} />
                    </div>

                    <div className="profile-stats-row">
                        <div className="profile-card">
                            <div className="profile-info">
                                <h3 className="profile-name">Дата регистрации</h3>
                                <p className="profile-description">10.05.2023</p>
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className="profile-info">
                                <h3 className="profile-name">Монеты</h3>
                                <p className="profile-description">21441</p>
                            </div>
                        </div>
                        <div className="profile-card">
                            <div className="profile-info">
                                <h3 className="profile-name">Последний вход</h3>
                                <p className="profile-description">30.05.2026</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;