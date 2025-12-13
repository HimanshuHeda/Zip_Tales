import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Search, TrendingUp, Shield, FileText, Zap, Brain } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'summary' | 'analysis' | 'search';
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi there! 👋 I\'m ZipBot, your AI news assistant. I can help you understand and verify news articles.\n\nHere\'s what I can do:\n• Summarize long articles in simple terms\n• Check if news seems trustworthy\n• Answer questions about current events\n• Find articles on topics you\'re interested in\n\nJust ask me anything! Try "Can you summarize this article for me?" or "What\'s happening with [topic]?"',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { articles, searchNews, analyzeNews } = useNews();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // AI-powered news summarization with human-friendly responses
  const summarizeArticle = async (content: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please summarize this news article in a friendly, conversational way. Write like you're explaining it to a friend. Include the main points, why it matters, and any important people or organizations mentioned. Keep it easy to understand and engaging.

Article: "${content}"`
              }]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (summary) {
          return `Here's what this article is about:\n\n${summary}\n\nWant me to explain anything in more detail? Just ask!`;
        }
      }
    } catch (error) {
      console.error('AI summarization error:', error);
    }

    // Fallback summarization
    return generateFallbackSummary(content);
  };

  // Fallback summarization with friendly tone
  const generateFallbackSummary = (content: string): string => {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
    const words = content.toLowerCase().split(/\s+/);
    
    const mainPoints = sentences.slice(0, 3).join('. ');
    const wordCount = words.length;

    return `Here's the gist of this article:

${mainPoints}

This is a ${wordCount > 500 ? 'pretty detailed' : 'quick'} read with ${sentences.length} main points. The article covers the key facts and seems to be ${wordCount > 300 ? 'comprehensive' : 'a brief overview'}.

Would you like me to check how trustworthy this source seems, or do you have any questions about the content?`;
  };

  // Advanced credibility analysis with conversational tone
  const performAdvancedAnalysis = async (content: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please analyze this news content for credibility in a friendly, conversational way. Explain like you're talking to a friend who wants to know if they should trust this news. Give a credibility score out of 100 and explain your reasoning in simple terms. Mention any red flags or positive signs you notice.

Content: "${content}"`
              }]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (analysis) {
          return `Let me check this for you:\n\n${analysis}\n\nRemember, it's always good to check multiple sources when something seems important. Want me to help you find other articles on this topic?`;
        }
      }
    } catch (error) {
      console.error('AI analysis error:', error);
    }

    // Fallback analysis
    return performFallbackAnalysis(content);
  };

  // Enhanced fallback analysis with human tone
  const performFallbackAnalysis = (content: string): string => {
    const keywords = content.toLowerCase();
    let credibilityScore = 50;
    let goodSigns: string[] = [];
    let concerns: string[] = [];
    let redFlags: string[] = [];

    // Check for positive indicators
    if (keywords.includes('study') || keywords.includes('research') || keywords.includes('university')) {
      credibilityScore += 20;
      goodSigns.push('mentions research or academic sources');
    }
    if (keywords.includes('confirmed') || keywords.includes('verified') || keywords.includes('official')) {
      credibilityScore += 15;
      goodSigns.push('uses official confirmation language');
    }
    if (keywords.includes('expert') || keywords.includes('professor') || keywords.includes('scientist')) {
      credibilityScore += 10;
      goodSigns.push('quotes experts or professionals');
    }
    if (content.match(/https?:\/\/[^\s]+/g)) {
      credibilityScore += 8;
      goodSigns.push('includes links to sources');
    }

    // Check for warning signs
    if (keywords.includes('breaking') || keywords.includes('urgent') || keywords.includes('shocking')) {
      credibilityScore -= 10;
      concerns.push('uses dramatic language that might be clickbait');
    }
    if (keywords.includes('anonymous') || keywords.includes('unnamed source')) {
      credibilityScore -= 15;
      concerns.push('relies on anonymous sources');
    }
    if (keywords.includes('rumor') || keywords.includes('allegedly') || keywords.includes('unconfirmed')) {
      credibilityScore -= 20;
      concerns.push('contains unverified claims');
      redFlags.push('admits information isn\'t confirmed');
    }
    if (keywords.includes('conspiracy') || keywords.includes('cover-up') || keywords.includes('they don\'t want you to know')) {
      credibilityScore -= 30;
      redFlags.push('uses conspiracy theory language');
    }

    credibilityScore = Math.max(0, Math.min(100, credibilityScore));

    let verdict = '';
    if (credibilityScore >= 80) {
      verdict = 'This looks pretty trustworthy! 👍';
    } else if (credibilityScore >= 60) {
      verdict = 'This seems generally reliable, but worth double-checking. ✅';
    } else if (credibilityScore >= 40) {
      verdict = 'I\'d be a bit cautious with this one. ⚠️';
    } else {
      verdict = 'This has some red flags - I\'d definitely verify elsewhere. ❌';
    }

    let response = `I've analyzed this article and here's what I found:\n\n${verdict}\n\nCredibility Score: ${credibilityScore}/100\n\n`;

    if (goodSigns.length > 0) {
      response += `Good signs I noticed:\n${goodSigns.map(sign => `• ${sign}`).join('\n')}\n\n`;
    }

    if (concerns.length > 0) {
      response += `Things to be aware of:\n${concerns.map(concern => `• ${concern}`).join('\n')}\n\n`;
    }

    if (redFlags.length > 0) {
      response += `Red flags:\n${redFlags.map(flag => `• ${flag}`).join('\n')}\n\n`;
    }

    response += `My advice: ${credibilityScore < 50 ? 'Check 2-3 other reliable sources before believing this' : 'This seems okay, but it never hurts to verify with another source'}. Want me to help you find other articles on this topic?`;

    return response;
  };

  // AI-powered news question answering with conversational tone
  const answerNewsQuestion = async (question: string): Promise<string> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${import.meta.env.VITE_GOOGLE_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Please answer this news question in a friendly, conversational way. Explain things clearly and mention if you're not sure about recent developments. If it's a complex topic, break it down into simple terms.

Question: "${question}"`
              }]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (answer) {
          return `${answer}\n\nKeep in mind that news changes quickly, so it's always good to check the latest updates from reliable sources. Need me to find some current articles on this topic?`;
        }
      }
    } catch (error) {
      console.error('AI question answering error:', error);
    }

    // Fallback response
    return `That's a great question about "${question}"! 

I'd love to help, but I'm having trouble accessing my full knowledge right now. Here's what I can suggest:

• Try searching our articles using the search bar above
• Look for articles with high credibility scores (70% or higher)
• Check multiple sources to get the full picture

Want me to search our database for articles related to your question? Just let me know what specific topic you're most interested in!`;
  };

  // Smart news search with friendly results
  const performSmartSearch = async (query: string): Promise<string> => {
    try {
      const results = await searchNews(query);
      
      if (results.length === 0) {
        return `I couldn't find any articles about "${query}" in our database right now. 

Here are some things you could try:
• Use different keywords (like "climate" instead of "global warming")
• Check our main categories: Technology, Politics, Sports, Entertainment, Health, Science
• Try the "Refresh News" button to get the latest articles

What else can I help you find?`;
      }

      const topResults = results.slice(0, 5);
      let response = `I found ${results.length} articles about "${query}"! Here are the best ones:\n\n`;
      
      topResults.forEach((article, index) => {
        const trustLevel = article.credibilityScore >= 70 ? '✅ Trusted' :
                          article.credibilityScore >= 40 ? '⚠️ Check carefully' : '❌ Be cautious';
        
        response += `${index + 1}. ${article.title}\n`;
        response += `${trustLevel} (${article.credibilityScore}% credibility)\n`;
        response += `From ${article.source} • ${new Date(article.publishedAt).toLocaleDateString()}\n`;
        response += `${article.summary.substring(0, 100)}...\n\n`;
      });

      const avgCredibility = Math.round(topResults.reduce((sum, a) => sum + a.credibilityScore, 0) / topResults.length);
      const trustedCount = topResults.filter(a => a.credibilityScore >= 70).length;
      
      response += `Quick stats: ${trustedCount} out of ${topResults.length} articles are from trusted sources, with an average credibility of ${avgCredibility}%.\n\n`;
      response += `Want me to summarize any of these articles for you?`;
      
      return response;
    } catch (error) {
      return `Sorry, I'm having trouble searching right now. Please try again in a moment!`;
    }
  };

  // Platform statistics with friendly explanation
  const getAdvancedStats = (): string => {
    const totalArticles = articles.length;
    const trustedArticles = articles.filter(a => a.credibilityScore >= 70).length;
    const pendingArticles = articles.filter(a => a.credibilityScore >= 40 && a.credibilityScore < 70).length;
    const disputedArticles = articles.filter(a => a.credibilityScore < 40).length;
    const avgCredibility = totalArticles > 0 ? Math.round(articles.reduce((sum, a) => sum + a.credibilityScore, 0) / totalArticles) : 0;
    const totalVotes = articles.reduce((sum, a) => sum + a.votes.upvotes + a.votes.downvotes, 0);

    const categories = articles.reduce((acc, article) => {
      acc[article.category] = (acc[article.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];

    return `Here's what's happening on ZipTales right now:

We have ${totalArticles} articles total, and our community has cast ${totalVotes.toLocaleString()} votes to help verify them!

Quality breakdown:
• ${trustedArticles} articles are highly trusted (${Math.round(trustedArticles/totalArticles*100)}%)
• ${pendingArticles} are still being verified (${Math.round(pendingArticles/totalArticles*100)}%)
• ${disputedArticles} have credibility concerns (${Math.round(disputedArticles/totalArticles*100)}%)

The average credibility score across all articles is ${avgCredibility}%, which is ${avgCredibility >= 70 ? 'excellent' : avgCredibility >= 50 ? 'pretty good' : 'something we\'re working to improve'}!

${topCategory ? `The most popular category right now is ${topCategory[0]} with ${topCategory[1]} articles.` : ''}

Our community is really active in helping verify news - that's ${Math.round(totalVotes/totalArticles)} votes per article on average!

Want to help improve these numbers? You can vote on articles or submit quality news for verification!`;
  };

  // Main response generator with natural conversation flow
  const generateBotResponse = async (userMessage: string): Promise<{ text: string; type: string }> => {
    const message = userMessage.toLowerCase();

    // Summarization requests
    if (message.includes('summarize') || message.includes('summary') || message.includes('tldr') || message.includes('sum up')) {
      const content = userMessage.replace(/summarize|summary|tldr|sum up|this article|this news|can you|please|for me/gi, '').trim();
      if (content.length > 50) {
        const summary = await summarizeArticle(content);
        return { text: summary, type: 'summary' };
      }
      return { 
        text: `I'd be happy to summarize an article for you! Just paste the article text and I'll break it down into the key points.\n\nYou can say something like "Can you summarize this article:" and then paste the content.`, 
        type: 'text' 
      };
    }

    // Analysis requests
    if (message.includes('analyze') || message.includes('fact check') || message.includes('verify') || message.includes('credibility') || message.includes('trustworthy') || message.includes('reliable')) {
      const content = userMessage.replace(/analyze|fact check|verify|credibility|trustworthy|reliable|check this|is this true|can you|please/gi, '').trim();
      if (content.length > 30) {
        const analysis = await performAdvancedAnalysis(content);
        return { text: analysis, type: 'analysis' };
      }
      return { 
        text: `I can help you check if news seems trustworthy! Just paste the article or news content you want me to analyze, and I'll look for signs of credibility or any red flags.\n\nTry saying "Is this reliable?" followed by the news content.`, 
        type: 'text' 
      };
    }

    // News questions
    if (message.includes('what') || message.includes('why') || message.includes('how') || message.includes('when') || message.includes('where')) {
      if (message.includes('happening') || message.includes('news about') || message.includes('latest on') || message.includes('update on') || message.includes('going on')) {
        const answer = await answerNewsQuestion(userMessage);
        return { text: answer, type: 'analysis' };
      }
    }

    // Search requests
    if (message.includes('find') || message.includes('search') || message.includes('show me') || message.includes('get me') || message.includes('look for')) {
      const searchTerms = userMessage.replace(/find|search|show me|get me|look for|articles about|news about|information on|can you|please/gi, '').trim();
      if (searchTerms.length > 2) {
        const results = await performSmartSearch(searchTerms);
        return { text: results, type: 'search' };
      }
    }

    // Statistics requests
    if (message.includes('stats') || message.includes('statistics') || message.includes('how many') || message.includes('platform') || message.includes('dashboard')) {
      return { text: getAdvancedStats(), type: 'analysis' };
    }

    // Help requests
    if (message.includes('help') || message.includes('what can you do') || message.includes('how do you work') || message.includes('capabilities')) {
      return { 
        text: `I'm here to help you with news! Here's what I can do:\n\n📰 **Summarize articles** - Paste any news article and I'll give you the key points in simple terms\n\n🔍 **Check credibility** - I can analyze news to see if it seems trustworthy\n\n❓ **Answer questions** - Ask me about current events or news topics\n\n🔎 **Find articles** - I can search our database for news on topics you're interested in\n\n📊 **Platform info** - Want to know what's trending or how the community is doing?\n\nJust talk to me naturally! You can say things like:\n• "Can you summarize this article for me?"\n• "Is this news reliable?"\n• "What's happening with climate change?"\n• "Find me articles about technology"\n\nWhat would you like to try first?`, 
        type: 'text' 
      };
    }

    // Greeting responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good morning') || message.includes('good afternoon')) {
      return {
        text: `Hello! 👋 Great to meet you! I'm ZipBot, and I'm here to help you navigate the world of news.\n\nI can help you understand articles, check if news seems trustworthy, answer questions about current events, or find articles on topics you care about.\n\nWhat's on your mind today? Got any news you'd like me to look at?`,
        type: 'text'
      };
    }

    // Thank you responses
    if (message.includes('thank') || message.includes('thanks') || message.includes('appreciate')) {
      return {
        text: `You're very welcome! 😊 I'm always happy to help you stay informed with reliable news.\n\nIs there anything else you'd like to know about? I'm here whenever you need help with news verification or have questions about current events!`,
        type: 'text'
      };
    }

    // Default responses
    const responses = [
      `I'm not quite sure what you're looking for, but I'm here to help with news! \n\nYou can ask me to:\n• Summarize articles\n• Check if news is reliable\n• Find articles on specific topics\n• Answer questions about current events\n\nWhat would you like to try?`,
      
      `I'd love to help you with that! I'm best at helping with news-related tasks.\n\nTry asking me something like:\n• "Can you check if this article is trustworthy?"\n• "What's the latest news about [topic]?"\n• "Summarize this article for me"\n\nWhat can I help you discover today?`,
      
      `I'm your friendly news assistant! While I didn't quite catch what you need, I'm great at:\n\n📰 Breaking down complex articles into simple summaries\n🔍 Checking if news sources seem reliable\n❓ Answering questions about current events\n🔎 Finding articles on topics you're interested in\n\nWhat would you like to explore?`
    ];

    return { text: responses[Math.floor(Math.random() * responses.length)], type: 'text' };
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
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const { text: botResponse, type } = await generateBotResponse(currentInput);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: type as any
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Oops! I ran into a technical issue. Could you try asking that again? I\'m usually pretty good at understanding what you need! 😅',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { 
      icon: FileText, 
      text: "Summarize", 
      action: () => setInputText("Can you summarize this article: "),
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200"
    },
    { 
      icon: Shield, 
      text: "Check credibility", 
      action: () => setInputText("Is this news reliable? "),
      color: "bg-green-100 text-green-700 hover:bg-green-200"
    },
    { 
      icon: Search, 
      text: "Find news", 
      action: () => setInputText("Find me articles about "),
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200"
    },
    { 
      icon: Brain, 
      text: "Ask question", 
      action: () => setInputText("What's happening with "),
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200"
    }
  ];

  const getMessageStyle = (type?: string) => {
    switch (type) {
      case 'summary':
        return 'border-l-4 border-blue-500 bg-blue-50';
      case 'analysis':
        return 'border-l-4 border-green-500 bg-green-50';
      case 'search':
        return 'border-l-4 border-purple-500 bg-purple-50';
      default:
        return 'bg-gray-100';
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
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[650px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Bot className="h-6 w-6" />
                <Zap className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <div>
                <span className="font-medium">ZipBot</span>
                <div className="text-xs text-pink-100">Your News Assistant</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs transition-colors ${action.color}`}
                >
                  <action.icon className="h-3 w-3" />
                  <span>{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-blue-500 text-white'
                      : getMessageStyle(message.type)
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0">
                        <Bot className="h-4 w-4 mt-0.5 text-pink-500" />
                      </div>
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
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
                placeholder="Ask me anything about news! Try 'summarize this article' or 'what's happening with...'"
                className="flex-1 p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
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
            <div className="mt-2 text-xs text-gray-500 text-center">
              AI-powered • Always learning • Here to help
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;