import { useEffect, useState } from 'react';
import { GetProfiles, GetProjectName, GetRootPath, GetSettings, SaveSettings } from '../wailsjs/go/main/App';
import { Profiles, ProfileSettings } from './js/Interfaces';
import { service } from '../wailsjs/go/models';
import { BrowserRouter } from 'react-router';
import { Routers } from './Routers';
import { SseProvider } from './components/SseProvider';
import SettingsObj = service.SettingsObj;

const App = () => {
    const [isProfilesGetted, setIsProfilesGetted] = useState<boolean | null>(null);
    const [isInit, setIsInit] = useState(false);

    useEffect(() => {
        GetSettings().then((obj) => (window.settings = obj));
        GetRootPath().then((path) => {
            window.rootPath = path;
        });
        GetProjectName().then((projectName) => (window.projectName = projectName));

        GetProfiles()
            .then((profiles) => {
                window.profiles = profiles as Profiles;
            })
            .catch(() => setIsInit(true))
            .finally(() => setIsProfilesGetted(true));
    }, []);

    useEffect(() => {
        if (isProfilesGetted) {
            if (isInit) {
                window.profiles = [];
                return;
            }

            if (window.settings.profiles == null) window.settings.profiles = {};

            window.profiles.forEach((profile) => {
                const clientFolderName = profile.backend.folderName;

                if (window.settings.profiles[`${clientFolderName}`] == null) {
                    const newProfile: ProfileSettings = {
                        optionalMods: profile.optionalMods,
                    };

                    window.settings.profiles[`${clientFolderName}`] = newProfile as unknown as service.ProfileSettings;
                } else {
                    let settingsOptionalMods = window.settings.profiles[`${clientFolderName}`].optionalMods;
                    const profileOptionalMods = profile.optionalMods;

                    if (profileOptionalMods.length == 0)
                        return (window.settings.profiles[`${clientFolderName}`].optionalMods = []);

                    let settingsMods: string[] = [];
                    let profileMods: string[] = [];

                    profileOptionalMods.forEach((profileMod) => {
                        profileMods = [...profileMods, profileMod.name];
                    });

                    settingsOptionalMods.forEach((settingsMod) => {
                        settingsMods = [...settingsMods, settingsMod.name];

                        profileOptionalMods.forEach((profileMod) => {
                            if (settingsMod.name == profileMod.name) {
                                settingsMod.name = profileMod.name;
                                settingsMod.description = profileMod.description;
                                settingsMod.fileName = profileMod.fileName;
                            }
                        });
                    });

                    settingsMods.forEach((modName) => {
                        if (!profileMods.includes(modName)) {
                            window.settings.profiles[`${clientFolderName}`].optionalMods = settingsOptionalMods.filter(
                                (mod) => mod.name != modName,
                            );
                        }
                    });

                    profileMods.forEach((modName) => {
                        if (!settingsMods.includes(modName)) {
                            profileOptionalMods
                                .filter((mod) => modName == mod.name)
                                .forEach((mod) => {
                                    settingsOptionalMods.push(mod);
                                });
                        }
                    });
                }
            });

            SaveSettings(window.settings as unknown as SettingsObj).then();
        }
    }, [isProfilesGetted]);

    if (isProfilesGetted == null && !isInit) return null;

    return (
        <>
            <>
                <SseProvider>
                    <BrowserRouter>
                        <Routers />
                    </BrowserRouter>
                </SseProvider>
            </>
        </>
    );
};

export default App;
