// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract VotingContract {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    Candidate[] public candidateArray;
    uint public candidatesCount;

    event votedEvent(uint indexed _candidateId);

    address public owner;
    uint public votingEndTime;

    constructor() {
        owner = msg.sender;
        addCandidate("Samarth Ghante");
        addCandidate("Kanishk Kumar");
        // Set the voting end time to 10 minutes after deployment
        votingEndTime = block.timestamp + 10; // 600 seconds = 10 minutes
    }

    modifier onlyBeforeVotingEnd() {
        require(block.timestamp < votingEndTime, "Voting has ended");
        _;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == owner, "Only owner can add candidates");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidateArray.push(Candidate(candidatesCount, _name, 0));
    }

    function vote(uint _candidateId) public onlyBeforeVotingEnd {
        require(!voters[msg.sender], "You have already voted");
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID");
        voters[msg.sender] = true;
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidateArray;
    }

    function getVotingEndTime() public view returns (uint) {
        return votingEndTime;
    }
}
