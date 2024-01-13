<h3>Setting up Voting Dapp</h3>

<p><strong>Clone Repository</strong></p>

```bash
git clone https://github.com/sorfinaly/voting-Dapp.git

```
<p><strong>Configure Truffle</strong></p>
<ul>
  <li>Open <code>truffle-config.js</code> and change the <code>from:'account'</code> to the admin address.</li>
</ul>
<p><strong>Update validVoters.json</strong></p>
<ul>
  <li>Update <code>validVoters.json</code> in the <code>client</code> directory with the list of account from <code>Ganache</code> and connect those account into <code>Metamsk</code>.</li>
</ul>
<p><strong>Compile and Migrate Contracts in Voting-Dapp directory</strong></p>

```bash
truffle compile
truffle migrate
truffle test

```

<p><strong>Verify VotingSC.json</strong></p>
<ul>
  <li>Ensure that <code>VotingSC.json</code> under <code>build\contract</code> contains the following:</li>

 ```bash
"networks": {
    "5777": {
      "address": ""
    }
  }

```
</ul>


<p><strong>Configure Client</strong></p>

```bash
cd client
npm init -f
npm install --save-dev parcel
npm install --save web3 bootstrap

```
<p><strong>Update web3 Path</strong></p>
<ul>
  <li>Update <code>browser</code> in <code>client\node_modules\web3\package.json</code> to the path of <code>web3.min.js</code> under <code>client\dist\web3.min.js</code>.</li>
</ul>
<p><strong>Run Client</strong></p>

```bash
npm run start

```
<h2>Tools</h2>
<h3>MetaMask</h3>
<p>Browser extension for Ethereum account management and user authentication.</p>
<h3>Ganache</h3>
<p>Local Ethereum blockchain for development and testing.</p>
<h3>Truffle</h3>
<p>Development framework for creating, testing, and deploying Ethereum smart contracts.</p>
<h3>Coding Languages</h3>
<ul>
  <li>JavaScript (JS): Front-end scripting.</li>
  <li>HTML: Structure of the user interface.</li>
  <li>CSS: Styling for visual presentation.</li>
  <li>Solidity: Smart contract development for Ethereum.</li>
</ul>
<h3>Parcel Bundler</h3>
<p>Streamlines development environment setup by automating tasks like bundling and asset optimization.</p>
