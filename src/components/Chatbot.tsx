import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m ZipBot, your AI news verification assistant. I can help you fact-check news, analyze credibility, and answer questions about our platform. How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const analyzeNewsContent = async (content: string): Promise<string> => {
    // Simulate AI analysis
    const keywords = content.toLowerCase();
    let credibilityScore = 50;
    let analysis = '';

    // Simple keyword-based analysis
    if (keywords.includes('breaking') || keywords.includes('urgent')) {
      credibilityScore -= 10;
      analysis += 'Sensational language detected. ';
    }

    if (keywords.includes('study') || keywords.includes('research') || keywords.includes('university')) {
      credibilityScore += 20;
      analysis += 'Academic sources mentioned. ';
    }

    if (keywords.includes('anonymous') || keywords.includes('unnamed source')) {
      credibilityScore -= 15;
      analysis += 'Anonymous sources present. ';
    }

    if (keywords.includes('confirmed') || keywords.includes('verified') || keywords.includes('official')) {
      credibilityScore += 15;
      analysis += 'Official confirmation language used. ';
    }

    credibilityScore = Math.max(0, Math.min(100, credibilityScore));

    return `Based on my analysis:

📊 **Credibility Score: ${credibilityScore}%**

🔍 **Analysis:** ${analysis || 'Standard news content detected.'}

${credibilityScore >= 70 ? '✅ **Status: Likely Trustworthy**' : 
  credibilityScore >= 40 ? '⚠️ **Status: Requires Verification**' : 
  '❌ **Status: High Risk - Verify Carefully**'}

**Recommendations:**
- Cross-check with multiple reliable sources
- Look for official statements or documentation
- Check the author's credentials and publication history
- Verify any statistical claims with original sources`;
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();

    // Fact-checking request
    if (message.includes('fact check') || message.includes('verify') || message.includes('analyze')) {
      const newsContent = userMessage.replace(/fact check|verify|analyze/gi, '').trim();
      if (newsContent.length > 20) {
        return await analyzeNewsContent(newsContent);
      }
      return 'Please provide the news content you\'d like me to analyze. I can help verify claims, check for bias, and assess credibility.';
    }

    // Platform help
    if (message.includes('how') && (message.includes('vote') || message.includes('voting'))) {
      return `🗳️ **Community Voting Guide:**

1. **Find an article** you want to vote on
2. **Read the content** carefully
3. **Click the thumbs up** 👍 if you believe it's credible
4. **Click the thumbs down** 👎 if you think it's questionable
5. **Your vote helps** determine the community credibility score

**Note:** You can only vote once per article, and your vote weight depends on your reputation score.`;
    }

    if (message.includes('credibility') || message.includes('score')) {
      return `📊 **Credibility Scoring System:**

Our AI analyzes multiple factors:
- **Author Reputation (30%)** - Track record and expertise
- **Community Votes (40%)** - User verification
- **Time Relevance (10%)** - Freshness of information
- **Photo Evidence (10%)** - Visual verification
- **Location Verification (10%)** - Geographic accuracy

**Score Ranges:**
- 🟢 **70%+** - Trusted
- 🟡 **40-69%** - Pending Verification
- 🔴 **<40%** - Disputed`;
    }

    if (message.includes('submit') || message.includes('news')) {
      return `📝 **Submitting News:**

1. **Go to Submit News** page
2. **Provide the article URL** or paste content
3. **Add relevant tags** and category
4. **Our AI will analyze** the content automatically
5. **Community members** will vote on credibility
6. **Verified users** can fast-track approval

**Tips for better submissions:**
- Include original sources
- Add context and background
- Use clear, factual headlines`;
    }

    // General responses
    const responses = [
      'I\'m here to help with news verification and platform questions. Try asking me to fact-check something or explain how our credibility system works!',
      'You can ask me to analyze news content, explain our voting system, or help with platform features. What would you like to know?',
      'I can help verify news claims, explain credibility scores, or guide you through platform features. How can I assist you?',
      'Feel free to share news content for analysis, or ask about our community voting system. I\'m here to help!'
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const botResponse = await generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ${
          isOpen ? 'hidden' : 'block'
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">ZipBot - News Verifier</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-pink-500" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-pink-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="h-4 w-4 text-pink-500" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me to fact-check news or explain our platform..."
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg hover:from-pink-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;