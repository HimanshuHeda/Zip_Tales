import React, { useState } from 'react';
import { Link2, FileText, Tag, MapPin, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNews } from '../contexts/NewsContext';

const SubmitNews: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { analyzeNews } = useNews();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    content: '',
    category: '',
    tags: '',
    location: '',
    source: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    'Technology', 'Politics', 'Sports', 'Entertainment', 
    'Health', 'Science', 'Business', 'Environment'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAnalyze = async () => {
    if (!formData.content.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const score = await analyzeNews(formData.content);
      setAnalysisResult(score);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmitted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'High Credibility';
    if (score >= 40) return 'Moderate Credibility';
    return 'Low Credibility';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <AlertCircle className="h-16 w-16 text-pink-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to submit news articles for verification.
            </p>
            <div className="space-y-3">
              <a
                href="/login"
                className="block w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                Sign In
              </a>
              <a
                href="/signup"
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Create Account
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Submitted!</h2>
            <p className="text-gray-600 mb-6">
              Your news article has been submitted for community verification. 
              You'll earn reputation points once it's verified by other users.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    title: '',
                    url: '',
                    content: '',
                    category: '',
                    tags: '',
                    location: '',
                    source: ''
                  });
                  setAnalysisResult(null);
                }}
                className="block w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-blue-600 transition-all duration-200"
              >
                Submit Another Article
              </button>
              <a
                href="/"
                className="block w-full py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Submit News for Verification
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Help fight misinformation by submitting news articles for AI analysis and community verification.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-blue-500 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Article Submission Form</h2>
            <p className="text-pink-100 text-sm">All fields marked with * are required</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Article Title *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter the article title"
                />
              </div>
            </div>

            {/* URL */}
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Article URL (Optional)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="https://example.com/article"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content *
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={8}
                value={formData.content}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Paste the full article content here for AI analysis..."
              />
              <div className="mt-2 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {formData.content.length} characters
                </p>
                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!formData.content.trim() || isAnalyzing}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Content'}
                </button>
              </div>
            </div>

            {/* Analysis Result */}
            {analysisResult !== null && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Analysis Result</h3>
                <div className="flex items-center space-x-4">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${getScoreColor(analysisResult)}`}>
                    Score: {analysisResult}%
                  </div>
                  <span className="text-gray-600">•</span>
                  <span className="text-gray-700 font-medium">
                    {getScoreLabel(analysisResult)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  This preliminary score will be refined through community voting after submission.
                </p>
              </div>
            )}

            {/* Category and Source */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-2">
                  Source *
                </label>
                <input
                  type="text"
                  id="source"
                  name="source"
                  required
                  value={formData.source}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="e.g., BBC News, Reuters"
                />
              </div>
            </div>

            {/* Tags and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (Optional)
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="AI, Healthcare, Breaking (comma-separated)"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="New York, USA"
                  />
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">Submission Guidelines</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure the content is factual and from a reliable source</li>
                <li>• Include original source links when available</li>
                <li>• Use clear, descriptive titles without sensational language</li>
                <li>• Articles will be reviewed by our AI system and community</li>
                <li>• You'll earn reputation points for verified submissions</li>
              </ul>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
              >
                <Upload className="h-5 w-5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Article'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitNews;