import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  User,
  MapPin,
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  BookmarkCheck,
  Share2,
  Shield,
  AlertTriangle,
  CheckCircle,
  Heart,
  HeartOff,
  Info,
} from "lucide-react";
import { useNews } from "../contexts/NewsContext";
import { useAuth } from "../contexts/AuthContext";
import BlockchainVerification from "../components/BlockchainVerification";
import RelatedArticles from "../components/RelatedArticles";
import CredibilityIndicator from "../components/CredibilityIndicator";
// Define article type (local)
interface Votes {
  upvotes: number;
  downvotes: number;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  author?: string;
  source?: string;
  location?: string;
  imageUrl?: string;
  credibilityScore?: number;
  votes?: Votes;
  verified?: boolean;
  blockchainVerified?: boolean;
  blockchainTokenId?: string;
  blockchainTxHash?: string;
}

interface CredibilityBreakdown {
  sourceReliability: number;
  factualAccuracy: number;
  biasLevel: number;
  userVotes: number;
  blockchainVerification: number;
}

const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    getArticleById,
    voteOnArticle,
    savedArticles,
    toggleSaveArticle,
    followedTopics,
    toggleFollowTopic,
    saveCredibilityScore,
  } = useNews();
  const { isAuthenticated } = useAuth();

  const [article, setArticle] = useState<Article | null>(null);
  const [hasVoted, setHasVoted] = useState(false);

  // credibility UI state
  const [credLoading, setCredLoading] = useState(false);
  const [credScore, setCredScore] = useState<number | null>(null);
  const [credBreakdown, setCredBreakdown] = useState<CredibilityBreakdown | null>(null);
  const [credError, setCredError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = typeof getArticleById === 'function' ? getArticleById(id) : undefined;
    setArticle(found ?? null);
  }, [id, getArticleById]);

  // fetch or compute credibility when article changes
  useEffect(() => {
    if (!article) return;

    let cancelled = false;
    const computeCred = async () => {
      setCredLoading(true);
      setCredError(null);

      // try calling external API (if you have one) or fallback to quick local heuristic
      try {
        const resp = await fetch("http://localhost:5000/api/credibility", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            source: article.source ?? "unknown",
            content: article.content ?? article.summary ?? "",
            userVotes: article.votes?.upvotes ?? 0,
            blockchainVerified: !!article.blockchainVerified,
          }),
        });

        if (!resp.ok) throw new Error(`status ${resp.status}`);
        const data = await resp.json();

        if (cancelled) return;
        setCredScore(typeof data.score === "number" ? data.score : 0);
        setCredBreakdown(data.breakdown ?? null);
      } catch (err) {
        console.warn("Credibility API failed, using fallback", err);
        if (cancelled) return;
        const fallback = simulateLocalCredibility(article);
        setCredScore(fallback);
        setCredBreakdown({
          sourceReliability: 50,
          factualAccuracy: 60,
          biasLevel: 50,
          userVotes: Math.min(100, (article.votes?.upvotes ?? 0) * 2),
          blockchainVerification: article.blockchainVerified ? 100 : 0,
        });
        setCredError("Using local fallback analysis");
      } finally {
        if (!cancelled) setCredLoading(false);
      }
    };

    computeCred();
    return () => {
      cancelled = true;
    };
  }, [article]);

  const simulateLocalCredibility = (a: Article) => {
    const sourceScore = a.source
      ? ["bbc", "guardian", "nyt", "reuters"].some((s) => a.source!.toLowerCase().includes(s))
        ? 85
        : 55
      : 50;

    const content = (a.content || a.summary || "").toLowerCase();
    let factual = 70;
    if (content.includes("study") || content.includes("research")) factual += 10;
    if (content.includes("breaking") || content.includes("shocking")) factual -= 15;
    const bias = content.includes("opinion") ? 40 : 70;
    const votes = Math.min(100, (a.votes?.upvotes ?? 0) * 5 + 50);
    const blockchainVal = a.blockchainVerified ? 100 : 0;

    const score = Math.round(
      sourceScore * 0.3 + factual * 0.3 + bias * 0.2 + votes * 0.1 + blockchainVal * 0.1
    );
    return Math.max(0, Math.min(100, score));
  };

  const isSaved = (savedArticles ?? []).includes(article?.id ?? "");

  const handleVote = async (vote: "up" | "down") => {
    if (!isAuthenticated || hasVoted || !article) return;
    try {
      if (typeof voteOnArticle === "function") {
        await voteOnArticle(article.id, vote);
      }
      setHasVoted(true);
      setArticle((prev) =>
        prev
          ? {
              ...prev,
              votes: {
                upvotes: (prev.votes?.upvotes ?? 0) + (vote === "up" ? 1 : 0),
                downvotes: (prev.votes?.downvotes ?? 0) + (vote === "down" ? 1 : 0),
              },
            }
          : prev
      );
    } catch (err) {
      console.error("Vote failed", err);
    }
  };

  const handleShare = async () => {
    if (!article) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, text: article.summary, url: window.location.href });
      } catch (err) {
        console.log("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Article URL copied to clipboard!");
    }
  };

  const handleBlockchainVerification = (verification: { tokenId: string; transactionHash: string }) => {
    setArticle((prev) => (prev ? { ...prev, blockchainTokenId: verification.tokenId, blockchainVerified: true, blockchainTxHash: verification.transactionHash } : prev));
  };

  // called when CredibilityIndicator saved the score successfully
  const onSaveCredibility = (success: boolean) => {
    if (success) {
      // update local article state to reflect saved score
      if (article && credScore !== null) {
        setArticle((prev) => (prev ? { ...prev, credibilityScore: credScore } : prev));
      }
      alert("Credibility score saved.");
    } else {
      alert("Failed to save credibility score. Check console for error.");
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h2>
          <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-semibold">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-pink-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors mb-8">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Articles</span>
        </Link>

        <article className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {article.imageUrl && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              <div className={`absolute top-6 left-6`}>
                <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium ${article.credibilityScore !== undefined ? (article.credibilityScore >= 70 ? 'text-green-600 bg-green-100' : article.credibilityScore >= 40 ? 'text-yellow-600 bg-yellow-100' : 'text-red-600 bg-red-100') : 'text-gray-600 bg-gray-100'}`}>
                  {article.credibilityScore !== undefined ? (article.credibilityScore >= 70 ? <CheckCircle className="h-4 w-4" /> : article.credibilityScore >= 40 ? <Shield className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />) : <Info className="h-4 w-4" />}
                  <span>{article.credibilityScore !== undefined ? `${article.credibilityScore}%` : 'No saved score'}</span>
                </div>
                {credLoading && <div className="mt-2 text-xs text-gray-500">Analyzing...</div>}
                {credError && <div className="mt-2 text-xs text-orange-600">{credError}</div>}
              </div>

              {article.verified && (
                <div className="absolute top-6 right-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <CheckCircle className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                </div>
              )}

              {article.blockchainVerified && (
                <div className="absolute bottom-6 right-6">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <Shield className="h-4 w-4" />
                    <span>Blockchain Verified</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-pink-100 to-blue-100 text-pink-700 rounded-full font-medium cursor-pointer hover:from-pink-200 hover:to-blue-200 transition-all duration-300" onClick={() => isAuthenticated && toggleFollowTopic(article.category)}>
                  <span>{article.category}</span>
                  {isAuthenticated && (followedTopics ?? []).includes(article.category) && <Heart className="h-3 w-3 fill-current text-pink-500" />}
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{article.title}</h1>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.summary}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  {article.author && <div className="flex items-center space-x-1"><User className="h-4 w-4" /><span className="font-medium">{article.author}</span></div>}
                  {article.source && <div className="flex items-center space-x-1"><span>•</span><span className="font-medium">{article.source}</span></div>}
                  {article.location && <div className="flex items-center space-x-1"><MapPin className="h-4 w-4" /><span>{article.location}</span></div>}
                </div>

                <div className="flex items-center space-x-3">
                  <button onClick={handleShare} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Share article"><Share2 className="h-5 w-5" /></button>
                  {isAuthenticated && <button onClick={() => toggleSaveArticle(article.id)} className="p-2 text-gray-400 hover:text-pink-500 transition-colors" title={isSaved ? "Remove from saved" : "Save article"}>{isSaved ? <BookmarkCheck className="h-5 w-5 text-pink-500" /> : <Bookmark className="h-5 w-5" />}</button>}
                </div>
              </div>
            </div>

            <div className="prose prose-lg max-w-none mb-8"><div className="text-gray-700 leading-relaxed whitespace-pre-line">{article.content}</div></div>

            <div className="mb-8">
              <BlockchainVerification article={article} onVerificationComplete={handleBlockchainVerification} />
            </div>

            {/* CredibilityIndicator usage */}
            <div className="mb-8">
              <CredibilityIndicator
                articleId={article.id}
                score={credScore}
                breakdown={credBreakdown}
                loading={credLoading}
                onSaved={onSaveCredibility}
              />
            </div>

            {article.tags && article.tags.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => {
                    const isFollowing = (followedTopics ?? []).includes(tag);
                    return (
                      <div key={idx} className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 transition-all duration-300 cursor-pointer group" onClick={() => isAuthenticated && toggleFollowTopic(tag)}>
                        <span>#{tag}</span>
                        {isAuthenticated && <button className={`transition-all duration-300 hover:scale-110 ${isFollowing ? 'text-pink-500' : 'text-gray-400 group-hover:text-pink-500'}`}>{isFollowing ? <Heart className="h-3 w-3 fill-current" /> : <HeartOff className="h-3 w-3" />}</button>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isAuthenticated ? (
              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Verification</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button onClick={() => handleVote("up")} disabled={hasVoted} className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${hasVoted ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-green-600 hover:bg-green-50 border border-green-200'}`}><ThumbsUp className="h-5 w-5" /><span>Credible ({article.votes?.upvotes ?? 0})</span></button>
                    <button onClick={() => handleVote("down")} disabled={hasVoted} className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${hasVoted ? 'text-gray-400 cursor-not-allowed bg-gray-100' : 'text-red-600 hover:bg-red-50 border border-red-200'}`}><ThumbsDown className="h-5 w-5" /><span>Questionable ({article.votes?.downvotes ?? 0})</span></button>
                  </div>
                  {hasVoted && <div className="text-sm text-gray-600">Thank you for your vote! Your contribution helps verify news credibility.</div>}
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 pt-8">
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 rounded-lg p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Join the Community</h3>
                  <p className="text-gray-600 mb-4">Sign in to vote on article credibility, verify news on blockchain, and help build a more trustworthy news ecosystem.</p>
                  <div className="flex justify-center space-x-4">
                    <Link to="/login" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-blue-500 text-white rounded-lg font-medium">Sign In</Link>
                    <Link to="/signup" className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium">Sign Up</Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </article>

        <RelatedArticles currentArticleId={article.id} limit={3} />
      </div>
    </div>
  );
};

export default ArticleDetail;
