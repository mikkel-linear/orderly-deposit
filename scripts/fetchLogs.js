const { ethers: hardhatEthers, upgrades } = require("hardhat");
async function fetchEvents() {
    const contract = await hardhatEthers.getContractAt("OrderlyDeposit", "0x289A06513a4C4d9bF7DBD201c01BA2492fe6e03C");

    const filter = contract.filters.DebugBalance();
    const logs = await contract.queryFilter(filter, "latest");

    logs.forEach((log) => {
        console.log(`📌 DebugBalance Event`);
        console.log(`User: ${log.args.user}`);
        console.log(`Balance: ${hardhatEthers.formatUnits(log.args.balance, 6)} USDC`);
        console.log(`Required: ${hardhatEthers.formatUnits(log.args.required, 6)} USDC`);
        console.log("----------------------------");
    });
}

fetchEvents();
