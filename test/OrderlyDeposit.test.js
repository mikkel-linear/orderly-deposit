const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("OrderlyDeposit Contract with Real USDC", function () {
    let usdc, orderlyDeposit, owner, user;
    const USDC_ADDRESS = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"; // Real USDC on Arbitrum Sepolia
    const WHALE = "0x42634850e5D4A383E3c907c7377622D114C6c506"; // Find an account with USDC
    const DEPOSIT_AMOUNT = 1000000; // Deposit 100 USDC

    beforeEach(async function () {
        // Fork Arbitrum Sepolia
        await network.provider.send("hardhat_reset", [
            {
                forking: {
                    jsonRpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
                },
            },
        ]);

        // Get test accounts
        [owner, user] = await ethers.getSigners();

        // 1️⃣ Get the Real USDC Contract
        usdc = await ethers.getContractAt("IERC20", USDC_ADDRESS);
        console.log("✅ Real USDC at:", USDC_ADDRESS);

        // 2️⃣ Deploy OrderlyDeposit contract
        const OrderlyDeposit = await ethers.getContractFactory("OrderlyDeposit");
        orderlyDeposit = await OrderlyDeposit.deploy(
            owner.address, // Orderly contract address (mocked as owner for now)
            USDC_ADDRESS, // Real USDC address
            "0x95d85ced8adb371760e4b6437896a075632fbd6cefe699f8125a8bc1d9b19e5b",
            "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa",
            400000
        );
        await orderlyDeposit.waitForDeployment();
        console.log("✅ OrderlyDeposit deployed at:", await orderlyDeposit.getAddress());

        // 3️⃣ Impersonate a USDC Whale
        await network.provider.send("hardhat_impersonateAccount", [WHALE]);
        const whaleSigner = await ethers.getSigner(WHALE);

        // 4️⃣ Transfer USDC to the test user
        await usdc.connect(whaleSigner).transfer(user.address, DEPOSIT_AMOUNT);
        console.log("✅ User received USDC:", ethers.formatUnits(await usdc.balanceOf(user.address), 6));

        // 5️⃣ User Approves OrderlyDeposit to Spend USDC
        await usdc.connect(user).approve(await orderlyDeposit.getAddress(), DEPOSIT_AMOUNT);
        console.log("✅ USDC allowance set for OrderlyDeposit");
    });

    it("Should allow the user to deposit real USDC to Orderly", async function () {
        // 6️⃣ User Calls depositToOrderly
        await expect(orderlyDeposit.connect(user).depositToOrderly(
            "0x96eca2f6db518ca9aef832914dcd1c392ce8eb40cdde68f6408d6a2ade5df9f9",
            DEPOSIT_AMOUNT
        )).to.emit(orderlyDeposit, "DebugLog");

        // 7️⃣ Check contract balance after deposit
        const contractBalance = await usdc.balanceOf(await orderlyDeposit.getAddress());
        expect(contractBalance).to.equal(DEPOSIT_AMOUNT);
        console.log("✅ OrderlyDeposit received USDC:", ethers.formatUnits(contractBalance, 6));
    });
});
