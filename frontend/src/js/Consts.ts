import { InitialInfo } from './Interfaces';

export let projectName: string;
export let userResourcesApiUrl: string;
export let launchServerApiUrl: string;

export const setConsts = (info: InitialInfo) => {
    projectName = info.projectName;
    userResourcesApiUrl = info.userResourcesApiUrl;
    launchServerApiUrl = info.launchServerApiUrl;
};
