import bufficorn from './bufficorn.png';
import cypherpunk from './cypherpunk.png';
import burnerlogo from './burnerwallet.png';

export const POA_XDAI_NODE = 'https://dai.poa.network';
export const DOLLAR_SYMBOL = '$';

export let XDAI_PROVIDER = POA_XDAI_NODE;
export let WEB3_PROVIDER;
export let CLAIM_RELAY;
export let ERC20TOKEN;
export let ERC20VENDOR;
export let ERC20IMAGE;
export let ERC20NAME;
export let LOADERIMAGE = burnerlogo;

function hostIncludes(hostname, fragment) {
  return hostname.indexOf(fragment) >= 0;
}

/**
 * Apply deployment settings for the current hostname.
 * Add a new branch here when whitelabeling another domain.
 */
export function applyHostnameConfig(hostname = window.location.hostname) {
  if (hostIncludes(hostname, 'localhost') || hostIncludes(hostname, '10.0.0.107')) {
    XDAI_PROVIDER = 'http://localhost:8545';
    WEB3_PROVIDER = 'http://localhost:8545';
    CLAIM_RELAY = 'http://localhost:18462';
    if (true) {
      ERC20NAME = false;
      ERC20TOKEN = false;
      ERC20IMAGE = false;
    } else {
      ERC20NAME = 'BUFF';
      ERC20VENDOR = 'VendingMachine';
      ERC20TOKEN = 'ERC20Vendable';
      ERC20IMAGE = bufficorn;
      XDAI_PROVIDER = 'http://localhost:8545';
      WEB3_PROVIDER = 'http://localhost:8545';
      LOADERIMAGE = bufficorn;
    }
  } else if (hostIncludes(hostname, 's.xdai.io')) {
    WEB3_PROVIDER = POA_XDAI_NODE;
    CLAIM_RELAY = 'https://x.xdai.io';
    ERC20TOKEN = false;
  } else if (hostIncludes(hostname, 'wallet.galleass.io')) {
    WEB3_PROVIDER = 'http://localhost:8545';
    ERC20TOKEN = false;
    document.domain = 'galleass.io';
  } else if (hostIncludes(hostname, 'qreth')) {
    WEB3_PROVIDER = 'https://mainnet.infura.io/v3/e0ea6e73570246bbb3d4bd042c4b5dac';
    CLAIM_RELAY = false;
    ERC20TOKEN = false;
  } else if (hostIncludes(hostname, 'xdai')) {
    WEB3_PROVIDER = POA_XDAI_NODE;
    CLAIM_RELAY = 'https://x.xdai.io';
    ERC20TOKEN = false;
  } else if (hostIncludes(hostname, 'buffidai')) {
    WEB3_PROVIDER = POA_XDAI_NODE;
    CLAIM_RELAY = 'https://x.xdai.io';
    ERC20NAME = 'BUFF';
    ERC20VENDOR = 'VendingMachine';
    ERC20TOKEN = 'ERC20Vendable';
    ERC20IMAGE = bufficorn;
    LOADERIMAGE = bufficorn;
  } else if (hostIncludes(hostname, 'burnerwithrelays')) {
    WEB3_PROVIDER = 'https://dai.poa.network';
    ERC20NAME = false;
    ERC20TOKEN = false;
    ERC20IMAGE = false;
  }
}

applyHostnameConfig();
