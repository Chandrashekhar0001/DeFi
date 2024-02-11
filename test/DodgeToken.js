const {expect} = require("chai");
const hre = require("hardhat");
const { beforeEach, describe, it } = require("node:test");
const { isAsyncFunction } = require("util/types");

describe("DodgeToken contract",function(){
    // global variables
    let Token;
    let dodgeToken;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 20000000;
    let tokenReward = 25;

    beforeEach(async function() {
        Token = await ethers.getContractFactory("DodgeToken");
        [owner, addr1, addr2] = await hre.ethers.getSigners();

        dodgeToken = await Token.deploy(tokenCap, tokenReward);
    });

    describe("Deployment", function(){
        it("Should set the right owner",async function(){
            expect(await dodgeToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total suply of tokens to the owner", async function(){
            const ownerBalance = await dodgeToken.balanceOf(owner.address);
            expect(await dodgeToken.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the max capped supply to the argument provided during deployment", async function(){
            const cap = await dodgeToken.cap();
            expect(Number(hre.ethers.utils.formatEther(cap))).to.ewual(tokenCap);
        });

        it("Should set the blockReward to the argument provided during deployment",async function(){
            const blockReward = await dodgeToken.blockReward();
            expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(tokenReward);
        });
    });

    describe("Transactions", function(){
        it("Should transfer tokens between accounts",async function(){
            //transfer 25 tokens from owner to addr1
            await dodgeToken.transfer(addr1.address,25);
            const addr1Balance = await dodgeToken.balanceOf(addr1.address);
            expect(addr1Balance.to.equal(25));

            await dodgeToken.connect(addr1).transfer(addr2.address, 25);
            const addr2Balance = await dodgeToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(25);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await dodgeToken.balanceOf(owner.address);
            // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
            // `require` will evaluate false and revert the transaction.
            await expect(
              dodgeToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
      
            // Owner balance shouldn't have changed.
            expect(await dodgeToken.balanceOf(owner.address)).to.equal(
              initialOwnerBalance
            );
          });
      
          it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await dodgeToken.balanceOf(owner.address);
      
            // Transfer 100 tokens from owner to addr1.
            await dodgeToken.transfer(addr1.address, 100);
      
            // Transfer another 50 tokens from owner to addr2.
            await dodgeToken.transfer(addr2.address, 25);
      
            // Check balances.
            const finalOwnerBalance = await dodgeToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(125));
      
            const addr1Balance = await dodgeToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);
      
            const addr2Balance = await dodgeToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(25);
         
        });
    })
});