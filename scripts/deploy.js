require("dotenv").config();
const { ethers: hardhatEthers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await hardhatEthers.getSigners();
    console.log(`Deploying contract with account: ${deployer.address}`);

    // Replace with actual addresses
    const orderlyContractAddress = "0x0EaC556c0C2321BA25b9DC01e4e3c95aD5CDCd2f";
    const usdcTokenAddress = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238";

    // Generate hashes
    const brokerHash = "0x95d85ced8adb371760e4b6437896a075632fbd6cefe699f8125a8bc1d9b19e5b";
    const tokenHash = "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa";

    const depositFee = 400000

    console.log("Broker Hash:", brokerHash);
    console.log("Token Hash:", tokenHash);

    // Deploy contract
    try {
        const OrderlyDeposit = await hardhatEthers.getContractFactory("OrderlyDeposit", deployer);
        console.log(orderlyContractAddress, usdcTokenAddress, brokerHash, tokenHash, depositFee)
        const contract = await OrderlyDeposit.deploy(
            orderlyContractAddress,
            usdcTokenAddress,
            brokerHash,
            tokenHash,
            depositFee
        );
        await contract.deployed();
    console.log(`OrderlyDeposit deployed at: ${contract.address}`);
    } catch (error) {
console.error("Deployment failed:", error);

        if (error.reason) {
            console.error("Reason:", error.reason);
        }

        if (error.transaction) {
            console.error("Transaction data:", error.transaction);
        }

        if (error.receipt) {
            console.error("Receipt:", error.receipt);
        }

        process.exit(1);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
