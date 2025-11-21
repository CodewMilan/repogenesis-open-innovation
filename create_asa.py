#!/usr/bin/env python3
"""
AuthenTIX – Algorand ASA Creation Script
Based on official Algorand SDK documentation
"""

import os
from dotenv import load_dotenv
from algosdk import mnemonic, account
from algosdk.v2client import algod
from algosdk import transaction
from algosdk import error as algosdk_error


# -------------------------------------------------------
# Helper class to match official docs syntax (acct1.address, acct1.private_key)
# -------------------------------------------------------
class AlgoAccount:
    def __init__(self, private_key, address):
        self.private_key = private_key
        self.address = address


# -------------------------------------------------------
# Load environment variables
# -------------------------------------------------------
def load_env():
    load_dotenv(".env.local")
    
    ALGOD_URL = os.getenv("ALGOD_URL", "https://testnet-api.algonode.cloud")
    ALGOD_TOKEN = os.getenv("ALGOD_TOKEN", "")
    MNEMONIC = os.getenv("ALGOD_MNEMONIC")
    
    if not MNEMONIC:
        raise Exception("Missing ALGOD_MNEMONIC in .env.local")
    
    return ALGOD_URL, ALGOD_TOKEN, MNEMONIC


# -------------------------------------------------------
# Validate mnemonic words
# -------------------------------------------------------
def validate_mnemonic_words(mnemonic_phrase):
    """Check which words are invalid in the Algorand word list"""
    words = mnemonic_phrase.strip().split()
    
    if len(words) != 25:
        raise ValueError(f"Invalid mnemonic length: {len(words)} words. Algorand requires exactly 25 words.")
    
    # Get the Algorand word_to_index dictionary to validate words
    import algosdk.mnemonic as mnemonic_module
    word_to_index = mnemonic_module.word_to_index
    
    invalid_words = []
    for i, word in enumerate(words):
        # Check if word (case-insensitive) is in the Algorand word list
        if word.lower() not in word_to_index:
            invalid_words.append((i + 1, word))
    
    if invalid_words:
        error_msg = "\nInvalid mnemonic words found (not in Algorand word list):\n"
        for pos, word in invalid_words:
            error_msg += f"  Position {pos}: '{word}'\n"
        error_msg += "\nPlease replace these words with valid Algorand mnemonic words."
        error_msg += "\nGet your correct mnemonic from Pera Wallet: Settings > Security > View Passphrase"
        raise ValueError(error_msg)
    
    return True


# -------------------------------------------------------
# Create account from 25-word Algorand mnemonic
# -------------------------------------------------------
def create_account_from_mnemonic(mnemonic_phrase):
    """Create account from Algorand 25-word mnemonic"""
    # Validate words first
    validate_mnemonic_words(mnemonic_phrase)
    
    # Then decode - this will validate the checksum
    try:
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        address = account.address_from_private_key(private_key)
        return AlgoAccount(private_key, address)
    except Exception as e:
        error_msg = str(e).lower()
        # Check for checksum errors
        if "checksum" in error_msg:
            raise ValueError(
                "Checksum validation failed. This usually means:\n"
                "1. One or more words are incorrect (typo)\n"
                "2. Words are in the wrong order\n"
                "3. The mnemonic is incomplete or corrupted\n\n"
                "Troubleshooting:\n"
                "- Double-check each word carefully\n"
                "- Make sure you copied all 25 words in the correct order\n"
                "- Get a fresh copy from Pera Wallet: Settings > Security > View Passphrase\n"
                "- The last word is a checksum - if it's wrong, the whole mnemonic is invalid"
            )
        else:
            raise


# -------------------------------------------------------
# Main script - following official Algorand docs format
# -------------------------------------------------------
def main():
    print("AuthenTIX ASA Creator - Algorand TestNet")
    print("=" * 60)
    
    # Load environment
    ALGOD_URL, ALGOD_TOKEN, MNEMONIC = load_env()
    
    # Create account from mnemonic
    print("\nDecoding mnemonic...")
    try:
        acct1 = create_account_from_mnemonic(MNEMONIC)
        print(f"Address: {acct1.address}")
    except ValueError as e:
        print(f"\nERROR: {e}")
        return
    except Exception as e:
        print(f"\nERROR decoding mnemonic: {e}")
        error_msg = str(e).lower()
        if "checksum" in error_msg:
            print("\nThis means the mnemonic words are valid but the checksum doesn't match.")
            print("Possible causes:")
            print("1. One or more words have typos")
            print("2. Words are in the wrong order")
            print("3. The mnemonic is incomplete or corrupted")
            print("\nSolution:")
            print("- Get a fresh copy from Pera Wallet: Settings > Security > View Passphrase")
            print("- Double-check each word, especially the last word (checksum)")
            print("- Make sure you copied all 25 words in the exact order")
        return
    
    # Initialize algod client
    algod_client = algod.AlgodClient(ALGOD_TOKEN, ALGOD_URL)
    
    # Check balance
    try:
        acct_info = algod_client.account_info(acct1.address)
        balance = acct_info.get('amount', 0) / 1_000_000
        print(f"Balance: {balance} ALGO")
        
        if acct_info.get('amount', 0) < 100000:  # Less than 0.1 ALGO
            print("\nWARNING: Insufficient funds for transaction fees.")
            print("Get TestNet funds from: https://testnet.algoexplorer.io/dispenser")
            print(f"Send funds to: {acct1.address}")
            return
    except Exception as e:
        print(f"WARNING: Could not check balance: {e}")
        print("Proceeding anyway...")
    
    print("\nCreating ASA...")
    
    try:
        # Account 1 creates an asset called `rug` with a total supply
        # of 1000 units and sets itself to the freeze/clawback/manager/reserve roles
        sp = algod_client.suggested_params()
        
        txn = transaction.AssetConfigTxn(
            sender=acct1.address,
            sp=sp,
            default_frozen=False,
            unit_name="rug",
            asset_name="Really Useful Gift",
            manager=acct1.address,
            reserve=acct1.address,
            freeze=acct1.address,
            clawback=acct1.address,
            url="https://path/to/my/asset/details",
            total=1000,
            decimals=0,
        )
        
        # Sign with secret key of creator
        stxn = txn.sign(acct1.private_key)
        
        # Send the transaction to the network and retrieve the txid.
        txid = algod_client.send_transaction(stxn)
        print(f"Sent asset create transaction with txid: {txid}")
        
        # Wait for the transaction to be confirmed
        results = transaction.wait_for_confirmation(algod_client, txid, 4)
        print(f"Result confirmed in round: {results['confirmed-round']}")
        
        # grab the asset id for the asset we just created
        created_asset = results["asset-index"]
        print(f"Asset ID created: {created_asset}")
        
        print("\n" + "=" * 60)
        print("SUCCESS!")
        print("=" * 60)
        print(f"Asset ID: {created_asset}")
        print(f"View on AlgoExplorer: https://testnet.algoexplorer.io/asset/{created_asset}")
        print(f"Transaction: https://testnet.algoexplorer.io/tx/{txid}")
        print("=" * 60)
        
        # Save asset ID to file
        with open("asset_id.txt", "w") as f:
            f.write(str(created_asset))
        print("\nAsset ID saved to asset_id.txt")
        
    except Exception as e:
        print(f"\nERROR creating ASA: {e}")
        print("\nCommon issues:")
        print("1. Insufficient balance (need at least 0.1 ALGO for fees)")
        print("2. Network connection issues")
        print("3. Invalid transaction parameters")
        print("\nFor detailed error information, check the error message above.")


if __name__ == "__main__":
    main()