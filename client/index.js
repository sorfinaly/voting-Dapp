import Web3 from 'web3';
const configuration = require("../build/contracts/VotingSC.json");
const CONTRACT_ADDRESS = configuration.networks['5777'].address;
const CONTRACT_ABI = configuration.abi;

const web3 = new Web3(Web3.givenProvider || 'HTTP://127.0.0.1:7545');   

const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

let account;

const accountElement = document.getElementById('account');
const candidateElement = document.getElementById('candidates');

async function updateCandidateList() {
    const candidateListContainer = document.getElementById('candidateList');
    candidateListContainer.innerHTML = ''; // Clear previous content

    try {
        const candidates = await contract.methods.getCandidate().call();

        candidates.forEach((candidate, index) => {
            const label = document.createElement('label');
            label.innerHTML = `
                <div style="font-size: 25px; font-weight: bold; margin:14px;"><input type="radio" name="selectedCandidate" value="${index + 1}"> ${candidate.name}</div
            `;
            candidateListContainer.appendChild(label);
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        // Optionally display an error message to the user
    }
}

const fs = require('fs'); // If you are running this code in a Node.js environment

// Function to read the JSON file
function loadValidVoters() {
    const jsonData = fs.readFileSync('validVoters.json');
    return JSON.parse(jsonData);
}

// Function to check if the account is a valid voter
function isValidVoter(account) {
    const validVoters = loadValidVoters().validVoters;
    return validVoters.some(voter => voter.accountNumber === account);
}

async function getVoterName(account) {
    const validVoters = loadValidVoters().validVoters;
    
    const voter = validVoters.find(voter => voter.accountNumber === account);
    const adminAddress = await contract.methods.admin().call();
    
    if (voter) {
        console.log(`Valid voter found. Name: ${voter.name}`);
        accountElement.innerHTML = `Welcome, ${voter.name}!`;
    } else if (account === adminAddress) {
        console.log('Admin logged in');
        accountElement.innerHTML = 'Welcome, Admin!';
    } else {
        console.log('Not a valid voter');
        accountElement.innerHTML = 'NOT A VALID VOTER';
    }
}

// Function to cast a vote
async function castVote(account, candidateId) {

    if (!isValidVoter(account)) {
        // Display the warning message to the user
        document.getElementById('invalid').innerText = 'You are not a valid voter';
    }
    else{
        checkVotingStatus();
    try {
        const receipt = await contract.methods.vote(candidateId)
            .send({ from: account });

        return receipt; // Return the transaction receipt
    } catch (error) {
        console.error('Error casting vote:', error);
        throw error;
    }
    }
}

// Event listener for casting vote
document.getElementById('castVoteButton').addEventListener('click', async () => {
    const selectedCandidate = document.querySelector('input[name="selectedCandidate"]:checked').value;
    console.log('Selected candidate:', selectedCandidate);

    const candidateId = parseInt(selectedCandidate);
    
    try {
        const receipt = await castVote(curr, candidateId);
        console.log('Receipt:', receipt);
        // Update table after successful vote
        await refreshVotingResultsTable();
    } catch (error) {
    }
});

// Define an async function to use await
async function checkVotingStatus() {
    try {
        const voterHasVoted = await contract.methods.hasVoted(curr).call();
        console.log('Voter has voted:', voterHasVoted);


        if (voterHasVoted) {
            console.log('You have already voted.');
            document.getElementById('invalid').innerText = 'Error! You has casted a vote';
        } else {
            console.log('You have not voted yet.');
        }
    } catch (error) {
        console.error('Error checking if voter has voted:', error);
        // Handle the error if needed
    }
}

// Function to refresh/update the voting results table
async function refreshVotingResultsTable() {
    try {
        const candidate = await contract.methods.getCandidate().call();
        const candidatesTable = document.getElementById('resultsBody');
        candidatesTable.innerHTML = ''; // Clear the table before updating
        console.log('Candidates:', candidate);

        for (let i = 0; i < candidate.length; i++) {
            const row = candidatesTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);

            cell1.textContent = candidate[i].id;
            cell2.textContent = candidate[i].name;
            cell3.textContent = candidate[i].voteCount;
        }
    } catch (error) {
        console.error('Error refreshing voting results:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {

        // Wrap your code in an async function
        async function addCandidate() {
            try {
                document.getElementById('warningMessage').innerText = '';
                const candidateName = String(document.getElementById('candidateName').value);

                if (!candidateName.trim()) {
                    document.getElementById('warningMessage').innerText = 'Candidate name cannot be empty';
                    console.log('Candidate name cannot be empty');
                    return;
                }

                console.log('Candidate Name:', candidateName);
                // console.log(typeof candidateName);

                const adminAddress = await contract.methods.admin().call();

                console.log('Current account:', curr);
                console.log('Admin account:', adminAddress);
            
                if (curr !== adminAddress) {
                    document.getElementById('warningMessage').innerText = '';
                    document.getElementById('warningMessage').innerText = 'You are not Admin'; //This line is not executed CHECKK
                    return;
                } else{
                    console.log('You are the admin');
                    const receipt = await contract.methods.addCandidate(candidateName).send({ from: adminAddress, gas: 500000 }); 

                    const candidate = await contract.methods.getCandidate().call();
                    console.log('Candidates after adding:', candidate);
                    await refreshVotingResultsTable();
                    await updateCandidateList();

                    window.location.href = 'http://localhost:1234';
                }
                // Clear error message
                document.getElementById('warningMessage').innerText = '';
            } catch (error) {
                console.error('Error adding candidate:', error);
                // Display error message
            }
        }

        // Add an event listener to the form
        document.getElementById('addCandidateForm').addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent the default form submission

            // Call the refreshVotingResultsTable function asynchronously
            try {
                await refreshVotingResultsTable();
            } catch (error) {
                console.error('Error refreshing voting results table:', error);
            }
        });

 

    // Add an event listener to the form
    document.getElementById('addCandidateForm').addEventListener('submit', addCandidate);

});

// Function to end the voting session
async function endVotingSession() {
    try {
        const adminAddress = await contract.methods.admin().call();
        if (curr === adminAddress) {
            await contract.methods.endVoting().send({ from: curr, gas: 500000 });
            console.log('Voting session ended by admin');
            accountElement.innerHTML = 'Welcome, Admin!';
            alert("Admin has ended the voting session");
            return;
            // Optionally, you can update the UI or perform other actions after ending the voting session
        } else {
            console.log('Only the admin can end the voting session');
            alert("Only Admin can end the voting session");
            return;
            // Optionally, you can display a message to the user that only the admin can end the voting session
        }
    } catch (error) {
        console.error('Error ending voting session:', error);
        // Handle the error if the voting session cannot be ended
        // Optionally, display an error message to the user
    }
}

// Add an event listener to the "End Voting Session" button
document.getElementById('endvote').addEventListener('click', async () => {
    try {
        await endVotingSession();
        // Optionally, you can update the UI or perform other actions after ending the voting session
    } catch (error) {
        console.error('Error handling "End Voting Session" button click:', error);
        // Handle the error if the button click fails
        // Optionally, display an error message to the user
    }
});

// Define an asynchronous function to get and display the remaining time
async function showRemainingTime() {
    try {
        // Convert Date.now() to BigInt
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        console.log('Current Real World Time:', currentTime);

        // Call the contract function to get the original end time
        const originalEndTime = await contract.methods.votingEndTime().call();
        console.log('Original End Time:', originalEndTime);

        // Calculate the remaining time based on the current block timestamp
        const remainingTime = originalEndTime - currentTime;

        console.log('Remaining Time:', remainingTime.toString()); // Convert to string for display

        if (remainingTime <= 0) {
            // Voting time has ended
            alert('Voting time has ended!');
            document.getElementById('castVoteButton').disabled = true;
        } else {
            alert(`Remaining Time: ${remainingTime.toString()} seconds`);
        }
    } catch (error) {
        console.error('Error showing remaining time:', error);
    }
}

// Add an event listener to the "Show Remaining Time" button
document.getElementById('showRemainingTime').addEventListener('click', showRemainingTime);

// Add an event listener to the "Show Result" button
document.getElementById('resultButton').addEventListener('click', showResult);

async function displayWinner() {
    const votingEnded = await contract.methods.votingEnded().call();

    if (!votingEnded) {
        // alert("Voting has not ended");
        return;
    }

    const winner = await contract.methods.displayWinner().call();
    return winner;
}

async function showResult() {
    const resultDiv = document.getElementById('result');
    const winner = await displayWinner();

    if (winner) {
        resultDiv.innerHTML = `🎉 Congratulations! 🎉 <br> The Winner is ${winner.name} with ${winner.voteCount} votes`;
    } else {
        resultDiv.innerHTML = 'Voting has not ended yet';
    }
}


const main = async () => {
    try {
        if (typeof web3 !== 'undefined') {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            if (accounts.length > 0) {
                account = accounts[0];
                
                // Convert to checksum address
                const checksumAddress = web3.utils.toChecksumAddress(account);
                
                console.log('Account First:', checksumAddress);
                // accountElement.innerHTML = checksumAddress;
                
                curr = checksumAddress;
                getVoterName(curr)
                updateCandidateList();
                refreshVotingResultsTable();
                
            } else {
                accountElement.innerHTML = 'No accounts found';
            }
        } else {
            accountElement.innerHTML = 'Web3 provider not found';
        }
    } catch (error) {
        console.error('Error connecting to provider:', error);
        accountElement.innerHTML = 'Error connecting to provider';
    }
};

main();