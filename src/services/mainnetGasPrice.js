const axios = require('axios');

const ETH_GAS_STATION_URL = 'https://ethgasstation.info/json/ethgasAPI.json';
const REQUEST_TIMEOUT_MS = 8000;

async function fetchMainnetGasPriceGwei(web3, gasBoostPrice = 0.25) {
  try {
    const response = await axios.get(ETH_GAS_STATION_URL, {
      crossdomain: true,
      timeout: REQUEST_TIMEOUT_MS,
    });
    if (response && response.data && response.data.average > 0 && response.data.average < 1000) {
      const boosted = response.data.average + response.data.average * gasBoostPrice;
      return Math.round(boosted * 100) / 1000;
    }
    console.log('ethgasstation returned unusable gas data', response && response.data);
  } catch (err) {
    console.log('ethgasstation unavailable, falling back to node gas price', err);
  }

  const wei = await web3.eth.getGasPrice();
  const boostedWei = Math.ceil(parseInt(wei, 10) * (1 + gasBoostPrice));
  return Math.max(Math.round(boostedWei / 1e8) / 10, 1);
}

module.exports = fetchMainnetGasPriceGwei;
