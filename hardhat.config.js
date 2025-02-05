require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "./.env" });

if (!process.env.PRIVATE_KEY || !process.env.ARBITRUM_SEPOLIA_RPC || !process.env.ARBISCAN_API_KEY) {
    throw new Error("Missing environment variables. Check .env file!");
}
console.log(process.env.ARBISCAN_API_KEY)
module.exports = {
    solidity: "0.8.24",
    networks: {
        arbitrumSepolia: {
            chainId: 421614,
            url: process.env.ARBITRUM_SEPOLIA_RPC,
            accounts: [process.env.PRIVATE_KEY]
        }
    },
    etherscan: {
        apiKey: {
            arbitrumSepolia: process.env.ARBISCAN_API_KEY
        }
    }
};
