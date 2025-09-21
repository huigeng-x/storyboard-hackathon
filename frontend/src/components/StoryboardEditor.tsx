import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { type StoryboardPanelType } from "@/components/StoryboardPanel";
import StoryboardSidebar from "@/components/StoryboardSidebar";
import StoryboardMainContent, { type StoryboardMainContentRef } from "@/components/StoryboardMainContent";

interface Story {
  screen_name?: string;
  Screen_title?: string;
  Type?: string;
  voiceover_text?: string;
  screen_type?: string;
  target_duration_sec?: number;
  action_notes?: string;
  screen_number?: number;
  on_screen_visual_keywords?: string;
  image_url?: string;
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
  {
    id: "7",
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
    id: "8",
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
    id: "9",
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
    id: "10",
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
    id: "11",
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
    id: "12",
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

const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  className,
  stories = [],
}) => {
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const mainContentRef = useRef<StoryboardMainContentRef>(null);

  // Convert stories to StoryboardPanelType format
  const convertStoriesToPanels = (stories: Story[]): StoryboardPanelType[] => {
    const mapType = (type: string | undefined): StoryboardPanelType["type"] => {
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
      title: story.screen_name || story.Screen_title || `Panel ${index + 1}`,
      description:
        story.voiceover_text || story.Description || story.description || "No description available",
      type: mapType(story.screen_type || story.Type),
      duration: Number(story.target_duration_sec || story.Duration || story.duration) || 10,
      imageUrl:
        story.image_url ||
        story.ImageUrl ||
        "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?q=80&w=2338&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      notes: story.action_notes || story.Notes || story.notes || "",
    }));
  };

  // Use converted stories if available, otherwise fall back to mock data
  const displayPanels =
    stories.length > 0 ? convertStoriesToPanels(stories) : mockStoryboard;

  // Handle panel selection from sidebar
  const handlePanelSelect = (panelId: string) => {
    setSelectedPanel(panelId);
  };

  // Handle scroll to panel from sidebar
  const handleScrollToPanel = (panelId: string) => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollToPanel(panelId);
    }
  };

  return (
    <div
      className={cn("flex h-full bg-background", className)}
      onClick={() => setSelectedPanel(null)}
    >
      {/* Left Sidebar */}
      <StoryboardSidebar
        panels={displayPanels}
        selectedPanelId={selectedPanel}
        onPanelSelect={handlePanelSelect}
        onScrollTo={handleScrollToPanel}
      />

      {/* Main Content Area */}
      <StoryboardMainContent
        ref={mainContentRef}
        panels={displayPanels}
        selectedPanelId={selectedPanel}
        onPanelSelect={setSelectedPanel}
        className="flex-1"
      />
    </div>
  );
};

export default StoryboardEditor;
