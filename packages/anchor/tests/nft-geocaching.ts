/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      nft-geocaching.ts
 *      Created on: 01.08.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import {
  SystemProgram,
  Transaction,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import { NftGeocaching } from "../target/types/nft_geocaching";
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAssociatedTokenAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import { expect } from "chai";

describe("nft-geocaching", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.NftGeocaching as Program<NftGeocaching>;

  const geocacheAccount = anchor.web3.Keypair.generate();
  const geocache2Account = anchor.web3.Keypair.generate();

  const hider = anchor.web3.Keypair.generate();
  const seeker = anchor.web3.Keypair.generate();
  const seeker2 = anchor.web3.Keypair.generate();

  let mint = null;
  let hiderTokenAccount = null;
  let seekerTokenAccount = null;
  let seeker2TokenAccount = null;

  it("Initialize mint and token accounts", async () => {
    // Airdrop to hider
    await program.provider.connection.confirmTransaction(
      await program.provider.connection.requestAirdrop(
        hider.publicKey,
        1000000000
      ),
      "confirmed"
    );

    // Fund seeker account
    await program.provider.sendAndConfirm(
      (() => {
        const tx = new Transaction();
        tx.add(
          SystemProgram.transfer({
            fromPubkey: hider.publicKey,
            toPubkey: seeker.publicKey,
            lamports: 100000000,
          }),
          SystemProgram.transfer({
            fromPubkey: hider.publicKey,
            toPubkey: seeker2.publicKey,
            lamports: 100000000,
          })
        );
        return tx;
      })(),
      [hider]
    );

    // Create mint of token
    mint = await createMint(
      program.provider.connection,
      hider,
      hider.publicKey,
      null,
      0
    );
    console.log("mint", mint.toString());

    // Create token accounts
    hiderTokenAccount = await createAssociatedTokenAccount(
      program.provider.connection,
      hider,
      mint,
      hider.publicKey
    );
    seekerTokenAccount = await createAssociatedTokenAccount(
      program.provider.connection,
      seeker,
      mint,
      seeker.publicKey
    );
    seeker2TokenAccount = await createAssociatedTokenAccount(
      program.provider.connection,
      seeker2,
      mint,
      seeker2.publicKey
    );

    // Mint to hider token account
    await mintTo(
      program.provider.connection,
      hider,
      mint,
      hiderTokenAccount,
      hider,
      2
    );

    // Check balances
    const hiderAccount = await getAccount(
      program.provider.connection,
      hiderTokenAccount
    );
    const seekerAccount = await getAccount(
      program.provider.connection,
      seekerTokenAccount
    );
    console.log("Hider amount: " + hiderAccount.amount);
    console.log("Seeker amount: " + seekerAccount.amount);
    expect(Number(hiderAccount.amount)).to.equal(2);
    expect(Number(seekerAccount.amount)).to.equal(0);
  });

  it("Create Geocache", async () => {
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [geocacheAccount.publicKey.toBytes()],
        program.programId
      );
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Vault bump: " + vaultBump.toString());

    const tx = await program.methods
      .createGeocache(vaultBump, "52.516181,13.376935")
      .accounts({
        geocache: geocacheAccount.publicKey,
        tokenAccount: vaultAddress,
        hiderTokenAccount: hiderTokenAccount,
        hider: hider.publicKey,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([geocacheAccount, hider])
      .rpc();
    console.log("Transaction signature", tx);

    const hiderAccount = await getAccount(
      program.provider.connection,
      hiderTokenAccount
    );
    const vaultAccount = await getAccount(
      program.provider.connection,
      vaultAddress
    );
    const seekerAccount = await getAccount(
      program.provider.connection,
      seekerTokenAccount
    );
    console.log("Hider amount: " + hiderAccount.amount);
    console.log("Vault amount: " + vaultAccount.amount);
    console.log("Seeker amount: " + seekerAccount.amount);
    expect(Number(hiderAccount.amount)).to.equal(1);
    expect(Number(vaultAccount.amount)).to.equal(1);
    expect(Number(seekerAccount.amount)).to.equal(0);
  });

  it("Get Geocache", async () => {
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [geocacheAccount.publicKey.toBytes()],
        program.programId
      );
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Vault bump: " + vaultBump.toString());

    const tx = await program.methods
      .getGeocache(vaultBump)
      .accounts({
        geocache: geocacheAccount.publicKey,
        tokenAccount: vaultAddress,
        seekerTokenAccount: seekerTokenAccount,
        seeker: seeker.publicKey,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([seeker])
      .rpc();
    console.log("Transaction signature", tx);

    const vaultAccount = await getAccount(
      program.provider.connection,
      vaultAddress
    );
    const hiderAccount = await getAccount(
      program.provider.connection,
      hiderTokenAccount
    );
    const seekerAccount = await getAccount(
      program.provider.connection,
      seekerTokenAccount
    );
    console.log("Hider amount: " + hiderAccount.amount);
    console.log("Vault amount: " + vaultAccount.amount);
    console.log("Seeker amount: " + seekerAccount.amount);
    expect(Number(hiderAccount.amount)).to.equal(1);
    expect(Number(vaultAccount.amount)).to.equal(0);
    expect(Number(seekerAccount.amount)).to.equal(1);

    const geocache = await program.account.geocache.fetch(
      geocacheAccount.publicKey
    );
    console.log("Geocache owner: " + geocache.owner.toString());
    console.log("Geocache location: " + geocache.location.toString());
    console.log("Geocache active: " + geocache.active);
    expect(geocache.owner.toString()).to.equal(hider.publicKey.toString());
    expect(geocache.location).to.equal("52.516181,13.376935");
    expect(geocache.active).to.equal(0);
  });

  it("Get Geocache with another account", async () => {
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [geocacheAccount.publicKey.toBytes()],
        program.programId
      );
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Vault bump: " + vaultBump.toString());

    try {
      const tx = await program.methods
        .getGeocache(vaultBump)
        .accounts({
          geocache: geocacheAccount.publicKey,
          tokenAccount: vaultAddress,
          seekerTokenAccount: seeker2TokenAccount,
          seeker: seeker2.publicKey,
          mint: mint,
          systemProgram: anchor.web3.SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .signers([seeker2])
        .rpc();
      console.log("Transaction signature", tx);
    } catch (e: any) {
      console.log("Error: " + e.message);
      expect(e.message).to.contain("The geocache is not active.");
    }
  });

  it("Create second Geocache", async () => {
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [geocache2Account.publicKey.toBytes()],
        program.programId
      );
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Vault bump: " + vaultBump.toString());

    const tx = await program.methods
      .createGeocache(vaultBump, "180.0000000,-180.0000000")
      .accounts({
        geocache: geocache2Account.publicKey,
        tokenAccount: vaultAddress,
        hiderTokenAccount: hiderTokenAccount,
        hider: hider.publicKey,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([geocache2Account, hider])
      .rpc();
    console.log("Transaction signature", tx);

    const vaultAccount = await getAccount(
      program.provider.connection,
      vaultAddress
    );
    const hiderAccount = await getAccount(
      program.provider.connection,
      hiderTokenAccount
    );
    const seekerAccount = await getAccount(
      program.provider.connection,
      seeker2TokenAccount
    );
    console.log("Hider amount: " + hiderAccount.amount);
    console.log("Vault amount: " + vaultAccount.amount);
    console.log("Seeker amount: " + seekerAccount.amount);
    expect(Number(hiderAccount.amount)).to.equal(0);
    expect(Number(vaultAccount.amount)).to.equal(1);
    expect(Number(seekerAccount.amount)).to.equal(0);
  });
});
