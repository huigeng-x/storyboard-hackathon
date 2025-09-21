import React from "react";
import StoryboardEditor from "@/components/StoryboardEditor";
import EnhancedChatbot from "@/components/EnhancedChatbot";
import StoryboardHeader from "@/components/StoryboardHeader";

const StoryboardLayout: React.FC = () => {
  return (
    // left side is the story editor and right side is the chatbot
    // add some padding between the soryboard editor and chatbot
    <div className="h-screen flex-1 w-3/4">
      <div className="flex flex-col p-4 gap-6 overflow-hidden">
        <StoryboardHeader />
        <div className="flex">
          <StoryboardEditor className="h-full" />
        </div>
      </div>
      <div className="w-1/4">
        <EnhancedChatbot className="h-full" />
      </div>
    </div>
  );
};

export default StoryboardLayout;
