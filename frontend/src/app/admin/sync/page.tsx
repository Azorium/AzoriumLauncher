import { useEffect, useState } from 'react';
import processingContext from '../../../js/utils/processingContext';
import { HeaderContextType, NotificationItem } from '../../../js/Interfaces';
import { useNavigate, useOutletContext } from 'react-router';
import { createPortal } from 'react-dom';
import AdminSyncActionsModal from '../../../components/AdminSyncActionsModal';
import { insertNotification, showNotification } from '../../../components/Notification';

export type ActionType = {
    name: string;
    title: string;
    value: null | string;
    redirect?: ActionType;
};

export default function AdminSyncPage() {
    const profiles = window.profiles.map((profile) => ({
        name: profile.frontend.name,
        folderName: profile.backend.folderName,
        mcVersion: profile.mcVersion,
    }));

    const headerContext = useOutletContext<HeaderContextType>();
    const [selectedMcVersion, setSelectedMcVersion] = useState<string | null>(null);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [showClientModal, setShowClientModal] = useState(false);
    const [showAssetModal, setShowAssetModal] = useState(false);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    const clientOptions = Array.from(new Set(profiles.map((p) => p.folderName)));
    const mcVersionOptions = Array.from(new Set(profiles.map((p) => p.mcVersion)));

    const actions = [
        { name: 'profiles', title: 'Профили', value: null },
        { name: 'client', title: 'Клиент', value: null },
        { name: 'asset', title: 'Ассеты', value: null },
        { name: 'launcher', title: 'Лаунчер', value: null },
        { name: 'all', title: 'Всё', value: null },
    ];

    useEffect(() => {
        processingContext(headerContext, 'admin_pages');
    }, []);

    const openModal = (name: string) => {
        if (name == 'asset') {
            setShowAssetModal(true);
            return;
        }

        setShowClientModal(true);
    };

    const getProcessState = (action: ActionType) => {
        const value = () => {
            if (action.name == 'client') return selectedClient;
            if (action.name == 'asset') return selectedMcVersion;
            return null;
        };

        return {
            name: action.name,
            title: action.title,
            value: value(),
        } as ActionType;
    };

    return (
        <>
            <div className="h-full w-full flex flex-col gap-4 justify-center items-center px-8! py-6!">
                <div className="text-2xl font-semibold">Синхронизация</div>
                <div className="w-full h-full grid grid-cols-3">
                    {actions.map((action) => (
                        <div
                            key={action.name}
                            className="flex flex-col gap-3 items-center justify-center w-60 h-50 bg-[rgba(20,20,30,0.55)] backdrop-blur-[12px] rounded-3xl border border-white/10 p-5!"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <p className="text-lg font-medium">{action.title}</p>
                                {(action.name == 'client' || action.name == 'asset') && (
                                    <img
                                        src={`/assets/images/icons/admin_sync_openmodal.svg`}
                                        alt="иконка"
                                        width={18}
                                        height={18}
                                        className="cursor-pointer hover:scale-106 transition-transform"
                                        onClick={() => openModal(action.name)}
                                    />
                                )}
                            </div>
                            <img
                                src={`/assets/images/icons/admin_sync_${action.name}.svg`}
                                alt="иконка"
                                width={42}
                                height={42}
                            />

                            <button
                                onClick={(e) => {
                                    e.preventDefault();

                                    if (
                                        (action.name == 'client' && selectedClient == null) ||
                                        (action.name == 'asset' && selectedMcVersion == null)
                                    ) {
                                        showNotification(
                                            'error',
                                            `Выберите нужный параметр в меню по кнопке выше.`,
                                            setNotifications,
                                        );
                                        return;
                                    }

                                    navigate('/admin/sync/process', { replace: true, state: getProcessState(action) });
                                }}
                                className="bg-gradient-to-br from-[#0984e3] to-[#5ebaef] border-0 rounded-xl p-2! text-[1.05rem] cursor-pointer transition-all duration-300 mt-2! tracking-[0.5px] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,132,227,0.3)]"
                            >
                                Начать
                            </button>
                        </div>
                    ))}
                </div>
                {showClientModal &&
                    createPortal(
                        <AdminSyncActionsModal
                            options={clientOptions}
                            setSelectedOption={setSelectedClient}
                            setShowModal={setShowClientModal}
                            selectedOption={selectedClient}
                            modalType="client"
                        />,
                        document.body,
                    )}
                {showAssetModal &&
                    createPortal(
                        <AdminSyncActionsModal
                            options={mcVersionOptions}
                            setSelectedOption={setSelectedMcVersion}
                            setShowModal={setShowAssetModal}
                            selectedOption={selectedMcVersion}
                            modalType="asset"
                        />,
                        document.body,
                    )}
            </div>
            {createPortal(insertNotification(notifications, setNotifications), document.body)}
        </>
    );
}
