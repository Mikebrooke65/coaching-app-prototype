import { useState, useEffect } from 'react';
import { FileText, Download, ChevronDown, File } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Resource {
  id: string;
  title: string;
  category: 'Rules' | 'Field Setup' | 'Coach Support' | 'General';
  file_url: string;
  file_name: string;
  file_type: string | null;
  description: string | null;
  created_at: string;
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

// Rule sets data - imported from resources branch
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

const categories = ['Rules', 'Pitch', 'Guides', 'General'] as const;
const categoryMapping = {
  'Rules': 'Rules',
  'Pitch': 'Field Setup',
  'Guides': 'Coach Support',
  'General': 'General'
} as const;

export function Resources() {
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('Rules');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRuleSet, setSelectedRuleSet] = useState<RuleSet>(ruleSets[0]);
  const [showRuleDropdown, setShowRuleDropdown] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedCategory !== 'Rules') {
      fetchResources();
    }
  }, [selectedCategory]);

  const fetchResources = async () => {
    try {
      setIsLoading(true);
      // Map display category to database category
      const dbCategory = categoryMapping[selectedCategory];
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .eq('category', dbCategory)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-gray-50 min-h-full pb-20">
      {/* Header */}
      <div className="p-4">
        <div className="border-l-8 border-[#8b5cf6] pl-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Resources</h1>
          <p className="text-gray-600 text-sm">
            Guides for Coaches and Managers
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#8b5cf6] text-white'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4">
        {selectedCategory === 'Rules' ? (
          <div>
            {/* Rule Set Selector */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Select Age Group</h2>
              <div className="relative">
                <button
                  onClick={() => setShowRuleDropdown(!showRuleDropdown)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-xl border-2 border-[#8b5cf6] hover:bg-purple-50 transition-colors shadow-sm"
                >
                  <span className="text-lg font-semibold text-gray-900">{selectedRuleSet.label}</span>
                  <ChevronDown className={`w-6 h-6 text-[#8b5cf6] transition-transform ${showRuleDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showRuleDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border-2 border-gray-200 z-50 overflow-hidden">
                    {ruleSets.map((ruleSet) => (
                      <button
                        key={ruleSet.id}
                        className={`block w-full text-left px-5 py-4 text-base hover:bg-purple-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                          ruleSet.id === selectedRuleSet.id ? 'bg-purple-50 text-[#8b5cf6] font-semibold' : 'text-gray-700'
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
            </div>

            {/* Rule Sections */}
            <div className="space-y-4">
              {selectedRuleSet.sections.map((section) => (
                <div key={section.key} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-5 py-4 bg-[#8b5cf6] bg-opacity-20 border-b border-purple-200">
                    <h3 className="text-lg font-bold text-gray-900">{section.title}</h3>
                  </div>
                  <div className="px-5 py-4">
                    <ul className="space-y-3">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-700 leading-relaxed">
                          <span className="text-[#8b5cf6] mr-3 flex-shrink-0">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6]"></div>
              </div>
            ) : resources.length > 0 ? (
              <div className="space-y-3">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                        <File className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 mb-1">{resource.title}</h3>
                        {resource.description && (
                          <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{resource.file_name}</span>
                            <span>•</span>
                            <span>{formatFileSize(resource.file_size)}</span>
                          </div>
                          
                          <a
                            href={resource.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-[#8b5cf6] text-sm font-medium hover:underline"
                          >
                            <Download className="w-4 h-4" />
                            Open
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-100">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No resources available in this category</p>
                <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
