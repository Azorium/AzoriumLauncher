import React, { useState } from 'react';
import './AuthPage.css';
import { useNavigate } from 'react-router';
import { LAUNCHER_URL } from '../../js/appConsts';
import Header from '../Header/Header';
import { insertNotification, showNotification } from '../Notification/Notification';
import { NotificationItem } from '../../js/Interfaces';
import { checkFetch } from '../../js/utils/auth';

const AuthPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const navigate = useNavigate();

    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const clickButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (formData.username && formData.password) {
            setIsLoading(true);
            try {
                const loginFetch = await fetch(`${LAUNCHER_URL}/api/auth/launcher/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });



                if (loginFetch.status == 400) {
                    showNotification('error', `Неверный никнейм или пароль`, setNotifications);
                    return;
                }

                const loginData = await loginFetch.json();
                const result = await checkFetch(loginData.token);

                if (result.error) {
                    showNotification('error', `${result.error}`, setNotifications);
                    return;
                }

                navigate('/', { replace: true });
            } catch (error) {
                showNotification('error', `Отсутствует подключение к серверу, попробуйте позже`, setNotifications);
                return { success: false, error: 'Network error' };
            } finally {
                setIsLoading(false);
            }
        } else {
            showNotification('error', `Отсутствует логин или пароль`, setNotifications);
        }
    };

    return (
        <>
            <Header />
            <div className="auth-container">
                <div className="video-background">
                    <img src="/assets/images/background.png" alt="Background" className="bg-gif" />
                    <div className="video-overlay"></div>
                </div>

                <div className="form-container">
                    <div className="form-wrapper">
                        <div className="form-header">
                            <h1 className="app-title">{window.projectName}</h1>
                            <p className="app-subtitle">Войдите в свой аккаунт</p>
                        </div>
                        <form className="auth-form">
                            <div className="input-group">
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="Никнейм"
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Введите ваш пароль"
                                    onChange={handleChange}
                                    value={formData.password}
                                    required
                                />
                            </div>

                            <button
                                className={`submit-btn ${isLoading ? 'button-disabled' : ''}`}
                                id="register-button"
                                type="submit"
                                onClick={isLoading ? undefined : clickButton}
                            >
                                {isLoading ? (
                                    <span className="loading-spinner">
                                        <span className="spinner"></span>
                                    </span>
                                ) : (
                                    'Войти'
                                )}
                            </button>

                            <div className="form-toggle">
                                <p>
                                    Нет аккаунта?
                                    <button type="button" className="toggle-btn">
                                        Зарегистрироваться
                                    </button>
                                </p>
                            </div>
                        </form>

                        <div className="app-info">
                            <p>{window.projectName}Launcher • 2026</p>
                            <p>При появлении проблем пишите в Discord проекта</p>
                        </div>
                    </div>
                </div>
            </div>
            {insertNotification(notifications, setNotifications)}
        </>
    );
};

export default AuthPage;
