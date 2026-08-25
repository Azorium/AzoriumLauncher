import React, { useEffect, useRef, useState } from 'react';
import { NotificationItem, NotificationProps } from '../js/Interfaces';

const Notification: React.FC<NotificationProps> = ({ type = 'success', message, duration = 5000, onClose }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);
    const [progressWidth, setProgressWidth] = useState<number>(100);
    const progressRef = useRef<HTMLDivElement>(null);
    const startTimeRef = useRef<number>(Date.now());
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const startTime = Date.now();

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
            setProgressWidth(remaining);

            if (remaining > 0) {
                rafRef.current = requestAnimationFrame(updateProgress);
            }
        };

        rafRef.current = requestAnimationFrame(updateProgress);

        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(timer);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [duration]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onClose) onClose();
        }, 300);
    };

    const icon = type === 'success' ? '✓' : '✗';

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-5 right-5 z-[1000] transform transition-transform duration-300 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] max-w-[350px] min-w-[300px] rounded-lg overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.15)] ${
                isVisible ? 'translate-x-0' : 'translate-x-[120%]'
            }`}
        >
            <div
                className="relative text-white p-4!"
                style={{
                    background:
                        type === 'success'
                            ? 'linear-gradient(135deg, rgb(111 191 125), rgb(91 165 124)) 50% center no-repeat'
                            : 'linear-gradient(145deg, #e14258, #ed655a)',
                }}
            >
                <div className="flex items-center mb-2! font-semibold">
                    <span className="text-xl mr-2.5! font-bold">{icon}</span>
                    <span className="flex-grow text-base">{type === 'success' ? 'Успешно' : 'Ошибка'}</span>
                    <button
                        className="bg-transparent border-none text-white text-2xl cursor-pointer opacity-80 p-0! w-6 h-6 flex items-center justify-center leading-none transition-opacity duration-200 hover:opacity-100"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>
                <div className="text-sm leading-[1.4] mb-3! opacity-90">{message}</div>
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-white/30 overflow-hidden">
                    <div
                        ref={progressRef}
                        className="h-full bg-white"
                        style={{
                            width: `${progressWidth}%`,
                            transition: 'width 50ms linear',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

type SetNotifications = React.Dispatch<React.SetStateAction<NotificationItem[]>>;

export const showNotification = (
    type: 'success' | 'error',
    message: string,
    setNotifications: SetNotifications,
): void => {
    const id = Date.now();
    const newNotification: NotificationItem = {
        id,
        type,
        message,
    };
    setNotifications((prev) => [...prev, newNotification]);
};

export const removeNotification = (id: number, setNotifications: SetNotifications): void => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
};

export const insertNotification = (
    notifications: NotificationItem[],
    setNotifications: SetNotifications,
): JSX.Element[] => {
    return notifications.map((notification) => (
        <Notification
            key={notification.id}
            type={notification.type}
            message={notification.message}
            onClose={() => removeNotification(notification.id, setNotifications)}
        />
    ));
};
