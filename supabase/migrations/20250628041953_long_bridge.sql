/*
  # Initial Schema for ZipTales

  1. New Tables
    - `users`
      - `id` (uuid, primary key) 
      - `email` (text, unique)
      - `name` (text)
      - `avatar_url` (text, optional)
      - `reputation` (integer, default 50)
      - `interests` (text array)
      - `bio` (text, optional)
      - `location` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `articles`
      - `id` (uuid, primary key)
      - `title` (text)
      - `summary` (text)
      - `content` (text)
      - `author` (text)
      - `source` (text)
      - `published_at` (timestamp)
      - `image_url` (text, optional)
      - `category` (text)
      - `credibility_score` (integer, default 50)
      - `upvotes` (integer, default 0)
      - `downvotes` (integer, default 0)
      - `tags` (text array)
      - `location` (text, optional)
      - `verified` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `votes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `article_id` (uuid, foreign key)
      - `vote_type` (text: 'up' or 'down')
      - `created_at` (timestamp)
    
    - `saved_articles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key)
      - `article_id` (uuid, foreign key)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add policies for public read access to articles
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  reputation integer DEFAULT 50,
  interests text[] DEFAULT '{}',
  bio text DEFAULT '',
  location text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  source text NOT NULL,
  published_at timestamptz DEFAULT now(),
  image_url text,
  category text NOT NULL,
  credibility_score integer DEFAULT 50,
  upvotes integer DEFAULT 0,
  downvotes integer DEFAULT 0,
  tags text[] DEFAULT '{}',
  location text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  vote_type text CHECK (vote_type IN ('up', 'down')) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Create saved_articles table
CREATE TABLE IF NOT EXISTS saved_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  article_id uuid REFERENCES articles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, article_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_articles ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Articles policies
CREATE POLICY "Anyone can read articles"
  ON articles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert articles"
  ON articles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update articles"
  ON articles
  FOR UPDATE
  TO authenticated
  USING (true);

-- Votes policies
CREATE POLICY "Users can read all votes"
  ON votes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own votes"
  ON votes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own votes"
  ON votes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own votes"
  ON votes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Saved articles policies
CREATE POLICY "Users can read own saved articles"
  ON saved_articles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own saved articles"
  ON saved_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved articles"
  ON saved_articles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_credibility_score ON articles(credibility_score DESC);
CREATE INDEX IF NOT EXISTS idx_votes_article_id ON votes(article_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON votes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_articles_user_id ON saved_articles(user_id);

-- Insert sample articles
INSERT INTO articles (title, summary, content, author, source, category, credibility_score, upvotes, downvotes, tags, location, verified, image_url) VALUES
(
  'AI Technology Breakthrough in Medical Diagnosis',
  'Researchers develop new AI system that can detect diseases with 95% accuracy, potentially revolutionizing healthcare diagnostics.',
  'A groundbreaking AI system developed by researchers at leading universities has achieved remarkable accuracy in medical diagnosis. The system, which uses advanced machine learning algorithms, can analyze medical images and patient data to detect various diseases with unprecedented precision.

The research team, led by Dr. Sarah Johnson from Stanford University, spent three years developing this revolutionary technology. The AI system was trained on millions of medical records and imaging data from hospitals worldwide.

"This breakthrough could transform how we approach medical diagnosis," said Dr. Johnson. "The system can identify patterns that human doctors might miss, potentially saving countless lives through early detection."

The technology has been tested in clinical trials across multiple hospitals, showing consistent results that exceed current diagnostic methods. The system is particularly effective in detecting cancer, cardiovascular diseases, and neurological conditions.

However, medical experts emphasize that this AI system is designed to assist doctors, not replace them. The technology will serve as a powerful tool to enhance medical decision-making and improve patient outcomes.

The research has been published in the prestigious Journal of Medical AI and has received funding from major healthcare organizations for further development and implementation.',
  'Dr. Sarah Johnson',
  'TechMed Today',
  'Technology',
  85,
  142,
  8,
  ARRAY['AI', 'Healthcare', 'Technology'],
  'Stanford, CA',
  true,
  'https://images.pexels.com/photos/3825581/pexels-photo-3825581.jpeg'
),
(
  'Climate Change Summit Reaches Historic Agreement',
  'World leaders agree on ambitious carbon reduction targets, marking a significant step in global climate action.',
  'In a historic moment for environmental policy, world leaders have reached a comprehensive agreement at the Global Climate Summit in Geneva. The agreement includes ambitious carbon reduction targets and substantial funding for renewable energy initiatives.

The summit, attended by representatives from 195 countries, concluded after intense negotiations that lasted three days. The final agreement commits participating nations to reduce carbon emissions by 50% by 2030 and achieve net-zero emissions by 2050.

"This is a turning point in our fight against climate change," said UN Secretary-General António Guterres. "The commitments made today represent the most ambitious climate action plan in history."

Key provisions of the agreement include:
- $500 billion in funding for renewable energy projects
- Mandatory carbon pricing mechanisms
- Protection of 30% of global land and ocean areas
- Technology transfer to developing nations
- Annual progress reviews and accountability measures

Environmental groups have praised the agreement while noting that implementation will be crucial. "The real test begins now," said Greenpeace International Director Jennifer Morgan. "We need to see these commitments translated into concrete action."

The agreement will be formally signed by all participating nations within the next six months, with implementation beginning immediately.',
  'Michael Chen',
  'Global News Network',
  'Politics',
  78,
  89,
  12,
  ARRAY['Climate', 'Politics', 'Environment'],
  'Geneva, Switzerland',
  true,
  'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg'
),
(
  'Controversial Social Media Policy Changes',
  'Major platform announces significant changes to content moderation policies, sparking debate among users and experts.',
  'The announcement has generated mixed reactions from users, privacy advocates, and industry experts. The new policies include stricter content moderation guidelines and enhanced user verification processes.

Critics argue that the changes could impact free speech, while supporters believe they will help combat misinformation and improve platform safety. The company has stated that the changes are necessary to maintain a healthy online environment.

The implementation will be rolled out gradually over the next six months, with user feedback being incorporated throughout the process.',
  'Anonymous Source',
  'Social Media Insider',
  'Technology',
  45,
  34,
  67,
  ARRAY['Social Media', 'Policy', 'Privacy'],
  null,
  false,
  'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg'
);