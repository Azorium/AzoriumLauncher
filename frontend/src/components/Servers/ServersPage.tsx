import React, {useEffect, useState} from 'react';
import './ServersPage.css';
import {NavLink} from "react-router";
import {API_URL} from "../../js/appConsts";
import {groupFormat} from "../../js/utils/textFormat";
import {insertNotification, showNotification} from "../Notification/Notification";
import {NotificationItem} from "../../js/Interfaces";
import {Quit, WindowMinimise} from "../../../wailsjs/runtime";

const ServersPage = () => {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isCheckedOnline, setIsCheckedOnline] = useState(false);
    const profiles = window.profiles
    const user = window.user;

    useEffect(() => {
        async function fetchAllProfiles() {
            const promises = profiles.map(async (profile) => {
                if (profile.maxOnline == undefined && profile.currentOnline == undefined) {
                    const host = profile.backend.ip;
                    const port = parseInt(profile.backend.port, 10);
                    const url = `https://api.mcstatus.io/v2/status/java/${host}:${port}`;

                    try {
                        const res = await fetch(url);
                        if (!res.ok) {
                            profile.maxOnline = 0;
                            profile.currentOnline = 0;
                            throw new Error(`HTTP ${res.status}`);
                        }
                        const data = await res.json();

                        profile.maxOnline = data.players.max;
                        profile.currentOnline = data.players.online;
                    } catch (error) {
                        console.error('Ошибка запроса:', error);
                    }
                }
            });

            await Promise.all(promises);
            setIsCheckedOnline(true);
        }

        fetchAllProfiles().then();
    }, [profiles]);

    return (
        <>
            <div className="servers-page">
                <div className="video-background">
                    <img src="/assets/images/background.png" alt="Background" className="bg-gif"/>
                    <div className="video-overlay"></div>
                </div>

                <div className="content-wrapper">
                    <header className="top-bar">
                        {
                            user === undefined || user === null
                                ? <div className="server-info">
                                    <img alt="logo" src="/assets/favicon.ico"/>
                                </div>
                                : <div className="user-info">
                                    <div className="user-avatar">
                                        <img
                                            src={`${API_URL}/uploads/heads/${user.username}_96.png`}
                                            alt={user.username}
                                            className="user-avatar-img"
                                        />
                                    </div>
                                    <div className="user-details">
                                        <span className="user-nickname">{user.username}</span>
                                        {groupFormat(user.groupName)}
                                    </div>
                                </div>
                        }

                        <div className="auth-actions">
                            {
                                user === undefined || user === null
                                    ?
                                    <NavLink to="/auth">
                                        <button className="login-btn">Войти</button>
                                    </NavLink>
                                    : ''
                            }

                            <NavLink to="/settings">
                                <button className="settings-icon-btn">
                                    <svg className='settings-icon' fill="#ffffff" version="1.1" id="Capa_1"
                                         xmlns="http://www.w3.org/2000/svg"
                                         width="800px" height="800px" viewBox="0 0 48.4 48.4" xmlSpace="preserve">
                                        <g>
                                            <path d="M48.4,24.2c0-1.8-1.297-3.719-2.896-4.285s-3.149-1.952-3.6-3.045c-0.451-1.093-0.334-3.173,0.396-4.705
		c0.729-1.532,0.287-3.807-0.986-5.08c-1.272-1.273-3.547-1.714-5.08-0.985c-1.532,0.729-3.609,0.848-4.699,0.397
		s-2.477-2.003-3.045-3.602C27.921,1.296,26,0,24.2,0c-1.8,0-3.721,1.296-4.29,2.895c-0.569,1.599-1.955,3.151-3.045,3.602
		c-1.09,0.451-3.168,0.332-4.7-0.397c-1.532-0.729-3.807-0.288-5.08,0.985c-1.273,1.273-1.714,3.547-0.985,5.08
		c0.729,1.533,0.845,3.611,0.392,4.703c-0.453,1.092-1.998,2.481-3.597,3.047S0,22.4,0,24.2s1.296,3.721,2.895,4.29
		c1.599,0.568,3.146,1.957,3.599,3.047c0.453,1.089,0.335,3.166-0.394,4.698s-0.288,3.807,0.985,5.08
		c1.273,1.272,3.547,1.714,5.08,0.985c1.533-0.729,3.61-0.847,4.7-0.395c1.091,0.452,2.476,2.008,3.045,3.604
		c0.569,1.596,2.49,2.891,4.29,2.891c1.8,0,3.721-1.295,4.29-2.891c0.568-1.596,1.953-3.15,3.043-3.604
		c1.09-0.453,3.17-0.334,4.701,0.396c1.533,0.729,3.808,0.287,5.08-0.985c1.273-1.273,1.715-3.548,0.986-5.08
		c-0.729-1.533-0.849-3.61-0.398-4.7c0.451-1.09,2.004-2.477,3.603-3.045C47.104,27.921,48.4,26,48.4,24.2z M24.2,33.08
		c-4.91,0-8.88-3.97-8.88-8.87c0-4.91,3.97-8.88,8.88-8.88c4.899,0,8.87,3.97,8.87,8.88C33.07,29.11,29.1,33.08,24.2,33.08z"/>
                                        </g>
                                    </svg>

                                </button>
                            </NavLink>
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

                    <main className="servers-main">
                        {/*<div className="servers-header">*/}
                        {/*    <div className="servers-filter">*/}
                        {/*        <span className="filter-label">Сортировка:</span>*/}
                        {/*        <button className="filter-btn active">По популярности</button>*/}
                        {/*        <button className="filter-btn">По версии</button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        <div className="servers-grid">
                            {profiles.sort((a, b) => a.id - b.id).map((profile) => (
                                <div key={profile.id} className="server-card">
                                    <div
                                        className="server-card-bg"
                                        style={{backgroundImage: `url(${profile.frontend.image})`}}
                                    />
                                    <div className="server-card-overlay">
                                        <div className="server-card-content">
                                            <div className="server-card-header">
                                                <div className="server-title-group">
                                                    <h3 className="server-name">{profile.frontend.name}</h3>
                                                    <span className="server-version">{profile.mcVersion}</span>
                                                </div>
                                                <span className="server-players">{
                                                    isCheckedOnline ? `${profile.currentOnline}/${profile.maxOnline}` : "Na/Na"
                                                }</span>
                                            </div>

                                            <p className="server-description">
                                                {profile.frontend.description}
                                            </p>

                                            <div className="server-actions">
                                                {!user ?
                                                    <button className="play-btn"
                                                            onClick={() => showNotification('error', `Войдите в аккаунт, чтобы начать играть`, setNotifications)}>
                                                        <span>Играть</span>
                                                    </button>
                                                    :
                                                    <NavLink
                                                        to={`/client_start/${profile.backend.folderName}/${profile.frontend.name}`}
                                                        style={{textDecoration: "none"}}>
                                                        <button className="play-btn">
                                                            <span>Играть</span>
                                                        </button>
                                                    </NavLink>
                                                }

                                                <NavLink to={`/server_settings/${profile.backend.folderName}`}>
                                                    <button className="server-settings-btn">

                                                        <svg className="settings-icon-small" width="800px"
                                                             height="800px"
                                                             viewBox="-0.5 0 25 25" fill="none"
                                                             xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M12 7.82001H22" stroke="#ffffff" strokeWidth="1.5"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M2 7.82001H4" stroke="#ffffff" strokeWidth="1.5"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M20 16.82H22" stroke="#ffffff" strokeWidth="1.5"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path d="M2 16.82H12" stroke="#ffffff" strokeWidth="1.5"
                                                                  strokeLinecap="round" strokeLinejoin="round"/>
                                                            <path
                                                                d="M8 11.82C10.2091 11.82 12 10.0291 12 7.82001C12 5.61087 10.2091 3.82001 8 3.82001C5.79086 3.82001 4 5.61087 4 7.82001C4 10.0291 5.79086 11.82 8 11.82Z"
                                                                stroke="#ffffff" strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                            <path
                                                                d="M16 20.82C18.2091 20.82 20 19.0291 20 16.82C20 14.6109 18.2091 12.82 16 12.82C13.7909 12.82 12 14.6109 12 16.82C12 19.0291 13.7909 20.82 16 20.82Z"
                                                                stroke="#ffffff" strokeWidth="1.5"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"/>
                                                        </svg>
                                                    </button>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
            {insertNotification(notifications, setNotifications)}
        </>
    );
};

export default ServersPage;