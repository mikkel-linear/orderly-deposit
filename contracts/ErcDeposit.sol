pragma solidity ^0.8.24;

import "../types/VaultTypes.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IUniswapV2Router02} from "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

interface IOrderlyContract {
    function getDepositFee(
        address account,
        VaultTypes.VaultDepositFE memory data
    ) external view returns (uint256);
    function deposit(VaultTypes.VaultDepositFE memory data) external payable;
    function depositTo(
        address receiver,
        VaultTypes.VaultDepositFE memory data
    ) external payable;
}

contract ErcDeposit {
    address public orderlyContractAddress;
    bytes32 public brokerHash;
    bytes32 public tokenHash;
    uint128 public depositFee;

    constructor(
        address _orderlyContractAddress,
        address _usdcToken,
        bytes32 _brokerHash,
        bytes32 _tokenHash,
        uint128 _depositFee
    ) {
        orderlyContractAddress = _orderlyContractAddress;
        tokenHash = _tokenHash;
        brokerHash = _brokerHash;
        depositFee = _depositFee;
        _setMaxApproval(_usdcToken);
    }

    function _setMaxApproval(address token) internal {
        IERC20(token).approve(orderlyContractAddress, type(uint256).max);
    }

    function depositWithPayable(
        address sender,
        bytes32 orderlyId,
        uint128 amount
    ) internal {
        VaultTypes.VaultDepositFE memory data = VaultTypes.VaultDepositFE({
            accountId: orderlyId,
            brokerHash: brokerHash,
            tokenHash: tokenHash,
            tokenAmount: amount
        });
        IOrderlyContract orderlyContract = IOrderlyContract(
            orderlyContractAddress
        );
        uint256 orderlyDepositFee = getDepositEstimate(sender, data);
        require(msg.value >= orderlyDepositFee, "Insufficient deposit fee");
        orderlyContract.depositTo{value: orderlyDepositFee}(sender, data);
    }

    function deposit(
        address sender,
        bytes32 orderlyId,
        uint128 amount
    ) internal {
        VaultTypes.VaultDepositFE memory data = VaultTypes.VaultDepositFE({
            accountId: orderlyId,
            brokerHash: brokerHash,
            tokenHash: tokenHash,
            tokenAmount: amount
        });
        IOrderlyContract orderlyContract = IOrderlyContract(
            orderlyContractAddress
        );
        uint256 orderlyDepositFee = getDepositEstimate(sender, data);
        require(
            address(this).balance >= orderlyDepositFee,
            "Insufficient deposit fee in contract funds"
        );
        orderlyContract.depositTo{value: orderlyDepositFee}(sender, data);
    }

    function getDepositEstimate(
        address sender,
        VaultTypes.VaultDepositFE memory data
    ) internal view returns (uint256) {
        IOrderlyContract orderlyContract = IOrderlyContract(
            orderlyContractAddress
        );
        return orderlyContract.getDepositFee(sender, data);
    }

    function getDepositEstimate(
        address sender,
        bytes32 orderlyId,
        uint128 amount
    ) public view returns (uint256) {
        VaultTypes.VaultDepositFE memory data = VaultTypes.VaultDepositFE({
            accountId: orderlyId,
            brokerHash: brokerHash,
            tokenHash: tokenHash,
            tokenAmount: amount
        });
        return getDepositEstimate(sender, data);
    }
}
