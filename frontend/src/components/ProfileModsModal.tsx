import React, { useEffect, useState } from 'react';
import { OptionalMod, Profile } from '../js/Interfaces';
import { SaveSettings } from '../../wailsjs/go/main/App';
import { service } from '../../wailsjs/go/models';
import SettingsObj = service.SettingsObj;

export default function ProfileModsModal({
    setShowMods,
    profile,
}: {
    setShowMods: React.Dispatch<React.SetStateAction<boolean>>;
    profile: Profile;
}) {
    const [mods, setMods] = useState<OptionalMod[]>(profile.optionalMods);
    const close = () => setShowMods(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const changeMod = (fileName: string, checked: boolean) => {
        const updatedMods = profile.optionalMods.map((mod) =>
            mod.fileName === fileName ? { ...mod, value: checked } : mod,
        );

        profile.optionalMods = updatedMods;
        setMods([...updatedMods]);
        window.settings.profiles[`${profile.backend.folderName}`].optionalMods = updatedMods;

        SaveSettings(window.settings as unknown as SettingsObj).then();
    };

    return (
        <div
            className="w-screen! h-screen! absolute inset-0 z-50 flex items-center justify-center  backdrop-blur-sm p-4! rounded-xl"
            onClick={close}
        >
            <div
                className="w-full max-w-[600px] bg-[rgba(20,20,30,0.9)] backdrop-blur rounded-3xl border border-white/10 p-8! shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6!">
                    <h2 className="text-xl font-bold text-white m-0">Опциональные моды</h2>
                    <button
                        type="button"
                        onClick={() => setShowMods(false)}
                        className="text-white/50 hover:text-white text-2xl leading-none p-2! cursor-pointer bg-transparent border-0"
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto pr-2!">
                    {mods.length > 0 ? (
                        mods.map((mod, idx) => (
                            <div
                                key={mod.fileName}
                                className="flex items-center justify-between px-5! py-4! rounded-2xl bg-white/[0.03] transition-colors duration-150 hover:bg-white/[0.06]"
                            >
                                <div className="flex flex-col gap-1.5 flex-1 min-w-0 mr-5!">
                                    <span className="text-[15px] font-semibold leading-[1.3] text-white">
                                        {mod.name}
                                    </span>
                                    <span className="text-xs leading-[1.4] text-white/50!">{mod.description}</span>
                                </div>

                                <label className="relative inline-block w-[54px] h-[30px] shrink-0">
                                    <input
                                        type="checkbox"
                                        className="peer opacity-0 w-0 h-0"
                                        checked={mod.value}
                                        onChange={(e) => changeMod(mod.fileName, e.target.checked)}
                                    />
                                    <span
                                        className="absolute cursor-pointer inset-0 bg-white/20 transition-all duration-200 rounded-[34px]
                                                before:absolute before:content-[''] before:h-6 before:w-6 before:left-[3px] before:bottom-[3px] before:bg-white before:transition-all before:duration-200 before:rounded-full
                                                peer-checked:bg-gradient-to-br peer-checked:from-[#6fbf7d] peer-checked:to-[#5ba57c] peer-checked:before:translate-x-6"
                                    ></span>
                                </label>
                            </div>
                        ))
                    ) : (
                        <div className="text-white/40 text-sm">Нет опциональных модов</div>
                    )}
                </div>

                <div className="flex justify-end mt-6!">
                    <button
                        type="button"
                        onClick={() => setShowMods(false)}
                        className="bg-gradient-to-br from-[#6fbf7d] to-[#5ba57c] text-white border-0 rounded-xl px-6! py-2.5! text-base font-semibold cursor-pointer transition-[filter] duration-200 hover:brightness-105"
                    >
                        Готово
                    </button>
                </div>
            </div>
        </div>
    );
}
