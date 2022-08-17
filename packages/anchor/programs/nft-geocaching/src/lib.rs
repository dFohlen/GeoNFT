 /*   ____            _   _ _____ _____
 *  / ___| ___  ___ | \ | |  ___|_   _|
 * | |  _ / _ \/ _ \|  \| | |_    | |
 * | |_| |  __/ (_) | |\  |  _|   | |
 *  \____|\___|\___/|_| \_|_|     |_|
 **********************************************************************************
 *      lib.ts
 *      Created on: 27.07.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 GeoNFT. All rights reserved.
 **********************************************************************************
 */

use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

declare_id!("9Jn6f1txpvCfRZ3vf38DcsueJM8irWz85zNuavMZSDvh");

#[program]
pub mod nft_geocaching {
    use super::*;

    pub fn create_geocache(ctx: Context<CreateGeocache>, _bump: u8, location: String) -> Result<()> {
        let geocache = &mut ctx.accounts.geocache;
        geocache.owner = ctx.accounts.hider.key();
        geocache.mint = ctx.accounts.mint.key();
        geocache.location = location;

        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx
                        .accounts
                        .hider_token_account
                        .to_account_info(),
                    to: ctx
                        .accounts
                        .token_account
                        .to_account_info(),
                    authority: ctx.accounts.hider.to_account_info(),
                },
                &[],
            ),
            1,
        )?;

        geocache.active = 1;
        Ok(())
    }

    pub fn get_geocache(ctx: Context<GetGeocache>, bump: u8) -> Result<()> {
        let geocache = &mut ctx.accounts.geocache;
        require!(geocache.active == 1, Errors::GeocacheNotActive);

        anchor_spl::token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                anchor_spl::token::Transfer {
                    from: ctx
                        .accounts
                        .token_account
                        .to_account_info(),
                    to: ctx
                        .accounts
                        .seeker_token_account
                        .to_account_info(),
                    authority: ctx.accounts.token_account.to_account_info(),
                },
                &[&[geocache.key().as_ref(), &[bump]]],
            ),
            1,
        )?;

        geocache.active = 0;
        Ok(())
    }
}


#[account] // An attribute for a data structure representing a Solana account.
pub struct Geocache {
    owner: Pubkey,
    // Owner of the geocache
    mint: Pubkey,
    // Owner of the geocache
    location: String,
    // Location of the geocache
    active: u8,
    // Whether the geocache is active or not
}

#[derive(Accounts)]
#[instruction(bump: u8)]
pub struct CreateGeocache<'info> {
    #[account(mut)]
    hider: Signer<'info>,

    #[account(
    init,
    payer = hider,
    space = 8 // all accounts need 8 bytes for the account discriminator prepended to the account
    + 32 // owner: Pubkey needs 32 bytes
    + 32 // mint: Pubkey needs 32 bytes
    + 32 // location: 32 bytes
    + 1 // active: 1 byte
    )]
    geocache: Account<'info, Geocache>,

    #[account(
    init,
    payer = hider,
    token::mint = mint,
    token::authority = token_account,
    seeds = [geocache.key().as_ref()],
    bump
    )]
    token_account: Account<'info, TokenAccount>,

    #[account(mut, constraint = hider_token_account.owner == hider.key(), constraint = hider_token_account.amount >= 1)]
    hider_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    mint: Account<'info, Mint>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct GetGeocache<'info> {
    #[account(mut)]
    seeker: Signer<'info>,

    #[account(mut)]
    geocache: Account<'info, Geocache>,

    #[account(mut)]
    token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub seeker_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    mint: Account<'info, Mint>,
    system_program: Program<'info, System>,
    token_program: Program<'info, Token>,
    rent: Sysvar<'info, Rent>,
}

#[error_code]
pub enum Errors {
    #[msg("The geocache is not active")]
    GeocacheNotActive,
}