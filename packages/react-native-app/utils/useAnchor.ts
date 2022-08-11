import React, {useContext, useState} from 'react';
import {useAnchorWallet, useConnection} from '@solana/wallet-adapter-react';
import {PublicKey, Transaction} from '@solana/web3.js';
import {MobileWallet} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import * as anchor from '@project-serum/anchor';
import {
  IDL,
  NftGeocaching,
} from '@nft-geocaching/anchor/target/types/nft_geocaching';
import idl from '@nft-geocaching/anchor/target/idl/nft_geocaching.json';

export class WalletAdapter {
  private wallet: MobileWallet;

  constructor(wallet: MobileWallet) {
    if (!wallet) throw new Error('Connect to Phantom first');
    this.wallet = wallet;
  }

  async signTransaction(tx: Transaction): Promise<Transaction> {
    return await this.wallet.signTransaction(tx);
  }

  async signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
    return await this.wallet.signAllTransactions(txs);
  }

  get publicKey(): PublicKey {
    return this.wallet.publicKey;
  }
}

export function useAnchor(wallet: WalletAdapter) {
  const {connection} = useConnection();
  const walletAdapter = new WalletAdapter(wallet);
  const provider = new anchor.AnchorProvider(connection, walletAdapter, {
    preflightCommitment: 'processed',
  });
  const programID = new anchor.web3.PublicKey(idl.metadata.address);
  const program = new anchor.Program<NftGeocaching>(IDL, programID, provider);
  return program;
}
