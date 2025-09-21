import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, BookOpen, Presentation, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryboardType {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
}

const storyboardTypes: StoryboardType[] = [
  {
    id: 1,
    title: "Product Release Video",
    description:
      "Create compelling product announcements and launch videos that showcase features and benefits",
    icon: <Play className="w-8 h-8" />,
    placeholder:
      "Describe your product launch - features, benefits, target audience...",
  },
  {
    id: 2,
    title: "How-to Video",
    description:
      "Build step-by-step tutorials and instructional content to guide users through processes",
    icon: <BookOpen className="w-8 h-8" />,
    placeholder:
      "Describe the process you want to teach - steps, audience skill level, key points...",
  },
  {
    id: 3,
    title: "Knowledge Sharing",
    description:
      "Develop educational content and training materials to share expertise and insights",
    icon: <Presentation className="w-8 h-8" />,
    placeholder:
      "Describe your educational content - topic, learning objectives, audience...",
  },
];

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<StoryboardType>(
    storyboardTypes[0]
  );
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateProjectId = (): string => {
    return Date.now().toString();
  };

  const createProjectFolder = async (
    projectId: string,
    typeId: number,
    userInput: string
  ) => {
    try {
      // Create project folder and JSON file via backend API
      const response = await fetch("http://localhost:8001/api/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          typeId,
          typeName: selectedType.title,
          userInput,
          prompt:
            " Genearte a storyboard with category Knowledge Sharing in 60 seconds",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create project folder");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating project folder:", error);
      throw error;
    }
  };

  const handleGenerate = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);

    try {
      // Generate unique project ID
      const projectId = generateProjectId();

      // Create project folder structure
      await createProjectFolder(projectId, selectedType.id, userInput);

      // Format input for Langflow
      const promptWithType = `Generate a 60 seconds storyboard with the category type [${selectedType.title}]. Here is the user input ${userInput}`;
      console.log("Prompt sent to chat API:", promptWithType);
      // Call the chat API to kick off the Langflow flow with extended timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 380000); // 6 minutes 20 seconds

      const response = await fetch("http://localhost:8001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: promptWithType,
          conversation_history: [],
          project_id: projectId,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to generate storyboard");
      }

      const data = await response.json();

      // Store project context
      sessionStorage.setItem("projectId", projectId);
      sessionStorage.setItem("storyboardType", selectedType.id.toString());
      sessionStorage.setItem("storyboardPrompt", userInput);
      sessionStorage.setItem("initialResponse", data.message);

      // Navigate to storyboard layout with project ID
      navigate(`/storyboard/${projectId}`);
    } catch (error) {
      console.error("Error generating storyboard:", error);
      alert("Failed to generate storyboard. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Storyboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the type of video you want to create and describe your vision
          </p>
        </div>

        {/* Storyboard Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {storyboardTypes.map((type) => (
            <Card
              key={type.id}
              className={cn(
                "p-6 cursor-pointer transition-all hover:shadow-xl hover:scale-105",
                "bg-white border-2 hover:border-primary",
                selectedType.id === type.id &&
                  "border-primary ring-2 ring-primary/20 bg-primary/5"
              )}
              onClick={() => setSelectedType(type)}
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={cn(
                    "p-4 rounded-full transition-colors",
                    selectedType.id === type.id
                      ? "bg-primary text-white"
                      : "bg-primary/10 text-primary"
                  )}
                >
                  {type.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {type.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Input Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-white shadow-lg">
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Describe Your {selectedType.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  The more details you provide, the better your storyboard will
                  be!
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-amber-800">
                    ⏱️ <strong>Please note:</strong> Storyboard generation
                    typically takes 3-5 minutes. We appreciate your patience
                    while our AI creates your personalized content.
                  </p>
                </div>
              </div>

              <Textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedType.placeholder}
                className="min-h-[200px] resize-none text-base"
                disabled={isGenerating}
              />

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  Press Enter to generate, Shift+Enter for new line
                </p>
                <Button
                  onClick={handleGenerate}
                  disabled={!userInput.trim() || isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    "Generate Storyboard"
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
