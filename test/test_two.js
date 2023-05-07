const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Variables", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.

  async function deployVvariablesContract() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;

    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Variables = await ethers.getContractFactory("Variables");
    const variablesContract = await Variables.deploy(unlockTime);

    return { variablesContract, unlockTime, owner, otherAccount };
  }

  describe("test if randomString variable  declared", function () {
    it("is declared?", async function () {
      const { variablesContract } = await loadFixture(deployVvariablesContract);
      expect(await variablesContract.randomString()).not.NaN;
    });
  });

});
