import { Link } from "react-router";
import { Smartphone, Monitor } from "lucide-react";
import { Button } from "./ui/button";
import gannetWhite from "figma:asset/e2b3da3f33b0748e111b306a15bee82b12f28232.png";

export function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0091f3] to-[#0081d8] flex items-center justify-center p-8 relative overflow-hidden">
      {/* Gannet Background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-10 pointer-events-none">
        <img 
          src={gannetWhite} 
          alt="" 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">Urrah</h1>
          <p className="text-2xl text-blue-100 mb-2">West Coast Rangers FC</p>
          <p className="text-lg text-blue-200">Coaching App Prototype</p>
        </div>

        {/* Version Selection */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mobile Version */}
          <Link to="/" className="group">
            <div className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 rounded-2xl bg-[#0091f3]/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-[#0091f3] transition-colors">
                <Smartphone className="w-10 h-10 text-[#0091f3] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Mobile Version</h2>
              <p className="text-gray-600 text-center mb-6">
                Experience the mobile app prototype with bottom tab navigation and 6 main screens
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#0091f3]"></div>
                  <span>Landing Page</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span>Coaching Sessions</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#ea7800]"></div>
                  <span>Games & Results</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span>Resources Library</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span>Schedule & Events</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <div className="w-2 h-2 rounded-full bg-[#545859]"></div>
                  <span>Messaging</span>
                </div>
              </div>
              <Button className="w-full bg-[#0091f3] hover:bg-[#0081d8] text-white">
                View Mobile Prototype
              </Button>
            </div>
          </Link>

          {/* Desktop Version */}
          <Link to="/desktop" className="group">
            <div className="bg-white rounded-2xl p-8 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <div className="w-20 h-20 rounded-2xl bg-[#ea7800]/10 flex items-center justify-center mb-6 mx-auto group-hover:bg-[#ea7800] transition-colors">
                <Monitor className="w-10 h-10 text-[#ea7800] group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3 text-center">Desktop Version</h2>
              <p className="text-gray-600 text-center mb-6">
                Explore the desktop prototype with sidebar navigation and 10 main areas including admin features
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-2">Coaching Tools:</p>
                  <ul className="space-y-1 text-gray-600 text-xs">
                    <li>• Landing Dashboard</li>
                    <li>• Coaching Sessions</li>
                    <li>• Games & Matches</li>
                    <li>• Resources</li>
                    <li>• Schedule</li>
                    <li>• Messaging</li>
                  </ul>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-900 mb-2">Admin Only:</p>
                  <ul className="space-y-1 text-gray-600 text-xs">
                    <li>• Teams Management</li>
                    <li>• User Management</li>
                    <li>• Reporting & Analytics</li>
                    <li>• Lesson Builder</li>
                  </ul>
                </div>
              </div>
              <Button className="w-full bg-[#ea7800] hover:bg-[#d66d00] text-white">
                View Desktop Prototype
              </Button>
            </div>
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-blue-100 text-sm">
            Design mockup reference for Kiro development • West Coast Rangers FC
          </p>
        </div>
      </div>
    </div>
  );
}
