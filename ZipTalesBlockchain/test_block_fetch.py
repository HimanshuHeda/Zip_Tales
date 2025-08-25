from web3 import Web3

# Connect to the Ethereum network
w3 = Web3(Web3.HTTPProvider('https://eth-holesky.g.alchemy.com/v2/Imc1zDU8bNhQYJoW-7qvA'))

# Get block by number
block_number = 123456
block = w3.eth.get_block(block_number)

print(block)
