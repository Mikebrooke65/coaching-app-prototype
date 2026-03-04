import { useState } from "react";
import { User, UserRole, UserTeamRole } from "../App";
import { LogIn } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import logo from "figma:asset/cdb7544de20d133944374bb8948c71879fef34b4.png";
import gannetWhite from "figma:asset/e2b3da3f33b0748e111b306a15bee82b12f28232.png";

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Mock users for demonstration
  const mockUsers: Record<string, { name: string; role: UserRole; teamName: string; roles?: UserTeamRole[] }> = {
    "coach@wcr.com": { 
      name: "Alex Johnson", 
      role: "coach", 
      teamName: "West Coast Rangers",
      roles: [
        { role: "coach", teamName: "U14 Blue" },
        { role: "coach", teamName: "U15 Mixed TDP" }
      ]
    },
    "manager@wcr.com": { 
      name: "Sarah Williams", 
      role: "manager", 
      teamName: "West Coast Rangers",
      roles: [
        { role: "manager", teamName: "U12 White" }
      ]
    },
    "admin@wcr.com": { name: "Michael Chen", role: "admin", teamName: "Admin Team" },
    "player@wcr.com": { name: "Jamie Taylor", role: "player", teamName: "West Coast Rangers" },
    "parent@wcr.com": { name: "Chris Parker", role: "caregiver", teamName: "West Coast Rangers" },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userData = mockUsers[email.toLowerCase()];
    
    if (userData) {
      onLogin({
        email,
        name: userData.name,
        role: userData.role,
        teamName: userData.teamName,
        roles: userData.roles
      });
    } else {
      alert("Invalid credentials. Try:\ncoach@wcr.com\nmanager@wcr.com\nadmin@wcr.com\nplayer@wcr.com\nparent@wcr.com");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0091f3]">
      {/* Developer Note - Obvious and Not Part of Design */}
      <div className="bg-yellow-300 border-4 border-yellow-500 p-4 m-4 rounded-lg shadow-lg">
        <p className="text-black font-bold text-center text-sm mb-2">🔧 DEVELOPER NOTE - TEST CREDENTIALS 🔧</p>
        <div className="text-black text-xs space-y-1">
          <p className="font-semibold">• Use <span className="bg-yellow-400 px-1 rounded">admin@wcr.com</span> to access Desktop version</p>
          <p className="font-semibold">• Use <span className="bg-yellow-400 px-1 rounded">coach@wcr.com</span> for Mobile App</p>
          <p className="text-gray-700 italic mt-2">(Password: anything works for demo)</p>
        </div>
      </div>

      {/* Mobile App Login - Full Screen */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Branding with Gannet Silhouette */}
        <div className="mb-12 text-center relative">
          {/* Gannet Silhouette Background */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-30 pointer-events-none">
            <img 
              src={gannetWhite} 
              alt="" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="relative z-10">
            <h1 className="text-6xl font-bold text-white mb-3" style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
              Urrah
            </h1>
            <h2 className="text-2xl text-white/95 mb-2" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              coaching app
            </h2>
            <p className="text-sm text-white/80 tracking-wider font-medium" style={{ fontFamily: "'Exo 2', sans-serif" }}>
              WEST COAST RANGERS FC
            </p>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Sign In</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent text-base"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0091f3] focus:border-transparent text-base"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0091f3] text-white py-4 px-4 rounded-xl hover:bg-[#0081d8] transition-colors flex items-center justify-center space-x-2 font-semibold text-base mt-6"
              >
                <LogIn className="w-5 h-5" />
                <span>Sign In</span>
              </button>
            </form>
          </div>

          {/* WCR Shield Logo */}
          <div className="mt-8 flex justify-center">
            <img
              src={logo}
              alt="West Coast Rangers FC Shield"
              className="w-32 h-32 object-contain opacity-90"
            />
          </div>

          <p className="text-center text-xs text-white/80 mt-6">
            © 2026 West Coast Rangers FC
          </p>
        </div>
      </div>
    </div>
  );
}