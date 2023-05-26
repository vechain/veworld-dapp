pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract MyVIP181 is ERC721PresetMinterPauserAutoId {

    constructor(string memory name, string memory symbol, string memory baseTokenURI) ERC721PresetMinterPauserAutoId(name, symbol, baseTokenURI) {
    }

        /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return string.concat(super.tokenURI(tokenId), ".json");
    }
}