import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { NftGeocaching } from "../target/types/nft_geocaching";

describe("nft-geocaching", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.NftGeocaching as Program<NftGeocaching>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
