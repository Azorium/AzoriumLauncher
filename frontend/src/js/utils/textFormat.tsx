export const groupFormat = (groupName: string) => {
    if (groupName === 'owner')
        return (
            <span className="user-group" style={{ color: '#48dbf1', fontWeight: 'bold' }}>
                Владелец
            </span>
        );
    if (groupName === 'manager')
        return (
            <span className="user-group" style={{ color: '#3fcced', fontWeight: 'bold' }}>
                Управляющий
            </span>
        );
    if (groupName === 'admin')
        return (
            <span className="user-group" style={{ color: '#e72248', fontWeight: 'bold' }}>
                Администратор
            </span>
        );
    if (groupName === 'moder')
        return (
            <span className="user-group" style={{ color: '#fdf288', fontWeight: 'bold' }}>
                Модератор
            </span>
        );
    if (groupName === 'helper')
        return (
            <span className="user-group" style={{ color: '#e4f3a4', fontWeight: 'bold' }}>
                Хелпер
            </span>
        );
    if (groupName === 'bloger')
        return (
            <span className="user-group" style={{ color: '#9491f3', fontWeight: 'bold' }}>
                Блогер
            </span>
        );

    if (groupName === 'dmoder')
        return (
            <span className="user-group" style={{ color: '#ff6370', fontWeight: 'bold' }}>
                DModer
            </span>
        );
    if (groupName === 'amethyst')
        return (
            <span className="user-group" style={{ color: 'purple', fontWeight: 'bold' }}>
                Аметист
            </span>
        );
    if (groupName === 'epic')
        return (
            <span className="user-group" style={{ color: '#ff82a3' }}>
                Epic
            </span>
        );
    if (groupName === 'deluxe')
        return (
            <span className="user-group" style={{ color: '#bf14bf' }}>
                Deluxe
            </span>
        );
    if (groupName === 'premium')
        return (
            <span className="user-group" style={{ color: '#55aceb' }}>
                Premium
            </span>
        );
    if (groupName === 'vip')
        return (
            <span className="user-group" style={{ color: '#e9e391' }}>
                VIP
            </span>
        );
    if (groupName === 'plus')
        return (
            <span className="user-group" style={{ color: '#6ecfff' }}>
                Plus
            </span>
        );

    return <span className="user-group">Игрок</span>;
};
