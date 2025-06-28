# ZipTales Website Flowchart

## 🌐 **Main User Flow Diagram**

```mermaid
flowchart TD
    A[🏠 Landing Page] --> B{User Authenticated?}
    
    B -->|No| C[👤 Guest User Experience]
    B -->|Yes| D[✅ Authenticated User Experience]
    
    %% Guest User Flow
    C --> E[📰 Browse News Articles]
    C --> F[🔍 Search Articles]
    C --> G[📂 Browse Categories]
    C --> H[ℹ️ About Page]
    C --> I[📞 Contact Page]
    C --> J[🔐 Login/Signup]
    
    %% Authentication Flow
    J --> K{Login or Signup?}
    K -->|Login| L[📧 Email/Password Login]
    K -->|Signup| M[📝 Registration Form]
    K -->|Google| N[🔗 Google OAuth]
    
    L --> O{Login Success?}
    M --> P{Signup Success?}
    N --> Q{OAuth Success?}
    
    O -->|Yes| D
    O -->|No| R[❌ Error Message]
    P -->|Yes| S[👤 Profile Setup]
    P -->|No| R
    Q -->|Yes| S
    Q -->|No| R
    
    R --> J
    S --> D
    
    %% Authenticated User Flow
    D --> T[🗳️ Vote on Articles]
    D --> U[📝 Submit News]
    D --> V[💾 Save Articles]
    D --> W[👤 Profile Management]
    D --> X[📊 Voting Dashboard]
    D --> Y[🔖 Saved Articles]
    D --> Z[🤖 AI Chatbot]
    
    %% Article Interaction Flow
    E --> AA[📖 Read Article Detail]
    T --> AA
    AA --> BB{User Authenticated?}
    BB -->|Yes| CC[👍👎 Vote on Credibility]
    BB -->|Yes| DD[💾 Save Article]
    BB -->|Yes| EE[📤 Share Article]
    BB -->|No| FF[🔐 Login Prompt]
    
    %% News Submission Flow
    U --> GG[📝 Article Submission Form]
    GG --> HH[🤖 AI Content Analysis]
    HH --> II[📊 Credibility Score Preview]
    II --> JJ[✅ Submit for Community Review]
    JJ --> KK[🏆 Reputation Points Earned]
    
    %% Voting Flow
    T --> LL[📋 Articles List]
    LL --> MM[🔍 Filter by Status]
    MM --> NN[✅ Trusted Articles]
    MM --> OO[⏳ Pending Verification]
    MM --> PP[❌ Disputed Articles]
    
    NN --> CC
    OO --> CC
    PP --> CC
    
    CC --> QQ[📈 Update Article Score]
    QQ --> RR[🏆 User Reputation Update]
    
    %% Profile Management
    W --> SS[✏️ Edit Personal Info]
    W --> TT[🎯 Select Interests]
    W --> UU[📊 View Reputation Stats]
    W --> VV[📈 Activity History]
    
    %% Chatbot Flow
    Z --> WW[💬 Chat Interface]
    WW --> XX{Query Type?}
    XX -->|Fact Check| YY[🔍 AI Content Analysis]
    XX -->|Platform Help| ZZ[ℹ️ Feature Explanation]
    XX -->|General| AAA[🤖 AI Response]
    
    YY --> BBB[📊 Credibility Assessment]
    ZZ --> CCC[📖 Help Information]
    AAA --> DDD[💬 Conversational Response]
    
    %% Category Browsing
    G --> EEE[📂 Category Selection]
    EEE --> FFF[🔬 Technology]
    EEE --> GGG[🏛️ Politics]
    EEE --> HHH[⚽ Sports]
    EEE --> III[🎬 Entertainment]
    EEE --> JJJ[🏥 Health]
    EEE --> KKK[🔬 Science]
    
    FFF --> LLL[📰 Category Articles]
    GGG --> LLL
    HHH --> LLL
    III --> LLL
    JJJ --> LLL
    KKK --> LLL
    
    LLL --> AA
    
    %% Search Flow
    F --> MMM[🔍 Search Input]
    MMM --> NNN[🔎 Real-time Results]
    NNN --> OOO[📋 Search Results List]
    OOO --> AA
    
    %% Footer Links
    H --> PPP[👥 Team Information]
    H --> QQQ[🎯 Mission & Vision]
    H --> RRR[📊 Platform Statistics]
    H --> SSS[🔧 How It Works]
    
    I --> TTT[📧 Contact Form]
    I --> UUU[❓ FAQ Section]
    I --> VVV[🐛 Report Issues]
    
    %% Legal Pages
    A --> WWW[📜 Privacy Policy]
    A --> XXX[📋 Terms of Service]
    
    style A fill:#ff6b9d,stroke:#333,stroke-width:3px,color:#fff
    style D fill:#4ecdc4,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#ffd93d,stroke:#333,stroke-width:2px,color:#333
    style J fill:#6c5ce7,stroke:#333,stroke-width:2px,color:#fff
    style Z fill:#fd79a8,stroke:#333,stroke-width:2px,color:#fff
```

## 🔄 **Authentication State Flow**

```mermaid
stateDiagram-v2
    [*] --> Guest
    Guest --> Authenticating : Login/Signup
    Authenticating --> Authenticated : Success
    Authenticating --> Guest : Failure
    Authenticated --> Guest : Logout
    Authenticated --> ProfileSetup : First Time User
    ProfileSetup --> Authenticated : Complete Setup
    
    state Guest {
        [*] --> BrowseOnly
        BrowseOnly --> ViewArticles
        BrowseOnly --> SearchNews
        BrowseOnly --> BrowseCategories
        ViewArticles --> LoginPrompt : Try to Vote/Save
        SearchNews --> LoginPrompt : Try to Vote/Save
        BrowseCategories --> LoginPrompt : Try to Vote/Save
    }
    
    state Authenticated {
        [*] --> FullAccess
        FullAccess --> VoteOnArticles
        FullAccess --> SubmitNews
        FullAccess --> SaveArticles
        FullAccess --> ManageProfile
        FullAccess --> UseChatbot
        VoteOnArticles --> EarnReputation
        SubmitNews --> EarnReputation
        EarnReputation --> UpdateUserLevel
    }
```

## 🎯 **Feature Access Matrix**

```mermaid
flowchart LR
    A[User Type] --> B[Guest User]
    A --> C[Authenticated User]
    A --> D[Verified User]
    A --> E[Expert User]
    
    B --> F[✅ Browse Articles]
    B --> G[✅ Search News]
    B --> H[✅ View Categories]
    B --> I[✅ Read About/Contact]
    B --> J[❌ Vote on Articles]
    B --> K[❌ Save Articles]
    B --> L[❌ Submit News]
    B --> M[❌ Use Full Chatbot]
    
    C --> N[✅ All Guest Features]
    C --> O[✅ Vote on Articles]
    C --> P[✅ Save Articles]
    C --> Q[✅ Submit News]
    C --> R[✅ Full Chatbot Access]
    C --> S[✅ Profile Management]
    C --> T[✅ Reputation Building]
    
    D --> U[✅ All Authenticated Features]
    D --> V[✅ Higher Vote Weight]
    D --> W[✅ Fast-track Submissions]
    
    E --> X[✅ All Verified Features]
    E --> Y[✅ Maximum Vote Weight]
    E --> Z[✅ Moderation Privileges]
```

## 📊 **Data Flow Architecture**

```mermaid
flowchart TD
    A[🌐 Frontend React App] --> B[🔐 Supabase Auth]
    A --> C[🗄️ Supabase Database]
    A --> D[🤖 AI Analysis Service]
    A --> E[💬 Chatbot Service]
    
    B --> F[👤 User Authentication]
    B --> G[🔑 Session Management]
    
    C --> H[📰 Articles Table]
    C --> I[👥 Users Table]
    C --> J[🗳️ Votes Table]
    C --> K[💾 Saved Articles Table]
    
    D --> L[📊 Credibility Scoring]
    D --> M[🔍 Content Analysis]
    
    E --> N[💬 Chat Responses]
    E --> O[🔍 Fact Checking]
    
    H --> P[📈 Real-time Updates]
    I --> Q[🏆 Reputation Tracking]
    J --> R[📊 Vote Aggregation]
    K --> S[👤 User Preferences]
    
    style A fill:#74b9ff,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#fd79a8,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#00b894,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#fdcb6e,stroke:#333,stroke-width:2px,color:#333
    style E fill:#e17055,stroke:#333,stroke-width:2px,color:#fff
```

## 🔄 **Article Lifecycle**

```mermaid
flowchart TD
    A[📝 Article Submission] --> B[🤖 AI Initial Analysis]
    B --> C[📊 Preliminary Score Generated]
    C --> D[🌐 Published to Community]
    D --> E[👥 Community Voting]
    E --> F[📈 Score Updates in Real-time]
    F --> G{Final Score?}
    
    G -->|≥70%| H[✅ Trusted Status]
    G -->|40-69%| I[⏳ Pending Verification]
    G -->|<40%| J[❌ Disputed Status]
    
    H --> K[🏆 Author Gains Reputation]
    I --> L[🔄 Continues Voting Process]
    J --> M[⚠️ Flagged for Review]
    
    L --> E
    M --> N[👨‍💼 Manual Review]
    N --> O{Review Decision?}
    O -->|Approve| H
    O -->|Reject| P[🗑️ Article Removed]
    
    style A fill:#74b9ff,stroke:#333,stroke-width:2px,color:#fff
    style H fill:#00b894,stroke:#333,stroke-width:2px,color:#fff
    style I fill:#fdcb6e,stroke:#333,stroke-width:2px,color:#333
    style J fill:#e17055,stroke:#333,stroke-width:2px,color:#fff
    style P fill:#d63031,stroke:#333,stroke-width:2px,color:#fff
```

## 🎮 **User Reputation System**

```mermaid
flowchart LR
    A[👤 New User] --> B[🆕 Newcomer - 50 pts]
    B --> C{Earn 100+ pts?}
    C -->|Yes| D[✅ Verified - 100+ pts]
    C -->|No| E[📈 Continue Building]
    
    D --> F{Earn 200+ pts?}
    F -->|Yes| G[🏆 Trusted - 200+ pts]
    F -->|No| H[📈 Continue Building]
    
    G --> I{Earn 500+ pts?}
    I -->|Yes| J[👑 Expert - 500+ pts]
    I -->|No| K[📈 Continue Building]
    
    E --> L[🎯 Actions to Earn Points]
    H --> L
    K --> L
    
    L --> M[✅ Accurate Voting +20]
    L --> N[📝 Verified Submission +30]
    L --> O[⏰ Platform Activity +10]
    L --> P[🤝 Community Help +15]
    
    L --> Q[❌ Penalties]
    Q --> R[🚫 Misinformation -40]
    Q --> S[👎 Inaccurate Voting -10]
    Q --> T[⚠️ Guideline Violation -25]
    
    style A fill:#74b9ff,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#ffd93d,stroke:#333,stroke-width:2px,color:#333
    style D fill:#00b894,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#6c5ce7,stroke:#333,stroke-width:2px,color:#fff
    style J fill:#fd79a8,stroke:#333,stroke-width:2px,color:#fff
```

---

## 📋 **Key Features Summary**

### 🔐 **Authentication Features:**
- Email/Password Login & Signup
- Google OAuth Integration
- Profile Setup for New Users
- Session Management

### 📰 **Content Features:**
- Browse Articles by Category
- Real-time Search with Suggestions
- Article Detail Views
- Community Voting System
- Save/Bookmark Articles

### 🤖 **AI Features:**
- Automated Content Analysis
- Credibility Scoring
- Intelligent Chatbot
- Fact-checking Assistance

### 👥 **Community Features:**
- User Reputation System
- Community Voting
- News Submission
- Profile Management

### 📊 **Analytics Features:**
- Real-time Score Updates
- User Activity Tracking
- Platform Statistics
- Reputation Metrics

This flowchart represents the complete user journey and technical architecture of the ZipTales platform, showing how users interact with the system from initial visit to becoming expert community members.