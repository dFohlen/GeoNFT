/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      lib.rs
 *      Created on: 27.07.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

use anchor_lang::prelude::*;

declare_id!("6F3RNrQC7ko1bDhX142J1cKrivYWwu1oE3iNEotHwUUT");

#[program]
pub mod nft_geocaching {
    use super::*;

    pub fn create(ctx: Context<Create>) -> Result<()> {
        let geocache = &mut ctx.accounts.geocache;
        geocache.player = ctx.accounts.player.key();
        geocache.location = ("").to_string();
        geocache.active = 0;
        Ok(())
    }

    pub fn set_geocache(ctx: Context<SetGeocache>, location: String) -> Result<()> {
        // TODO: Validate NFT is transferred to the Smart Contract

        let geocache = &mut ctx.accounts.geocache;

        require!(
            geocache.player == ctx.accounts.player.key(),
            Errors::NotTheOwner
        );

        geocache.location = location;
        geocache.active = 1;
        Ok(())
    }

    pub fn get_geocache(ctx: Context<GetGeocache>) -> Result<()> {
        let geocache = &mut ctx.accounts.geocache;

        require!(geocache.active == 1, Errors::NotActive);

        // TODO: Transfer NFT to player

        geocache.active = 0;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(
    init,
    payer = player,
    space = 8 // 3.A) all accounts need 8 bytes for the account discriminator prepended to the account
    + 32 // 3.B) player: Pubkey needs 32 bytes
    + 32 // 3.C) geocache: location bytes
    + 1 // 3.D) active: 1 byte
    )]
    pub geocache: Account<'info, Geocache>,
    #[account(mut)]
    pub player: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account] // An attribute for a data structure representing a Solana account.
pub struct Geocache {
    pub player: Pubkey,   // Owner of the geocache
    pub location: String, // Location of the geocache
    pub active: u8,       // Whether the geocache is active or not
}

#[derive(Accounts)]
pub struct SetGeocache<'info> {
    #[account(mut)]
    pub geocache: Account<'info, Geocache>,
    pub player: Signer<'info>,
}

#[derive(Accounts)]
pub struct GetGeocache<'info> {
    #[account(mut)]
    pub geocache: Account<'info, Geocache>,
}

#[error_code]
pub enum Errors {
    #[msg("Only the owner of the item can set the location")]
    NotTheOwner,
    #[msg("The geocache is not active")]
    NotActive,
}
