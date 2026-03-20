import { useState, useEffect } from 'react';
import { FileText, Search, Download, Upload, Trash2, X, File, ChevronDown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Resource {
  id: string;
  title: string;
  category: 'Rules' | 'Field Setup' | 'Coach Support' | 'General';
  file_url: string;
  file_name: string;
  file_type: string | null;
  file_size: number | null;
  description: string | null;
  created_at: string;
  created_by: string | null;
}

interface RuleSection {
  key: string;
  title: string;
  items: string[];
}

interface RuleSet {
  id: string;
  label: string;
  category: string;
  ageRange: { min: number; max: number };
  version: string;
  sections: RuleSection[];
}

// Rule sets data - same as mobile version
const ruleSets: RuleSet[] = [
  {
    id: "first-kicks",
    label: "First Kicks (4–6 years)",
    category: "Junior",
    ageRange: { min: 4, max: 6 },
    version: "2026-03-08",
    sections: [
      { key: "players", title: "Players", items: ["3v3 or 4v4"] },
      { key: "gameTime", title: "Game Time", items: ["Max 30 minutes", "2×15 mins or 3×10 mins"] },
      { key: "pitchSize", title: "Pitch Size", items: ["3v3: 20×15m", "4v4: 30×20m"] },
      { key: "goals", title: "Goals", items: ["1.5×0.9m or 2×1m"] },
      { key: "ball", title: "Ball", items: ["Size 3"] },
      { key: "penaltyArea", title: "Penalty Area", items: ["None"] },
      { key: "goalkeepers", title: "Goalkeepers", items: ["None at this age"] },
      { key: "subs", title: "Subs", items: ["Max 2", "Rolling rotation encouraged"] },
      { key: "startRestart", title: "Start & Restart of Play", items: ["Kick to a teammate from halfway.", "Opposition must be 5m away.", "Cannot score directly from kick‑off — ball must touch another player.", "After a goal, the conceding team restarts from halfway."] },
      { key: "scoring", title: "Scoring", items: ["Whole ball must cross the line.", "Goals can only be scored from the opposition's half."] },
      { key: "offside", title: "Offside", items: ["No offside rule.", "Players should not stand permanently in obvious offside positions."] },
      { key: "outTouchLine", title: "Ball Out of Play – Touch Line", items: ["No throw‑ins.", "Ball is kicked or dribbled back into play from behind the line.", "Restart within ~3 seconds.", "Defenders retreat 5m.", "Cannot score directly — ball must touch another player."] },
      { key: "outGoalLine", title: "Ball Out of Play – Goal Line", items: ["No corner kicks.", "Defending team restarts from any point on their goal line.", "Opponents retreat to halfway.", "Cannot score directly — ball must touch another player."] },
      { key: "foulsMisconduct", title: "Fouls & Misconduct", items: ["Most fouls are accidental — play advantage where possible.", "If deliberate, explain the rule simply and encourage better behaviour.", "All free kicks are indirect.", "Opponents must be 5m away."] },
      { key: "resultsLadders", title: "Match Results & Ladders", items: ["No published scores, tables, or ladders.", "Clubs, Associations, and Federations must not publish results."] }
    ]
  },
  {
    id: "fun-football",
    label: "Fun Football (7–8 years)",
    category: "Junior",
    ageRange: { min: 7, max: 8 },
    version: "2026-03-08",
    sections: [
      { key: "players", title: "Players", items: ["4v4 or 5v5"] },
      { key: "gameTime", title: "Game Time", items: ["Max 40 minutes", "2×20 mins or 4×10 mins"] },
      { key: "pitchSize", title: "Pitch Size", items: ["30×20m", "40×30m"] },
      { key: "goals", title: "Goals", items: ["1.8×0.9m", "2×1m"] },
      { key: "ball", title: "Ball", items: ["Size 3"] },
      { key: "penaltyArea", title: "Penalty Area", items: ["None"] },
      { key: "goalkeepers", title: "Goalkeepers", items: ["None at this age"] },
      { key: "subs", title: "Subs", items: ["Max 2", "Rolling rotation encouraged"] },
      { key: "startRestart", title: "Start & Restart of Play", items: ["Kick to a teammate from halfway.", "Opposition must be 5m away.", "Cannot score directly from kick‑off — ball must touch another player.", "After a goal, the conceding team restarts from halfway."] },
      { key: "scoring", title: "Scoring", items: ["Whole ball must cross the line.", "Goals can only be scored from the opposition's half."] },
      { key: "offside", title: "Offside", items: ["No offside rule.", "Players should not stand permanently in obvious offside positions."] },
      { key: "outTouchLine", title: "Ball Out of Play – Touch Line", items: ["No throw‑ins.", "Ball is kicked or dribbled back into play from behind the line.", "Restart within ~3 seconds.", "Defenders retreat 5m.", "Cannot score directly — ball must touch another player."] },
      { key: "outGoalLine", title: "Ball Out of Play – Goal Line", items: ["No corner kicks.", "Defending team restarts from any point on their goal line.", "Opponents retreat to halfway.", "Cannot score directly — ball must touch another player."] },
      { key: "foulsMisconduct", title: "Fouls & Misconduct", items: ["Most fouls are accidental — allow advantage where possible.", "If deliberate, explain the rule simply and encourage better behaviour.", "All free kicks are indirect.", "Opponents must be 5m away."] },
      { key: "resultsLadders", title: "Match Results & Ladders", items: ["No published scores, tables, or ladders.", "Clubs, Associations, and Federations must not publish results."] }
    ]
  },
  {
    id: "mini-football-9-10",
    label: "Mini Football (9–10 years)",
    category: "Junior",
    ageRange: { min: 9, max: 10 },
    version: "2026-03-08",
    sections: [
      { key: "players", title: "Players", items: ["7v7"] },
      { key: "gameTime", title: "Game Time", items: ["Max 50 minutes", "2×25 mins"] },
      { key: "pitchSize", title: "Pitch Size", items: ["45×30m (min)", "55×35m (max)"] },
      { key: "goals", title: "Goals", items: ["3.8×1.9m", "4×2m"] },
      { key: "ball", title: "Ball", items: ["Size 4"] },
      { key: "penaltyArea", title: "Penalty Area", items: ["8×16m"] },
      { key: "goalkeepers", title: "Goalkeepers", items: ["Yes"] },
      { key: "subs", title: "Subs", items: ["Max 3", "Rolling rotation encouraged"] },
      { key: "startRestart", title: "Start & Restart of Play", items: ["Kick to a teammate from halfway.", "Opposition must be 5m away.", "Cannot score directly from kick‑off — ball must touch another player.", "After a goal, the conceding team restarts from halfway."] },
      { key: "scoring", title: "Scoring", items: ["A goal is scored when the whole ball crosses the line."] },
      { key: "retreatingLine", title: "Retreating Line", items: ["Used for: Goal kicks; Goalkeeper possession; Free kicks.", "Opposition must drop behind the retreating line.", "They may advance only after: the goalkeeper plays the ball; and a teammate touches it.", "Coaches should encourage quick play from the goalkeeper."] },
      { key: "offside", title: "Offside", items: ["Offside applies.", "For 9th & 10th Grade: Offside is judged between the retreating line and the goal line only."] },
      { key: "outTouchLine", title: "Ball Out of Play – Touch Line", items: ["Throw‑ins: Both feet on or behind the line.", "Throw‑ins: Ball delivered with both hands from behind and over the head.", "Throw‑ins: Thrower cannot touch the ball again until another player does.", "Throw‑ins: Cannot score directly from a throw‑in."] },
      { key: "outGoalLine", title: "Ball Out of Play – Goal Line", items: ["Defending team last touched: Corner kick.", "Attacking team last touched: Goal kick from anywhere inside the penalty area.", "Opponents retreat to the retreating line."] },
      { key: "goalkeepersRules", title: "Goalkeepers", items: ["May handle the ball anywhere inside the penalty area.", "Must release the ball within 6 seconds.", "Must throw, roll, or play from the ground — no drop‑kicks or punts.", "Indirect free kick if the keeper handles a deliberate back‑pass."] },
      { key: "foulsMisconduct", title: "Fouls & Misconduct", items: ["Mostly indirect free kicks, except for penalties.", "Opponents must be 5m away.", "Fouls include: Kicking, tripping, jumping at, charging, striking; pushing, holding, spitting; deliberate handball; dangerous play; impeding progress."] },
      { key: "penaltyKicks", title: "Penalty kicks", items: ["Awarded for deliberate handball or serious misconduct in the penalty area.", "Taken from 7m with a goalkeeper in position."] },
      { key: "resultsLadders", title: "Match Results & Ladders", items: ["No public results, tables, or ladders.", "Results may be recorded privately to help place teams at appropriate levels."] }
    ]
  },
  {
    id: "mini-football-11-12",
    label: "Mini Football (11–12 years)",
    category: "Junior",
    ageRange: { min: 11, max: 12 },
    version: "2026-03-08",
    sections: [
      { key: "players", title: "Players", items: ["9v9"] },
      { key: "gameTime", title: "Game Time", items: ["Max 60 minutes", "2×30 mins"] },
      { key: "pitchSize", title: "Pitch Size", items: ["64×45m (min)", "70×50m (max)"] },
      { key: "goals", title: "Goals", items: ["4×2m", "5×2m"] },
      { key: "ball", title: "Ball", items: ["Size 4"] },
      { key: "penaltyArea", title: "Penalty Area", items: ["10×24m"] },
      { key: "goalkeepers", title: "Goalkeepers", items: ["Yes"] },
      { key: "subs", title: "Subs", items: ["Max 4", "Rolling rotation encouraged"] },
      { key: "startRestart", title: "Start & Restart of Play", items: ["Kick to a teammate from halfway.", "Opposition must be 5m away.", "Cannot score directly from kick‑off — ball must touch another player.", "After a goal, the conceding team restarts from halfway."] },
      { key: "scoring", title: "Scoring", items: ["A goal is scored when the whole ball crosses the line."] },
      { key: "retreatingLine", title: "Retreating Line", items: ["Used for: Goal kicks; Goalkeeper possession; Free kicks.", "Opposition must drop behind the retreating line.", "They may advance only after: the goalkeeper plays the ball; and a teammate touches it.", "Coaches should encourage quick play from the goalkeeper."] },
      { key: "offside", title: "Offside", items: ["Offside applies.", "For 11th & 12th Grade: Offside cannot be given if the player is in their own half."] },
      { key: "outTouchLine", title: "Ball Out of Play – Touch Line", items: ["Throw‑ins: Both feet on or behind the line.", "Throw‑ins: Ball delivered with both hands from behind and over the head.", "Throw‑ins: Thrower cannot touch the ball again until another player does.", "Throw‑ins: Cannot score directly from a throw‑in."] },
      { key: "outGoalLine", title: "Ball Out of Play – Goal Line", items: ["Defending team last touched: Corner kick.", "Attacking team last touched: Goal kick from anywhere inside the penalty area.", "Opponents retreat to the retreating line."] },
      { key: "goalkeepersRules", title: "Goalkeepers", items: ["May handle the ball anywhere inside the penalty area.", "Must release the ball within 6 seconds.", "Must throw, roll, or play from the ground — no drop‑kicks or punts.", "Indirect free kick if the keeper handles a deliberate back‑pass."] },
      { key: "foulsMisconduct", title: "Fouls & Misconduct", items: ["Mostly indirect free kicks, except for penalties.", "Opponents must be 5m away.", "Fouls include: Kicking, tripping, jumping at, charging, striking; pushing, holding, spitting; deliberate handball; dangerous play; impeding progress."] },
      { key: "penaltyKicks", title: "Penalty kicks", items: ["Awarded for deliberate handball or serious misconduct in the penalty area.", "Taken from 8m with a goalkeeper in position."] },
      { key: "resultsLadders", title: "Match Results & Ladders", items: ["No public results, tables, or ladders.", "Results may be recorded privately to help place teams at appropriate levels."] }
    ]
  }
];

const categories = ['All', 'Rules', 'Field Setup', 'Coach Support', 'General'] as const;

export function DesktopResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Rules-specific state
  const [selectedRuleSet, setSelectedRuleSet] = useState<RuleSet>(ruleSets[0]);
  const [showRuleDropdown, setShowRuleDropdown] = useState(false);
  
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: 'General' as Resource['category'],
    description: '',
    file: null as File | null,
  });

  useEffect(() => {
    if (selectedCategory !== 'Rules') {
      fetchResources();
    } else {
      setIsLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Initial load
    if (selectedCategory !== 'Rules') {
      fetchResources();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      alert('Please provide a title and select a file');
      return;
    }

    try {
      // Upload file to Supabase Storage
      const fileExt = uploadForm.file.name.split('.').pop();
      const fileName = `${Date.now()}_${uploadForm.file.name}`;
      const filePath = `resources/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, uploadForm.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // Insert resource record
      const { error: insertError } = await supabase
        .from('resources')
        .insert({
          title: uploadForm.title,
          category: uploadForm.category,
          description: uploadForm.description || null,
          file_url: publicUrl,
          file_name: uploadForm.file.name,
          file_type: fileExt,
          file_size: uploadForm.file.size,
          created_by: user?.id,
        });

      if (insertError) throw insertError;

      // Refresh list and close modal
      await fetchResources();
      setIsUploadModalOpen(false);
      setUploadForm({
        title: '',
        category: 'General',
        description: '',
        file: null,
      });
    } catch (error) {
      console.error('Error uploading resource:', error);
      alert('Failed to upload resource. Please try again.');
    }
  };

  const handleDelete = async (resourceId: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;

    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', resourceId);

      if (error) throw error;

      await fetchResources();
      if (selectedResource?.id === resourceId) {
        setSelectedResource(null);
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory =
      selectedCategory === 'All' || resource.category === selectedCategory;
    const matchesSearch =
      searchTerm === '' ||
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getFileIcon = (fileType: string | null) => {
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resources Management</h1>
          <p className="text-gray-600 mt-1">Manage coaching resources and reference materials</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0091f3] text-white rounded-lg hover:bg-[#0081d9] transition-colors"
        >
          <Upload className="w-4 h-4" />
          Add Resource
        </button>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        {/* Resources List */}
        <div className="w-1/2 flex flex-col bg-white rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0091f3]"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedResource(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#8b5cf6] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {selectedCategory === 'Rules' ? (
              /* Rules Section - Just Age Group Selector */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Select Age Group</h3>
                <div className="relative">
                  <button
                    onClick={() => setShowRuleDropdown(!showRuleDropdown)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white rounded-lg border border-gray-300 hover:bg-purple-50 transition-colors shadow-sm"
                  >
                    <span className="text-sm font-medium text-gray-900">{selectedRuleSet.label}</span>
                    <ChevronDown className={`w-4 h-4 text-[#8b5cf6] transition-transform ${showRuleDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showRuleDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                      {ruleSets.map((ruleSet) => (
                        <button
                          key={ruleSet.id}
                          className={`block w-full text-left px-3 py-2 text-sm hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            ruleSet.id === selectedRuleSet.id ? 'bg-purple-50 text-[#8b5cf6] font-medium' : 'text-gray-700'
                          }`}
                          onClick={() => {
                            setSelectedRuleSet(ruleSet);
                            setShowRuleDropdown(false);
                          }}
                        >
                          {ruleSet.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Rules will be displayed in the right panel
                </p>
              </div>
            ) : (
              /* Regular Resources */
              <>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6]"></div>
                  </div>
                ) : filteredResources.length > 0 ? (
                  filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      onClick={() => setSelectedResource(resource)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedResource?.id === resource.id
                          ? 'border-[#8b5cf6] bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                          {getFileIcon(resource.file_type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-700 whitespace-nowrap">
                              {resource.category}
                            </span>
                          </div>
                          {resource.description && (
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          )}
                          
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{resource.file_name}</span>
                            <span>•</span>
                            <span>{formatFileSize(resource.file_size)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No resources found</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Resource Details / Rules Display */}
        <div className="w-1/2 bg-white rounded-lg shadow p-6">
          {selectedCategory === 'Rules' ? (
            /* Rules Display */
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedRuleSet.label}
                </h2>
                <p className="text-gray-600">Football rules and regulations</p>
              </div>

              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedRuleSet.sections.map((section) => (
                  <div key={section.key} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-purple-200" style={{ backgroundColor: 'rgba(139, 92, 246, 0.2)' }}>
                      <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
                    </div>
                    <div className="px-4 py-3">
                      <ul className="space-y-2">
                        {section.items.map((item, index) => (
                          <li key={index} className="flex items-start text-sm text-gray-600 leading-relaxed">
                            <span className="text-[#8b5cf6] mr-2 flex-shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selectedResource ? (
            /* Resource Details */
            <div>
              <div className="flex items-start gap-3 mb-6">
                <div className="p-3 rounded-lg bg-purple-100 text-purple-700">
                  {getFileIcon(selectedResource.file_type)}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedResource.title}
                  </h2>
                  {selectedResource.description && (
                    <p className="text-gray-600">{selectedResource.description}</p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{selectedResource.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Name:</span>
                      <span className="font-medium text-gray-900">{selectedResource.file_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">File Size:</span>
                      <span className="font-medium text-gray-900">{formatFileSize(selectedResource.file_size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uploaded:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(selectedResource.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 space-y-3">
                  <a
                    href={selectedResource.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#8b5cf6] text-white rounded-lg hover:bg-[#7c3aed] transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download / Open
                  </a>
                  
                  <button 
                    onClick={() => handleDelete(selectedResource.id)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Resource
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State */
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>
                  {selectedCategory === 'Rules' 
                    ? 'Select an age group to view football rules'
                    : 'Select a resource to view details'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Add New Resource</h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                  placeholder="e.g., U10 Field Dimensions"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={uploadForm.category}
                  onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value as Resource['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                >
                  <option value="Rules">Rules</option>
                  <option value="Field Setup">Field Setup</option>
                  <option value="Coach Support">Coach Support</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                  rows={3}
                  placeholder="Brief description of the resource"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files?.[0] || null })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Supported formats: PDF, Word, Excel, PowerPoint, Images
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="px-4 py-2 bg-[#8b5cf6] text-white rounded-lg font-medium hover:bg-[#7c3aed]"
              >
                Upload Resource
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
