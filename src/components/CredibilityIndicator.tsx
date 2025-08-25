import React from 'react';
import { CheckCircle, Shield, AlertTriangle, Save } from 'lucide-react';
import { useNews } from '../contexts/NewsContext';

interface Breakdown {
  sourceReliability: number;
  factualAccuracy: number;
  biasLevel: number;
  userVotes: number;
  blockchainVerification: number;
}

interface Props {
  articleId: string;
  score: number | null;
  breakdown?: Breakdown | null;
  loading?: boolean;
  onSaved?: (success: boolean) => void;
}

const MiniBar: React.FC<{ label: string; value: number }> = ({ label, value }) => (
  <div className="flex items-center space-x-3">
    <div className="w-32 text-sm text-gray-600">{label}</div>
    <div className="flex-1 bg-gray-100 rounded overflow-hidden h-3">
      <div style={{ width: `${Math.max(0, Math.min(100, value))}%` }} className="h-3 rounded bg-gradient-to-r from-pink-500 to-blue-500" />
    </div>
    <div className="w-10 text-right text-sm font-medium">{value}%</div>
  </div>
);

const CredibilityIndicator: React.FC<Props> = ({ articleId, score, breakdown, loading = false, onSaved }) => {
  const { saveCredibilityScore } = useNews();

  const getColor = (s: number | null) => {
    if (s === null) return 'text-gray-600 bg-gray-100';
    if (s >= 70) return 'text-green-600 bg-green-100';
    if (s >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getIcon = (s: number | null) => {
    if (s === null) return <Shield className="h-5 w-5" />;
    if (s >= 70) return <CheckCircle className="h-5 w-5" />;
    if (s >= 40) return <Shield className="h-5 w-5" />;
    return <AlertTriangle className="h-5 w-5" />;
  };

  const handleSave = async () => {
    if (!articleId || score === null) return;
    try {
      const ok = await saveCredibilityScore(articleId, score);
      onSaved?.(ok);
    } catch (err) {
      console.error(err);
      onSaved?.(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getColor(score)}`}>
          {getIcon(score)}
          <div>
            <div className="text-xs text-gray-700">Credibility</div>
            <div className="font-semibold text-lg">{score !== null ? `${score}%` : 'Analyzing'}</div>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading || score === null}
          className="inline-flex items-center space-x-2 px-3 py-2 border rounded text-sm hover:shadow-sm disabled:opacity-50"
          title="Save credibility score"
        >
          <Save className="h-4 w-4" />
          <span>Save</span>
        </button>
      </div>

      {loading && <div className="text-sm text-gray-500 mb-2">Analyzing article...</div>}

      {breakdown ? (
        <div className="space-y-2">
          <MiniBar label="Source" value={breakdown.sourceReliability} />
          <MiniBar label="Accuracy" value={breakdown.factualAccuracy} />
          <MiniBar label="Bias" value={breakdown.biasLevel} />
          <MiniBar label="Votes" value={breakdown.userVotes} />
          <MiniBar label="Blockchain" value={breakdown.blockchainVerification} />
        </div>
      ) : (
        <div className="text-sm text-gray-500">No breakdown available.</div>
      )}
    </div>
  );
};

// At the end of CredibilityIndicator.tsx
export default CredibilityIndicator;
