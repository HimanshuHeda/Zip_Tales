import json
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Connect to Ethereum
w3 = Web3(Web3.HTTPProvider(os.getenv("WEB3_PROVIDER")))
private_key = os.getenv("PRIVATE_KEY")
account = w3.eth.account.from_key(private_key)

# Load contract
contract_address = w3.to_checksum_address(os.getenv("CONTRACT_ADDRESS"))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

with open(os.path.join(BASE_DIR, "ZipTalesABI.json")) as f:
    abi = json.load(f)

contract = w3.eth.contract(address=contract_address, abi=abi)

# Helper to wait for transaction receipt
def wait_for_receipt(tx_hash, timeout=120):
    try:
        return w3.eth.wait_for_transaction_receipt(tx_hash, timeout=timeout)
    except Exception as e:
        print(f"[Receipt Error] {e}")
        return None

# Submit article function
def submit_article(title, article_hash):
    try:
        tx = contract.functions.submitArticle(title, article_hash).build_transaction({
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address, 'pending'),
            "gas": 300000,
            "gasPrice": w3.to_wei("20", "gwei")
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_hash_hex = w3.to_hex(tx_hash)

        # Wait for transaction to be mined
        receipt = wait_for_receipt(tx_hash)
        if receipt and receipt.status == 1:
            print(f"✅ Article submitted successfully in block {receipt.blockNumber}")
        elif receipt:
            print(f"⚠️ Transaction failed in block {receipt.blockNumber}")
        else:
            print("⚠️ Receipt timeout or unknown failure.")

        return tx_hash_hex

    except Exception as e:
        print(f"[submit_article ERROR]: {e}")
        raise e

# Vote article function
def vote_article(article_id, upvote=True):
    try:
        tx = contract.functions.voteArticle(article_id, upvote).build_transaction({
            "from": account.address,
            "nonce": w3.eth.get_transaction_count(account.address, 'pending'),
            "gas": 200000,
            "gasPrice": w3.to_wei("20", "gwei")
        })

        signed_tx = w3.eth.account.sign_transaction(tx, private_key=private_key)
        tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
        tx_hash_hex = w3.to_hex(tx_hash)

        print(f"🗳️ Vote transaction sent: {tx_hash_hex}")
        return tx_hash_hex

    except Exception as e:
        print(f"[vote_article ERROR]: {e}")
        raise e

# Get article function with safety
def get_article(article_id):
    try:
        total_articles = contract.functions.articlesLength().call() if hasattr(contract.functions, 'articlesLength') else len(contract.functions.articles().call())
        if article_id >= total_articles:
            raise IndexError("Invalid article ID: Out of bounds")
        return contract.functions.getArticle(article_id).call()
    except Exception as e:
        print(f"[get_article ERROR]: {e}")
        raise e
