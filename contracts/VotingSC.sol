// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


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
    bool public votingEnded = false;

    constructor() public {
        admin = msg.sender;
        addCandidate("sorfina");
        addCandidate("Fadzlina");
        // Set the voting end time 
        votingEndTime = block.timestamp + 50000000; 
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
        //require(!voters[msg.sender], "You have already voted"); //checks whether the address of the caller (msg.sender) has already voted
        require(_candidateId > 0 && _candidateId <= candidatesCount, "Invalid candidate ID"); //user needs to select more than 0 and less than avaible candidate's count
        voters[msg.sender] = true; //Marks msg.sender as having voted by setting the corresponding value in the voters mapping to true
        candidates[_candidateId].voteCount++;
        emit votedEvent(_candidateId);
    }

    function getCandidate() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](candidatesCount);

        for (uint i = 1; i <= candidatesCount; i++) {
            allCandidates[i - 1] = candidates[i];
        }

        return allCandidates;
    }


    function getRemainingTime() public view onlyBeforeVotingEnd returns (uint) {
        uint remainingTime = votingEndTime - block.timestamp;
        return remainingTime;
    }

    function endVoting() public onlyBeforeVotingEnd {
            require(msg.sender == admin, "Only admin can end voting");
            votingEnded = true;
            votingEndTime = block.timestamp; // Set the end time to the current block timestamp
        }

    function displayWinner() public view returns (Candidate memory) {
        require(votingEnded, "Voting has not ended");

        Candidate memory winner;
        uint maxVotes = 0;

        for (uint i = 1; i <= candidatesCount; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winner = candidates[i];
            }
        }

        return winner;
    }

    function _hasVoted(address _voter) internal view returns (bool) {
        return voters[_voter];
    }



}
