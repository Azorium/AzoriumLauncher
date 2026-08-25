import { NavLink, Outlet, useOutletContext } from 'react-router';
import { HeaderContextType } from '../../js/Interfaces';

export default function AdminLayout() {
    const rootContext = useOutletContext<HeaderContextType>();

    const pages = [
        {
            name: 'installclient',
            htmlTitle: 'Установить клиент',
        },
        {
            name: 'sync',
            htmlTitle: 'Синхронизация',
        },
    ];

    return (
        <div className="w-full h-full flex gap-6 items-center justify-center">
            <div className="mb-10! h-full max-h-[520px] w-20 bg-[rgba(20,20,30,0.45)] backdrop-blur-[12px]  border border-white/10 rounded-xl flex gap-8 flex-col justify-center items-center">
                {pages.map(({ name, htmlTitle }) => (
                    <NavLink to={`${name}`} key={name}>
                        <img
                            src={`/assets/images/icons/admin_${name}.svg`}
                            alt="иконка"
                            width={42}
                            height={42}
                            title={htmlTitle}
                        />
                    </NavLink>
                ))}
            </div>
            <div className="w-full max-w-[920px] h-full max-h-[520px] mb-10!  bg-[rgba(20,20,30,0.45)] backdrop-blur-[12px]  border border-white/10 rounded-xl">
                <Outlet context={rootContext} />
            </div>
        </div>
    );
}
