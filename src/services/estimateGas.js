const GAS_BUFFER_NUMERATOR = 12;
const GAS_BUFFER_DENOMINATOR = 10;

module.exports = async function estimateTxGas(web3, tx, fallbackGas) {
  try {
    const estimate = await web3.eth.estimateGas(tx);
    return Math.ceil((estimate * GAS_BUFFER_NUMERATOR) / GAS_BUFFER_DENOMINATOR);
  } catch (err) {
    console.log('estimateGas failed, using fallback', err);
    return fallbackGas;
  }
};
