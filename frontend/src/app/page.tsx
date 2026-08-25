import { NavLink, useLocation, useNavigate, useOutletContext } from 'react-router';
import { HeaderContextType } from '../js/Interfaces';
import React, { useEffect, useState } from 'react';
import processingContext from '../js/utils/processingContext';
import { SaveSettings } from '../../wailsjs/go/main/App';
import { service } from '../../wailsjs/go/models';
import { SkinViewer } from '../components/SkinViewer';
import SettingsObj = service.SettingsObj;

export default function RootPage() {
    const user = window.user;
    const navigate = useNavigate();
    const headerContext = useOutletContext<HeaderContextType>();
    const [selectedImg, setSelectedImg] = useState(window.settings.startCardPage);
    const images = ['sky.jpg', 'beach.png', 'island.jpg'];
    const [isShow, setIsShow] = useState(false);
    const location = useLocation();
    const state: { isReload: boolean | null } | null = location.state;

    useEffect(() => {
        if (state?.isReload) {
            window.history.replaceState(null, '');
            window.location.reload();
        }

        if (!user) {
            navigate('/servers', { replace: true });
        } else {
            processingContext(headerContext, 'root');
            setIsShow(true);
        }
    }, []);

    useEffect(() => {
        if (selectedImg != window.settings.startCardPage) {
            window.settings.startCardPage = selectedImg;
            SaveSettings(window.settings as unknown as SettingsObj).then();
        }
    }, [selectedImg]);

    if (!isShow) return null;

    return (
        <div className="w-full h-full flex justify-center items-center">
            <NavLink
                to="/servers"
                className="group relative w-[390px] h-[407px] rounded-2xl overflow-hidden transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:scale-[1.01]"
            >
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-[1.01]"
                    style={{ backgroundImage: `url(assets/images/start_${selectedImg})` }}
                />

                <div className="gap-10 cursor-pointer p-4! absolute inset-0 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-black/15 via-black/35 to-black/65 transition-colors duration-300">
                    <div className="font-bold text-white m-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] tracking-[-0.3px]">
                        <p className="text-5xl flex items-center justify-center">НАЧАТЬ</p>
                        <p className="text-3xl flex items-center justify-center">ПРИКЛЮЧЕНИЯ!</p>
                    </div>

                    <div className="flex flex-row items-center gap-6 p-8 mt-20!">
                        {images.map((img) => (
                            <button
                                key={img}
                                type="button"
                                role="tab"
                                aria-selected={selectedImg == img}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedImg(img);
                                }}
                                className={`
              w-3 h-3 rounded-full transition-all duration-300 ease-in-out
              cursor-pointer focus:outline-none focus-visible:ring-2
              focus-visible:ring-blue-500 focus-visible:ring-offset-2
              ${
                  selectedImg == img
                      ? ' bg-[#5ebaef] shadow-md shadow-blue-500/50'
                      : ' bg-white hover:bg-gray-400 active:scale-90'
              }
            `}
                            />
                        ))}
                    </div>
                </div>
            </NavLink>
            <div className="pl-26! flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center">
                    {user?.role == 'ADMIN' && (
                        <NavLink to="/admin/installclient" className="hover:scale-104 transition-transform">
                            <img
                                src={`/assets/images/icons/admin.svg`}
                                alt="иконка"
                                title="Админ-панель"
                                width={42}
                                height={42}
                                className="cursor-pointer hover:opacity-95 transition-all "
                            />
                        </NavLink>
                    )}
                    <p className="text-3xl font-bold">{user?.username}</p>
                    <SkinViewer />
                </div>
            </div>
        </div>
    );
}
