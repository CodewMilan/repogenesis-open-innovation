#!/usr/bin/env python3
"""
Algorand ASA Creation Script (Fixed)
Creates an ASA on TestNet using standard Algorand Mnemonics
"""

import algosdk
from algosdk.v2client import algod
from algosdk.transaction import AssetCreateTxn, wait_for_confirmation
from algosdk import account, mnemonic

def get_account_from_mnemonic(mnemonic_phrase):
    """
    Derive Algorand keypair from standard Algorand mnemonic
    Works with Pera Wallet, Defly, and standard SDK generated wallets.
    """
    try:
        # correct formatting (strip whitespace)
        mnemonic_phrase = mnemonic_phrase.strip()
        
        # Convert mnemonic directly to private key
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        
        # Derive address from private key
        address = account.address_from_private_key(private_key)
        
        return private_key, address
        
    except Exception as e:
        print(f"❌ Error deriving keypair: {e}")
        raise

def create_asa_on_testnet(private_key, address):
    """
    Create an ASA on Algorand TestNet
    """
    # TestNet Algod client (AlgoNode is free and reliable)
    algod_address = "https://testnet-api.algonode.cloud"
    algod_token = ""
    
    # Initialize the algod client
    algod_client = algod.AlgodClient(algod_token, algod_address)
    
    try:
        # Get network suggested parameters
        params = algod_client.suggested_params()
        
        # Asset creation parameters
        asset_create_txn = AssetCreateTxn(
            sender=address,
            sp=params,
            total=1000,           # Total supply
            default_frozen=False, # Assets are not frozen by default
            unit_name="TIX",      # Unit name
            asset_name="AUTHENTIX_EVENT", # Asset name
            manager=address,      # Manager address
            reserve=address,      # Reserve address
            freeze=address,       # Freeze address
            clawback=address,     # Clawback address
            decimals=0            # Number of decimals (0 for NFT-like tickets)
        )
        
        # Sign the transaction
        signed_txn = asset_create_txn.sign(private_key)
        
        # Submit the transaction
        txid = algod_client.send_transaction(signed_txn)
        print(f"⏳ Transaction sent with ID: {txid}")
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(algod_client, txid, 4)
        
        # Get the asset ID from the transaction
        asset_id = confirmed_txn["asset-index"]
        
        return asset_id, txid
        
    except Exception as e:
        print(f"❌ Error creating ASA: {e}")
        raise

def main():
    """
    Main function
    """
    # PASTE YOUR MNEMONIC HERE (24 or 25 words)
    user_mnemonic = "YOUR MNEMONIC HERE"
    
    print("🚀 AuthenTIX ASA Creation Script")
    print("=" * 50)
    
    # Step 1: Derive Algorand keypair
    print("📝 Deriving Algorand keypair...")
    try:
        private_key, address = get_account_from_mnemonic(user_mnemonic)
        print(f"✅ Derived Address: {address}")
    except Exception as e:
        print(f"❌ Failed to derive keypair: {e}")
        return
    
    # Step 2: Check account balance
    print("\n💰 Checking account balance...")
    try:
        algod_client = algod.AlgodClient("", "https://testnet-api.algonode.cloud")
        account_info = algod_client.account_info(address)
        balance = account_info.get('amount', 0) / 1_000_000  # Convert microAlgos to Algos
        print(f"✅ Account Balance: {balance} ALGO")
        
        if balance < 0.1:
            print("⚠️  Warning: Low balance. You need at least 0.1 ALGO for transaction fees.")
            print("💡 Get TestNet funds from: https://dispenser.testnet.aws.algodev.network/")
            return # Stop here if no funds
    except Exception as e:
        print(f"⚠️  Could not check balance: {e}")
    
    # Step 3: Create ASA
    print("\n🎫 Creating ASA on TestNet...")
    try:
        asset_id, txid = create_asa_on_testnet(private_key, address)
        
        print("\n" + "=" * 50)
        print("🎉 ASA CREATED SUCCESSFULLY!")
        print("=" * 50)
        print(f"🆔 Asset ID: {asset_id}")
        print(f"📋 Transaction ID: {txid}")
        print(f"🔗 View on AlgoExplorer: https://testnet.algoexplorer.io/asset/{asset_id}")
        print("=" * 50)
        
    except Exception as e:
        print(f"❌ Failed to create ASA: {e}")
        return

if __name__ == "__main__":
    main()