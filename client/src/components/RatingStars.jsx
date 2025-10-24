import { Star } from "lucide-react";

export default function RatingStars({
    rating,
    maxRating = 10,
    size = "md",
    showNumber = true,
}) {
    const stars = 5;
    const normalizedRating = (rating / maxRating) * stars;

    const sizeClasses = {
        sm: "w-3 h-3",
        md: "w-4 h-4",
        lg: "w-6 h-6",
    };

    const textSizeClasses = {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-lg",
    };

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
                {Array.from({ length: stars }).map((_, index) => {
                    const fillPercentage = Math.min(
                        Math.max(normalizedRating - index, 0),
                        1
                    );

                    return (
                        <div key={index} className="relative">
                            <Star className={`${sizeClasses[size]} text-muted-foreground/30`} />
                            <div
                                className="absolute inset-0 overflow-hidden"
                                style={{ width: `${fillPercentage * 100}%` }}
                            >
                                <Star
                                    className={`${sizeClasses[size]} text-chart-2 fill-chart-2`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            {showNumber && (
                <span className={`font-semibold text-chart-2 ${textSizeClasses[size]}`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
