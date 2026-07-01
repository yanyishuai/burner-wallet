import core, { mainAsset as xdaiAsset } from '../core';
import { metaAccountFromLocalSigner } from './burnerKeys';

const XDAI_NETWORK = '100';

export function shouldUseBurnerCoreSend(metaAccount) {
  const local = metaAccountFromLocalSigner();
  return !!(
    local &&
    metaAccount &&
    local.address.toLowerCase() === metaAccount.address.toLowerCase()
  );
}

export function sendNativeWithBurnerCore({ from, to, amount, message }) {
  return xdaiAsset.send({
    from,
    to,
    ether: `${amount}`,
    message: message || undefined,
  });
}

export async function signTransactionWithBurnerCore(tx) {
  return core.signTx(tx);
}

export function sendSignedTransaction(network, rawTransaction) {
  const web3 = core.getWeb3(network);
  return new Promise((resolve, reject) => {
    web3.eth
      .sendSignedTransaction(rawTransaction)
      .on('receipt', resolve)
      .on('error', reject);
  });
}

export function wrapNativeSend(originalSend, getMetaAccount) {
  return function burnerCoreNativeSend(to, value, gasLimit, txData, cb) {
    let callback = cb;
    let message = false;

    if (typeof gasLimit === 'function') {
      callback = gasLimit;
    } else if (typeof txData === 'function') {
      callback = txData;
    } else {
      message = txData;
    }

    if (typeof callback !== 'function') {
      return;
    }

    const metaAccount = getMetaAccount();
    if (!shouldUseBurnerCoreSend(metaAccount)) {
      return originalSend(to, value, gasLimit, txData, callback);
    }

    sendNativeWithBurnerCore({
      from: metaAccount.address,
      to,
      amount: value,
      message: message || undefined,
    })
      .then(receipt => callback(receipt))
      .catch(error => callback(error));
  };
}

export { XDAI_NETWORK };
