# voting-Dapp

1. git clone https://github.com/sorfinaly/voting-Dapp.git 
2. change 'account' from: (account) to be the admin address in truffle-config.js
3. change validVoters.json in client directory acording the from account in ganache that will be connected to metamask
4. run "truffle compile" and then "truffle migrate" in the parents directory
5. Ensure that in VotingSC.json under directory build\contract, has this line 
   "networks": {
    "5777": { 
      "address": ""
    }
  },
6. in the client directory (cd client), run "npm init -f", followed by "npm install --save-dev parcel", then "npm install --save web3 bootstrap".
7. change browser: location in client\node_modules\web3\package.json to location of web3.min.js under client\dist\web3.min.js
8. run "npm run start" in the client directory
