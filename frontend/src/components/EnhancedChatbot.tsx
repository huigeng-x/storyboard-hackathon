import React, { useRef, useEffect, useState } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface EnhancedChatbotProps {
  className?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

const EnhancedChatbot: React.FC<EnhancedChatbotProps> = ({ className }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm your AI assistant powered by OpenAI for storyboard editing and iteration. I can help you refine your storyboard panels, adjust scenes, modify dialogue, and make your video more engaging. What would you like to work on?",
      createdAt: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling AI API:', error);

      // Fallback to mock response if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        createdAt: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes('dramatic') || input.includes('more dramatic')) {
      return "I'll help you make that panel more dramatic! Here are some suggestions:\n\n• Add dynamic camera angles or zoom effects\n• Strengthen the emotional language in the script\n• Include tension-building music or sound effects\n• Use more impactful visuals or transitions\n\nWhich panel would you like me to focus on?";
    }

    if (input.includes('simplify') || input.includes('simple')) {
      return "Great idea to simplify! I can help you:\n\n• Reduce the amount of text or dialogue\n• Break complex scenes into smaller panels\n• Use clearer, more direct messaging\n• Remove unnecessary visual elements\n\nWhich aspect would you like to simplify first?";
    }

    if (input.includes('call-to-action') || input.includes('cta')) {
      return "Adding a strong call-to-action is crucial! I can help you:\n\n• Create compelling CTA copy\n• Position the CTA at the optimal moment\n• Design visually appealing CTA panels\n• A/B test different CTA approaches\n\nWhat action do you want viewers to take?";
    }

    if (input.includes('pacing') || input.includes('pace')) {
      return "Let's improve the pacing! I can help you:\n\n• Adjust individual panel durations\n• Add or remove transition time\n• Balance fast and slow moments\n• Ensure good flow between scenes\n\nAre there specific panels that feel too fast or slow?";
    }

    return "I understand you want to improve your storyboard. I can help you with:\n\n• Refining panel content and messaging\n• Adjusting timing and pacing\n• Improving visual elements\n• Enhancing audience engagement\n\nCould you be more specific about what you'd like to change? You can also click on a panel in the storyboard to focus our discussion.";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleQuickAction = async (action: string) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      createdAt: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await fetch('http://localhost:8001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: action,
          conversation_history: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from AI');
      }

      const data = await response.json();

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        createdAt: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling AI API:', error);

      // Fallback to mock response if API fails
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        createdAt: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className={cn("fixed right-0 top-0 h-screen w-1/4 bg-background border-l border-border shadow-lg flex flex-col z-50", className)}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-medium">Storyboard AI Assistant</h3>
        </div>
        <p className="text-xs text-primary-foreground/80 mt-1">
          Edit and iterate your storyboard
        </p>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex w-full",
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  "flex max-w-[75%] space-x-2",
                  message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                )}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={cn(
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  )}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>

                <div
                  className={cn(
                    "rounded-lg p-3 text-sm",
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.createdAt || Date.now()).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex space-x-2 max-w-[75%]">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground rounded-lg p-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex space-x-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Describe what you'd like to change about your storyboard..."
              className="flex-1 resize-none min-h-[60px] max-h-[120px]"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Press Enter to send, Shift+Enter for new line
          </p>
        </form>

        {/* Quick Actions */}
        <div className="mt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Quick actions:</p>
          <div className="flex flex-wrap gap-1">
            {[
              "Make it more dramatic",
              "Simplify the message",
              "Add a call-to-action",
              "Improve pacing"
            ].map((action) => (
              <Button
                key={action}
                variant="outline"
                size="sm"
                className="text-xs h-6"
                onClick={() => void handleQuickAction(action)}
                disabled={isLoading}
              >
                {action}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedChatbot;