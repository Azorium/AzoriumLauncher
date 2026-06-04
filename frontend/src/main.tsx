import React from 'react'
import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css';
import {checkFetch} from "./js/utils/auth";
import {GetStartPage} from "../wailsjs/go/main/App";
import {LauncherUpdate} from "./components/LauncherUpdate/LauncherUpdate";
import ServerUnavailable from "./components/ServerUnavailable/ServerUnavailable";
import {LogInfo} from "../wailsjs/runtime";

const container = document.getElementById('root')
const root = createRoot(container!)
const token = localStorage.getItem('token')

GetStartPage().then(startPage => {
    if (startPage == "main") {
        if (token) {
            checkFetch(token).then(() =>
                root.render(
                    <App/>
                )
            )
        } else {
            root.render(
                <App/>
            )
        }
    } else if (startPage == "update") {
        root.render(
            <LauncherUpdate/>
        )
    } else {
        root.render(
            <ServerUnavailable/>
        )
    }
})




