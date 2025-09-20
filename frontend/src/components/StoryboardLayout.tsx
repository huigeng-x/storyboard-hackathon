import React from "react";
import StoryboardEditor from "@/components/StoryboardEditor";
import EnhancedChatbot from "@/components/EnhancedChatbot";

const StoryboardLayout: React.FC = () => {
  return (
    // left side is the story editor and right side is the chatbot
    // add some padding between the soryboard editor and chatbot
    <div className="flex h-screen p-20">
      <div className="w-3/4 mr-6">
        <StoryboardEditor className="h-full" />
      </div>
      <div className="w-1/4">
        <EnhancedChatbot className="h-full" />
      </div>
    </div>
  );
};

export default StoryboardLayout;
