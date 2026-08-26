import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router';
import { StartClientProcesses } from '../../../wailsjs/go/main/App';
import { service } from '../../../wailsjs/go/models';
import { EventsOff, EventsOn } from '../../../wailsjs/runtime';
import { HeaderContextType } from '../../js/Interfaces';
import processingContext from '../../js/utils/processingContext';
import Profile = service.Profile;

export default function ClientstartPage() {
    const [searchParams] = useSearchParams();
    const headerContext = useOutletContext<HeaderContextType>();
    const clientName = searchParams.get('clientName');
    const clientFolderName = searchParams.get('clientFolderName');
    const navigate = useNavigate();

    const [showProgress, setShowProgress] = useState(false);
    const [currentStage, setCurrentStage] = useState('Инициализация');
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        processingContext(headerContext, 'process_pages');
    });

    useEffect(() => {
        window.setCurrentStage = (stage: string) => {
            setCurrentStage(stage);
        };

        const showProgressCallback = (optionalData: number) => {
            setProgress(optionalData);
        };

        const setCurrentStageCallback = (optionalData: { showProgress: boolean; stage: string }) => {
            setShowProgress(optionalData.showProgress);
            setCurrentStage(optionalData.stage);
        };

        const navToDebugPageCallback = () => {
            navigate(`/debug`, { replace: true });
        };

        const setOffEvents = () => {
            setShowProgress(false);
            EventsOff('setProgress');
            EventsOff('setCurrentStage');
            EventsOff('offDownloadBytesEvents');
        };

        EventsOn('setProgress', showProgressCallback);
        EventsOn('setCurrentStage', setCurrentStageCallback);
        EventsOn('navToDebugPage', navToDebugPageCallback);
        EventsOn('offDownloadBytesEvents', setOffEvents);

        const [profile] = window.profiles
            .filter((profile) => profile.backend.folderName.includes(clientFolderName as string))
            .values();

        StartClientProcesses(profile as unknown as Profile).then();
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col  pt-10! pb-35! select-none">
            <div className="flex items-center justify-between mb-8!">
                <div>
                    <p className="text-lg font-semibold uppercase tracking-[0.5px] text-white/50 mb-1!">
                        Запуск клиента
                    </p>
                    <h1 className="text-4xl font-bold text-white tracking-[-0.5px] m-0!">{clientName}</h1>
                </div>

                <div className="text-2xl font-semibold flex items-center justify-center flex-col">
                    <div className="flex items-center gap-2.5 text-white/60 text-lg bg-white/[0.03] border border-white/10 rounded-full px-4! py-2!">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-300"></span>
                        </span>
                        {currentStage}
                    </div>
                </div>
            </div>
            <div className="w-full max-w-[1000px] mx-auto! -my-40! mt-95!">
                {showProgress ? (
                    <div
                        className="progress-container"
                        ref={intervalRef}
                        role="progressbar"
                        aria-valuenow={Math.round(progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div className="flex items-center gap-4">
                            <div className="progress-bar flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="progress-fill h-full rounded-full bg-green-300 transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <div className="progress-percent text-sm font-semibold text-white/80 w-14 text-right tabular-nums">
                                {Math.round(progress)}%
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center text-white/50 text-lg font-medium h-6">
                        Ожидайте . . .
                    </div>
                )}
            </div>
        </div>
    );
}
