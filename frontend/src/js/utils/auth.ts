import { API_URL, LAUNCHER_URL } from '../appConsts';
import { SetUser } from '../../../wailsjs/go/main/App';
import { src } from '../../../wailsjs/go/models';
import { User } from '../Interfaces';
import UserType = src.UserType;

export const checkFetch = async (token: string) => {
    const response = await fetch(`${LAUNCHER_URL}/api/auth/launcher/me`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status == 401) {
        localStorage.removeItem('token');

        return {
            error: 'Сессия истекла. Авторизуйтесь повторно.',
        };
    }

    const checkData: User = await response.json();

    localStorage.removeItem('token');
    localStorage.setItem('token', token);

    checkData.jwt_token = token;
    window.user = checkData;

    SetUser(window.user as UserType).then();

    await fetch(`${API_URL}/uploads/skins/${checkData.skinHash}.png`)
        .then((res) => res.blob())
        .then((blob) => {
            window.__preloadedSkin = URL.createObjectURL(blob);
        });

    return {};
};
