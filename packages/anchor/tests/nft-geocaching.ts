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
  PublicKey,
  SystemProgram,
  Transaction,
  LAMPORTS_PER_SOL,
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

  const hider = anchor.web3.Keypair.generate();
  const seeker = anchor.web3.Keypair.generate();

  let mint = null;
  let hiderTokenAccount = null;
  let seekerTokenAccount = null;

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

    // Mint to hider token account
    await mintTo(
      program.provider.connection,
      hider,
      mint,
      hiderTokenAccount,
      hider,
      1
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
    expect(Number(hiderAccount.amount)).to.equal(1);
    expect(Number(seekerAccount.amount)).to.equal(0);
  });

  it("Create Geocache", async () => {
    // Geocache PDA
    const [geocacheAddress, geocacheBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("geocache"))],
        program.programId
      );
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("vault"))],
        program.programId
      );
    console.log("Geocache PDA: " + geocacheAddress.toString());
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Geocache bump: " + geocacheBump.toString());
    console.log("Vault bump: " + vaultBump.toString());

    const tx = await program.methods
      .createGeocache(vaultBump, "52.516181,13.376935")
      .accounts({
        geocache: geocacheAddress,
        tokenAccount: vaultAddress,
        hiderTokenAccount: hiderTokenAccount,
        hider: hider.publicKey,
        mint: mint,
        systemProgram: anchor.web3.SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([hider])
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
    expect(Number(hiderAccount.amount)).to.equal(0);
    expect(Number(vaultAccount.amount)).to.equal(1);
    expect(Number(seekerAccount.amount)).to.equal(0);
  });

  it("Get Geocache", async () => {
    // Geocache PDA
    const [geocacheAddress, geocacheBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("geocache"))],
        program.programId
      );
    // Vault PDA
    const [vaultAddress, vaultBump] =
      await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from(anchor.utils.bytes.utf8.encode("vault"))],
        program.programId
      );
    console.log("Geocache PDA: " + geocacheAddress.toString());
    console.log("Vault PDA: " + vaultAddress.toString());
    console.log("Geocache bump: " + geocacheBump.toString());
    console.log("Vault bump: " + vaultBump.toString());

    const tx = await program.methods
      .getGeocache(vaultBump)
      .accounts({
        geocache: geocacheAddress,
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
    expect(Number(hiderAccount.amount)).to.equal(0);
    expect(Number(vaultAccount.amount)).to.equal(0);
    expect(Number(seekerAccount.amount)).to.equal(1);

    const geocache = await program.account.geocache.fetch(geocacheAddress);
    console.log("Geocache owner: " + geocache.owner.toString());
    console.log("Geocache location: " + geocache.location.toString());
    console.log("Geocache active: " + geocache.active);
    expect(geocache.owner.toString()).to.equal(hider.publicKey.toString());
    expect(geocache.location).to.equal("52.516181,13.376935");
    expect(geocache.active).to.equal(0);
  });
});
