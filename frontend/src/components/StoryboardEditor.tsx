import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryboardPanel {
  id: string;
  title: string;
  description: string;
  type: "stock-video" | "screencast" | "talking-head" | "cta" | "text-overlay";
  duration: number;
  imageUrl?: string;
  notes?: string;
}

interface StoryboardEditorProps {
  className?: string;
}

const mockStoryboard: StoryboardPanel[] = [
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

const getTypeColor = (type: StoryboardPanel["type"]) => {
  const colors = {
    "stock-video": "bg-blue-500",
    screencast: "bg-green-500",
    "talking-head": "bg-purple-500",
    cta: "bg-red-500",
    "text-overlay": "bg-orange-500",
  };
  return colors[type];
};

const getTypeLabel = (type: StoryboardPanel["type"]) => {
  const labels = {
    "stock-video": "Stock Video",
    screencast: "Screencast",
    "talking-head": "Talking Head",
    cta: "Call to Action",
    "text-overlay": "Text Overlay",
  };
  return labels[type];
};

const StoryboardEditor: React.FC<StoryboardEditorProps> = ({ className }) => {
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);

  const totalDuration = mockStoryboard.reduce(
    (sum, panel) => sum + panel.duration,
    0
  );

  return (
    <div className={cn("flex-1 p-6 bg-background", className)}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-foreground">
            How-to Demo: AI Video Creation Tool
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Total: {totalDuration}s</span>
            </div>
            <Button variant="outline" size="sm">
              <Play className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Edit your storyboard panels below. Use the chat assistant to make
          changes and improvements.
        </p>
      </div>

      {/* Storyboard Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {mockStoryboard.map((panel, index) => (
          <Card
            key={panel.id}
            className={cn(
              "p-4 cursor-pointer transition-all hover:shadow-md",
              selectedPanel === panel.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedPanel(panel.id)}
          >
            {/* Panel Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-muted-foreground">
                  Panel {index + 1}
                </span>
                <Badge
                  variant="secondary"
                  className={cn("text-white", getTypeColor(panel.type))}
                >
                  {getTypeLabel(panel.type)}
                </Badge>
              </div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{panel.duration}s</span>
              </div>
            </div>

            {/* Panel Image */}
            <div className="aspect-video bg-muted rounded-md mb-3 flex items-center justify-center overflow-hidden">
              {panel.imageUrl ? (
                <img
                  src={panel.imageUrl}
                  alt={`${panel.title} preview`}
                  className="object-cover w-full h-full"
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

            {/* Panel Content */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm line-clamp-2">
                {panel.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3">
                {panel.description}
              </p>
              {panel.notes && (
                <p className="text-xs text-blue-600 italic line-clamp-2">
                  Note: {panel.notes}
                </p>
              )}
            </div>

            {/* Panel Actions */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Add After
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Selected Panel Details */}
      {selectedPanel && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Panel Details</h3>
          {(() => {
            const panel = mockStoryboard.find((p) => p.id === selectedPanel);
            if (!panel) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Title:</span>{" "}
                      {panel.title}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>{" "}
                      {getTypeLabel(panel.type)}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>{" "}
                      {panel.duration} seconds
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Description:
                      </span>
                      <p className="mt-1">{panel.description}</p>
                    </div>
                    {panel.notes && (
                      <div>
                        <span className="text-muted-foreground">Notes:</span>
                        <p className="mt-1 text-blue-600">{panel.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Suggestions</h4>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>💡 Use the chat assistant to:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Adjust the pacing of this panel</li>
                      <li>Modify the dialogue or description</li>
                      <li>Change the visual style</li>
                      <li>Add transitions or effects</li>
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default StoryboardEditor;
