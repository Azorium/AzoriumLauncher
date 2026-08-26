import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router';
import { HeaderContextType, NotificationItem, Settings } from '../../js/Interfaces';
import { OpenLauncherRootFolder, SaveSettings } from '../../../wailsjs/go/main/App';
import { service } from '../../../wailsjs/go/models';
import { insertNotification } from '../../components/Notification';
import processingContext from '../../js/utils/processingContext';
import SettingsObj = service.SettingsObj;

export default function SettingsPage() {
    const headerContext = useOutletContext<HeaderContextType>();
    const [settings, setSettings] = useState<Settings>(window.settings);
    const [memory, setMemory] = useState<number>(window.settings.dedicatedRamGB);
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        processingContext(headerContext, 'settings');
    }, []);

    useEffect(() => {
        if (memory != window.settings.dedicatedRamGB) {
            window.settings.dedicatedRamGB = memory;
            SaveSettings(window.settings as unknown as SettingsObj).then();
        }
    }, [memory]);

    const changeSettings = (target: React.ChangeEvent<HTMLInputElement>['target'], type: string) => {
        if (settings) {
            let changedSettings = { ...settings };
            changedSettings['base'][type]['value'] = target.checked;
            SaveSettings(changedSettings as unknown as SettingsObj).then();
            setSettings(changedSettings);
            window.settings = changedSettings;
        }
    };

    const renderToggleList = () => {
        if (!settings) return null;
        return Object.entries(settings['base']).map(([key, value], idx) => (
            <div
                key={value.index}
                className="flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.03] transition-colors duration-150 hover:bg-white/[0.06] animate-[fadeInRow_0.3s_ease_forwards] opacity-0 p-4!"
                style={{ animationDelay: `${idx * 0.05}s` }}
            >
                <div className="flex flex-col gap-1.5 flex-1 min-w-0 mr-5">
                    <span className="text-[17px] font-semibold leading-[1.3] text-white">{value.name}</span>
                    <span className="text-sm leading-[1.4] text-white/50! overflow-hidden [-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]">
                        {value.description}
                    </span>
                </div>
                <label className="relative inline-block w-[54px] h-[30px] shrink-0">
                    <input
                        type="checkbox"
                        className="peer opacity-0 w-0 h-0"
                        checked={value.value}
                        onChange={(e) => changeSettings(e.target, key)}
                    />
                    <span
                        className="absolute cursor-pointer inset-0 bg-white/20 transition-all duration-200 rounded-[34px]
                         before:absolute before:content-[''] before:h-6 before:w-6 before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-200 before:rounded-full
                         peer-checked:bg-gradient-to-br peer-checked:from-[#6fbf7d] peer-checked:to-[#5ba57c] peer-checked:before:translate-x-6"
                    ></span>
                </label>
            </div>
        ));
    };

    return (
        <>
            <style>{`
  @keyframes fadeInRow {
    to { opacity: 1; }
  }
`}</style>

            <div className="flex gap-8 items-center justify-center w-full h-full pb-20!">
                <section className="flex-[1.2] flex gap-4 flex-col bg-[rgba(20,20,30,0.55)] backdrop-blur-[12px] rounded-3xl border border-white/10 p-10! py-16!">
                    <h2 className="text-base font-semibold uppercase tracking-[0.5px] text-white/50 mb-5">
                        Основные параметры
                    </h2>
                    <div className="flex flex-col gap-3">{renderToggleList()}</div>
                </section>

                <aside className="flex-[0.8] flex flex-col gap-5">
                    <div className="flex flex-col gap-4">
                        <div className="p-6! bg-[rgba(20,20,30,0.55)] backdrop-blur-[12px] rounded-[22px] px-6 py-5 flex items-center justify-between transition-colors duration-150 hover:bg-[rgba(20,20,30,0.6)] border border-white/10">
                            <div className="min-w-0 mr-5">
                                <h3 className="text-[17px] font-semibold text-white mb-1.5">Место хранения файлов</h3>
                                <p className="text-sm text-white/50! leading-[1.4]">Папка с файлами игры и лаунчера</p>
                            </div>
                            <button
                                className="p-2! bg-gradient-to-br from-[#6fbf7d] to-[#5ba57c] border-none rounded-[14px] py-2.5 px-[26px] text-base font-semibold text-white cursor-pointer transition-[filter] duration-200 hover:brightness-105"
                                onClick={OpenLauncherRootFolder}
                            >
                                Открыть
                            </button>
                        </div>
                    </div>

                    <div className="p-6! bg-[rgba(20,20,30,0.45)] backdrop-blur-[12px] rounded-[22px] px-6 py-5 flex flex-col gap-3.5 border border-white/10">
                        <div className="min-w-0">
                            <h3 className="text-[17px] font-semibold text-white mb-1.5">Выделенная память</h3>
                            <p className="text-sm text-white/50! leading-[1.4]">Объём ОЗУ для игры (ГБ)</p>
                        </div>
                        <div className="text-2xl font-semibold text-white text-left mt-1">{memory} ГБ</div>
                        <div className="flex flex-col gap-2 w-full">
                            <input
                                type="range"
                                min="1"
                                max="12"
                                step="1"
                                value={memory}
                                onChange={(e) => setMemory(Number(e.target.value))}
                                className="w-full h-2 appearance-none bg-white/20 rounded outline-none cursor-pointer
                     [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-150 [&::-webkit-slider-thumb]:hover:scale-115
                     [&::-moz-range-thumb]:w-6 [&::-moz-range-thumb]:h-6 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-none"
                            />
                            <div className="flex justify-between text-sm text-white/50! px-0.5">
                                <span>1 ГБ</span>
                                <span>12 ГБ</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            {insertNotification(notifications, setNotifications)}
        </>
    );
}
