import { NavLink, Outlet, useNavigate } from 'react-router';
import { Quit, WindowMinimise } from '../../wailsjs/runtime';
import { useState } from 'react';

export default function RootLayout() {
    const user = window.user;
    const navigate = useNavigate();
    const [isRenderSettingsButton, setIsRenderSettingsButton] = useState(true);
    const [isRenderBackButton, setIsRenderBackButton] = useState(false);
    const [isRenderLogoutButton, setIsRenderLogoutButton] = useState(false);
    const [isRenderAuthButton, setIsRenderAuthButton] = useState(false);
    const [backUrl, setBackUrl] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.user = null;
        navigate('/servers', { replace: true });
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden rounded-xl">
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <video className="absolute w-full h-full object-cover" muted loop playsInline preload="auto" autoPlay>
                    <source src="/assets/background.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-10 w-full h-full pr-8! pl-8!">
                <div
                    className={`h-[40px] flex items-center gap-4 pt-6! text-2xl ${isRenderBackButton || (isRenderAuthButton && !user) ? 'justify-between' : 'justify-end'}`}
                >
                    {isRenderBackButton && (!isRenderAuthButton || user) && (
                        <NavLink
                            to={backUrl}
                            onClick={(e) => {
                                if (backUrl == 'none') {
                                    e.preventDefault();
                                    navigate(-1);
                                }
                            }}
                            className="flex items-center justify-center gap-2 text-[14px] bg-white/10 rounded-xl p-2!"
                        >
                            <img src={`/assets/images/icons/back.svg`} alt="иконка" width={18} height={18} />
                            Назад
                        </NavLink>
                    )}
                    {isRenderAuthButton && !user && (
                        <button
                            onClick={() => navigate('/auth', { replace: true })}
                            className="px-5! py-1.5! bg-white/95 border border-white/90 rounded-2xl text-slate-900! text-[16px] cursor-pointer
                             transition-all duration-200 hover:bg-white hover:border-white hover:-translate-y-px"
                        >
                            Вход
                        </button>
                    )}
                    <div className="flex items-center justify-center gap-4">
                        {isRenderSettingsButton && (
                            <NavLink
                                to="/settings"
                                className="cursor-pointer text-[16px] hover:text-gray-300! transition-colors flex justify-center items-center"
                            >
                                Настройки
                            </NavLink>
                        )}

                        {isRenderLogoutButton && user && (
                            <button
                                onClick={handleLogout}
                                className="cursor-pointer transition-all flex justify-center items-center hover:scale-104 hover:opacity-97"
                                title="Выйти из аккаунта"
                            >
                                <img src={`/assets/images/icons/logout.svg`} alt="иконка" width={22} height={22} />
                            </button>
                        )}

                        <button
                            onClick={WindowMinimise}
                            className="cursor-pointer hover:text-gray-400! transition-colors flex justify-center items-center"
                            title="Свернуть окно"
                        >
                            -
                        </button>
                        <button
                            onClick={Quit}
                            className="cursor-pointer hover:text-red-500! transition-colors flex justify-center items-center"
                            title="Выйти"
                        >
                            x
                        </button>
                    </div>
                </div>
                <div className="w-full h-full">
                    <Outlet
                        context={{
                            isRenderSettingsButton: setIsRenderSettingsButton,
                            isRenderBackButton: setIsRenderBackButton,
                            isRenderLogoutButton: setIsRenderLogoutButton,
                            isRenderAuthButton: setIsRenderAuthButton,
                            backUrl: setBackUrl,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
