import { service } from '../../wailsjs/go/models';
import React from 'react';
import SettingsObj = service.SettingsObj;
import Mod = service.Mod;

export {};

export type InitialInfo = {
    startPage: string;
    projectName: string;
    launchServerApiUrl: string;
    userResourcesApiUrl: string;
};

export interface User {
    username: string;
    uuid: string;
    lastLoginDate: string;
    coins: string;
    registrationDate: string;
    jwt_token: string;
    skinHash: string;
    capeHash: string;
    role: string;
}

export type Profiles = Profile[];

export interface Profile {
    currentOnline: number;
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
    profileImages: string[];
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
    startCardPage: string;
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

export type HeaderContextType = {
    isRenderSettingsButton: React.Dispatch<React.SetStateAction<boolean>>;
    isRenderBackButton: React.Dispatch<React.SetStateAction<boolean>>;
    isRenderLogoutButton: React.Dispatch<React.SetStateAction<boolean>>;
    isRenderAuthButton: React.Dispatch<React.SetStateAction<boolean>>;
    backUrl: React.Dispatch<React.SetStateAction<string>>;
};

export type EventMessageType = {
    progress: number;
    stage: string;
    log: string;
};

export interface SseContextType {
    eventSource: EventSource | null;
    emitterKey: number | null;
    setSseConnection: (emitterKey: number, eventSource: EventSource) => void;
    closeSse: () => void;
}
