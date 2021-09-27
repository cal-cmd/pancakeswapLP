const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('Token1.sol');
const Token2 = artifacts.require('Token2.sol');
const BigNumber = require('bignumber.js');

const total = new BigNumber(210000000);
const total1 = new BigNumber(1);

module.exports = async done => {
  try {
    const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0xb7926c0430afb07aa7defde6da862ae0bde767bc');
    const router = await Router.at('0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3');
    const token1 = await Token1.at('0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd');
    const token2 = await Token2.new();
    const pairAddress = await factory.createPair.call(token1.address, token2.address);
    const tx = await factory.createPair(token1.address, token2.address);
    await token1.approve(router.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
    await token2.approve(router.address, "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"); 
    await router.addLiquidity(
      token2.address,
      token1.address,
      total.shiftedBy(18),
      total1.shiftedBy(16), // shift to 18 on mainnet launch
      1000,
      10,
      admin,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(admin); 
    console.log(`balance LP: ${balance.toString()}`);
    } catch(e) {
      console.log(e);
    }
  done();
};
