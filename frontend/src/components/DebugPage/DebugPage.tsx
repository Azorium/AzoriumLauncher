import React, { useCallback, useEffect } from 'react';
import './DebugPage.css';
import { EventsEmit, EventsOff, EventsOn } from '../../../wailsjs/runtime';
import { FiCopy, FiXCircle } from 'react-icons/fi';
import Header from '../Header/Header';
import { useNavigate, useParams } from 'react-router';

export const DebugPage = () => {
    const { clientName } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const setTextCallback = (text: string) => {
            const el = document.getElementById('debug-output') as HTMLElement;
            el.textContent += text + '\n';
            el.scrollTop = el.scrollHeight;
        };

        EventsOn('setText', setTextCallback);

        return () => {
            EventsOff('setText', 'navToDebugPage');
        };
    }, []);

    const handleCopy = useCallback(async () => {
        const el = document.getElementById('debug-output') as HTMLElement;
        const text = el.textContent || '';
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    }, []);

    const handleStop = useCallback(() => {
        EventsEmit('killProcess');
    }, []);

    const handleBack = () => navigate('/', { replace: true });

    return (
        <>
            <Header />
            <div className="debug-start-page">
                <div className="video-background">
                    <img src="/assets/images/background.png" alt="Background" className="bg-gif" />
                    <div className="video-overlay"></div>
                </div>

                <div className="debug-start-center">
                    <div className="debug-start-card">
                        <div className="debug-start-header">
                            <h1 className="debug-start-title">{clientName}</h1>
                        </div>

                        <div className="debug-start-content">
                            <div id="debug-output" className="debug-output" />
                            <div className="debug-actions">
                                <button className="back-btn" onClick={handleBack} aria-label="Вернуться в лаунчер">
                                    <svg className="back-icon" viewBox="0 0 24 24" fill="none">
                                        <path
                                            d="M19 12H5"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M12 5L5 12L12 19"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        className="debug-btn debug-btn-stop"
                                        onClick={handleStop}
                                        title="Завершить процесс"
                                    >
                                        <FiXCircle size={20} />
                                    </button>
                                    <button
                                        className="debug-btn debug-btn-copy"
                                        onClick={handleCopy}
                                        title="Копировать в буфер"
                                    >
                                        <FiCopy size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
