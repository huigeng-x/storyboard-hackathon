import React, { useState } from "react";
import { cn } from "@/lib/utils";
import StoryboardPanel, {
  type StoryboardPanelType,
} from "@/components/StoryboardPanel";

interface Story {
  screen_name: string;
  Screen_title: string;
  Type: string;
  [key: string]: any;
}

interface StoryboardEditorProps {
  className?: string;
  stories?: Story[];
}

const mockStoryboard: StoryboardPanelType[] = [
  {
    id: "1",
    title: "Hook - Problem Introduction",
    description:
      "We get it, creating how-to videos takes hours of filming, screen recording, and editing time you could spend on other content and strategies.",
    type: "stock-video",
    duration: 8,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Use engaging visuals of frustrated content creators",
  },
  {
    id: "2",
    title: "Solution Introduction",
    description:
      "With our AI tool, you can create professional tutorials in minutes.",
    type: "talking-head",
    duration: 6,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Enthusiastic presenter introduction",
  },
  {
    id: "3",
    title: "Feature Demo - Script Creation",
    description:
      "Let me show you how. First, let's start with your script. Our AI script generator makes it easy...",
    type: "screencast",
    duration: 15,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Screen recording of script creation process",
  },
  {
    id: "4",
    title: "Feature Demo - Visual Selection",
    description:
      "Next, choose your visuals. Our AI selects the perfect stock footage and images for your content.",
    type: "screencast",
    duration: 12,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Show visual selection interface",
  },
  {
    id: "5",
    title: "Feature Demo - Voice & Music",
    description:
      "Add professional voiceover and background music with just a few clicks.",
    type: "talking-head",
    duration: 10,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Demonstrate audio features",
  },
  {
    id: "6",
    title: "Call to Action",
    description:
      "Ready to transform your content creation? Start your free trial today and create your first video in minutes.",
    type: "cta",
    duration: 7,
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    notes: "Strong CTA with signup button and demo link",
  },
];

const StoryboardEditor: React.FC<StoryboardEditorProps> = ({ className, stories = [] }) => {
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  // Convert stories to StoryboardPanelType format
  const convertStoriesToPanels = (stories: Story[]): StoryboardPanelType[] => {
    const mapType = (type: string): StoryboardPanelType["type"] => {
      const lowercaseType = type?.toLowerCase() || "";
      switch (lowercaseType) {
        case "stock-video":
        case "stock_video":
        case "stock video":
          return "stock-video";
        case "screencast":
        case "screen_cast":
        case "screen cast":
        case "screen recording":
          return "screencast";
        case "talking-head":
        case "talking_head":
        case "talking head":
        case "presenter":
          return "talking-head";
        case "cta":
        case "call-to-action":
        case "call_to_action":
        case "call to action":
          return "cta";
        case "text-overlay":
        case "text_overlay":
        case "text overlay":
        case "text":
          return "text-overlay";
        default:
          return "screencast";
      }
    };

    return stories.map((story, index) => ({
      id: story.screen_name || (index + 1).toString(),
      title: story.Screen_title || `Panel ${index + 1}`,
      description: story.Description || story.description || "No description available",
      type: mapType(story.Type),
      duration: Number(story.Duration || story.duration) || 10,
      imageUrl: story.ImageUrl || story.image_url || "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      notes: story.Notes || story.notes || "",
    }));
  };

  // Use converted stories if available, otherwise fall back to mock data
  const displayPanels = stories.length > 0 ? convertStoriesToPanels(stories) : mockStoryboard;

  return (
    <div
      className={cn(
        "flex flex-col h-full p-4 bg-background overflow-auto",
        className
      )}
      onClick={() => setSelectedPanel(null)}
    >
      {/* Storyboard Grid */}
      <div
        className="grid grid-cols-3 gap-4 flex-1"
        onClick={(e) => e.stopPropagation()}
      >
        {displayPanels.map((panel, index) => (
          <StoryboardPanel
            key={panel.id}
            panel={panel}
            index={index}
            isSelected={selectedPanel === panel.id}
            onSelect={setSelectedPanel}
          />
        ))}
      </div>
    </div>
  );
};

export default StoryboardEditor;
