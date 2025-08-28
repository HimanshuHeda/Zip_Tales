from web3 import Web3
from dotenv import load_dotenv
import os

load_dotenv() # This loads the variables from .env
# Connect to the Ethereum network
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY")
w3 = Web3(Web3.HTTPProvider(f'https://eth-holesky.g.alchemy.com/v2/{ALCHEMY_API_KEY}'))

# Get block by number
block_number = 123456
block = w3.eth.get_block(block_number)

print(block)
