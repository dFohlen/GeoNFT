import {transact} from '@solana-mobile/mobile-wallet-adapter-protocol-web3js';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import {useAnchor} from '../utils/useAnchor';

import useAuthorization from '../utils/useAuthorization';
import useGuardedCallback from '../utils/useGuardedCallback';

type Props = Readonly<{
  children?: React.ReactNode;
}>;

export default function CreateGeocacheButton({children}: Props) {
  const [loading, setLoading] = useState(false);
  const {authorizeSession, selectedAccount} = useAuthorization();

  const createGeocachesGuarded = useGuardedCallback(async () => {
    const [signature] = await transact(async wallet => {
      const freshAccount = await authorizeSession(wallet);
      if (!freshAccount && !selectedAccount) {
        throw new Error('No account selected');
      }

      const program = useAnchor(wallet);

      // TODO: Create geocache

      let geocaches = await program.account.geocache.all();
      console.log('Geocaches', geocaches);
    });
    return signature;
  }, [authorizeSession, selectedAccount]);
  return (
    <>
      <View style={styles.buttonGroup}>
        <Button
          loading={loading}
          onPress={async () => {
            if (loading) {
              return;
            }
            setLoading(true);
            try {
              await createGeocachesGuarded();
            } finally {
              setLoading(false);
            }
          }}
          mode="contained"
          style={styles.actionButton}>
          {children}
          </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    flex: 1,
    marginEnd: 8,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
});
