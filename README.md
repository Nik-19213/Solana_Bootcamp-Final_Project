# Aviation AVN NFT Contract 🛩️

Welcome to the Aviation NFT Contract project! This contract is designed to create and manage unique Aviation-themed NFTs (Non-Fungible Tokens) on the Solana blockchain.

## Purpose 🚀
The Aviation AVN NFT Contract allows you to create and manage unique NFTs with an aviation theme on the Solana blockchain. Each NFT represents a one-of-a-kind digital asset related to aviation, which can be owned, transferred, and traded.

## Functionalities 🌟
This NFT contract provides the following core functionalities:

1. **Minting Aviation NFTs ✈️:** You can create new unique aviation-themed NFTs by minting them. Each NFT can have its own distinct attributes, such as aircraft type, flight route, and description, making it truly unique.

2. **Transferring Aviation NFTs 🎁:** Aviation NFTs can be transferred from one wallet to another using the `transfer` function. This allows users to trade or gift aviation-themed digital assets to different owners.

3. **Burning Aviation NFTs 🔥:** If you want to remove an aviation-themed NFT from circulation, you can use the `burn` function. This permanently destroys the NFT.

## Getting Started 🚀

### Prerequisites 🛠️
Before you can deploy and interact with the Aviation AVN NFT Contract, make sure you have the following prerequisites:

- Node.js and npm installed 📦
- Solana SDK installed ⚙️
- Rust installed (for smart contract development) 🦀
- TypeScript for writing smart contracts 📜

OR

- You can Deploy the smart contract on the Solana blockchain using `codigo` or another Solana development tool.

### Installation 📦
1. Clone this repository to your local machine.
2. Install the required dependencies.
3. Build the contract 🏗️
   Open a terminal window from the terminal tab above and navigate to the generated directory using the command `cd program` (the folder name where you have Cargo.toml, file may be different) and type the command :
    `cargo build-sbf` 🛠️
4. Set your config file
   `solana config set --url devnet` ⚙️
    This command will set our config file to connect to devnet, where we will deploy.
5. Get devnet tokens 💰
    `solana airdrop 1` 💸, 
    `solana balance` 💰
6. Build and Deploy the Contract 🚀
    `solana program deploy target/deploy/avn_nft.so` 🛰️

After completing the deployment, you will get a program ID.

Copy and save this program ID so we can configure the client library.

7. Open a terminal, navigate to the program_client directory (which contains package.json), and type the command 
    `yarn install` to install the node_modules dependencies. 📦

8. This contract also relies on @solana/spl-token; this package needs to be installed manually by executing 
    `yarn add @solana/spl-token`. 📦

9. Run app.ts 🏃
    `npx ts-node app.ts <YOUR_PROGRAM_ID>` 🏁

10. Explore the Output 🕵️

Congrats 🎉 you have successfully tested NFT contract in Solana. 🥳

## Contributing
Contributions to this project are welcome! If you have ideas for additional features or improvements, please submit issues and pull requests.

## License
This project is licensed under the MIT License. See the LICENSE file for details.
