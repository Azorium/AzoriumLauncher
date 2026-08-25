import { HeaderContextType } from '../Interfaces';

export default function processingContext(headerContext: HeaderContextType, page: string) {
    const { isRenderSettingsButton, isRenderBackButton, isRenderLogoutButton, isRenderAuthButton, backUrl } =
        headerContext;

    switch (page) {
        case 'settings': {
            isRenderSettingsButton(false);
            isRenderBackButton(true);
            isRenderLogoutButton(true);
            isRenderAuthButton(false);
            backUrl('none');
            break;
        }
        case 'root': {
            isRenderSettingsButton(true);
            isRenderBackButton(false);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('');
            break;
        }
        case 'servers': {
            isRenderSettingsButton(true);
            isRenderBackButton(true);
            isRenderLogoutButton(false);
            isRenderAuthButton(true);
            backUrl('');
            break;
        }
        case 'auth': {
            isRenderSettingsButton(true);
            isRenderBackButton(true);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('/servers');
            break;
        }
        case 'profile': {
            isRenderSettingsButton(false);
            isRenderBackButton(true);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('/servers');
            break;
        }
        case 'process_pages': {
            isRenderSettingsButton(false);
            isRenderBackButton(false);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('');
            break;
        }
        case 'debug': {
            isRenderSettingsButton(false);
            isRenderBackButton(true);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('none');
            break;
        }
        case 'admin_pages': {
            isRenderSettingsButton(false);
            isRenderBackButton(true);
            isRenderLogoutButton(false);
            isRenderAuthButton(false);
            backUrl('');
            break;
        }
    }
}
