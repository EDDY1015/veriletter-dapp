// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract OfferLetterVerifier is Initializable, UUPSUpgradeable, OwnableUpgradeable {

    struct OfferLetter {
        address issuer;
        bytes32 studentHash; // hash(name + passport)
        bytes32 fileHash; // hash of the PDF
        uint256 issueDate;
        uint256 expiryDate;
        bool isRevoked;
    }

    mapping(bytes32 => OfferLetter) private letters; // fileHash => OfferLetter
    mapping(address => bool) public authorizedIssuers;

    event OfferLetterIssued(bytes32 indexed fileHash, address indexed issuer);
    event OfferLetterRevoked(bytes32 indexed fileHash);
    event IssuerAdded(address issuer);
    event IssuerRemoved(address issuer);

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

   function initialize(address contractOwner, address initialIssuer) public initializer {
    __Ownable_init(contractOwner);         // Owner can manage upgrades + issuers
    __UUPSUpgradeable_init();              // Required for upgradeable pattern
    authorizedIssuers[initialIssuer] = true;
    emit IssuerAdded(initialIssuer);
}


    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function issueOfferLetter(
        bytes32 studentHash,
        bytes32 fileHash,
        uint256 expiryDate
    ) external onlyIssuer {
        require(letters[fileHash].issuer == address(0), "Offer letter already exists");

        letters[fileHash] = OfferLetter({
            issuer: msg.sender,
            studentHash: studentHash,
            fileHash: fileHash,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            isRevoked: false
        });

        emit OfferLetterIssued(fileHash, msg.sender);
    }

    function revokeOfferLetter(bytes32 fileHash) external {
        OfferLetter storage letter = letters[fileHash];
        require(letter.issuer == msg.sender, "Only the issuer can revoke");
        require(!letter.isRevoked, "Already revoked");

        letter.isRevoked = true;
        emit OfferLetterRevoked(fileHash);
    }

    function isLetterValid(bytes32 fileHash) external view returns (bool) {
        OfferLetter memory letter = letters[fileHash];
        if (letter.issuer == address(0)) return false;
        if (letter.isRevoked) return false;
        if (block.timestamp > letter.expiryDate) return false;
        return true;
    }

    function getLetterDetails(bytes32 fileHash) external view returns (
        address issuer,
        bytes32 studentHash,
        uint256 issueDate,
        uint256 expiryDate,
        bool isRevoked
    ) {
        OfferLetter memory letter = letters[fileHash];
        require(letter.issuer != address(0), "Letter not found");
        return (
            letter.issuer,
            letter.studentHash,
            letter.issueDate,
            letter.expiryDate,
            letter.isRevoked
        );
    }

    function addIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
        emit IssuerAdded(issuer);
    }

    function removeIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }
}
