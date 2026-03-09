# Lesson Creation Guide
## Standard Format for All Lessons and Sessions

---

## Purpose
This document defines the EXACT format and structure for creating lessons and sessions. Follow this guide to ensure consistency across all 32 lessons (128 sessions).

---

## Lesson Structure

### Lesson Metadata
```
Title: [Engaging, descriptive title]
Age Group: [U9, U10, etc.]
Skill Category: [Tackling, Marking, Pressing, Intercepting, Dribbling, Ball Striking, 1v1, Passing/Receiving]
Level: Beginner
Total Duration: [Sum of 4 sessions, typically 60-65 minutes]
Description: [2-3 sentences describing what players will learn]
```

### Lesson Objectives (4 required)
- Use action verbs (Understand, Execute, Use, Maintain, Develop, Apply)
- Focus on learning outcomes, not activities
- Keep concise (one line each)
- Cover both technical and tactical aspects

**Example:**
```
- Understand when to tackle and when to delay
- Execute safe block tackles with correct body shape
- Use poke tackles to win the ball in tight spaces
- Maintain balance and control when defending
```

---

## Session Structure (4 Sessions per Lesson)

### Session Types and Durations
1. **Session 1: Warm-Up** (15-20 minutes)
   - Type: `warmup`
   - Focus: Movement, footwork, basic technique without pressure

2. **Session 2: Skill Introduction** (15 minutes)
   - Type: `skill_intro`
   - Focus: Teach the core technique, slow progression

3. **Session 3: Progressive Development** (15 minutes)
   - Type: `progressive`
   - Focus: Add pressure, opposition, decision-making

4. **Session 4: Game Application** (15 minutes)
   - Type: `game`
   - Focus: Apply skill in realistic game situations

---

## Session Fields (Required for Each Session)

### 1. Session Name
**Format:** `session-[descriptive-name]-[age-group]`

**Rules:**
- All lowercase
- Hyphens only (no spaces or underscores)
- Descriptive of the activity
- Must be globally unique
- Age group at the end

**Examples:**
- `session-mirror-jockey-u9`
- `session-block-tackle-intro-u9`
- `session-1v1-tackle-pressure-u9`
- `session-tackle-game-u9`

### 2. Title
- Display name for the session
- Title case
- Descriptive and engaging
- 2-5 words

**Examples:**
- "Mirror Jockey"
- "Block Tackle Introduction"
- "1v1 Tackle Under Pressure"
- "Tackle Game Application"

### 3. Organisation (How It Runs)
**Format:** 2-4 sentences describing:
1. Setup (pitch size, markings, equipment placement)
2. How players are organized
3. What happens during the activity
4. Key progressions or variations

**Use METRIC measurements (meters, not yards)**

**Example:**
```
Set up a 18x18 meter square. Players work in pairs without a ball initially. 
One player (attacker) moves around the area using changes of direction and speed. 
The partner (defender) mirrors their movement staying 2-3 meters away, maintaining 
a side-on jockey position. Switch roles every 60 seconds. Progression: Add a ball 
to the attacker.
```

### 4. Equipment (Array)
**Format:** `[Item description with quantity]`

**Rules:**
- Be specific with quantities
- Include all items needed
- Format: "Item (quantity) for purpose" OR "Item (quantity)"

**Example:**
```
ARRAY[
  'Cones (8) for square boundary',
  'Bibs (2 colors)',
  'Balls (1 per pair for progression)'
]
```

### 5. Coaching Points (Array, 5-6 points)
**Format:** Short, actionable statements

**Rules:**
- Start with action verbs or imperatives
- Keep to one line each
- Focus on technique and decision-making
- Use coaching language (what to tell players)

**Example:**
```
ARRAY[
  'Stay on your toes, knees bent',
  'Side-on body shape, never square',
  'Keep 2-3 meters distance',
  'Watch the ball, not the feet',
  'Small quick steps, don''t cross feet'
]
```

### 6. Steps (Array, 5-6 steps)
**Format:** Step-by-step instructions for running the session

**Rules:**
- Chronological order
- Include timing where relevant
- Cover setup, demonstration, practice, progressions
- Be specific about what coach does

**Example:**
```
ARRAY[
  'Demonstrate correct jockey stance: side-on, knees bent, arms out for balance',
  'Players practice jockey footwork without partner (30 seconds)',
  'Pairs begin mirroring exercise without ball (2 minutes)',
  'Switch roles (2 minutes)',
  'Add ball to attacker, defender continues jockeying (3 minutes each role)',
  'Emphasize staying patient and not diving in'
]
```

### 7. Key Objectives (Array, 3 objectives)
**Format:** Learning outcomes specific to this session

**Rules:**
- Use action verbs
- Focus on what players will learn/develop
- Keep concise (one line each)
- Different from lesson objectives (more specific)

**Example:**
```
ARRAY[
  'Master defensive stance and footwork',
  'Maintain proper distance from attacker',
  'Develop patience in defensive situations'
]
```

### 8. Pitch Layout Description
**Format:** Detailed description for image generation

**Rules:**
- Describe pitch dimensions in METERS
- Specify player positions and bib colors
- Describe markings (cones, goals, lines)
- Mention movement patterns
- Include who has the ball

**Example:**
```
18x18 meter square marked with cones at corners. Pairs spread throughout the area. 
Attacker (orange bib) moves freely within square. Defender (blue bib) mirrors 
movement staying 2-3 meters away, maintaining side-on position. Arrows show 
attacker's random movement patterns and defender's mirroring response.
```

---

## Complete Session Example

```sql
INSERT INTO sessions (
  session_name,
  age_group,
  session_type,
  duration,
  title,
  organisation,
  equipment,
  coaching_points,
  steps,
  key_objectives,
  pitch_layout_description
) VALUES (
  'session-mirror-jockey-u9',
  'U9',
  'warmup',
  20,
  'Mirror Jockey',
  'Set up a 18x18 meter square. Players work in pairs without a ball initially. One player (attacker) moves around the area using changes of direction and speed. The partner (defender) mirrors their movement staying 2-3 meters away, maintaining a side-on jockey position. Switch roles every 60 seconds. Progression: Add a ball to the attacker.',
  ARRAY['Cones (8) for square boundary', 'Bibs (2 colors)', 'Balls (1 per pair for progression)'],
  ARRAY['Stay on your toes, knees bent', 'Side-on body shape, never square', 'Keep 2-3 meters distance', 'Watch the ball, not the feet', 'Small quick steps, don''t cross feet'],
  ARRAY['Demonstrate correct jockey stance: side-on, knees bent, arms out for balance', 'Players practice jockey footwork without partner (30 seconds)', 'Pairs begin mirroring exercise without ball (2 minutes)', 'Switch roles (2 minutes)', 'Add ball to attacker, defender continues jockeying (3 minutes each role)', 'Emphasize staying patient and not diving in'],
  ARRAY['Master defensive stance and footwork', 'Maintain proper distance from attacker', 'Develop patience in defensive situations'],
  '18x18 meter square marked with cones at corners. Pairs spread throughout the area. Attacker (orange bib) moves freely within square. Defender (blue bib) mirrors movement staying 2-3 meters away, maintaining side-on position. Arrows show attacker''s random movement patterns and defender''s mirroring response.'
);
```

---

## Complete Lesson Example

```sql
INSERT INTO lessons (
  title,
  description,
  age_group,
  skill_category,
  level,
  session_1_id,
  session_2_id,
  session_3_id,
  session_4_id,
  total_duration,
  objectives,
  coaching_focus
)
SELECT
  'Win It Safely: Block & Poke',
  'Players learn how to regain possession safely by using correct body shape, controlled close-down, and choosing the right moment to block tackle or poke the ball away instead of diving in.',
  'U9',
  'Tackling',
  'Beginner',
  (SELECT id FROM sessions WHERE session_name = 'session-mirror-jockey-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-block-tackle-intro-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-1v1-tackle-pressure-u9'),
  (SELECT id FROM sessions WHERE session_name = 'session-tackle-game-u9'),
  65,
  ARRAY['Understand when to tackle and when to delay', 'Execute safe block tackles with correct body shape', 'Use poke tackles to win the ball in tight spaces', 'Maintain balance and control when defending'],
  ARRAY['Safety first - no diving in', 'Side-on body shape', 'Timing over aggression', 'Stay on your feet'];
```

---

## Checklist for Each Session

Before creating a session, verify:

- [ ] Session name follows format: `session-[name]-[age]`
- [ ] Session name is globally unique
- [ ] Title is descriptive and engaging (2-5 words)
- [ ] Organisation uses METRIC measurements
- [ ] Organisation is 2-4 sentences
- [ ] Equipment list has specific quantities
- [ ] 5-6 coaching points (short, actionable)
- [ ] 5-6 steps (chronological, specific)
- [ ] 3 key objectives (learning outcomes)
- [ ] Pitch layout description is detailed
- [ ] Pitch layout specifies who has the ball
- [ ] Duration is appropriate for session type

---

## Checklist for Each Lesson

Before creating a lesson, verify:

- [ ] Title is engaging and descriptive
- [ ] Description is 2-3 sentences
- [ ] Age group is specified (U9, U10, etc.)
- [ ] Skill category is correct
- [ ] Level is set (typically Beginner)
- [ ] 4 lesson objectives (action verbs, concise)
- [ ] 4 sessions created first (with unique names)
- [ ] Session 1 is warmup type
- [ ] Session 2 is skill_intro type
- [ ] Session 3 is progressive type
- [ ] Session 4 is game type
- [ ] Total duration = sum of 4 sessions
- [ ] Coaching focus points are included

---

## Common Mistakes to Avoid

❌ **DON'T:**
- Use yards (use meters)
- Use imperial measurements
- Make session names too generic
- Forget to specify who has the ball
- Use vague coaching points
- Skip the steps section
- Make organisation too long or too short
- Forget equipment quantities

✅ **DO:**
- Use metric measurements (meters)
- Make session names descriptive and unique
- Specify ball possession clearly
- Use actionable coaching language
- Provide clear step-by-step instructions
- Keep organisation concise but complete
- Include specific equipment quantities
- Follow the exact format shown

---

## Workflow for Creating a New Lesson

### Step 1: Plan the Lesson
1. Choose skill category and age group
2. Define 4 lesson objectives
3. Outline the progression across 4 sessions

### Step 2: Create 4 Sessions
For each session:
1. Choose unique session name
2. Write title
3. Write organisation (2-4 sentences, metric)
4. List equipment with quantities
5. Write 5-6 coaching points
6. Write 5-6 steps
7. Write 3 key objectives
8. Write pitch layout description

### Step 3: Create the Lesson
1. Write lesson title and description
2. Reference the 4 session names
3. Calculate total duration
4. Verify all fields are complete

### Step 4: Create SQL Migration File
1. Create file: `supabase/migrations/0XX_[skill]-[age]-lesson-0X.sql`
2. Include all 4 session INSERT statements
3. Include lesson INSERT statement
4. Save file

### Step 5: Create Image Prompts File
1. Create file: `[AGE]-[SKILL]-IMAGE-PROMPTS.md` (e.g., `U9-TACKLING-IMAGE-PROMPTS.md`)
2. Follow IMAGE-PROMPT-GUIDELINES.md format
3. Create 4 prompts (one per session) with:
   - Opening: "Create a football (soccer) coaching pitch diagram from top-down view"
   - Pitch dimensions in METERS
   - Player positions with bib colors (orange/blue)
   - WHO HAS THE BALL clearly stated
   - "football (soccer ball)" terminology
   - Movement arrows described
   - Technical specs closing paragraph
4. Include filename, storage path, and database update SQL
5. Save file

### Step 6: Generate and Upload Images (Later)
1. Use prompts from Step 5 with AI image generator
2. Download generated images
3. Rename to match session names
4. Upload to Supabase Storage
5. Run SQL to update diagram_url fields

---

## Reference Files

- **This guide:** LESSON-CREATION-GUIDE.md (lesson/session content structure)
- **Image prompts:** IMAGE-PROMPT-GUIDELINES.md (detailed image generation rules)
- **Architecture:** LESSON-SYSTEM-ARCHITECTURE.md (database schema and system design)
- **Example lesson:** lessons/U9-Tackling-Lesson-01.md (complete working example)
- **Database schema:** supabase/migrations/010_refactor_lessons_sessions.sql (actual SQL)

**Note:** When creating lessons, you'll use BOTH this guide (for content) AND IMAGE-PROMPT-GUIDELINES.md (for images).

---

## Questions?

If you're unsure about any format:
1. Check the U9 Tackling Lesson 01 example
2. Review this guide
3. Verify against the database schema
4. Ask for clarification before creating 31 more lessons!

---

## Deliverables for Each Lesson

When creating a new lesson, you will produce TWO files:

### 1. SQL Migration File
**Filename:** `supabase/migrations/0XX_[skill]-[age]-lesson-0X.sql`

**Example:** `supabase/migrations/012_tackling-u9-lesson-02.sql`

**Contains:**
- 4 session INSERT statements
- 1 lesson INSERT statement
- Comments for clarity

### 2. Image Prompts File
**Filename:** `[AGE]-[SKILL]-IMAGE-PROMPTS.md`

**Example:** `U9-TACKLING-IMAGE-PROMPTS.md`

**Contains:**
- 4 complete image generation prompts
- Filename and storage path for each image
- Database update SQL
- Generation checklist
- Post-generation instructions

**See U9-TACKLING-IMAGE-PROMPTS.md for the exact format to follow**

---

## Version History

- **v1.0** - Initial guide created (March 9, 2026)
- Based on U9 Tackling Lesson 01 format
- Captures all required fields and formats
- Includes complete examples and checklists
