import { NavLink, Outlet } from 'react-router';
import { Quit, WindowMinimise } from '../../../wailsjs/runtime';
import React, { ReactElement } from 'react';

export default function OutrouterLayout({ children }: { children: ReactElement }) {
    return (
        <div className="relative w-screen h-screen overflow-hidden rounded-xl">
            <div className="absolute inset-0 overflow-hidden rounded-xl">
                <img
                    src="/assets/images/background.jpg"
                    alt="Background"
                    className="absolute w-full h-full object-cover"
                />
            </div>

            <div className="relative z-10 w-full h-full pr-8! pl-8!">
                <div className="h-[40px] flex items-center gap-4 pt-6! text-2xl justify-end">
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={WindowMinimise}
                            className="cursor-pointer hover:text-gray-400! transition-colors flex justify-center items-center"
                            title="Свернуть окно"
                        >
                            -
                        </button>
                        <button
                            onClick={Quit}
                            className="cursor-pointer hover:text-red-500! transition-colors flex justify-center items-center"
                            title="Выйти"
                        >
                            x
                        </button>
                    </div>
                </div>
                <div className="w-full h-full">{children}</div>
            </div>
        </div>
    );
}
