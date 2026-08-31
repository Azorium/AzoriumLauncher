import { NavLink, useLocation, useNavigate, useOutletContext } from 'react-router';
import { ActionType, HeaderContextType } from '../../../../js/Interfaces';
import { useEffect, useState } from 'react';
import processingContext from '../../../../js/utils/processingContext';
import CircleSpinner from '../../../../components/CircleSpinner';
import { useSse } from '../../../../components/SseProvider';
import { sseCompleteEvent, sseConnect } from '../../../../js/utils/sse';
import { launchServerApiUrl } from '../../../../js/Consts';

export default function AdminSyncProcessPage() {
    const headerContext = useOutletContext<HeaderContextType>();
    const [isComplete, setIsComplete] = useState(false);
    const location = useLocation();
    const state: ActionType = location.state;
    const navigate = useNavigate();
    const { setSseConnection } = useSse();

    useEffect(() => {
        processingContext(headerContext, 'process_pages');

        sseConnect().then(({ emitterKey, eventSource }) => {
            const formData = {
                action: state.name,
                value: state.value,
                emitterKey: emitterKey,
            };

            const sync = async () => {
                const req = await fetch(`${launchServerApiUrl}/admin/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${window.user?.jwt_token}`,
                    },
                    body: JSON.stringify(formData),
                });

                setSseConnection(emitterKey, eventSource);

                if (req.ok) {
                    sseCompleteEvent(eventSource, () => {
                        if (state.redirect) {
                            navigate('/admin/sync/process', { replace: true, state: state.redirect as ActionType });
                            return;
                        }

                        setIsComplete(true);
                    });
                }
            };

            sync().then();
        });
    }, [state]);

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 w-180 h-110 bg-[rgba(20,20,30,0.55)] backdrop-blur-[12px] rounded-3xl border border-white/10 p-5! mb-8! py-6! px-6!">
                <div className="flex items-center justify-center flex-col">
                    <p className="text-2xl font-semibold">Синхронизация</p>
                    <p className="text-gray-400/90! text-[14px]">
                        {state.title}: {state.value ? state.value : 'значение не предусмотрено'}
                    </p>
                    {isComplete ? (
                        <div className="flex flex-col items-center gap-3 mt-25!">
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <svg
                                    className="w-16 h-16 text-green-400!"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1" />
                                    <path
                                        d="M7 12.5L10.5 16L17 9"
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                                <NavLink
                                    to={'/'}
                                    state={state.name == 'profiles' ? { isReload: true } : null}
                                    className="bg-gradient-to-br from-[#0984e3] to-[#5ebaef] border-0 rounded-xl p-[15px]! text-[0.9rem] font-semibold cursor-pointer transition-all
                             duration-300 tracking-[0.5px]  hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(9,132,227,0.3)] mt-25!"
                                >
                                    Перейти на главную страницу
                                </NavLink>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mt-25!">
                                <CircleSpinner size={64} strokeWidth={7} color="#ffffff" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
