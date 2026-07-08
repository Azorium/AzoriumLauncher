import React from 'react';
import { Route, Routes } from 'react-router';

import AuthPage from './AuthPage/AuthPage';
import ServersPage from './Servers/ServersPage';
import SettingsPage from './Settings/SettingsPage';
import ServerSettings from './Servers/Settings/ServerSettings';
import ServerUnavailable from './ServerUnavailable/ServerUnavailable';
import { ClientStartPage } from './ClientStartPage/ClientStartPage';
import ProfilePage from './ProfilePage/ProfilePage';
import { DebugPage } from './DebugPage/DebugPage';

export const Routers = () => {
    return (
        <>
            <div>
                <Routes>
                    <Route path="/" element={<ServersPage />} />
                    <Route path="auth" element={<AuthPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="server_settings/:clientFolderName" element={<ServerSettings />} />
                    <Route path="server_unavailable" element={<ServerUnavailable />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="client_start/:clientFolderName/:clientName" element={<ClientStartPage />} />
                    <Route path="debug/:clientName" element={<DebugPage />} />
                </Routes>
            </div>
        </>
    );
};
