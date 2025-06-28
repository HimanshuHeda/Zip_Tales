import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Clock, User, Hash, CheckCircle, AlertTriangle, Loader } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { blockchainService } from '../lib/blockchain';

interface BlockchainVerificationProps {
  article: any;
  onVerificationComplete?: (verification: any) => void;
}

const BlockchainVerification: React.FC<BlockchainVerificationProps> = ({ 
  article, 
  onVerificationComplete 
}) => {
  const { 
    isConnected, 
    walletAddress, 
    connectWallet, 
    verifyNews, 
    getVerification,
    getHistory,
    loading,
    error 
  } = useBlockchain();
  
  const [verification, setVerification] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    checkExistingVerification();
  }, [article.id]);

  const checkExistingVerification = async () => {
    if (article.blockchainTokenId) {
      const verification = await getVerification(article.blockchainTokenId);
      setVerification(verification);
      
      if (verification) {
        const history = await getHistory(article.blockchainTokenId);
        setHistory(history);
      }
    }
  };

  const handleVerifyOnBlockchain = async () => {
    if (!isConnected) {
      const connected = await connectWallet();
      if (!connected) return;
    }

    setIsVerifying(true);
    
    try {
      const metadata = {
        title: article.title,
        author: article.author,
        source: article.source,
        category: article.category,
        publishedAt: article.publishedAt,
        tags: article.tags,
        location: article.location
      };

      const result = await verifyNews(article.content, article.credibilityScore, metadata);
      
      if (result) {
        setVerification(result);
        onVerificationComplete?.(result);
        
        // Show success message
        alert('News successfully verified on blockchain!');
      }
    } catch (error) {
      console.error('Verification failed:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const getVerificationStatus = () => {
    if (!verification) return { icon: AlertTriangle, color: 'text-gray-500', label: 'Not Verified' };
    
    if (verification.credibilityScore >= 70) {
      return { icon: CheckCircle, color: 'text-green-600', label: 'Blockchain Verified' };
    } else if (verification.credibilityScore >= 40) {
      return { icon: Shield, color: 'text-yellow-600', label: 'Partially Verified' };
    } else {
      return { icon: AlertTriangle, color: 'text-red-600', label: 'Disputed on Chain' };
    }
  };

  const status = getVerificationStatus();
  const StatusIcon = status.icon;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
            <p className="text-sm text-gray-600">Immutable proof of authenticity</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 ${status.color}`}>
          <StatusIcon className="h-5 w-5" />
          <span className="font-medium">{status.label}</span>
        </div>
      </div>

      {verification ? (
        <div className="space-y-4">
          {/* Verification Details */}
          <div className="bg-white rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Token ID</p>
                  <p className="font-mono text-sm">{verification.tokenId}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Verifier</p>
                  <p className="font-mono text-sm">
                    {blockchainService.formatAddress(verification.verifier)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Verified On</p>
                  <p className="text-sm">
                    {new Date(verification.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Network</p>
                  <p className="text-sm font-medium">{verification.network}</p>
                </div>
              </div>
            </div>
            
            {verification.transactionHash && (
              <div className="pt-3 border-t border-gray-200">
                <a
                  href={blockchainService.getExplorerUrl(verification.transactionHash)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>View on Blockchain Explorer</span>
                </a>
              </div>
            )}
          </div>

          {/* Verification History */}
          {history.length > 0 && (
            <div>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="text-sm font-medium text-purple-600 hover:text-purple-700 mb-2"
              >
                {showHistory ? 'Hide' : 'Show'} Verification History ({history.length})
              </button>
              
              {showHistory && (
                <div className="bg-white rounded-lg p-4 space-y-2">
                  {history.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium">Score: {entry.score}%</p>
                          <p className="text-xs text-gray-500">
                            {new Date(entry.timestamp * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs font-mono text-gray-600">
                        {blockchainService.formatAddress(entry.verifier)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            This article hasn't been verified on the blockchain yet. 
            Blockchain verification provides immutable proof of authenticity.
          </p>
          
          {!isConnected ? (
            <button
              onClick={connectWallet}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              {loading ? <Loader className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              <span>{loading ? 'Connecting...' : 'Connect Wallet to Verify'}</span>
            </button>
          ) : (
            <button
              onClick={handleVerifyOnBlockchain}
              disabled={isVerifying}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 mx-auto"
            >
              {isVerifying ? <Loader className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
              <span>{isVerifying ? 'Verifying on Blockchain...' : 'Verify on Blockchain'}</span>
            </button>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Wallet Info */}
      {isConnected && walletAddress && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">
            <strong>Connected:</strong> {blockchainService.formatAddress(walletAddress)}
          </p>
        </div>
      )}
    </div>
  );
};

export default BlockchainVerification;