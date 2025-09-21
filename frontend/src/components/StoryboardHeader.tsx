import React from "react";
import { Clock } from "lucide-react";

interface StoryboardHeaderProps {
  title?: string;
  description?: string;
}

const StoryboardHeader: React.FC<StoryboardHeaderProps> = ({
  title = "How-to Demo: AI Video Creation Tool",
  description = "Edit your storyboard panels below. Use the chat assistant to make changes and improvements.",
}) => {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
          </div>
        </div>
      </div>
      <div className="flex">
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default StoryboardHeader;
