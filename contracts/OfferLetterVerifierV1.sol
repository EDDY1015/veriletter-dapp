// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract OfferLetterVerifierV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    struct OfferLetter {
        address issuerWallet;
        bytes32 issuerId;
        bytes32 subjectIdHash;
        bytes32 fileHash;
        uint256 issueDate;
        uint256 expiryDate;
        bool isRevoked;
    }

    mapping(bytes32 => OfferLetter) private letters; // fileHash => OfferLetter
    mapping(address => bool) public authorizedIssuers;

    event OfferLetterIssued(
        bytes32 indexed fileHash,
        address indexed issuerWallet,
        bytes32 indexed issuerId,
        bytes32 subjectIdHash,
        uint256 issueDate,
        uint256 expiryDate
    );

    event OfferLetterRevoked(bytes32 indexed fileHash);
    event ExpiryUpdated(bytes32 indexed fileHash, uint256 oldExpiry, uint256 newExpiry);
    event OfferLetterBurned(bytes32 indexed fileHash);
    event IssuerAdded(address issuer);
    event IssuerRemoved(address issuer);

    modifier onlyIssuer() {
        require(authorizedIssuers[msg.sender], "Not an authorized issuer");
        _;
    }

    function initialize(address contractOwner, address initialIssuer) public initializer {
        __Ownable_init(contractOwner);
        __UUPSUpgradeable_init();
        authorizedIssuers[initialIssuer] = true;
        emit IssuerAdded(initialIssuer);
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    function issueOfferLetter(
        bytes32 issuerId,
        bytes32 subjectIdHash,
        bytes32 fileHash,
        uint256 expiryDate
    ) external onlyIssuer {
        require(letters[fileHash].issuerWallet == address(0), "Offer letter already exists");

        OfferLetter memory newLetter = OfferLetter({
            issuerWallet: msg.sender,
            issuerId: issuerId,
            subjectIdHash: subjectIdHash,
            fileHash: fileHash,
            issueDate: block.timestamp,
            expiryDate: expiryDate,
            isRevoked: false
        });

        letters[fileHash] = newLetter;

        emit OfferLetterIssued(
            fileHash,
            msg.sender,
            issuerId,
            subjectIdHash,
            block.timestamp,
            expiryDate
        );
    }

    function revokeOfferLetter(bytes32 fileHash) external {
        OfferLetter storage letter = letters[fileHash];
        require(letter.issuerWallet == msg.sender, "Only the issuer can revoke");
        require(!letter.isRevoked, "Already revoked");

        letter.isRevoked = true;
        emit OfferLetterRevoked(fileHash);
    }

    function updateExpiry(bytes32 fileHash, uint256 newExpiry) external onlyIssuer {
        OfferLetter storage letter = letters[fileHash];
        require(letter.issuerWallet == msg.sender, "Only issuer can update");
        require(!letter.isRevoked, "Cannot update revoked letter");
        require(newExpiry > letter.expiryDate, "Must extend expiry");

        uint256 old = letter.expiryDate;
        letter.expiryDate = newExpiry;
        emit ExpiryUpdated(fileHash, old, newExpiry);
    }

    function burnLetter(bytes32 fileHash) external onlyOwner {
        require(letters[fileHash].issuerWallet != address(0), "Letter does not exist");
        delete letters[fileHash];
        emit OfferLetterBurned(fileHash);
    }

    function isLetterValid(bytes32 fileHash) external view returns (bool) {
        OfferLetter memory letter = letters[fileHash];
        if (letter.issuerWallet == address(0)) return false;
        if (letter.isRevoked) return false;
        if (block.timestamp > letter.expiryDate) return false;
        return true;
    }

    function getLetterDetails(bytes32 fileHash) external view returns (
        address issuerWallet,
        bytes32 issuerId,
        bytes32 subjectIdHash,
        uint256 issueDate,
        uint256 expiryDate,
        bool isRevoked
    ) {
        OfferLetter memory letter = letters[fileHash];
        require(letter.issuerWallet != address(0), "Letter not found");
        return (
            letter.issuerWallet,
            letter.issuerId,
            letter.subjectIdHash,
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

    uint256[50] private __gap; // Storage gap for future upgrades
}
