import { localSigner } from '../core';

function normalizePrivateKey(privateKey) {
  if (!privateKey) {
    return null;
  }
  return privateKey.indexOf('0x') === 0 ? privateKey : `0x${privateKey}`;
}

export function metaAccountFromLocalSigner() {
  if (!localSigner || !localSigner.isAvailable()) {
    return null;
  }
  const accounts = localSigner.getAccounts();
  if (!accounts.length) {
    return null;
  }
  const address = accounts[0];
  const privateKey = localSigner.invoke('readKey', address);
  return { address, privateKey };
}

export function importPrivateKeyToLocalSigner(privateKey) {
  const pk = normalizePrivateKey(privateKey);
  if (!pk || !/^0x[0-9a-fA-F]{64}$/.test(pk)) {
    throw new Error('Invalid private key');
  }
  const account = localSigner.getAccounts()[0];
  const newAddress = localSigner.invoke('writeKey', account, pk);
  return {
    address: newAddress,
    privateKey: localSigner.invoke('readKey', newAddress),
  };
}

export function burnLocalSignerKey() {
  const account = localSigner.getAccounts()[0];
  const newAddress = localSigner.invoke('burn', account);
  return {
    address: newAddress,
    privateKey: localSigner.invoke('readKey', newAddress),
  };
}

export function syncMetaAccount(metaAccount) {
  const localMeta = metaAccountFromLocalSigner();
  if (!localMeta) {
    return metaAccount;
  }
  if (
    !metaAccount ||
    metaAccount.address.toLowerCase() !== localMeta.address.toLowerCase()
  ) {
    return localMeta;
  }
  return metaAccount;
}
