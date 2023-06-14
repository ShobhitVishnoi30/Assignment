# CappedSet

## About

CappedSet: Address-value set with capped capacity and auto-removal of lowest.

## Project Description

The CappedSet contract represents a set data structure where each element is a pair consisting of an address and a value. The contract enforces a maximum capacity for the set, and when the set becomes full, it automatically removes the element with the lowest value. The maximum number of elements that can be stored in the set is specified in the constructor.

## System Requirements

    # Node.js 16.8 or later.
    # MacOS, Windows (including WSL), and Linux are supported.

## Prerequisites

    # Download the Node js and setup your environment
    # Check your node version
    $ node -v
    # Check package manager version
    $ yarn -v (or) npm -v

## Technologies Used

- [Solidity](https://docs.soliditylang.org/en/v0.8.20/)
- [Hardhat](https://hardhat.org/)
- [Openzeppelin](https://openzeppelin.com/contracts/)
- [Ethers.js](https://docs.ethers.io/v5/)
- [TypeScript](https://www.typescript.com/)

## Directory layout

    ├── contracts/           # Solidity smart contracts
    ├── scripts/             # Scripts for deploy with smart contracts
    ├── test/unit            # Automated unit tests for smart contracts
    ├── hardhat.config.js    # Hardhat configuration file
    ├── README.md            # Project README file
    └── .gitignore           # Git ignore file

## How to Install and Run

## Installation

These instructions will get you a local copy of the project up and running on your local machine for development and testing purposes.

### Clone the repository to your local machine using the command.

```
git clone https://github.com/ShobhitVishnoi30/Assignment.git
```

### Install the required packages using the command.

```
cd Assignment

yarn
or
npm install
```

### Set up .env

create a new .env file by copying it's content from env.example and filling in your secrets

```
cp .env.example .env
```

## Building the projects

### compile

Compile the contracts:

```
yarn compile
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```
yarn clean
```

### Testing

Run the tests:

```
yarn test
```

### Coverage

Check Coverage of test cases:

```
yarn coverage
```

### Deployment

Deploy the contracts locally:

```
yarn deploy-local
```

### Coverage

To check testcase coverage :

```
yarn coverage
```

### Contract-size

To check contract's size :

```
yarn contract-size
```

### Prettier

To run prettier :

```
yarn prettier
```

### Gorli verification

Set API key for goerli in the .env file.
[https://etherscan.io/myapikey](https://etherscan.io/myapikey)

    -- Georli Testnet
    yarn run verify-contract <contract-address> <constructor-paramter>

## Testing on Remix

- Run `npm i -g @remix-project/remixd` to install the npm library
- Run `npx hardhat node` to run local node on **Terminal 1**
- Run `remixd -s ./contracts --remix-ide https://remix.ethereum.org` on **Terminal 2** to run contracts on remix
- Import the addresses from localhost into metamask using private key
- On Remix, switch to Injected Web3
- Run `npx hardhat run scripts/deploy.js` to deploy contacts on localhost
- Use `At Address` in Remix to test the functionalities
