# voting-Dapp

1. change from: (account) to be the admin address in truffle-config.js
2. change validVoters.json in client directory acording the from account in ganache that will be connected to metamask
3. run "truffle compile" and then "truffle migrate" in the parents directory
4. run "npm init -f", followed by "npm install --save-dev parcel", then "npm install --save web3 bootstrap" in the client directory.
5. change browser: location in client\node_modules\web3\package.json to location of web3.min.js under client\dist\web3.min.js
6. run "npm run start" in the client directory
