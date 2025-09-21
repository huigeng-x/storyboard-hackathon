import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface StoryboardLoadingStateProps {
  className?: string;
}

const StoryboardLoadingState: React.FC<StoryboardLoadingStateProps> = ({
  className,
}) => {
  return (
    <div className={`flex h-full w-full ${className || ""}`}>
      {/* Left sidebar placeholder */}
      <div className="w-80 bg-background border-r border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">Storyboard</h3>
            <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              Loading...
            </div>
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating content</span>
          </div>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Sparkles className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">AI is crafting your story...</p>
          </div>
        </div>
      </div>

      {/* Main content loading area */}
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center bg-background">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 mx-auto animate-spin text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-4">
              Creating Your Storyboard
            </h2>

            <div className="space-y-2 text-muted-foreground">
              <p className="text-lg">
                Our AI is analyzing your requirements and generating a professional storyboard...
              </p>
              <p className="text-sm">
                This usually takes 30-60 seconds. Please wait while we craft the perfect narrative for your project.
              </p>
            </div>

            {/* Progress indicator */}
            <div className="mt-8">
              <div className="flex justify-center space-x-2 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Generating scenes and content...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryboardLoadingState;