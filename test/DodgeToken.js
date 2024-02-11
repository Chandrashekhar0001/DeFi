const {expect} = require("chai");
const hre = require("hardaht");
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

            await dodgeToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await dodgeToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        })
    })
});