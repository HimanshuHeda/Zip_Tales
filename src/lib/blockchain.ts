import { ethers } from 'ethers';

// Smart Contract ABI for News Verification
const NEWS_VERIFICATION_ABI = [
  "function verifyNews(string memory newsHash, uint256 credibilityScore, string memory ipfsHash) public returns (uint256)",
  "function getNewsVerification(uint256 tokenId) public view returns (string memory, uint256, string memory, address, uint256)",
  "function updateCredibilityScore(uint256 tokenId, uint256 newScore) public",
  "function getVerificationHistory(uint256 tokenId) public view returns (tuple(uint256 timestamp, uint256 score, address verifier)[])",
  "function isNewsVerified(string memory newsHash) public view returns (bool)",
  "function getNewsTokenId(string memory newsHash) public view returns (uint256)",
  "event NewsVerified(uint256 indexed tokenId, string newsHash, uint256 credibilityScore, address verifier)",
  "event ScoreUpdated(uint256 indexed tokenId, uint256 oldScore, uint256 newScore, address updater)"
];

// Contract addresses (these would be deployed contracts)
const CONTRACT_ADDRESSES = {
  // Polygon Mumbai Testnet
  MUMBAI: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  // Polygon Mainnet (for production)
  POLYGON: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  // Ethereum Mainnet (for high-value news)
  ETHEREUM: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
};

const RPC_URLS = {
  MUMBAI: 'https://rpc-mumbai.maticvigil.com',
  POLYGON: 'https://polygon-rpc.com',
  ETHEREUM: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY'
};

export interface BlockchainVerification {
  tokenId: string;
  newsHash: string;
  credibilityScore: number;
  ipfsHash: string;
  verifier: string;
  timestamp: number;
  transactionHash: string;
  blockNumber: number;
  network: string;
}

export interface VerificationHistory {
  timestamp: number;
  score: number;
  verifier: string;
  transactionHash: string;
}

class BlockchainService {
  private provider: ethers.JsonRpcProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private currentNetwork: string = 'MUMBAI'; // Default to testnet

  async initialize(network: string = 'MUMBAI') {
    try {
      this.currentNetwork = network;
      this.provider = new ethers.JsonRpcProvider(RPC_URLS[network as keyof typeof RPC_URLS]);
      
      // Check if MetaMask is available
      if (typeof window !== 'undefined' && window.ethereum) {
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        this.signer = await browserProvider.getSigner();
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES],
          NEWS_VERIFICATION_ABI,
          this.signer
        );
      } else {
        // Read-only contract for viewing data
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES],
          NEWS_VERIFICATION_ABI,
          this.provider
        );
      }
      
      return true;
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
      return false;
    }
  }

  async connectWallet(): Promise<boolean> {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask not found');
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await browserProvider.getSigner();
      
      if (this.contract && this.provider) {
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESSES[this.currentNetwork as keyof typeof CONTRACT_ADDRESSES],
          NEWS_VERIFICATION_ABI,
          this.signer
        );
      }
      
      return true;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  async verifyNewsOnBlockchain(
    newsContent: string,
    credibilityScore: number,
    metadata: any
  ): Promise<BlockchainVerification | null> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Blockchain not initialized or wallet not connected');
      }

      // Create hash of news content
      const newsHash = ethers.keccak256(ethers.toUtf8Bytes(newsContent));
      
      // Upload metadata to IPFS (simulated)
      const ipfsHash = await this.uploadToIPFS(metadata);
      
      // Call smart contract
      const tx = await this.contract.verifyNews(newsHash, credibilityScore, ipfsHash);
      const receipt = await tx.wait();
      
      // Extract token ID from event logs
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.contract!.interface.parseLog(log);
          return parsed?.name === 'NewsVerified';
        } catch {
          return false;
        }
      });
      
      const parsedEvent = this.contract.interface.parseLog(event);
      const tokenId = parsedEvent?.args[0].toString();
      
      return {
        tokenId,
        newsHash,
        credibilityScore,
        ipfsHash,
        verifier: await this.signer.getAddress(),
        timestamp: Date.now(),
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        network: this.currentNetwork
      };
    } catch (error) {
      console.error('Failed to verify news on blockchain:', error);
      return null;
    }
  }

  async updateCredibilityScore(tokenId: string, newScore: number): Promise<boolean> {
    try {
      if (!this.contract || !this.signer) {
        throw new Error('Blockchain not initialized or wallet not connected');
      }

      const tx = await this.contract.updateCredibilityScore(tokenId, newScore);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to update credibility score:', error);
      return false;
    }
  }

  async getNewsVerification(tokenId: string): Promise<BlockchainVerification | null> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain not initialized');
      }

      const result = await this.contract.getNewsVerification(tokenId);
      return {
        tokenId,
        newsHash: result[0],
        credibilityScore: Number(result[1]),
        ipfsHash: result[2],
        verifier: result[3],
        timestamp: Number(result[4]),
        transactionHash: '',
        blockNumber: 0,
        network: this.currentNetwork
      };
    } catch (error) {
      console.error('Failed to get news verification:', error);
      return null;
    }
  }

  async getVerificationHistory(tokenId: string): Promise<VerificationHistory[]> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain not initialized');
      }

      const history = await this.contract.getVerificationHistory(tokenId);
      return history.map((entry: any) => ({
        timestamp: Number(entry.timestamp),
        score: Number(entry.score),
        verifier: entry.verifier,
        transactionHash: '' // Would need to query events for this
      }));
    } catch (error) {
      console.error('Failed to get verification history:', error);
      return [];
    }
  }

  async isNewsVerified(newsContent: string): Promise<boolean> {
    try {
      if (!this.contract) {
        throw new Error('Blockchain not initialized');
      }

      const newsHash = ethers.keccak256(ethers.toUtf8Bytes(newsContent));
      return await this.contract.isNewsVerified(newsHash);
    } catch (error) {
      console.error('Failed to check if news is verified:', error);
      return false;
    }
  }

  async getNetworkInfo() {
    try {
      if (!this.provider) return null;
      
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      
      return {
        name: network.name,
        chainId: Number(network.chainId),
        blockNumber
      };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }

  private async uploadToIPFS(metadata: any): Promise<string> {
    // Simulated IPFS upload - in production, use actual IPFS service
    const data = JSON.stringify(metadata);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(data));
    return `Qm${hash.slice(2, 48)}`; // Simulate IPFS hash format
  }

  // Utility function to format addresses
  formatAddress(address: string): string {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Utility function to get explorer URL
  getExplorerUrl(txHash: string): string {
    const explorers = {
      MUMBAI: 'https://mumbai.polygonscan.com/tx/',
      POLYGON: 'https://polygonscan.com/tx/',
      ETHEREUM: 'https://etherscan.io/tx/'
    };
    return `${explorers[this.currentNetwork as keyof typeof explorers]}${txHash}`;
  }
}

// Create singleton instance
export const blockchainService = new BlockchainService();

// Initialize on module load
if (typeof window !== 'undefined') {
  blockchainService.initialize().catch(console.error);
}

// Type declarations for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}