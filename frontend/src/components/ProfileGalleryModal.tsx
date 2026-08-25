import { useEffect, useState } from 'react';
import { Profile } from '../js/Interfaces';

interface ProfileGalleryModalProps {
    profile: Profile;
    setShowGallery: (value: boolean) => void;
}

export default function ProfileGalleryModal({ profile, setShowGallery }: ProfileGalleryModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const images = profile.frontend.profileImages;

    const close = () => setShowGallery(false);
    const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
    const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') prev();
            if (e.key === 'ArrowRight') next();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (images.length === 0) {
        return (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center rounded-xl backdrop-blur-sm p-4! "
                onClick={close}
            >
                <div
                    className="bg-[rgba(20,20,30,0.9)] rounded-2xl border border-white/10 p-8! w-120 h-70 "
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4!">
                        <h2 className="text-xl font-bold text-white m-0">Галерея</h2>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={close}
                                className="text-white/50 hover:text-white text-2xl leading-none p-2! cursor-pointer bg-transparent border-0"
                                aria-label="Закрыть"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                    <p className="text-white/70">Нет изображений</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center  backdrop-blur-sm p-4! rounded-xl"
            onClick={close}
        >
            <div
                className="w-full max-w-[600px] bg-[rgba(20,20,30,0.9)] backdrop-blur rounded-3xl border border-white/10 p-8! shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Заголовок и счётчик */}
                <div className="flex items-center justify-between mb-4!">
                    <h2 className="text-xl font-bold text-white m-0">Галерея</h2>
                    <div className="flex items-center gap-4">
                        <span className="text-white/60 text-sm">
                            {currentIndex + 1} / {images.length}
                        </span>
                        <button
                            onClick={close}
                            className="text-white/50 hover:text-white text-2xl leading-none p-2! cursor-pointer bg-transparent border-0"
                            aria-label="Закрыть"
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Основная область с картинкой и стрелками */}
                <div className="relative flex items-center justify-center min-h-[300px] flex-1">
                    {images.length > 1 && (
                        <button
                            onClick={prev}
                            className="absolute left-2! top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-colors cursor-pointer"
                            aria-label="Предыдущее"
                        >
                            ❮
                        </button>
                    )}
                    <img
                        src={`/assets/images/profile/${profile.backend.folderName}/${images[currentIndex]}`}
                        alt={`${profile.frontend.name} ${currentIndex + 1}`}
                        className="max-h-[60vh] max-w-full object-contain rounded-xl border border-white/10 shadow-lg"
                    />
                    {images.length > 1 && (
                        <button
                            onClick={next}
                            className="absolute right-2! top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 text-white border border-white/10 backdrop-blur-sm transition-colors cursor-pointer"
                            aria-label="Следующее"
                        >
                            ❯
                        </button>
                    )}
                </div>

                {/* Миниатюры */}
                {images.length > 1 && (
                    <div className="flex gap-2 mt-4! overflow-x-auto py-2! [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        {images.map((img, idx) => (
                            <img
                                key={`${img}-${idx}`}
                                src={`/assets/images/profile/${profile.backend.folderName}/${img}`}
                                alt={`миниатюра ${idx + 1}`}
                                onClick={() => setCurrentIndex(idx)}
                                className={`h-14 w-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                                    idx === currentIndex
                                        ? 'border-blue-400 shadow-[0_0_10px_rgba(9,132,227,0.5)]'
                                        : 'border-transparent hover:border-white/30'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
