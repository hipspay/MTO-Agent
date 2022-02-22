export const toWei = (web3, amount) =>
    web3.utils.toWei(web3.utils.toBN(amount), 'ether');

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
