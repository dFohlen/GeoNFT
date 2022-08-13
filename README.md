# NFT-Geocaching

## ℹ️ General Info

This project is/was designed and implemented by [Volker Dufner](https://github.com/dFohlen) as part of the [Solana Summer Hackathon](https://solana.com/summercamp).

## 🗺️ What is Geocaching?

Geocaching is an outdoor recreational activity, in which participants use a Global Positioning System (GPS) receiver or mobile device and other navigational techniques to hide and seek containers, called "geocaches" or "caches", at specific locations marked by coordinates all over the world. A typical cache is a small waterproof container containing a logbook and sometimes a pen or pencil. The geocacher signs the log with their established code name and dates it, in order to prove that they found the cache. After signing the log, the cache must be placed back exactly where the person found it. Larger containers such as plastic storage containers (Tupperware or similar) or ammunition boxes can also contain items for trading, such as toys or trinkets, usually of more sentimental worth than financial. Geocaching shares many aspects with benchmarking, trigpointing, orienteering, treasure-hunting, letterboxing and waymarking.

## 📝 Concept behind NFT-Geocaching

The concept behind NFT geocaching is that with our mobile app, the community can drop off their Non-Fungible Token (NFT) at a specific location of their choice and the finder can pick them up. This creates an incentive to get outside and look for potentially valuable NFTs.

Geocaching offers something for everyone, from families with children to retirees. Some geocachers play the game to see how many total “finds” they can get, while others play to see how many new states or countries they can visit. Geocaching is a great way to find remarkable destinations that you would not have otherwise discovered. It is also an excellent education tool and an excuse to get off the couch.

Since the hackathon is hosted by [Solana](https://solana.com/), we also use the corresponding Solana blockchain and the newly developed [Solana Mobile Stack](https://solana.com/de/news/solana-mobile-stack-reveal).

Happy hunting!

## 🗺️ Demo Flow

1. The NFT holder goes to a location of his choice where he/she would like to place the NFT.
2. The NFT and the location coordinates are then sent from the holders wallet to our smart contract. The coordinates are additionally encrypted to prevent misuse or theft of the NFTs.
3. Searchers can now use the app to see where the nearest NFTs are and make their way there.
4. The first person who finds the NFT gets the opportunity to take it. This is transferred from the smart contract to the finders wallet.

## 🧑‍💻 Technologies


### Solana-Blockchain

WIP

### Smart Contract

WIP

### Mobile App

WIP


## Project structure

In the project structure, you will see the following files and folders.

* packages - This is an Yarn workspace, new way to set up your package architecture. It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of them in a single pass.  
  * achnor - Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts.
    * program — This is the directory of Solana programs (Smart contracts)
    * test — This is where javascript test code lives
    * migrations — This is the deploy script
  * react-app — This is where the web-frontend is going to be built
  * react-native-app - This is where the mobile-frontend is going to be built

## 🏗️ How to build/run

### Preparations

#### Rust
Go [here](https://www.rust-lang.org/tools/install) to install Rust.

#### Solana
Go [here](https://docs.solana.com/cli/install-solana-cli-tools) to install Solana and then run `solana-keygen new` to create a keypair at the default location. Anchor uses this keypair to run your program tests.

#### Yarn
Go [here](https://yarnpkg.com/getting-started/install) to install Yarn.

#### Anchor
Installing using Anchor version manager (avm) (recommended)


Anchor version manager is a tool for using multiple versions of the anchor-cli. It will require the same dependencies as building from source. It is recommended you uninstall the NPM package if you have it installed.

Install avm using Cargo. Note this will replace your anchor binary if you had one installed.


```
cargo install --git https://github.com/project-serum/anchor avm --locked --force
```

On Linux systems you may need to install additional dependencies if cargo install fails. E.g. on Ubuntu:

```
sudo apt-get update && sudo apt-get upgrade && sudo apt-get install -y pkg-config build-essential libudev-dev
```
Install the latest version of the CLI using avm, and then set it to be the version to use.

```
avm install latest
avm use latest
```

Verify the installation.

```
anchor --version
```

### Getting started

1. Run `yarn install` to install related dependencies.
2. Goto the packages/anchor folder and run `anchor build` to build the Smart Contract.
3. Run `anchor deploy:<network>` to deploy the Smart Contract to the Solana blockchain.
4. Goto the packages/react-app folder and run `yarn start` to start the development server which will serve the app on http://localhost:3000

---

Copyright: [Volker Dufner](https://github.com/dFohlen) | 2022
