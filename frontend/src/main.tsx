import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { checkFetch } from './js/utils/auth';
import { GetInitialInfo } from '../wailsjs/go/main/App';
import { LauncherUpdate } from './components/outrouter/pages/LauncherUpdate';
import ServerUnavailable from './components/outrouter/pages/ServerUnavailable';
import { InitialInfo } from './js/Interfaces';
import { setConsts } from './js/Consts';

const container = document.getElementById('root');
const root = createRoot(container!);
const token = localStorage.getItem('token');

GetInitialInfo().then((info: InitialInfo) => {
    setConsts(info);

    if (info.startPage == 'main') {
        if (token) {
            checkFetch(token).then(() => root.render(<App />));
        } else {
            root.render(<App />);
        }
    } else if (info.startPage == 'update') {
        root.render(<LauncherUpdate />);
    } else {
        root.render(<ServerUnavailable />);
    }
});
