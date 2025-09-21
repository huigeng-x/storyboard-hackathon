import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Clock, Edit, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StoryboardPanelType {
  id: string;
  title: string;
  description: string;
  type: "stock-video" | "screencast" | "talking-head" | "cta" | "text-overlay";
  duration: number;
  imageUrl?: string;
  notes?: string;
}

interface StoryboardPanelProps {
  panel: StoryboardPanelType;
  index: number;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const getTypeColor = (type: StoryboardPanelType["type"]) => {
  const colors = {
    "stock-video": "bg-blue-500",
    screencast: "bg-green-500",
    "talking-head": "bg-purple-500",
    cta: "bg-red-500",
    "text-overlay": "bg-orange-500",
  };
  return colors[type];
};

export const getTypeLabel = (type: StoryboardPanelType["type"]) => {
  const labels = {
    "stock-video": "Stock Video",
    screencast: "Screencast",
    "talking-head": "Talking Head",
    cta: "Call to Action",
    "text-overlay": "Text Overlay",
  };
  return labels[type];
};

const StoryboardPanel: React.FC<StoryboardPanelProps> = ({
  panel,
  index,
  isSelected,
  onSelect,
}) => {
  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all hover:shadow-md h-fit",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={() => onSelect(panel.id)}
    >
      {/* Panel Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-muted-foreground">
            Panel {index + 1}
          </span>
          <Badge className={cn("text-white", getTypeColor(panel.type))}>
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
        <h3 className="font-medium text-sm line-clamp-2">{panel.title}</h3>
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
  );
};

export default StoryboardPanel;
