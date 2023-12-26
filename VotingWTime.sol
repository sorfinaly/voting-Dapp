// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;

contract VotingSC {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(address => bool) public voters;
    mapping(uint => Candidate) public candidates;
    Candidate[] public candidateArray;
    uint public candidatesCount = 0;

    event votedEvent(uint indexed _candidateId);

    address public admin;
    uint public votingEndTime;

    constructor() {
        admin = msg.sender;
        addCandidate("sorfina");
        addCandidate("Fadzlina");
        // Set the voting end time 
        votingEndTime = block.timestamp + 50; 
    }

    modifier onlyBeforeVotingEnd() {
        require(block.timestamp < votingEndTime, "Voting has ended");
        _;
    }

    function addCandidate(string memory _name) public {
        require(msg.sender == admin, "Only admin can add candidates");
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
        candidateArray.push(Candidate(candidatesCount, _name, 0)); // this like is like append fx
    }

    function vote(uint _candidateId) public onlyBeforeVotingEnd {
        require(!voters[msg.sender], "You have already voted"); //checks whether the address of the caller (msg.sender) has already voted
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID"); //user needs to select more than 0 and less than avaible candidate's count
        voters[msg.sender] = true; //Marks msg.sender as having voted by setting the corresponding value in the voters mapping to true
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    function getCandidates() public view returns (Candidate[] memory) {
        return candidateArray;
    }

    function getRemainingTime() public view onlyBeforeVotingEnd returns (uint) {
        uint remainingTime = votingEndTime - block.timestamp;
        return remainingTime;
    }


}
