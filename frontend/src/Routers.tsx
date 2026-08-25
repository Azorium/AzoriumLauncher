import React from 'react';
import { Route, Routes } from 'react-router';
import ServersPage from './app/servers/page';
import SettingsPage from './app/settings/page';
import ClientstartPage from './app/clientstart/page';
import DebugPage from './app/debug/page';
import AuthPage from './app/auth/page';
import RootPage from './app/page';
import RootLayout from './app/layout';
import ProfilePage from './app/profile/page';
import AdminLayout from './app/admin/layout';
import AdminSyncPage from './app/admin/sync/page';
import AdminInstallclientPage from './app/admin/installclient/page';
import AdminInstallProcessPage from './app/admin/installclient/process/page';
import AdminSyncProcessPage from './app/admin/sync/process/page';

export const Routers = () => {
    return (
        <>
            <div>
                <Routes>
                    <Route element={<RootLayout />}>
                        <Route path="/" element={<RootPage />} />
                        <Route path="admin" element={<AdminLayout />}>
                            <Route path="installclient" element={<AdminInstallclientPage />} />
                            <Route path="sync" element={<AdminSyncPage />} />
                        </Route>
                        <Route path="/admin/installclient/process" element={<AdminInstallProcessPage />} />
                        <Route path="/admin/sync/process" element={<AdminSyncProcessPage />} />
                        <Route path="auth" element={<AuthPage />} />
                        <Route path="client_start" element={<ClientstartPage />} />
                        <Route path="debug" element={<DebugPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="servers" element={<ServersPage />} />
                        <Route path="settings" element={<SettingsPage />} />
                    </Route>
                </Routes>
            </div>
        </>
    );
};
