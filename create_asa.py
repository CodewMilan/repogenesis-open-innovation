#!/usr/bin/env python3
import algosdk
from algosdk import transaction, mnemonic, account
from algosdk.v2client import algod
import json

# ---------------------------------------------------------
# Helper Class to match your snippet's syntax (acct1.address)
# ---------------------------------------------------------
class AlgoAccount:
    def __init__(self, private_key, address):
        self.private_key = private_key
        self.address = address

# ---------------------------------------------------------
# Authentication Logic (The Fix)
# ---------------------------------------------------------
def get_account_from_mnemonic(mnemonic_phrase):
    """Derives keys correctly for Pera/Defly/SDK wallets"""
    try:
        mnemonic_phrase = mnemonic_phrase.strip()
        private_key = mnemonic.to_private_key(mnemonic_phrase)
        address = account.address_from_private_key(private_key)
        return AlgoAccount(private_key, address)
    except Exception as e:
        print(f"❌ Error deriving keypair: {e}")
        exit(1)

# ---------------------------------------------------------
# Main Script
# ---------------------------------------------------------
def main():
    # 1. SETUP: Paste your mnemonic here
    # -------------------------------------------
    MNEMONIC = "fresh toss cover wheat close federal behave symbol cover ribbon shine engine fiscal tuna scrub shed zoo lobster orchard april control satisfy youth sun"
    # -------------------------------------------

    # Connect to TestNet (using free AlgoNode API)
    algod_address = "https://testnet-api.algonode.cloud"
    algod_client = algod.AlgodClient("", algod_address)

    # Create the account object (acct1)
    print("🔐 Authenticating...")
    acct1 = get_account_from_mnemonic(MNEMONIC)
    print(f"✅ Using Address: {acct1.address}")

    # Check balance before proceeding
    try:
        acct_info = algod_client.account_info(acct1.address)
        if acct_info.get('amount') < 100000: # 0.1 Algo
            print("⚠️  Insufficient funds. Please fill your account at: https://dispenser.testnet.aws.algodev.network/")
            return
    except Exception as e:
        print(f"⚠️  Could not fetch balance: {e}")

    print("\n🚀 Creating Asset 'Really Useful Gift'...")

    try:
        # 2. THE CODE SNIPPET YOU PROVIDED
        # ---------------------------------------------------------
        # Get network params
        sp = algod_client.suggested_params()

        # Create the transaction using AssetConfigTxn
        # Note: strict_empty_address_check=False is often needed if using same address for everything
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
            decimals=0
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
        # ---------------------------------------------------------
        
        print("\n🎉 Success! View on Explorer:")
        print(f"https://testnet.algoexplorer.io/asset/{created_asset}")

    except Exception as e:
        print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()