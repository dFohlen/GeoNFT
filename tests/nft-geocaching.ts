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
import { expect } from "chai";
import { NftGeocaching } from "../target/types/nft_geocaching";

describe("nft-geocaching", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.NftGeocaching as Program<NftGeocaching>;
  const player = program.provider.publicKey;
  const account = anchor.web3.Keypair.generate();
  const account2 = anchor.web3.Keypair.generate();

  it("Create Geocache", async () => {
    const tx1 = await program.rpc.create({
      accounts: {
        geocache: account.publicKey,
        player: player,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [account],
    });
    console.log("Transaction signature", tx1);

    const tx2 = await program.methods.create().rpc;
    await program.rpc.create({
      accounts: {
        geocache: account2.publicKey,
        player: player,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [account2],
    });
    console.log("Transaction signature", tx2);

    const geocache = await program.account.geocache.fetch(account.publicKey);
    console.log("Geocache", geocache);

    expect(geocache.player.toString()).to.equal(player.toString());
    expect(geocache.location).to.equal("");
    expect(geocache.active).to.equal(0);
  });

  it("Set Geocache", async () => {
    // TODO: Set the NFT to the geocache account
    const tx = await program.rpc.setGeocache("52.516181,13.376935", {
      accounts: {
        geocache: account.publicKey,
        player: player,
      },
    });
    console.log("Transaction signature", tx);

    const geocache = await program.account.geocache.fetch(account.publicKey);
    console.log("Geocache", geocache);

    expect(geocache.player.toString()).to.equal(player.toString());
    expect(geocache.location).to.equal("52.516181,13.376935");
    expect(geocache.active).to.equal(1);
  });

  it("Get Geocache", async () => {
    // TODO: Get the NFT from the account
    const tx = await program.rpc.getGeocache({
      accounts: {
        geocache: account.publicKey,
      },
    });
    console.log("Transaction signature", tx);

    const geocache = await program.account.geocache.fetch(account.publicKey);
    console.log("Geocache", geocache);

    expect(geocache.player.toString()).to.equal(player.toString());
    expect(geocache.location).to.equal("52.516181,13.376935");
    expect(geocache.active).to.equal(0);
  });

  it("Get Geocaches", async () => {
    const geocaches = await program.provider.connection.getProgramAccounts(
      program.programId
    );
    console.log("Geocaches", geocaches);

    expect(geocaches.length).to.equal(2);
    expect(
      geocaches[0].account.data.readInt8(
        8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
          32 + // 3.B) player: Pubkey needs 32 bytes
          32 // 3.C) geocache: location bytes
      )
    ).to.equal(0);
    expect(
      geocaches[1].account.data.readInt8(
        8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
          32 + // 3.B) player: Pubkey needs 32 bytes
          32 // 3.C) geocache: location bytes
      )
    ).to.equal(0);
    console.log(
      "Location",
      geocaches[0].account.data
        .slice(
          8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
            32, // 3.B) player: Pubkey needs 32 bytes
          8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
            32 + // 3.B) player: Pubkey needs 32 bytes
            32 // 3.C) geocache: location bytes
        )
        .toString()
    );
    console.log(
      "Location",
      geocaches[1].account.data
        .slice(
          8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
            32, // 3.B) player: Pubkey needs 32 bytes
          8 + // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
            32 + // 3.B) player: Pubkey needs 32 bytes
            32 // 3.C) geocache: location bytes
        )
        .toString()
    );
  });
});
