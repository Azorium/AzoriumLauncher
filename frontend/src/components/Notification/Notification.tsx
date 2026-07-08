import React, { useEffect, useRef, useState } from 'react';
import './Notification.css';
import { NotificationItem, NotificationProps } from '../../js/Interfaces';

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
        <div className={`notification ${isVisible ? 'show' : 'hide'}`}>
            <div
                className="notification-content"
                style={{
                    background:
                        type === 'success'
                            ? 'linear-gradient(135deg, rgb(111 191 125), rgb(91 165 124)) 50% center no-repeat'
                            : 'linear-gradient(145deg, #e14258, #ed655a)',
                }}
            >
                <div className="notification-header">
                    <span className="notification-icon">{icon}</span>
                    <span className="notification-title">{type === 'success' ? 'Успешно' : 'Ошибка'}</span>
                    <button className="notification-close" onClick={handleClose}>
                        ×
                    </button>
                </div>
                <div className="notification-body">{message}</div>
                <div className="notification-progress">
                    <div
                        ref={progressRef}
                        className="notification-progress-bar"
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
