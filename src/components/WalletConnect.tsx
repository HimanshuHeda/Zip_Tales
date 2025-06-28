import React from 'react';
import { Wallet, ExternalLink, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useBlockchain } from '../contexts/BlockchainContext';
import { blockchainService } from '../lib/blockchain';

const WalletConnect: React.FC = () => {
  const { 
    isConnected, 
    walletAddress, 
    networkInfo, 
    connectWallet, 
    loading, 
    error 
  } = useBlockchain();

  const getNetworkStatus = () => {
    if (!networkInfo) return { icon: AlertTriangle, color: 'text-gray-500', label: 'Not Connected' };
    
    // Check if we're on the correct network (Polygon Mumbai for testnet)
    const isCorrectNetwork = networkInfo.chainId === 80001 || networkInfo.chainId === 137;
    
    if (isCorrectNetwork) {
      return { 
        icon: CheckCircle, 
        color: 'text-green-600', 
        label: networkInfo.name === 'maticmum' ? 'Mumbai Testnet' : 'Polygon Mainnet'
      };
    } else {
      return { 
        icon: AlertTriangle, 
        color: 'text-yellow-600', 
        label: 'Wrong Network' 
      };
    }
  };

  const switchToPolygon = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x13881' }], // Mumbai testnet
      });
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x13881',
                chainName: 'Polygon Mumbai',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const networkStatus = getNetworkStatus();
  const NetworkIcon = networkStatus.icon;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Blockchain Wallet</h3>
        </div>
        
        <div className={`flex items-center space-x-1 ${networkStatus.color}`}>
          <NetworkIcon className="h-4 w-4" />
          <span className="text-sm font-medium">{networkStatus.label}</span>
        </div>
      </div>

      {!isConnected ? (
        <div className="text-center py-4">
          <p className="text-gray-600 text-sm mb-4">
            Connect your wallet to verify news on the blockchain and earn crypto rewards.
          </p>
          <button
            onClick={connectWallet}
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 transition-all duration-200"
          >
            {loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
          
          {!window.ethereum && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm">
                MetaMask not detected. 
                <a 
                  href="https://metamask.io/download/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 underline hover:text-yellow-800"
                >
                  Install MetaMask
                </a>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-800 font-medium text-sm">Wallet Connected</p>
                <p className="text-green-600 text-xs font-mono">
                  {blockchainService.formatAddress(walletAddress!)}
                </p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>

          {networkInfo && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Network</p>
                  <p className="font-medium">{networkStatus.label}</p>
                </div>
                <div>
                  <p className="text-gray-500">Block</p>
                  <p className="font-medium">#{networkInfo.blockNumber}</p>
                </div>
              </div>
            </div>
          )}

          {networkInfo && networkInfo.chainId !== 80001 && networkInfo.chainId !== 137 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm mb-2">
                Please switch to Polygon network for optimal experience.
              </p>
              <button
                onClick={switchToPolygon}
                className="text-yellow-800 hover:text-yellow-900 text-sm font-medium underline"
              >
                Switch to Polygon Mumbai
              </button>
            </div>
          )}

          <div className="flex space-x-2">
            <a
              href={`https://mumbai.polygonscan.com/address/${walletAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
            >
              <ExternalLink className="h-3 w-3" />
              <span>View on Explorer</span>
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Benefits */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2 text-sm">Blockchain Benefits</h4>
        <ul className="space-y-1 text-xs text-gray-600">
          <li className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-green-500" />
            <span>Immutable verification records</span>
          </li>
          <li className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-blue-500" />
            <span>Transparent credibility scoring</span>
          </li>
          <li className="flex items-center space-x-2">
            <Shield className="h-3 w-3 text-purple-500" />
            <span>Earn crypto rewards for verification</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default WalletConnect;