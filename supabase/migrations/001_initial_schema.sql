-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE user_role AS ENUM ('player', 'caregiver', 'coach', 'manager', 'admin');
CREATE TYPE session_type AS ENUM ('technical_drill', 'skill_introduction', 'skill_development', 'game');
CREATE TYPE lesson_slot_type AS ENUM ('warmup_technical', 'skill_introduction', 'progressive_development', 'game_application');
CREATE TYPE announcement_priority AS ENUM ('high', 'normal');
CREATE TYPE announcement_audience AS ENUM ('all', 'coaches', 'managers', 'players', 'caregivers');
CREATE TYPE announcement_status AS ENUM ('draft', 'published');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    cellphone TEXT,
    role user_role NOT NULL DEFAULT 'player',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    age_group TEXT NOT NULL,
    division TEXT,
    training_ground TEXT NOT NULL,
    training_time TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User-Team assignments (many-to-many)
CREATE TABLE user_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, team_id)
);

-- Skills categories
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    UNIQUE(display_order)
);

-- Sessions (20-minute training activities)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    session_type session_type NOT NULL,
    description TEXT NOT NULL,
    setup_instructions TEXT NOT NULL,
    setup_image_url TEXT,
    video_url TEXT,
    learning_objectives JSONB NOT NULL DEFAULT '[]',
    tags JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lessons (4-session training programs)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE RESTRICT,
    version INTEGER NOT NULL DEFAULT 1,
    tags JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lesson-Session junction (exactly 4 sessions per lesson)
CREATE TABLE lesson_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
    slot_number INTEGER NOT NULL CHECK (slot_number BETWEEN 1 AND 4),
    slot_type lesson_slot_type NOT NULL,
    UNIQUE(lesson_id, slot_number)
);

-- Delivery records (lesson deliveries by coaches)
CREATE TABLE delivery_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coach_name TEXT NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    team_name TEXT NOT NULL,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    lesson_version INTEGER NOT NULL,
    delivery_date DATE NOT NULL,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    updated_at TIMESTAMPTZ,
    deleted_by UUID REFERENCES users(id) ON DELETE RESTRICT,
    deleted_at TIMESTAMPTZ
);

-- Session feedback
CREATE TABLE session_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coach_name TEXT NOT NULL,
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE RESTRICT,
    lesson_id UUID REFERENCES lessons(id) ON DELETE RESTRICT,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    delivery_date DATE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Lesson feedback
CREATE TABLE lesson_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coach_name TEXT NOT NULL,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    delivery_date DATE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 0 AND 5),
    comments TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Game feedback (4 Moments of Football)
CREATE TABLE game_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coach_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    coach_name TEXT NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    team_name TEXT NOT NULL,
    game_date DATE NOT NULL,
    attacking_www TEXT,
    attacking_ebi TEXT,
    transition_attack_defend_www TEXT,
    transition_attack_defend_ebi TEXT,
    defending_www TEXT,
    defending_ebi TEXT,
    transition_defend_attack_www TEXT,
    transition_defend_attack_ebi TEXT,
    key_areas JSONB NOT NULL DEFAULT '[]',
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    priority announcement_priority NOT NULL DEFAULT 'normal',
    audience announcement_audience NOT NULL DEFAULT 'all',
    target_teams JSONB,
    target_age_groups JSONB,
    publish_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expiration_date TIMESTAMPTZ,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    status announcement_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Player-Caregiver relationships
CREATE TABLE player_caregivers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    player_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    caregiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(player_id, caregiver_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(active);

CREATE INDEX idx_user_teams_user_id ON user_teams(user_id);
CREATE INDEX idx_user_teams_team_id ON user_teams(team_id);
CREATE INDEX idx_user_teams_default ON user_teams(user_id, is_default);

CREATE INDEX idx_sessions_skill_id ON sessions(skill_id);
CREATE INDEX idx_sessions_type ON sessions(session_type);
CREATE INDEX idx_sessions_status ON sessions(status);

CREATE INDEX idx_lessons_skill_id ON lessons(skill_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lesson_sessions_lesson_id ON lesson_sessions(lesson_id);

CREATE INDEX idx_delivery_records_coach_id ON delivery_records(coach_id);
CREATE INDEX idx_delivery_records_team_id ON delivery_records(team_id);
CREATE INDEX idx_delivery_records_date ON delivery_records(delivery_date DESC);
CREATE INDEX idx_delivery_records_lesson_id ON delivery_records(lesson_id);
CREATE INDEX idx_delivery_records_deleted ON delivery_records(deleted_at);

CREATE INDEX idx_session_feedback_session_id ON session_feedback(session_id);
CREATE INDEX idx_session_feedback_rating ON session_feedback(rating);
CREATE INDEX idx_lesson_feedback_lesson_id ON lesson_feedback(lesson_id);
CREATE INDEX idx_lesson_feedback_rating ON lesson_feedback(rating);

CREATE INDEX idx_game_feedback_team_id ON game_feedback(team_id);
CREATE INDEX idx_game_feedback_date ON game_feedback(game_date DESC);

CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_publish_date ON announcements(publish_date);
CREATE INDEX idx_announcements_expiration ON announcements(expiration_date);
CREATE INDEX idx_announcements_audience ON announcements(audience);

-- Insert initial skill categories
INSERT INTO skills (name, description, display_order) VALUES
    ('Passing and First Touch', 'Ball control and passing techniques', 1),
    ('Dribbling and Ball Control', 'Dribbling skills and close control', 2),
    ('Shooting', 'Shooting techniques and finishing', 3),
    ('Defending', 'Defensive positioning and tackling', 4),
    ('Attacking', 'Attacking movement and creativity', 5),
    ('Transitions', 'Transition play between attack and defense', 6);
