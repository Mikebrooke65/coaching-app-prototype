# West Coast Rangers Coaching App - Visual Diagrams

## 1. User Roles and Relationships

```mermaid
graph TB
    Admin[Admin<br/>Desktop + Mobile]
    Coach[Coach<br/>Mobile Only]
    Manager[Manager<br/>Mobile Only]
    Player[Player<br/>Mobile Only]
    Caregiver[Caregiver<br/>Mobile Only]
    Team[Team]
    
    Admin -.->|can also be| Coach
    Coach -->|assigned to| Team
    Manager -->|assigned to| Team
    Player -->|member of| Team
    Caregiver -->|linked to| Player
    
    style Admin fill:#e1f5ff
    style Coach fill:#fff4e1
    style Manager fill:#fff4e1
    style Player fill:#e8f5e9
    style Caregiver fill:#e8f5e9
    style Team fill:#f3e5f5
```

## 2. Session and Lesson Structure

```mermaid
graph LR
    subgraph "Session Repository"
        S1[Session 1<br/>20 min<br/>Dribbling]
        S2[Session 2<br/>20 min<br/>Passing]
        S3[Session 3<br/>20 min<br/>Shooting]
        S4[Session 4<br/>20 min<br/>Defending]
        S5[Session 5<br/>20 min<br/>Transitions]
        Sn[... more sessions]
    end
    
    subgraph "Lesson = 1 Hour"
        L1[Session A<br/>20 min]
        L2[Session B<br/>20 min]
        L3[Session C<br/>20 min]
    end
    
    S1 -.->|Admin selects| L1
    S3 -.->|Admin selects| L2
    S5 -.->|Admin selects| L3
    
    L1 --> Lesson[Complete Lesson<br/>60 minutes]
    L2 --> Lesson
    L3 --> Lesson
    
    style Lesson fill:#4caf50,color:#fff
```

## 3. Session Plan Components

```mermaid
graph TB
    Session[Session Plan<br/>20 minutes]
    
    Session --> Skill[Skill Category<br/>e.g., Passing]
    Session --> Title[Session Title]
    Session --> Desc[Description]
    Session --> Setup[Setup Explanation]
    Session --> Drawing[Setup Drawing<br/>Image]
    Session --> Video[Demo Video<br/>Optional]
    Session --> Objectives[5 Key Learning<br/>Objectives]
    
    style Session fill:#2196f3,color:#fff
    style Skill fill:#ff9800
    style Drawing fill:#9c27b0,color:#fff
    style Video fill:#9c27b0,color:#fff
```

## 4. Mobile App Structure (4 Main Areas)

```mermaid
graph TB
    App[Mobile App]
    
    App --> Landing[1. Landing Page<br/>Welcome & Announcements]
    App --> Lessons[2. Lessons Area<br/>Browse & Deliver]
    App --> Games[3. Games Area<br/>Match Feedback]
    App --> Resources[4. Resources Area<br/>Coaching Info]
    
    Landing --> Welcome[Welcome Text]
    Landing --> TeamAnnounce[Team Announcements<br/>7-day auto-expire]
    
    Lessons --> Browse[Browse by Skill]
    Lessons --> History[Past Lessons]
    Lessons --> Deliver[Deliver Lesson]
    Lessons --> Feedback[Rate Sessions/Lessons]
    
    Games --> Moments[4 Moments Framework]
    Games --> KeyAreas[Identify Key Areas]
    
    Resources --> Articles[How-To Articles]
    Resources --> Reference[Pitch Sizes, etc.]
    
    style App fill:#1976d2,color:#fff
    style Landing fill:#4caf50,color:#fff
    style Lessons fill:#ff9800,color:#fff
    style Games fill:#f44336,color:#fff
    style Resources fill:#9c27b0,color:#fff
```

## 5. Game Feedback - 4 Moments of Football

```mermaid
graph TB
    Start[Start Game Feedback]
    
    Start --> M1[Moment 1:<br/>Attacking]
    M1 --> WWW1[What Went Well?]
    M1 --> EBI1[Even Better If?]
    
    WWW1 --> M2[Moment 2:<br/>Attacking to Defending<br/>Transition]
    EBI1 --> M2
    M2 --> WWW2[What Went Well?]
    M2 --> EBI2[Even Better If?]
    
    WWW2 --> M3[Moment 3:<br/>Defending]
    EBI2 --> M3
    M3 --> WWW3[What Went Well?]
    M3 --> EBI3[Even Better If?]
    
    WWW3 --> M4[Moment 4:<br/>Defending to Attacking<br/>Transition]
    EBI3 --> M4
    M4 --> WWW4[What Went Well?]
    M4 --> EBI4[Even Better If?]
    
    WWW4 --> KeyAreas[Identify 2-3<br/>Key Areas to Work On]
    EBI4 --> KeyAreas
    
    KeyAreas --> Complete[Complete Feedback]
    
    style Start fill:#4caf50,color:#fff
    style M1 fill:#ff9800,color:#fff
    style M2 fill:#2196f3,color:#fff
    style M3 fill:#f44336,color:#fff
    style M4 fill:#9c27b0,color:#fff
    style Complete fill:#4caf50,color:#fff
```

## 6. Coach Workflow - Selecting a Lesson

```mermaid
graph TB
    Start[Coach Opens App<br/>Day Before Practice]
    
    Start --> LessonsArea[Go to Lessons Area]
    
    LessonsArea --> Decision{How to Choose?}
    
    Decision -->|Path A| History[Review Past Lessons]
    History --> NextLesson[Select Next<br/>Logical Lesson]
    
    Decision -->|Path B| AI[Tap AI Coach Button]
    AI --> Voice[Speak Team Issues<br/>Voice Input]
    Voice --> Suggestions[AI Suggests<br/>1-3 Lessons]
    Suggestions --> Preview[Preview Lessons]
    Preview --> Select[Select Lesson]
    
    NextLesson --> Deliver[Deliver Lesson<br/>at Practice]
    Select --> Deliver
    
    Deliver --> Record[Record Delivery]
    Record --> Feedback[Optional: Rate<br/>Sessions/Lesson]
    
    style Start fill:#4caf50,color:#fff
    style AI fill:#9c27b0,color:#fff
    style Deliver fill:#ff9800,color:#fff
```

## 7. Admin Desktop Site Functions

```mermaid
graph TB
    AdminSite[Admin Desktop Site]
    
    AdminSite --> Content[Content Management]
    AdminSite --> Users[User Management]
    AdminSite --> Reports[Reporting]
    
    Content --> Sessions[Create/Edit Sessions]
    Content --> Lessons[Build Lessons<br/>Select 3 Sessions]
    Content --> Resources[Manage Resources]
    Content --> Announcements[Team Announcements]
    
    Users --> CreateUsers[Create Users<br/>5 Role Types]
    Users --> Teams[Manage Teams]
    Users --> Players[Manage Players]
    Users --> Caregivers[Link Caregivers]
    
    Reports --> Delivery[Lesson Deliveries]
    Reports --> GameFeedback[Game Feedback]
    Reports --> CoachActivity[Coach Activity]
    Reports --> TeamHistory[Team History]
    Reports --> Popularity[Session Popularity]
    
    style AdminSite fill:#1976d2,color:#fff
    style Content fill:#4caf50,color:#fff
    style Users fill:#ff9800,color:#fff
    style Reports fill:#9c27b0,color:#fff
```

## 8. Data Relationships

```mermaid
erDiagram
    ADMIN ||--o{ COACH : "can also be"
    COACH ||--o{ TEAM : "assigned to"
    MANAGER ||--o{ TEAM : "assigned to"
    PLAYER ||--o{ TEAM : "member of"
    PLAYER ||--o{ CAREGIVER : "linked to"
    CAREGIVER ||--o{ PLAYER : "linked to"
    
    SESSION_PLAN ||--o{ LESSON : "3 per lesson"
    LESSON ||--o{ DELIVERY_RECORD : "delivered"
    COACH ||--o{ DELIVERY_RECORD : "delivers"
    TEAM ||--o{ DELIVERY_RECORD : "receives"
    
    COACH ||--o{ GAME_FEEDBACK : "submits"
    TEAM ||--o{ GAME_FEEDBACK : "about"
    
    ADMIN {
        string name
        string email
        boolean isCoach
    }
    
    COACH {
        string name
        string email
    }
    
    PLAYER {
        string name
        date dateOfBirth
    }
    
    CAREGIVER {
        string name
        string email
    }
    
    SESSION_PLAN {
        string title
        string skill
        int duration
    }
    
    LESSON {
        string name
        string skill
        int version
    }
```

---

## How to Use These Diagrams

1. **View in Markdown Preview**: Open this file in a markdown viewer that supports Mermaid diagrams
2. **Copy to Presentation**: Copy individual diagrams into PowerPoint, Google Slides, or other presentation tools
3. **Online Rendering**: Use https://mermaid.live to render and export as PNG/SVG
4. **Print**: Print this document for reference during your meeting

## Key Points to Emphasize

### Session & Lesson Structure
- **Reusable Building Blocks**: Sessions are 20-minute activities stored in a repository
- **Flexible Composition**: Admins build 1-hour lessons by selecting any 3 sessions
- **Easy Updates**: Change a session once, updates everywhere it's used

### 4 Moments Framework
- **Structured Analysis**: Coaches analyze games systematically
- **Actionable Insights**: WWW/EBI format provides clear feedback
- **AI-Ready**: Structured data enables future AI recommendations

### User Roles
- **Clear Separation**: Each role has specific permissions and access
- **Flexible Relationships**: Many-to-many supports real-world scenarios
- **Family Engagement**: Players and caregivers included from Version 1
