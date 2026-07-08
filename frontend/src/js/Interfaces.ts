import { service } from '../../wailsjs/go/models';
import SettingsObj = service.SettingsObj;
import Mod = service.Mod;

export {};

export interface User {
    username: string;
    uuid: string;
    groupName: string;
    lastLoginDate: string;
    coins: string;
    registrationDate: string;
    jwt_token: string;
    skinHash: string;
    capeHash: string;
}

export type Profiles = Profile[];

export interface Profile {
    currentOnline: number;
    maxOnline: number;
    frontend: Frontend;
    backend: Backend;
    id: number;
    mcVersion: string;
    optionalMods: OptionalMod[];
}

export interface OptionalMod {
    name: string;
    description: string;
    fileName: string;
    value: boolean;
}

interface Backend {
    ip: string;
    port: string;
    folderName: string;
}

interface Frontend {
    description: string;
    image: string;
    name: string;
}

export interface NotificationProps {
    type?: 'success' | 'error';
    message: string;
    duration?: number;
    onClose?: () => void;
}

export interface NotificationItem {
    id: number;
    type: 'success' | 'error';
    message: string;
}

export interface Settings {
    dedicatedRamGB: number;
    base: {
        [key: string]: SettingItem;
    };
    profiles: SettingsObj['profiles'];
}

export interface ProfileSettings {
    optionalMods: Mod[];
}

interface SettingItem {
    index: number;
    name: string;
    description: string;
    value: boolean;
}
