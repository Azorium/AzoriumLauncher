import { NavLink, useOutletContext, useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import { HeaderContextType, NotificationItem, Profile } from '../../js/Interfaces';
import processingContext from '../../js/utils/processingContext';
import { createPortal } from 'react-dom';
import ProfileModsModal from '../../components/ProfileModsModal';
import ProfileGalleryModal from '../../components/ProfileGalleryModal';
import { insertNotification, showNotification } from '../../components/Notification';

export default function ProfilePage() {
    const [searchParams] = useSearchParams();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const profileId = parseInt(searchParams.get('id') as string);
    const profile = window.profiles.find((p) => p.id === profileId) as Profile;
    profile.optionalMods = window.settings.profiles[`${profile.backend.folderName}`].optionalMods;

    const headerContext = useOutletContext<HeaderContextType>();
    const [showMods, setShowMods] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    useEffect(() => {
        processingContext(headerContext, 'profile');
    }, [headerContext]);

    return (
        <>
            <div className="relative w-full h-full flex flex-col py-10!">
                <div className="flex items-start justify-between mb-6!">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-[-0.5px] m-0">{profile.frontend.name}</h1>
                        <div className="flex items-center gap-4 mt-1.5! text-white/60 text-sm">
                            <span>Версия: {profile.mcVersion}</span>
                            <span className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                                </span>
                                {profile.currentOnline} онлайн
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowGallery(true)}
                        className="text-white/80! hover:text-white! text-sm font-semibold cursor-pointer bg-transparent border-0 p-0! transition-colors outline-none!"
                    >
                        Галерея
                    </button>
                </div>

                <div className="flex h-85 overflow-y-auto pr-2!">
                    <p className="text-base leading-[1.7] text-white/70!">{profile.frontend.description}</p>
                </div>

                <div className="mt-6! flex items-center gap-6">
                    <NavLink
                        to={`/client_start?clientFolderName=${profile.backend.folderName}&clientName=${profile.frontend.name}`}
                        onClick={(e) => {
                            if (!window.user) {
                                e.preventDefault();
                                showNotification(
                                    'error',
                                    `Для начала игры требуется вход в аккаунт.`,
                                    setNotifications,
                                );
                            }
                        }}
                        type="button"
                        className="bg-gradient-to-br from-[#0984e3] to-[#5ebaef] text-white border-0 rounded-xl px-8! py-3! text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 "
                    >
                        Начать играть
                    </NavLink>
                    <button
                        type="button"
                        onClick={() => setShowMods(true)}
                        className="text-white/80! hover:text-white! text-sm font-semibold cursor-pointer bg-transparent border-0 p-0! transition-colors outline-none!"
                    >
                        Настроить опциональные моды
                    </button>
                </div>

                {showMods &&
                    createPortal(<ProfileModsModal setShowMods={setShowMods} profile={profile} />, document.body)}
                {showGallery &&
                    createPortal(
                        <ProfileGalleryModal setShowGallery={setShowGallery} profile={profile} />,
                        document.body,
                    )}
            </div>
            {insertNotification(notifications, setNotifications)}
        </>
    );
}
