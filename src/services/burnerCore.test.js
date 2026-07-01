import {
  metaAccountFromLocalSigner,
  syncMetaAccount,
} from './burnerKeys';
import { shouldUseBurnerCoreSend } from './burnerSend';

describe('burnerKeys', () => {
  it('syncMetaAccount prefers LocalSigner account when present', () => {
    const localMeta = metaAccountFromLocalSigner();
    if (!localMeta) {
      expect(syncMetaAccount(null)).toBeNull();
      return;
    }
    expect(syncMetaAccount(null)).toEqual(localMeta);
    expect(syncMetaAccount({ address: '0xdead', privateKey: '0x' + '1'.repeat(64) })).toEqual(localMeta);
  });
});

describe('burnerSend', () => {
  it('shouldUseBurnerCoreSend matches LocalSigner meta account', () => {
    const localMeta = metaAccountFromLocalSigner();
    if (!localMeta) {
      expect(shouldUseBurnerCoreSend(null)).toBe(false);
      return;
    }
    expect(shouldUseBurnerCoreSend(localMeta)).toBe(true);
    expect(shouldUseBurnerCoreSend({ address: '0xdead', privateKey: '0x' + '2'.repeat(64) })).toBe(false);
  });
});
