import { LAUNCHER_URL } from '../appConsts';

export const sseConnect = (): Promise<{ emitterKey: number; eventSource: EventSource }> => {
    return new Promise((resolve, reject) => {
        const eventSource = new EventSource(`${LAUNCHER_URL}/sse/connect`);

        eventSource.onmessage = (ev) => {
            resolve({
                emitterKey: ev.data,
                eventSource: eventSource,
            });
        };

        eventSource.onerror = (ev) => {
            eventSource.close();
            reject();
        };
    });
};

export const sseCompleteEvent = (eventSource: EventSource, fn: (() => void) | null) => {
    eventSource.addEventListener('complete', () => {
        eventSource.close();

        if (fn) {
            fn();
        }
    });
};
