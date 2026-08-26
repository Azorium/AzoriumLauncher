import React, { useCallback, useEffect } from 'react';
import { EventsEmit, EventsOff, EventsOn } from '../../../wailsjs/runtime';
import { FiCopy, FiXCircle } from 'react-icons/fi';
import { useOutletContext } from 'react-router';
import { HeaderContextType } from '../../js/Interfaces';
import processingContext from '../../js/utils/processingContext';

export default function DebugPage() {
    const headerContext = useOutletContext<HeaderContextType>();

    useEffect(() => {
        processingContext(headerContext, 'debug');
    });

    useEffect(() => {
        const setTextCallback = (text: string) => {
            const el = document.getElementById('debug-output') as HTMLElement;
            el.textContent += text + '\n';
            el.scrollTop = el.scrollHeight;
        };

        EventsOn('setText', setTextCallback);

        return () => {
            EventsOff('setText');
        };
    }, []);

    const handleCopy = useCallback(async () => {
        const el = document.getElementById('debug-output') as HTMLElement;
        const text = el.textContent || '';

        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
    }, []);

    const handleStop = useCallback(() => {
        EventsEmit('killProcess');
    }, []);

    return (
        <div className="relative w-full h-full flex flex-col py-10!  mb-20!">
            <div className="flex items-start justify-start mb-6! gap-2">
                <h1 className="text-2xl font-bold text-white tracking-[-0.5px] m-0!">Журнал отладки</h1>
                <div className="flex items-center justify-center">
                    <button
                        type="button"
                        onClick={handleStop}
                        title="Завершить процесс"
                        className="p-2! text-white border-0 rounded-xl cursor-pointer transition-all duration-300 "
                    >
                        <FiXCircle size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={handleCopy}
                        title="Копировать в буфер"
                        className="p-2! text-white border-0 rounded-xl cursor-pointer transition-all duration-300"
                    >
                        <FiCopy size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 min-h-0 max-h-[450px] bg-[rgba(20,20,30,0.45)] backdrop-blur-[12px] rounded-3xl border border-white/10 p-6! overflow-hidden">
                <div
                    id="debug-output"
                    className="w-full h-full overflow-y-auto rounded-xl bg-black/40 p-5! font-extralight! text-sm leading-[1.8] text-white/80 whitespace-pre-wrap select-text!"
                />
            </div>
        </div>
    );
}
