import React from 'react';
import { Shield, Users, Zap, Award, CheckCircle, Target } from 'lucide-react';

const About: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: 'AI-Powered Verification',
      description: 'Advanced machine learning algorithms analyze news content for credibility indicators, source reliability, and factual accuracy.',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Real users vote on article credibility, with votes weighted by user reputation to ensure quality verification.',
      color: 'text-green-600'
    },
    {
      icon: Zap,
      title: 'Real-time Scoring',
      description: 'Dynamic credibility scores update instantly based on AI analysis, community votes, and verification from trusted sources.',
      color: 'text-purple-600'
    },
    {
      icon: Award,
      title: 'Reputation System',
      description: 'Users earn reputation points for accurate voting and quality submissions, creating incentives for truthful participation.',
      color: 'text-pink-600'
    }
  ];

  const team = [
    {
      name: 'Himanshu Heda',
      role: 'Team Leader / Manager',
      linkedin: 'https://www.linkedin.com/in/himanshu-heda/',
      github: 'https://github.com/HimanshuHeda',
      description: 'Visionary leader driving the mission to combat misinformation through innovative technology solutions.'
    },
    {
      name: 'Avni Sharma',
      role: 'Frontend Developer',
      linkedin: 'https://www.linkedin.com/in/avnisharma1705/',
      github: 'https://github.com/AVNI-THEEXPLORER',
      description: 'Creative developer crafting intuitive user experiences that make news verification accessible to everyone.'
    },
    {
      name: 'Lakshita Pagaria',
      role: 'Python Developer',
      linkedin: 'https://www.linkedin.com/in/lakshita-pagaria/',
      github: 'https://github.com/LakshitaPagaria',
      description: 'Backend specialist building robust AI systems and data processing pipelines for accurate news analysis.'
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <img src="/ZipTails.jpg" alt="ZipTales" className="h-20 w-20 mx-auto rounded-full shadow-lg mb-6" />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">ZipTales</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            We're on a mission to combat misinformation and restore trust in journalism through 
            AI-powered verification and community-driven truth validation.
          </p>
          <div className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full font-semibold">
            <Target className="h-5 w-5" />
            <span>Breaking News, Not Trust</span>
          </div>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              In an era of information overload and widespread misinformation, ZipTales stands as a beacon of truth. 
              We combine cutting-edge AI technology with the wisdom of community verification to create a more 
              trustworthy news ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Verify Truth</h3>
              <p className="text-gray-600">
                Use advanced AI and community intelligence to identify and verify authentic news stories.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fight Misinformation</h3>
              <p className="text-gray-600">
                Actively combat fake news and misleading information through transparent credibility scoring.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empower Community</h3>
              <p className="text-gray-600">
                Enable citizens to participate in the verification process and build a more informed society.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How ZipTales Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our comprehensive approach combines multiple verification methods to ensure accuracy and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4 ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Credibility Scoring */}
        <div className="bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Credibility Scoring System</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Every article receives a comprehensive credibility score based on multiple factors, 
              ensuring transparent and reliable news verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600 mb-2">30%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Author Reputation</div>
              <div className="text-xs text-gray-600">Track record and expertise</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">40%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Community Votes</div>
              <div className="text-xs text-gray-600">User verification</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">10%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Time Relevance</div>
              <div className="text-xs text-gray-600">Freshness of information</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">10%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Photo Evidence</div>
              <div className="text-xs text-gray-600">Visual verification</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">10%</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Location Verification</div>
              <div className="text-xs text-gray-600">Geographic accuracy</div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Team Code Breakers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A passionate team of developers and innovators dedicated to creating a more trustworthy information ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.description}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                  >
                    LinkedIn
                  </a>
                  <span className="text-gray-400">•</span>
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600">
              Making a difference in the fight against misinformation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">10,247</div>
              <div className="text-sm text-gray-600">Articles Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2,834</div>
              <div className="text-sm text-gray-600">Active Verifiers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-600 mb-2">94.2%</div>
              <div className="text-sm text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Real-time Updates</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-pink-100 mb-6">
            Be part of the solution. Help us build a more trustworthy information ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-3 bg-white text-pink-600 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Verifying News
            </a>
            <a
              href="/contact"
              className="px-8 py-3 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;