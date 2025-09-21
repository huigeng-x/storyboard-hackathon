import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import StoryboardLayout from "@/components/StoryboardLayout";
import OnboardingPage from "@/components/OnboardingPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="h-screen flex flex-col">
        {/* Global Header */}
        <header className="bg-background border-b border-border px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-foreground">
                Plotline
              </h1>
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded text-[10px]">
                Beta
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              AI-Powered Storyboard Generator
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route
              path="/storyboard/:projectId"
              element={<StoryboardLayout />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
