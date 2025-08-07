# ZipTales - Breaking News, Not Trust

A decentralized news platform that combines blockchain verification with community-driven credibility scoring to combat misinformation and promote trustworthy journalism.

## ✨ Features

### 🔖 Bookmarks
- **Save Articles**: Click the bookmark icon on any article to save it for later
- **Personal Library**: Access all your saved articles from the "Saved" page
- **Easy Management**: Remove articles from your saved list with one click
- **Persistent Storage**: Your bookmarks are stored securely in your account

### 📰 Topic Following
- **Follow Topics**: Click the heart icon on article tags or categories to follow topics
- **Personalized Feed**: View articles from your followed topics on the "Following" page
- **Smart Filtering**: Articles are matched by both tags and categories
- **Visual Feedback**: Heart icons show which topics you're currently following

### 🔔 Notifications (Optional)
- **Real-time Updates**: Get notified when new articles are published under followed topics
- **Toast Notifications**: Elegant in-app notifications that auto-dismiss
- **Notification Center**: Click the bell icon to view all notifications
- **Smart Filtering**: Only receive notifications for topics you actually follow

### 🏆 Core Features
- **Blockchain Verification**: Immutable proof of article authenticity
- **Community Voting**: Vote on article credibility (upvote/downvote)
- **AI-Powered Analysis**: Automated credibility scoring using Google AI
- **Multi-Source Verification**: Cross-reference information across sources
- **User Reputation System**: Build credibility through quality contributions
- **Real-time Updates**: Live credibility scores and voting results

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Google AI API key (optional, for AI analysis)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ziptales.git
   cd ziptales
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_API_KEY=your_google_ai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 How to Use

### Bookmarking Articles
1. Browse articles on the home page
2. Click the bookmark icon (📖) on any article card
3. The icon will change to a filled bookmark (📖✅) to indicate it's saved
4. Access your saved articles from the "Saved" page in the navigation

### Following Topics
1. Look for heart icons (❤️) next to article tags or categories
2. Click the heart to follow a topic
3. The heart will fill in (❤️) to show you're following that topic
4. Visit the "Following" page to see articles from your followed topics
5. Click the filled heart to unfollow a topic

### Managing Notifications
1. When you follow topics, you'll automatically receive notifications for new articles
2. Click the bell icon (🔔) in the top-right corner to view notifications
3. Notifications auto-dismiss after 5 seconds
4. Use the notification center to manage all your notifications

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Blockchain**: Ethereum (for article verification)
- **AI**: Google AI (Gemini Pro) for content analysis
- **Icons**: Lucide React
- **Routing**: React Router DOM

## 📊 Database Schema

### Core Tables
- `users` - User profiles and authentication
- `articles` - News articles with metadata
- `votes` - Community voting on articles
- `saved_articles` - User bookmarks
- `followed_topics` - User topic preferences

### Key Features
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates
- Optimized indexes for performance
- Automatic timestamps and UUIDs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Supabase for the excellent backend platform
- Google AI for content analysis capabilities
- The React and TypeScript communities
- All contributors and beta testers

---

**ZipTales** - Where news meets trust, one article at a time. 🌟