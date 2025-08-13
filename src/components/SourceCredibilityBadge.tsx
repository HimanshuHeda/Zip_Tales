import React, { useMemo, useState } from 'react';
import { Info, X, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import sourceReliability from '../data/sourceReliability.json';

interface Props {
  source?: string | null;
}

function resolveSourceDomain(source?: string | null): string | null {
  if (!source) return null;
  try {
    const url = new URL(source);
    return url.hostname.replace(/^www\./, '');
  } catch {
    return source.toLowerCase().replace(/^www\./, '');
  }
}

function getBadgeClasses(score: number | null): string {
  if (score === null) return 'bg-gray-500 text-white';
  if (score >= 80) return 'bg-green-600 text-white';
  if (score >= 50) return 'bg-yellow-500 text-black';
  return 'bg-red-600 text-white';
}

export const SourceCredibilityBadge: React.FC<Props> = ({ source }) => {
  const [open, setOpen] = useState(false);

  const { domain, score } = useMemo(() => {
    const d = resolveSourceDomain(source);
    if (!d) return { domain: null as string | null, score: null as number | null };
    const map = sourceReliability as Record<string, number>;
    const direct = map[d];
    if (typeof direct === 'number') return { domain: d, score: direct };
    // also try bare name (e.g., 'bbc') if provided
    const bare = d.split('.').slice(0, -1).join('.') || d;
    const alt = map[bare];
    return { domain: d, score: typeof alt === 'number' ? alt : null };
  }, [source]);

  const classes = getBadgeClasses(score);
  const label = score !== null ? `Source: ${score}%` : 'Source: Not Rated';

  const reportParams = useMemo(() => {
    const q = new URLSearchParams();
    q.set('type', 'report');
    const subj = domain ? `Report source: ${domain}` : 'Report source reliability';
    q.set('subject', subj);
    const msg = domain
      ? `I would like to report concerns about the credibility of source: ${domain}.\n\nDetails:`
      : 'I would like to report concerns about a source.\n\nDetails:';
    q.set('message', msg);
    return `/contact?${q.toString()}`;
  }, [domain]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded ${classes}`}
        title="This score is based on the reliability rating of the source. Click for details."
      >
        <span>{label}</span>
        <Info className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold">Source Credibility</div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-xs text-gray-600">
                {domain ? (
                  <>
                    Source: <span className="font-medium text-gray-800">{domain}</span>
                  </>
                ) : (
                  'Source not available'
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className={`px-2 py-1 text-xs font-semibold rounded ${classes}`}>{label}</div>
                <div className="text-xs text-gray-500">Click badge for tooltip</div>
              </div>

              <div className="border rounded-md p-3 bg-gray-50">
                <div className="text-xs font-medium text-gray-700 mb-2">Legend</div>
                <ul className="space-y-1 text-xs">
                  <li className="flex items-center space-x-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-600" />
                    <span>High credibility (80%+)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-500" />
                    <span>Medium credibility (50–79%)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span>Low credibility (&lt;50%)</span>
                  </li>
                </ul>
              </div>

              <div className="flex items-start space-x-2 text-xs text-gray-600">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                <p>
                  This score is based on a curated mapping of source reliability and may not reflect individual articles.
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  to={reportParams}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium border rounded hover:shadow-sm"
                >
                  Report this source
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-xs px-3 py-1.5 rounded bg-gray-800 text-white hover:bg-black"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceCredibilityBadge;


