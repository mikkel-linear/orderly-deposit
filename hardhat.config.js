require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./.env" });

if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_SEPOLIA_RPC) {
    throw new Error("Missing environment variables. Check .env file!");
}

module.exports = {
    solidity: "0.8.24",
    networks: {
        arbitrumSepolia: {
            chainId: 421614,
            url: process.env.ARBITRUM_SEPOLIA_RPC,
            accounts: [process.env.PRIVATE_KEY]
        }
    }
};
