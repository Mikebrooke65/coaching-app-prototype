import { Plus, Upload, Image as ImageIcon, Trash2, Save, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

export function Announcements() {
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    text: '',
    image: '',
    audiences: {
      all: false,
      adult: false,
      youth: false,
      junior: false,
      academyCommunity: false,
      wof: false,
      teams: [] as string[],
    },
  });

  const [showTeamList, setShowTeamList] = useState(false);

  // Mock team list
  const availableTeams = [
    'U14 Blue',
    'U14 White',
    'U15 Mixed TDP',
    'U16 Rangers',
    'U17 Elite',
    'U12 White',
    'U13 Development',
    'Senior Men',
    'Senior Women',
    'U10 Academy',
  ];

  // Mock existing announcements
  const [announcements] = useState([
    {
      id: 1,
      title: 'Season Kick-Off BBQ - March 15th',
      audience: ['All'],
      date: 'Mar 1, 2026',
    },
    {
      id: 2,
      title: 'Coaching Workshop - Professional Development',
      audience: ['Adult', 'Youth Coaches'],
      date: 'Feb 28, 2026',
    },
    {
      id: 3,
      title: 'U14 Blue Training Schedule Update',
      audience: ['U14 Blue'],
      date: 'Feb 27, 2026',
    },
    {
      id: 4,
      title: 'Academy Community Day',
      audience: ['Academy Community', 'Junior'],
      date: 'Feb 26, 2026',
    },
    {
      id: 5,
      title: 'Whole of Football Strategy Meeting',
      audience: ['WOF'],
      date: 'Feb 25, 2026',
    },
  ]);

  const handleAllChange = (checked: boolean) => {
    if (checked) {
      setNewAnnouncement({
        ...newAnnouncement,
        audiences: {
          all: true,
          adult: true,
          youth: true,
          junior: true,
          academyCommunity: true,
          wof: true,
          teams: [...availableTeams],
        },
      });
    } else {
      setNewAnnouncement({
        ...newAnnouncement,
        audiences: {
          all: false,
          adult: false,
          youth: false,
          junior: false,
          academyCommunity: false,
          wof: false,
          teams: [],
        },
      });
    }
  };

  const handleAudienceChange = (key: keyof typeof newAnnouncement.audiences, value: boolean) => {
    setNewAnnouncement({
      ...newAnnouncement,
      audiences: {
        ...newAnnouncement.audiences,
        [key]: value,
        all: false, // Uncheck "All" when individual items change
      },
    });
  };

  const handleTeamToggle = (team: string) => {
    const teams = newAnnouncement.audiences.teams;
    const newTeams = teams.includes(team)
      ? teams.filter(t => t !== team)
      : [...teams, team];
    
    setNewAnnouncement({
      ...newAnnouncement,
      audiences: {
        ...newAnnouncement.audiences,
        teams: newTeams,
        all: false,
      },
    });
  };

  const handleImageUpload = () => {
    // In a real app, this would open a file picker
    const mockImageUrl = 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB0cmFpbmluZyUyMGdyaWR8ZW58MXx8fHwxNzQwNjEyMDAwfDA&ixlib=rb-4.1.0&q=80&w=1080';
    setNewAnnouncement({
      ...newAnnouncement,
      image: mockImageUrl,
    });
  };

  const handleSave = () => {
    // In a real app, this would save to storage
    console.log('Saving announcement:', newAnnouncement);
    // Reset form
    setNewAnnouncement({
      title: '',
      text: '',
      image: '',
      audiences: {
        all: false,
        adult: false,
        youth: false,
        junior: false,
        academyCommunity: false,
        wof: false,
        teams: [],
      },
    });
    setShowTeamList(false);
  };

  const isFormValid = () => {
    const hasAudience = 
      newAnnouncement.audiences.all ||
      newAnnouncement.audiences.adult ||
      newAnnouncement.audiences.youth ||
      newAnnouncement.audiences.junior ||
      newAnnouncement.audiences.academyCommunity ||
      newAnnouncement.audiences.wof ||
      newAnnouncement.audiences.teams.length > 0;

    return newAnnouncement.title.trim() !== '' && 
           newAnnouncement.text.trim() !== '' && 
           hasAudience;
  };

  const getAudienceDisplay = (audience: string[]) => {
    return audience.join(', ');
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Create and manage club announcements</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Current Announcements List */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#0091f3] p-6">
              <h2 className="text-xl font-bold text-white">Current Announcements</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-sm text-gray-900 flex-1 pr-2">
                        {announcement.title}
                      </h3>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{announcement.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Users className="w-3 h-3 text-[#0091f3]" />
                      <span className="text-gray-600">
                        <span className="font-semibold">Audience:</span> {getAudienceDisplay(announcement.audience)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - New Announcement Form */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-[#22c55e] p-6">
              <h2 className="text-xl font-bold text-white">Create New Announcement</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                  placeholder="e.g., Season Kick-Off BBQ - March 15th"
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                />
              </div>

              {/* Picture Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Picture
                </label>
                {newAnnouncement.image ? (
                  <div className="relative">
                    <ImageWithFallback
                      src={newAnnouncement.image}
                      alt="Announcement"
                      className="w-full h-48 object-cover rounded-xl border border-gray-300"
                    />
                    <button
                      onClick={() => setNewAnnouncement({ ...newAnnouncement, image: '' })}
                      className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleImageUpload}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#22c55e] hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                      <ImageIcon className="w-10 h-10" />
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs">PNG, JPG up to 10MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* Announcement Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Announcement Text <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newAnnouncement.text}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, text: e.target.value })}
                  placeholder="Enter the full announcement details here..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#22c55e] focus:border-transparent"
                  rows={6}
                />
              </div>

              {/* Audience Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Select Audience <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 bg-gray-50 rounded-xl p-4 border border-gray-200">
                  {/* All Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.all}
                      onChange={(e) => handleAllChange(e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm font-bold text-gray-900">All (Select All)</span>
                  </label>

                  <div className="border-t border-gray-300 my-2"></div>

                  {/* Individual Audiences */}
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.adult}
                      onChange={(e) => handleAudienceChange('adult', e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm text-gray-900">Adult</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.youth}
                      onChange={(e) => handleAudienceChange('youth', e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm text-gray-900">Youth</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.junior}
                      onChange={(e) => handleAudienceChange('junior', e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm text-gray-900">Junior</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.academyCommunity}
                      onChange={(e) => handleAudienceChange('academyCommunity', e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm text-gray-900">Academy Community</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={newAnnouncement.audiences.wof}
                      onChange={(e) => handleAudienceChange('wof', e.target.checked)}
                      className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                    />
                    <span className="text-sm text-gray-900">WOF</span>
                  </label>

                  {/* Teams Section */}
                  <div className="border-t border-gray-300 mt-2 pt-2">
                    <button
                      onClick={() => setShowTeamList(!showTeamList)}
                      className="flex items-center justify-between w-full gap-3 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={newAnnouncement.audiences.teams.length > 0}
                          readOnly
                          className="w-4 h-4 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e] pointer-events-none"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Team {newAnnouncement.audiences.teams.length > 0 && `(${newAnnouncement.audiences.teams.length} selected)`}
                        </span>
                      </div>
                      {showTeamList ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </button>

                    {/* Team List */}
                    {showTeamList && (
                      <div className="mt-2 ml-7 space-y-1 bg-white rounded-lg p-2 border border-gray-200 max-h-48 overflow-y-auto">
                        {availableTeams.map((team) => (
                          <label
                            key={team}
                            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={newAnnouncement.audiences.teams.includes(team)}
                              onChange={() => handleTeamToggle(team)}
                              className="w-3.5 h-3.5 text-[#22c55e] border-gray-300 rounded focus:ring-[#22c55e]"
                            />
                            <span className="text-xs text-gray-700">{team}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={!isFormValid()}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isFormValid()
                      ? 'bg-[#22c55e] text-white hover:bg-[#1ea84c] shadow-sm'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  Save Announcement
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
