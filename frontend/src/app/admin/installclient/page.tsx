import { useNavigate, useOutletContext } from 'react-router';
import { HeaderContextType, NotificationItem } from '../../../js/Interfaces';
import { useEffect, useRef, useState } from 'react';
import processingContext from '../../../js/utils/processingContext';
import { launchServerApiUrl } from '../../../js/Consts';
import { insertNotification, showNotification } from '../../../components/Notification';
import { sseCompleteEvent, sseConnect } from '../../../js/utils/sse';
import { useSse } from '../../../components/SseProvider';
import DropdownArrow from '../../../components/DropdownArrow';
import { createPortal } from 'react-dom';

export default function AdminInstallclientPage() {
    const headerContext = useOutletContext<HeaderContextType>();
    const loaders = ['fabric', 'forge', 'neoforge'];
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const navigate = useNavigate();

    const [folderName, setFolderName] = useState('');
    const [gameVersion, setGameVersion] = useState('');
    const [loader, setLoader] = useState('fabric');
    const [loaderVersion, setLoaderVersion] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { setSseConnection } = useSse();

    useEffect(() => {
        processingContext(headerContext, 'admin_pages');
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getLoaderDisplayName = (name: string) => {
        if (name == 'neoforge') {
            return name.charAt(0).toUpperCase() + name.slice(1, 3) + name.charAt(3).toUpperCase() + name.slice(4);
        } else {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
    };

    const handleInstall = () => {
        if (gameVersion.length == 0 || folderName.length == 0 || loaderVersion.length == 0) {
            showNotification('error', `Все поля должны быть заполнены.`, setNotifications);
            return;
        }

        sseConnect().then(({ emitterKey, eventSource }) => {
            sseCompleteEvent(eventSource, null);

            const formData = {
                gameVersion: gameVersion,
                folderName: folderName,
                loaderType: loader,
                loaderVersion: loaderVersion,
                emitterKey: emitterKey,
            };

            const installclient = async () => {
                const req = await fetch(`${launchServerApiUrl}/admin/installclient`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.user?.jwt_token}`,
                    },
                    body: JSON.stringify(formData),
                });

                if (req.status == 400) {
                    const message = await req.text();
                    showNotification('error', message, setNotifications);
                }

                setSseConnection(emitterKey, eventSource);

                if (req.ok) {
                    navigate('/admin/installclient/process', {
                        state: {
                            clientName: folderName,
                            mcVersion: gameVersion,
                        },
                    });
                }
            };

            installclient().then();
        });
    };

    return (
        <>
            <div className="w-full h-full flex flex-col px-8! py-6!">
                <div className="mb-5!">
                    <h1 className="text-2xl font-bold text-white tracking-[-0.3px]">Установка клиента</h1>
                    <p className="text-sm text-white/50 mt-0.5!">Заполните параметры для установки нового клиента</p>
                </div>

                <div className="grid grid-cols-2 gap-x-5! gap-y-4! flex-1">
                    <div className="flex flex-col gap-1.5!">
                        <label htmlFor="folderName" className="text-sm font-medium text-white/70">
                            Название папки клиента
                        </label>
                        <input
                            id="folderName"
                            type="text"
                            value={folderName}
                            onChange={(e) => setFolderName(e.target.value)}
                            placeholder="Введите название папки"
                            className="px-[16px]! py-[12px]! border border-white/15 rounded-xl text-[15px] text-white bg-white/10 placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(94,186,239,0.15)]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5!">
                        <label htmlFor="gameVersion" className="text-sm font-medium text-white/70">
                            Версия игры
                        </label>
                        <input
                            id="gameVersion"
                            type="text"
                            value={gameVersion}
                            onChange={(e) => setGameVersion(e.target.value)}
                            placeholder="Например: 1.20.4"
                            className="px-[16px]! py-[12px]! border border-white/15 rounded-xl text-[15px] text-white bg-white/10 placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(94,186,239,0.15)]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5!">
                        <label className="text-sm font-medium text-white/70">Тип загрузчика</label>
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="cursor-pointer w-full px-[16px]! py-[12px]! border border-white/15 rounded-xl text-[15px] text-white bg-white/10 flex items-center justify-between transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(94,186,239,0.15)]"
                            >
                                <span className="flex items-center gap-2.5!">
                                    <img
                                        src={`/assets/images/loaders/${loader}.png`}
                                        alt={loader}
                                        className="w-5 h-5 object-contain"
                                    />
                                    {getLoaderDisplayName(loader)}
                                </span>
                                <DropdownArrow isDropdownOpen={isDropdownOpen} />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 right-0 mt-1! bg-[rgba(20,20,30,0.95)] backdrop-blur-[12px] border border-white/10 rounded-xl overflow-hidden z-20 shadow-[0_8px_25px_rgba(0,0,0,0.4)]">
                                    {loaders.map((l) => (
                                        <button
                                            key={l}
                                            type="button"
                                            onClick={() => {
                                                setLoader(l);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`cursor-pointer w-full px-[16px]! py-[11px]! text-left text-[15px] text-white hover:bg-white/10 transition-colors duration-150 flex items-center gap-2.5! ${
                                                loader === l ? 'bg-white/10' : ''
                                            }`}
                                        >
                                            <img
                                                src={`/assets/images/loaders/${l}.png`}
                                                alt={l}
                                                className="w-5 h-5 object-contain"
                                            />
                                            {getLoaderDisplayName(l)}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5!">
                        <label htmlFor="loaderVersion" className="text-sm font-medium text-white/70">
                            Версия загрузчика
                        </label>
                        <input
                            id="loaderVersion"
                            type="text"
                            value={loaderVersion}
                            onChange={(e) => setLoaderVersion(e.target.value)}
                            placeholder="Введите версию загрузчика"
                            className="px-[16px]! py-[12px]! border border-white/15 rounded-xl text-[15px] text-white bg-white/10 placeholder:text-white/40 transition-all duration-300 focus:outline-none focus:border-[#5ebaef] focus:shadow-[0_0_0_3px_rgba(94,186,239,0.15)]"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-5! pt-2!">
                    <button
                        type="button"
                        onClick={handleInstall}
                        className="bg-gradient-to-br from-[#0984e3] to-[#5ebaef] text-white border-0 rounded-xl px-10! py-3! text-[15px] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,132,227,0.3)] active:scale-[0.98]"
                    >
                        Установить
                    </button>
                </div>
            </div>

            {createPortal(insertNotification(notifications, setNotifications), document.body)}
        </>
    );
}
