import React from 'react';
import OutrouterLayout from '../Layout';

const ServerUnavailable = () => {
    return (
        <OutrouterLayout
            children={
                <>
                    <style>{`
                        @keyframes serverUnavailableFadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(12px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }
                    `}</style>

                    <div className="relative w-full h-full flex flex-col items-center justify-center px-8! py-10! font-semibold">
                        <div className="mb-7! flex items-center justify-center rounded-full bg-white/[0.06] backdrop-blur-[12px] border border-white/10 p-4! shadow-[0_0_25px_rgba(94,186,239,0.15)] animate-[serverUnavailableFadeIn_0.5s_ease-out_both]">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#0984e3] to-[#5ebaef] text-white shadow-[0_8px_20px_rgba(9,132,227,0.25)]">
                                <svg
                                    width="28"
                                    height="28"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                    <line x1="12" y1="9" x2="12" y2="13" />
                                    <line x1="12" y1="17" x2="12.01" y2="17" />
                                </svg>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-white tracking-[-0.5px] mb-3! text-center animate-[serverUnavailableFadeIn_0.5s_ease-out_both]">
                            Сервер временно недоступен
                        </h1>

                        <p className="max-w-[540px] text-center text-lg leading-[1.7] text-white/80! mb-8! animate-[serverUnavailableFadeIn_0.5s_ease-out_both]">
                            Возможно, проводятся технические работы или сервер перегружен. Пожалуйста, попробуйте позже.
                        </p>

                        <div className="flex items-center justify-center gap-3 max-w-[560px] bg-[rgba(20,20,30,0.45)] backdrop-blur-[12px] rounded-2xl border border-white/10 px-6! py-4! animate-[serverUnavailableFadeIn_0.6s_ease-out_both]">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-[#5ebaef] shrink-0"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="16" x2="12" y2="12" />
                                <line x1="12" y1="8" x2="12.01" y2="8" />
                            </svg>
                            <p className="text-sm leading-[1.5] text-white/50!">
                                Если проблема сохраняется, обратитесь в Discord сервер проекта или в другие соцсети
                            </p>
                        </div>
                    </div>
                </>
            }
        />
    );
};

export default ServerUnavailable;
