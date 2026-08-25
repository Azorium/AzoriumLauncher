import React, { useEffect } from 'react';

export default function AdminSyncActionsModal({
    options,
    setSelectedOption,
    setShowModal,
    selectedOption,
    modalType,
}: {
    options: string[];
    setSelectedOption: React.Dispatch<React.SetStateAction<string | null>>;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedOption: string | null;
    modalType: string;
}) {
    const isClientModalType = modalType == 'client';
    const close = () => setShowModal(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center  backdrop-blur-sm p-4! rounded-xl"
            onClick={close}
        >
            <div
                className="w-full max-w-[600px] bg-[rgba(20,20,30,0.9)] backdrop-blur rounded-3xl border border-white/10 p-8! shadow-2xl flex flex-col gap-6 justify-center items-center"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center justify-center">
                    <p className="text-xl font-semibold">
                        Выберите {isClientModalType ? 'нужный клиент' : 'нужную версию'}
                    </p>
                    {isClientModalType && (
                        <p className="text-gray-400/90! text-[13px]">
                            Каждое значение ниже соответствует названию папки клиента
                        </p>
                    )}
                </div>
                <div className="w-full h-full grid grid-cols-4  gap-3">
                    {options.map((option) => (
                        <div
                            key={option}
                            className={`bg-white/10 p-4! flex justify-center items-center rounded-lg cursor-pointer hover:bg-white/20 hover:scale-105 transition-all ${option == selectedOption ? 'border border-blue-400' : 'border-none'}`}
                            onClick={() => setSelectedOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
