# EVM-Todo Application



A practical exercise to understand the integration between Solidity smart contracts and a reactive front end. This todo application allows users to store and manage a task list on EVM-compatible blockchains using Metamask.

> **Disclaimer**: Using blockchain as a storage method for a todo application is not recommended for real-world use. This is a purely educational exercise to understand the principles of Solidity and blockchain interaction through a JavaScript front end.

## Features

- Interact with various EVM-compatible blockchains: Sepolia testnet, Polygon, and Optimism.
- Use Metamask for account linking and transaction handling.
- Solidity 0.8 for the contract layer.
- Front end built using Vue 3 for reactivity.
- Build tools powered by ViteJS.

## Getting Started

### Prerequisites

- A Metamask account. If you don't have one, install the [Metamask extension](https://metamask.io/download.html).
- Enough ETH in your Metamask wallet to handle transaction fees for the selected layer or testnet. Sepolia is recommended. You can claim free Sepolia ETH from various faucets.

### Setup for Sepolia Testnet

1. **Adding Sepolia to Metamask**: Follow the guide [here](https://www.coingecko.com/learn/sepolia-eth#adding-sepolia-to-metamask) to add the Sepolia testnet to Metamask.
2. **Claiming Sepolia ETH**: To obtain free ETH for the Sepolia testnet, visit the faucet [here](https://sepolia-faucet.pk910.de/).

### Using the Application

1. Visit [EVM-Todo](https://evm-todo.viperfish.com.au).
2. Link your Metamask account.
3. Start creating, updating, and deleting your tasks stored on the blockchain.

## Why Blockchain for a Todo App?

The application of blockchain technology for a todo app is unnecessary overkill, but it was a valuable learning experience as a first dive into Solidity contracts and interacting via a Javascript frontend:

- **Solidity Basics**: Hands-on experience with Solidity 0.8, a popular version of the language.
- **EVM Interactions**: Understand how DApps interact with EVM-compatible chains.
- **JavaScript Integration**: Dive deep into how smart contracts can be integrated with reactive front ends using Vue 3.

I certainly wouldn't recommend using this app as a real-world task manager. It's just a bit of learning fun.
## Development

### Smart Contract

Located in the `contracts/` directory. Written in Solidity 0.8.

### Frontend

The frontend codebase can be found in the `src/` directory. Vue 3 is employed for creating a reactive UI. For local development:

```bash
npm install
npm run dev
```
## License
This project is licensed under the MIT License. See the LICENSE file for details.
