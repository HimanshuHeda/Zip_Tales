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

// Contract addresses (dummy for now — replace with yours)
const CONTRACT_ADDRESSES = {
  MUMBAI: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  POLYGON: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
  ETHEREUM: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6'
};

// CORS-friendly RPCs (Infura)
const RPC_URLS = {
  MUMBAI: `https://polygon-mumbai.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
  POLYGON: `https://polygon-mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`,
  ETHEREUM: `https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID`
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
  getExplorerUrl(transactionHash: any): string | undefined {
    throw new Error('Method not implemented.');
  }
  private provider: ethers.JsonRpcProvider | ethers.BrowserProvider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;
  private currentNetwork: string = 'MUMBAI';

  async initialize(network: string = 'MUMBAI') {
    try {
      this.currentNetwork = network;

      // Use MetaMask if available
      if (typeof window !== 'undefined' && window.ethereum) {
        console.log("Using MetaMask provider...");
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        this.provider = browserProvider;
        this.signer = await browserProvider.getSigner();
        this.contract = new ethers.Contract(
          CONTRACT_ADDRESSES[network as keyof typeof CONTRACT_ADDRESSES],
          NEWS_VERIFICATION_ABI,
          this.signer
        );
      } else {
        // Use Infura for read-only
        console.log("Using Infura RPC for read-only mode...");
        this.provider = new ethers.JsonRpcProvider(RPC_URLS[network as keyof typeof RPC_URLS]);
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
      if (!window.ethereum) throw new Error('MetaMask not found');
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return this.initialize(this.currentNetwork);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return false;
    }
  }

  async verifyNewsOnBlockchain(newsContent: string, credibilityScore: number, metadata: any): Promise<BlockchainVerification | null> {
    try {
      if (!this.contract || !this.signer) throw new Error('Wallet not connected');

      const newsHash = ethers.keccak256(ethers.toUtf8Bytes(newsContent));
      const ipfsHash = await this.uploadToIPFS(metadata);

      const tx = await this.contract.verifyNews(newsHash, credibilityScore, ipfsHash);
      const receipt = await tx.wait();

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

  async getNetworkInfo() {
    try {
      if (!this.provider) return null;
      const network = await this.provider.getNetwork();
      const blockNumber = await this.provider.getBlockNumber();
      return { name: network.name, chainId: Number(network.chainId), blockNumber };
    } catch (error) {
      console.error('Failed to get network info:', error);
      return null;
    }
  }

  private async uploadToIPFS(metadata: any): Promise<string> {
    const data = JSON.stringify(metadata);
    const hash = ethers.keccak256(ethers.toUtf8Bytes(data));
    return `Qm${hash.slice(2, 48)}`;
  }

  formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Get news verification details by token ID
  async getNewsVerification(tokenId: string | number): Promise<BlockchainVerification | null> {
    try {
      if (!this.contract) throw new Error('Blockchain service not initialized');
      
      const result = await this.contract.getNewsVerification(tokenId);
      if (!result || result[0] === ethers.ZeroAddress) return null;

      return {
        tokenId: tokenId.toString(),
        newsHash: result[0],
        credibilityScore: Number(result[1]),
        ipfsHash: result[2],
        verifier: result[3],
        timestamp: Number(result[4]) * 1000, // Convert from seconds to milliseconds
        transactionHash: '', // Not available from this call
        blockNumber: 0, // Not available from this call
        network: this.currentNetwork
      };
    } catch (error) {
      console.error('Failed to get news verification:', error);
      return null;
    }
  }

  // Get verification history for a token ID
  async getVerificationHistory(tokenId: string | number): Promise<VerificationHistory[]> {
    try {
      if (!this.contract) throw new Error('Blockchain service not initialized');
      
      const history = await this.contract.getVerificationHistory(tokenId);
      return history.map((entry: any) => ({
        timestamp: Number(entry.timestamp) * 1000, // Convert from seconds to milliseconds
        score: Number(entry.score),
        verifier: entry.verifier,
        transactionHash: '' // Not available from this call
      }));
    } catch (error) {
      console.error('Failed to get verification history:', error);
      return [];
    }
  }

  // Check if news content is already verified
  async isNewsVerified(newsContent: string): Promise<boolean> {
    try {
      if (!this.contract) throw new Error('Blockchain service not initialized');
      
      const newsHash = ethers.keccak256(ethers.toUtf8Bytes(newsContent));
      return await this.contract.isNewsVerified(newsHash);
    } catch (error) {
      console.error('Failed to check if news is verified:', error);
      return false;
    }
  }

  // Update credibility score for a token ID
  async updateCredibilityScore(tokenId: string | number, newScore: number): Promise<boolean> {
    try {
      if (!this.contract || !this.signer) throw new Error('Wallet not connected');
      
      const tx = await this.contract.updateCredibilityScore(tokenId, newScore);
      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to update credibility score:', error);
      return false;
    }
  }

  // Get blockchain explorer URL for a transaction hash
  getExplorerUrl(txHash: string): string {
    const baseUrls = {
      MUMBAI: 'https://mumbai.polygonscan.com/tx/',
      POLYGON: 'https://polygonscan.com/tx/',
      ETHEREUM: 'https://etherscan.io/tx/'
    };
    
    const baseUrl = baseUrls[this.currentNetwork as keyof typeof baseUrls] || baseUrls.MUMBAI;
    return baseUrl + txHash;
  }
}

export const blockchainService = new BlockchainService();

if (typeof window !== 'undefined') {
  blockchainService.initialize().catch(console.error);
}

declare global {
  interface Window {
    ethereum?: any;
  }
}
