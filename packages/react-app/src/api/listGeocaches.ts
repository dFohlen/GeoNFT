import { Program } from '@project-serum/anchor';
import { NftGeocaching } from '@nft-geocaching/anchor/target/types/nft_geocaching';

export async function listGeocaches(program: Program<NftGeocaching>): Promise<any> {
    console.log('Listing geocaches', program);
    let geocaches = await program.account.geocache.all();
    console.log('Geocaches', geocaches);
    geocaches = geocaches.filter(({ account }) => {
        return account.active ? true : false;
    });
    return geocaches;
}
