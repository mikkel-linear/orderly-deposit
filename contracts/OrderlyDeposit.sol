// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ErcDeposit.sol";

contract OrderlyDeposit is ErcDeposit {
    address public admin;
    address public candidate;
    address private __usdcToken;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    constructor(
        address _orderlyContractAddress,
        address _usdcToken,
        bytes32 _brokerHash,
        bytes32 _tokenHash,
        uint128 _depositFee
    )
        ErcDeposit(
            _orderlyContractAddress,
            _usdcToken,
            _brokerHash,
            _tokenHash,
            _depositFee
        )
    {
        __usdcToken = _usdcToken;
        admin = msg.sender;
    }

    event DebugBalance(address indexed user, uint256 balance, uint256 required);

    function depositToOrderly(bytes32 orderlyId, uint128 amount) external {
        require(amount > 0, "Deposit amount must be greater than zero");
        uint256 userBalance = IERC20(__usdcToken).balanceOf(msg.sender);

        // Emit balance before requiring
        emit DebugBalance(msg.sender, userBalance, amount);
        require(
            IERC20(__usdcToken).balanceOf(msg.sender) >= amount,
            "User balance too low Before transfer"
        );

        // Transfer USDC from user to contract
        require(
            IERC20(__usdcToken).transferFrom(msg.sender, address(this), amount),
            "USDC transfer failed"
        );

        // Ensure contract has enough balance before deposit
        require(
            IERC20(__usdcToken).balanceOf(address(this)) >= amount,
            "Contract balance too low after transfer"
        );

        // Deposit to Orderly on behalf of the user
        deposit(msg.sender, orderlyId, amount);
    }

    function setCandidate(address _candidate) external onlyAdmin {
        candidate = _candidate;
    }

    function assumeAdminRole() external {
        require(
            msg.sender == candidate,
            "Only the candidate can assume the admin role"
        );
        admin = candidate;
        candidate = address(0);
    }

    function setDepositFee(uint128 _depositFee) external onlyAdmin {
        depositFee = _depositFee;
    }

    function withdrawUSDC(uint256 amount) external onlyAdmin {
        IERC20(__usdcToken).transfer(admin, amount);
    }

    receive() external payable {}
    fallback() external payable {}
}
