#!/usr/bin/env python3
"""
AuthenTIX - Algorand ASA Creation Script (TestNet)

- Uses 24-word BIP39 mnemonic (new Pera style)
- Derives Algorand keypair via BIP44: m/44'/283'/0'/0/0
- Creates an ASA on Algorand TestNet using AlgoNode
"""

import os
import base64

from dotenv import load_dotenv
from bip_utils import Bip39SeedGenerator, Bip44, Bip44Coins, Bip44Changes

import algosdk
from algosdk.v2client import algod
from algosdk.transaction import AssetCreateTxn, wait_for_confirmation
from algosdk import account


def load_env():
    """Load environment variables from .env.local"""
    # Explicitly load .env.local from current directory
    load_dotenv(".env.local")

    mnemonic = os.getenv("ALGOD_MNEMONIC")
    organizer_address = os.getenv("ORGANIZER_WALLET_ADDRESS")
    algod_url = os.getenv("ALGOD_URL", "https://testnet-api.algonode.cloud")
    algod_token = os.getenv("ALGOD_TOKEN", "")

    if not mnemonic:
        raise RuntimeError("ALGOD_MNEMONIC is not set in .env.local")

    if not organizer_address:
        print("⚠️  ORGANIZER_WALLET_ADDRESS not set, that's okay but recommended.")

    return mnemonic.strip(), organizer_address, algod_url, algod_token


def derive_algorand_keypair_from_bip39(mnemonic_words: str):
    """
    Derive Algorand keypair from 24-word BIP39 mnemonic using BIP44 path:

        m/44'/283'/0'/0/0

    283 is Algorand's SLIP-0044 coin type.
    """
    # Generate seed from mnemonic (BIP39)
    seed_bytes = Bip39SeedGenerator(mnemonic_words).Generate()

    # BIP44 root for Algorand
    bip44_mst_ctx = Bip44.FromSeed(seed_bytes, Bip44Coins.ALGORAND)

    # Account 0, change 0, address index 0
    bip44_acc_ctx = bip44_mst_ctx.Purpose().Coin().Account(0)
    bip44_chg_ctx = bip44_acc_ctx.Change(Bip44Changes.CHAIN_EXT)
    bip44_addr_ctx = bip44_chg_ctx.AddressIndex(0)

    # Raw 32-byte private key (ed25519)
    private_key_bytes = bip44_addr_ctx.PrivateKey().Raw().ToBytes()

    # Build Algorand private key format: 32-byte sk + 32-byte pk
    import nacl.signing

    signing_key = nacl.signing.SigningKey(private_key_bytes)
    public_key_bytes = signing_key.verify_key.encode()

    full_private_key = private_key_bytes + public_key_bytes

    # Base64 encoded private key that algosdk expects
    private_key_b64 = base64.b64encode(full_private_key).decode("utf-8")

    # Derive corresponding Algorand address
    address_str = account.address_from_private_key(private_key_b64)

    return private_key_b64, address_str


def create_asa_on_testnet(algod_client: algod.AlgodClient, private_key: str, address: str):
    """
    Create an ASA on Algorand TestNet.
    """
    print("📡 Fetching suggested params from TestNet...")
    params = algod_client.suggested_params()

    print("🧾 Building ASA creation transaction...")
    txn = AssetCreateTxn(
        sender=address,
        sp=params,
        total=1000,                  # total supply
        default_frozen=False,        # not frozen by default
        unit_name="TIX",             # short unit
        asset_name="AUTHENTIX_EVENT",
        manager=address,
        reserve=address,
        freeze=address,
        clawback=address,
        decimals=0                   # whole units (good for tickets)
    )

    print("✍️  Signing ASA transaction...")
    signed_txn = txn.sign(private_key)

    print("🚀 Sending transaction to network...")
    txid = algod_client.send_transaction(signed_txn)
    print(f"⏳ Transaction sent with ID: {txid}")

    print("⏱ Waiting for confirmation...")
    confirmed_txn = wait_for_confirmation(algod_client, txid, 4)

    asset_id = confirmed_txn["asset-index"]
    return asset_id, txid


def main():
    print("🚀 AuthenTIX ASA Creation Script (TestNet)")
    print("=" * 60)

    # 1) Load env
    try:
        mnemonic, organizer_address, algod_url, algod_token = load_env()
    except Exception as e:
        print(f"❌ Env load error: {e}")
        return

    # 2) Derive keypair from mnemonic
    print("📝 Deriving Algorand keypair from BIP39 mnemonic...")
    try:
        private_key, derived_address = derive_algorand_keypair_from_bip39(mnemonic)
        print(f"✅ Derived address: {derived_address}")
    except Exception as e:
        print(f"❌ Failed to derive keypair from mnemonic: {e}")
        return

    # 3) Warn if derived address != ORGANIZER_WALLET_ADDRESS
    if organizer_address:
        if organizer_address.strip() != derived_address:
            print("⚠️  WARNING: Derived address does NOT match ORGANIZER_WALLET_ADDRESS")
            print(f"    ORGANIZER_WALLET_ADDRESS: {organizer_address}")
            print(f"    Derived from mnemonic:    {derived_address}")
            print("    → Either update ORGANIZER_WALLET_ADDRESS in .env.local")
            print("      OR use the mnemonic that belongs to the organizer address.\n")
        else:
            print("✅ Derived address matches ORGANIZER_WALLET_ADDRESS")

    # 4) Initialize algod client
    print("\n🌐 Connecting to Algod (TestNet via AlgoNode)...")
    algod_client = algod.AlgodClient(algod_token, algod_url)

    # 5) Check balance
    print("💰 Checking account balance...")
    try:
        account_info = algod_client.account_info(derived_address)
        balance = account_info.get("amount", 0) / 1_000_000
        print(f"   Balance: {balance} ALGO")

        if balance < 0.2:
            print("⚠️  Low balance. You should fund this account with TestNet ALGO:")
            print("   👉 https://testnet.algoexplorer.io/dispenser\n")
    except Exception as e:
        print(f"⚠️  Could not check balance: {e}")

    # 6) Create ASA
    print("\n🎫 Creating ASA on TestNet...")
    try:
        asset_id, txid = create_asa_on_testnet(algod_client, private_key, derived_address)

        print("\n" + "=" * 60)
        print("🎉 ASA CREATED SUCCESSFULLY!")
        print("=" * 60)
        print(f"🆔 Asset ID: {asset_id}")
        print(f"📋 Transaction ID: {txid}")
        print(f"🔗 View Asset: https://testnet.algoexplorer.io/asset/{asset_id}")
        print(f"🔗 View Txn:  https://testnet.algoexplorer.io/tx/{txid}")
        print("=" * 60)

        with open("asset_id.txt", "w") as f:
            f.write(str(asset_id))
        print("💾 Asset ID saved to asset_id.txt")

    except Exception as e:
        print(f"❌ Failed to create ASA: {e}")


if __name__ == "__main__":
    main()
