require("dotenv").config();
const { ethers: hardhatEthers, upgrades } = require("hardhat");

async function main() {
    const [deployer] = await hardhatEthers.getSigners();
    console.log(`Deploying contract with account: ${deployer.address}`);

    // Replace with actual addresses
    const orderlyContractAddress = "0x0EaC556c0C2321BA25b9DC01e4e3c95aD5CDCd2f";
    // const usdcTokenAddress = "0xf3c3351d6bd0098eeb33ca8f830faf2a141ea2e1";
    const usdcTokenAddress = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
    // Generate hashes
    const brokerHash = "0x95d85ced8adb371760e4b6437896a075632fbd6cefe699f8125a8bc1d9b19e5b";
    const tokenHash = "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa";

    const depositFee = 400000

    console.log("Broker Hash:", brokerHash);
    console.log("Token Hash:", tokenHash);
    console.log("usdcTokenAddress:", usdcTokenAddress)
    // Deploy contract
    const OrderlyDeposit = await hardhatEthers.getContractFactory("OrderlyDeposit", deployer);
    
    const contract = await OrderlyDeposit.deploy(
        orderlyContractAddress,
        usdcTokenAddress,
        brokerHash,
        tokenHash,
        depositFee
    );

    await contract.waitForDeployment(); // Fix: Use `waitForDeployment()`

    console.log("Contract deployed at:", await contract.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
