import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { SseContextType } from '../js/Interfaces';

const SseContext = createContext<SseContextType | undefined>(undefined);

export const SseProvider = ({ children }: { children: ReactNode }) => {
    const [eventSource, setEventSource] = useState<EventSource | null>(null);
    const [emitterKey, setEmitterKey] = useState<number | null>(null);

    const setSseConnection = (key: number, es: EventSource) => {
        setEmitterKey(key);
        setEventSource(es);
    };

    const closeSse = () => {
        if (eventSource) {
            eventSource.close();
            setEventSource(null);
            setEmitterKey(null);
        }
    };

    useEffect(() => {
        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [eventSource]);

    return (
        <SseContext.Provider value={{ eventSource, emitterKey, setSseConnection, closeSse }}>
            {children}
        </SseContext.Provider>
    );
};

export const useSse = () => {
    const context = useContext(SseContext);
    if (context === undefined) {
        throw new Error('useSse must be used within an SseProvider');
    }
    return context;
};
