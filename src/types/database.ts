// User roles enum
export enum UserRole {
  PLAYER = 'player',
  CAREGIVER = 'caregiver',
  COACH = 'coach',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

// User model
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  cellphone: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  last_login?: string;
}

// Team model
export interface Team {
  id: string;
  name: string;
  age_group: string;
  division?: string;
  training_ground: string;
  training_time: string;
  game_players?: number;
  half_duration?: number;
  created_at: string;
}

// User team assignment
export interface UserTeam {
  id: string;
  user_id: string;
  team_id: string;
  is_default: boolean;
  created_at: string;
}

// User profile with team assignments
export interface UserProfile extends User {
  teams: (UserTeam & { team: Team })[];
  defaultTeam?: Team;
}

// Skill category
export interface Skill {
  id: string;
  name: string;
  description: string;
  display_order: number;
}

// Session types enum
export enum SessionType {
  TECHNICAL_DRILL = 'technical_drill',
  SKILL_INTRODUCTION = 'skill_introduction',
  SKILL_DEVELOPMENT = 'skill_development',
  GAME = 'game',
}

// Session tags
export interface SessionTags {
  ageGroups: string[];
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
  funLevel: number;
  duration: number;
}

// Session model
export interface Session {
  id: string;
  name: string;
  skill_id: string;
  session_type: SessionType;
  description: string;
  setup_instructions: string;
  setup_image_url?: string;
  video_url?: string;
  learning_objectives: string[];
  tags: SessionTags;
  created_at: string;
  updated_at: string;
}

// Lesson slot types
export enum LessonSlotType {
  WARMUP_TECHNICAL = 'warmup_technical',
  SKILL_INTRODUCTION = 'skill_introduction',
  PROGRESSIVE_DEVELOPMENT = 'progressive_development',
  GAME_APPLICATION = 'game_application',
}

// Lesson tags
export interface LessonTags {
  ageGroups: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  focusAreas: string[];
}

// Lesson model
export interface Lesson {
  id: string;
  name: string;
  skill_id: string;
  version: number;
  tags: LessonTags;
  total_duration: number;
  created_at: string;
  updated_at: string;
}

// Lesson session slot
export interface LessonSession {
  id: string;
  lesson_id: string;
  session_id: string;
  slot_number: number;
  slot_type: LessonSlotType;
}

// Delivery record
export interface DeliveryRecord {
  id: string;
  coach_id: string;
  coach_name: string;
  team_id: string;
  team_name: string;
  lesson_id: string;
  lesson_version: number;
  delivery_date: string;
  notes?: string;
  created_by: string;
  created_at: string;
  updated_by?: string;
  updated_at?: string;
  deleted_by?: string;
  deleted_at?: string;
}

// Session feedback
export interface SessionFeedback {
  id: string;
  coach_id: string;
  coach_name: string;
  session_id: string;
  lesson_id: string;
  team_id: string;
  delivery_date: string;
  rating: number;
  comments?: string;
  created_at: string;
}

// Lesson feedback
export interface LessonFeedback {
  id: string;
  coach_id: string;
  coach_name: string;
  lesson_id: string;
  team_id: string;
  delivery_date: string;
  rating: number;
  comments?: string;
  created_at: string;
}

// Game feedback moment
export interface MomentFeedback {
  www: string;
  ebi: string;
}

// Four moments structure
export interface FourMoments {
  attacking: MomentFeedback;
  transitionAttackDefend: MomentFeedback;
  defending: MomentFeedback;
  transitionDefendAttack: MomentFeedback;
}

// Game feedback
export interface GameFeedback {
  id: string;
  coach_id: string;
  coach_name: string;
  team_id: string;
  team_name: string;
  game_date: string;
  attacking_www: string;
  attacking_ebi: string;
  transition_attack_defend_www: string;
  transition_attack_defend_ebi: string;
  defending_www: string;
  defending_ebi: string;
  transition_defend_attack_www: string;
  transition_defend_attack_ebi: string;
  key_areas: string[];
  created_by: string;
  created_at: string;
}

// Announcement enums
export enum AnnouncementPriority {
  HIGH = 'high',
  NORMAL = 'normal',
}

export enum AnnouncementAudience {
  ALL = 'all',
  COACHES = 'coaches',
  MANAGERS = 'managers',
  PLAYERS = 'players',
  CAREGIVERS = 'caregivers',
}

export enum AnnouncementStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

// Announcement model
export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  priority: AnnouncementPriority;
  audience: AnnouncementAudience;
  target_teams?: string[];
  target_age_groups?: string[];
  publish_date: string;
  expiration_date?: string;
  is_pinned: boolean;
  status: AnnouncementStatus;
  created_at: string;
}

// Player-Caregiver relationship
export interface PlayerCaregiver {
  id: string;
  player_id: string;
  caregiver_id: string;
  created_at: string;
}

// Team member
export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'player' | 'coach';
  created_at: string;
  updated_at: string;
}

// Game model
export interface Game {
  id: string;
  team_id: string;
  opponent: string;
  game_date: string;
  venue: string;
  home_away: 'home' | 'away';
  status: 'scheduled' | 'completed' | 'cancelled';
  team_score?: number;
  opponent_score?: number;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Game feedback model
export interface GameFeedbackRecord {
  id: string;
  game_id: string;
  team_id: string;
  feedback_type: 'team' | 'player';
  player_id?: string;
  feedback_text: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by?: string;
}

// Event model
export interface Event {
  id: string;
  title: string;
  event_type: 'game' | 'training' | 'general';
  event_date: string;
  location: string;
  opponent?: string;
  home_away?: 'home' | 'away';
  team_score?: number;
  opponent_score?: number;
  target_teams: string[];
  target_roles: string[];
  target_divisions: string[];
  target_age_groups: string[];
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Event RSVP model
export interface EventRsvp {
  id: string;
  event_id: string;
  user_id: string;
  status: 'going' | 'not_going' | 'maybe' | 'no_response';
  responded_at: string | null;
  decline_reason: 'late' | 'sick' | 'injured' | 'holiday' | 'other' | null;
  created_at: string;
  updated_at: string;
}

// Event attendance record
export interface EventAttendance {
  id: string;
  event_id: string;
  user_id: string | null;
  guest_name: string | null;
  attended: boolean;
  recorded_at: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Game time record
export interface GameTime {
  id: string;
  event_id: string;
  kick_off_time: string | null;
  second_half_start_time: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Substitution event record
export interface SubstitutionEvent {
  id: string;
  event_id: string;
  player_off_id: string | null;
  player_off_guest_name: string | null;
  player_on_id: string | null;
  player_on_guest_name: string | null;
  game_minute: number;
  half: 1 | 2;
  strategy_used: 'random' | 'coach';
  recorded_at: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  updated_by?: string;
}

// Squad member (joined view for Subs page)
export interface SquadMember {
  id: string;
  user_id: string | null;
  guest_name: string | null;
  display_name: string;
  attended: boolean;
  is_guest: boolean;
  rsvp_status?: 'going' | 'not_going' | 'maybe' | 'no_response';
}

// Messaging targeting types
export type MessageTargetingType = 'individual' | 'whole_team' | 'management_team' | 'club_admin';

export interface Message {
  id: string;
  sender_id: string;
  team_id: string;
  parent_message_id: string | null;
  title: string;
  body: string;
  created_at: string;
}

export interface MessageRecipient {
  id: string;
  message_id: string;
  targeting_type: MessageTargetingType;
  recipient_user_ids: string[];
  notification_pending: boolean;
}

export interface MessageReadReceipt {
  id: string;
  message_id: string;
  user_id: string;
  read_at: string;
}

export interface MessageReaction {
  id: string;
  message_id: string;
  user_id: string;
  emoji: string;
  created_at: string;
}

export interface MessageArchive {
  id: string;
  message_id: string;
  user_id: string;
  archived_at: string;
}

export interface DeviceToken {
  id: string;
  user_id: string;
  device_token: string;
  platform: 'web' | 'android' | 'ios';
  created_at: string;
}

// Composed view types for UI
export interface Thread {
  message: Message;
  sender: { first_name: string; last_name: string };
  recipient: MessageRecipient;
  reply_count: number;
  last_activity: string;
  read_count: number;
  total_recipients: number;
  is_read: boolean;
  is_archived: boolean;
  reactions: ReactionGroup[];
}

export interface ThreadDetail {
  thread: Thread;
  replies: (Message & { sender: { first_name: string; last_name: string }; reactions: ReactionGroup[] })[];
}

export interface ReactionGroup {
  emoji: string;
  count: number;
  user_ids: string[];
}

export interface CreateMessagePayload {
  team_id: string;
  targeting_type: MessageTargetingType;
  title: string;
  body: string;
  individual_user_id?: string;
}

export interface CreateReplyPayload {
  body: string;
}

export interface SearchResult {
  thread: Thread;
  match_context: string;
  is_archived: boolean;
}
