interface Windows11SpinnerProps {
    size?: number;
    strokeWidth?: number;
    color?: string;
    speed?: number;
}

export default function CircleSpinner({
    size = 48,
    strokeWidth = 4,
    color = '#ffffff',
    speed = 1.2,
}: Windows11SpinnerProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * 0.25;

    return (
        <div
            className="relative inline-flex items-center justify-center"
            style={{ width: size, height: size }}
            role="status"
            aria-label="Загрузка"
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="animate-spin"
                style={{ animationDuration: `${speed}s` }}
            >
                <defs>
                    <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0" />
                        <stop offset="50%" stopColor={color} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={color} stopOpacity="1" />
                    </linearGradient>
                </defs>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#spinner-gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={`${arcLength} ${circumference - arcLength}`}
                    transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
            </svg>
        </div>
    );
}
