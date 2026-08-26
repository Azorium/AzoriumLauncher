import { Profiles, Settings, User } from './Interfaces';

declare global {
    interface Window {
        user: User | null;
        profiles: Profiles;
        settings: Settings;
        rootPath: string;
        __preloadedSkin: string;
        setCurrentStage: (stage: string) => void;
    }
}
