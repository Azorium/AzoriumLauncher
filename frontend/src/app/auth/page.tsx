import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router';
import { launchServerApiUrl, projectName } from '../../js/Consts';
import { insertNotification, showNotification } from '../../components/Notification';
import { HeaderContextType, NotificationItem } from '../../js/Interfaces';
import { checkFetch } from '../../js/utils/auth';
import processingContext from '../../js/utils/processingContext';

export default function AuthPage() {
    const headerContext = useOutletContext<HeaderContextType>();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    useEffect(() => {
        processingContext(headerContext, 'auth');
    });

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
                const loginFetch = await fetch(`${launchServerApiUrl}/api/auth/launcher/login`, {
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
            <div className="w-full h-full flex items-center justify-center">
                <div className="mb-7! w-full max-w-[480px] bg-[rgba(20,20,30,0.55)] backdrop-blur-[12px] rounded-3xl border border-white/10 p-10! shadow-[0_15px_35px_rgba(0,0,0,0.2)] animate-[fadeIn_0.6s_ease-out]">
                    <div className="text-center mb-6!">
                        <h1 className="text-4xl font-bold text-white mb-1.5! tracking-[-0.5px]">{projectName}</h1>
                        <p className="text-base font-normal text-white/50">Войдите в свой аккаунт</p>
                    </div>

                    <form className="flex flex-col gap-[18px]">
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Никнейм или почта"
                                value={formData.username}
                                onChange={handleChange}
                                className="px-[18px]! py-[14px]! border border-white/15 rounded-xl text-base text-white bg-white/10 placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(111,191,125,0.15)]"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Введите ваш пароль"
                                onChange={handleChange}
                                value={formData.password}
                                required
                                className="px-[18px]! py-[14px]! border border-white/15 rounded-xl text-base text-white bg-white/10 placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(111,191,125,0.15)]"
                            />
                        </div>

                        <button
                            className={`bg-gradient-to-br from-[#0984e3] to-[#5ebaef] text-white border-0 rounded-xl p-[15px]! text-[1.05rem] font-semibold cursor-pointer transition-all
                             duration-300 mt-2 tracking-[0.5px]  ${isLoading ? 'bg-none bg-gray-600/30! cursor-not-allowed!' : 'hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,132,227,0.3)]'}`}
                            id="register-button"
                            type="submit"
                            onClick={isLoading ? undefined : clickButton}
                        >
                            {isLoading ? (
                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 rounded-full border-t-white animate-spin"></span>
                                </span>
                            ) : (
                                'Войти'
                            )}
                        </button>

                        <div className="mt-[18px]! pt-[18px]! border-t border-white/10"></div>
                    </form>

                    <div className="mt-6! text-center text-xs text-white/40 leading-[1.4]">
                        <p>{projectName}Launcher • 2026</p>
                        <p>При появлении проблем пишите в Discord проекта</p>
                    </div>
                </div>
            </div>
            {insertNotification(notifications, setNotifications)}
        </>
    );
}
