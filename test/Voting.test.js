const VotingSC = artifacts.require("VotingSC");

contract("Vote Casting", (accounts) => {
  it("should allow a voter to cast a vote", async () => {
    const votingInstance = await VotingSC.deployed();
    const candidateId = 1; // Change this based on your candidate IDs

    const result = await votingInstance.vote(candidateId, { from: accounts[1] });

    // Assert that the votedEvent is emitted or check the result based on your implementation
    assert.equal(result.logs[0].event, "votedEvent", "Vote not cast successfully");
  });
});

contract("End Voting Session", (accounts) => {
  it("should not allow a non-admin to end the voting session", async () => {
    const votingInstance = await VotingSC.deployed();

    // Try ending the voting session with a non-admin account
    try {
      await votingInstance.endVoting({ from: accounts[1] });
      assert.fail("Expected an error but voting session ended successfully");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "Expected 'revert' but got different error: " + error.message
      );
    }
  });
});

contract("Candidate Addition", (accounts) => { 
  it("should not allow a non-admin to add a new candidate", async () => {
    const votingInstance = await VotingSC.deployed();
    const candidateName = "Invalid Candidate";

    // Try adding a candidate with a non-admin account
    try {
      await votingInstance.addCandidate(candidateName, { from: accounts[1] });
      assert.fail("Expected an error but candidate was added successfully");
    } catch (error) {
      assert.include(
        error.message,
        "revert",
        "Expected 'revert' but got different error: " + error.message
      );
    }
  });
});


