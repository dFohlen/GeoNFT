import { Program, ProgramAccount } from '@project-serum/anchor';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function getGeocaches(program: Program<NftGeocaching>): Promise<any> {
    let geocaches = await program.account.geocache.all();
    // const geocaches = await program.provider.connection.getParsedProgramAccounts(program.programId, {
    //   filters: [
    //     {
    //       memcmp: {
    //         offset: 72,
    //         bytes: '1', // How to filter for active geocaches?
    //     }
    //    }
    //   ]
    // });
    console.log('Geocaches', geocaches);

    geocaches = geocaches.filter(({ account }) => {
        return account.active ? true : false;
    });

    return geocaches;
}
