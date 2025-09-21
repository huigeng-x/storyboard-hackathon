import React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryboardImageProps {
  imageUrl?: string;
  alt: string;
  className?: string;
}

const StoryboardImage: React.FC<StoryboardImageProps> = ({
  imageUrl,
  alt,
  className
}) => {
  return (
    <div className={cn(
      "w-64 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0",
      className
    )}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={alt}
          className="object-cover w-full h-full"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `
                <div class="text-center text-muted-foreground">
                  <div class="w-12 h-12 bg-muted-foreground/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polygon points="5,3 19,12 5,21"></polygon>
                    </svg>
                  </div>
                  <p class="text-xs">Image Error</p>
                </div>
              `;
            }
          }}
        />
      ) : (
        <div className="text-center text-muted-foreground">
          <div className="w-12 h-12 bg-muted-foreground/20 rounded-lg mx-auto mb-2 flex items-center justify-center">
            <Play className="w-6 h-6" />
          </div>
          <p className="text-xs">No Image Available</p>
        </div>
      )}
    </div>
  );
};

export default StoryboardImage;