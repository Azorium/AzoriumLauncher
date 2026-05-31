import React from 'react';
import './ServerUnavailable.css';
import Header from "../Header/Header";

const ServerUnavailable = () => {

    return (
        <div className="server-unavailable-page">
            <div className="video-background">
                <img src="/assets/images/background.png" alt="Background" className="bg-gif"/>
                <div className="video-overlay"></div>
            </div>

            <div className="su-content-wrapper">
                <header className="su-top-bar">
                    <Header/>
                </header>

                <main className="su-main">
                    <div className="su-error-container">
                        <h1 className="su-error-title">Сервер временно недоступен</h1>
                        <p className="su-error-details">Возможно, проводятся технические работы или сервер перегружен.
                            Пожалуйста, попробуйте позже.</p>

                        <div className="su-error-footer">
                            <p>Если проблема сохраняется, обратитесь в Discord сервер проекта или в другие соцсети</p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ServerUnavailable;