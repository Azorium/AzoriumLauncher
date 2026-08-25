import React, { useEffect, useState } from 'react';
import { NavLink, useOutletContext } from 'react-router';
import { insertNotification } from '../../components/Notification';
import { HeaderContextType, NotificationItem } from '../../js/Interfaces';
import processingContext from '../../js/utils/processingContext';

export default function ServersPage() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [isCheckedOnline, setIsCheckedOnline] = useState(false);
    const headerContext = useOutletContext<HeaderContextType>();
    const profiles = window.profiles;
    const user = window.user;

    useEffect(() => {
        processingContext(headerContext, 'servers');
    });

    useEffect(() => {
        async function fetchAllProfiles() {
            const promises = profiles.map(async (profile) => {
                if (profile.currentOnline == undefined) {
                    const host = profile.backend.ip;
                    const port = parseInt(profile.backend.port, 10);
                    const url = `https://api.mcstatus.io/v2/status/java/${host}:${port}`;

                    try {
                        const res = await fetch(url);
                        if (!res.ok) {
                            profile.currentOnline = 0;
                            throw new Error(`HTTP ${res.status}`);
                        }
                        const data = await res.json();

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
            <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] justify-items-center gap-x-[35px] gap-y-5 pt-14!">
                {profiles
                    .sort((a, b) => a.id - b.id)
                    .map((profile, index) => (
                        <NavLink
                            to={`/profile?id=${profile.id}`}
                            key={profile.id}
                            className="group relative w-full h-[207px] rounded-2xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:scale-103 animate-[fadeInUpServers_0.5s_ease-out_both]"
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <div
                                className="group absolute inset-0 bg-cover bg-center transition-transform duration-500 ease-in-out group-hover:scale-103]"
                                style={{ backgroundImage: `url(${profile.frontend.image})` }}
                            />
                            <div className="w-full h-full cursor-pointer p-4! absolute  flex flex-col justify-center items-start p-5 px-4 bg-gradient-to-b from-black/20 via-black/60 to-black/90 transition-colors duration-300 ">
                                <div className="gap-1.5 ml-3! w-full h-full flex flex-col justify-center items-start ">
                                    <h3 className="text-2xl font-bold text-white m-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] tracking-[-0.3px]">
                                        {profile.frontend.name}
                                    </h3>
                                    <span className="text-[13px]! flex gap-1 justify-center items-center font-semibold px-2.5! py-1.5! rounded-xl bg-green-300/60 backdrop-blur-[4px] border border-white/15 text-white whitespace-nowrap">
                                        {isCheckedOnline ? (
                                            <>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-300"></div>
                                                <p className="text-green-300!">{profile.currentOnline}</p>
                                                <p>в сети</p>
                                            </>
                                        ) : (
                                            'Na/Na'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
            </div>

            {insertNotification(notifications, setNotifications)}
        </>
    );
}
