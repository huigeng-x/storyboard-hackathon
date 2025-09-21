import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import StoryboardLayout from '@/components/StoryboardLayout'
import OnboardingPage from '@/components/OnboardingPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OnboardingPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/storyboard/:projectId" element={<StoryboardLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
