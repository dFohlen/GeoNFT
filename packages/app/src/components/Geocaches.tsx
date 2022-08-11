import React, { useEffect, useState } from 'react';
import { useAnchor } from '../hooks/useAnchor';
import { getGeocaches } from '../api/getGeocaches';
import { ProgramAccount } from '@project-serum/anchor';

export default function Geocaches() {
    const program = useAnchor();
    // const [geocaches, setGeocaches] = useState<
    //     {
    //         pubkey: PublicKey;
    //         account: AccountInfo<Buffer | ParsedAccountData>;
    //     }[]
    // >();
    const [geocaches, setGeocaches] = useState<ProgramAccount[]>();

    useEffect(() => {
        // declare the data fetching function
        if (!geocaches) {
            const fetchData = async () => {
                const geocaches = await getGeocaches(program);
                console.log(geocaches);
                setGeocaches(geocaches);
            };

            // call the function
            fetchData()
                // make sure to catch any error
                .catch(console.error);
        }
    }, [program, geocaches]);

    return (
        <>
            {!geocaches ? (
                <div>
                    <p>Loading geocaches...</p>
                </div>
            ) : geocaches.length === 0 ? (
                <div>
                    <p>No geocaches</p>
                </div>
            ) : (
                geocaches?.map((geocache) => (
                    <div key={geocache.publicKey.toString()}>
                        <p>{geocache.publicKey.toString()}</p>
                        <p>{geocache.account.location}</p>
                    </div>
                ))
            )}
        </>
    );
}
