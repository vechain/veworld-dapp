pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

contract MyVIP180 is ERC20PresetMinterPauser {

    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20PresetMinterPauser(name, symbol) {
        _decimals = decimals_;
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
}