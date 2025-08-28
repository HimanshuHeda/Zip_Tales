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
import { useScrollToTop } from "../hooks/useScrollToTop";  // ✅ keep from fix-footer-scroll

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
  useScrollToTop();  // ✅ included

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
    const found = typeof getArticleById === "function" ? getArticleById(id) : undefined;
    setArticle(found ?? null);
  }, [id, getArticleById]);

  // fetch or compute credibility when article changes
  useEffect(() => {
    if (!article) return;

    let cancelled = false;
    const computeCred = async () => {
      setCredLoading(true);
      setCredError(null);

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

  // ... keep rest of component same (UI, handlers, render, etc.)
};

export default ArticleDetail;
