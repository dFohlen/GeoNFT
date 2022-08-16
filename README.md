[contributors-shield]: https://img.shields.io/github/contributors/dFohlen/GeoNFT.svg?style=for-the-badge
[contributors-url]: https://github.com/dFohlen/GeoNFT/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/dFohlen/GeoNFT.svg?style=for-the-badge
[forks-url]: https://github.com/dFohlen/GeoNFT/network/members
[stars-shield]: https://img.shields.io/github/stars/dFohlen/GeoNFT.svg?style=for-the-badge
[stars-url]: https://github.com/dFohlen/GeoNFT/stargazers
[issues-shield]: https://img.shields.io/github/issues/dFohlen/GeoNFT.svg?style=for-the-badge
[issues-url]: https://github.com/dFohlen/GeoNFT/issues
[license-shield]: https://img.shields.io/github/license/dFohlen/GeoNFT.svg?style=for-the-badge
[license-url]: https://github.com/dFohlen/GeoNFT/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/volker-dufner

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<div align="center">
  <a href="https://solana.com/summercamp">
    <img src="https://solana.com/_next/static/media/logo.aadda478.svg" alt="Logo" width="500">
  </a>

<h3 align="center"><a href="https://explorer.solana.com/?cluster=devnet">Solana Devent</a></h3>
  <p align="center">
    A decentralized NFT geocaching application
    <br />
    <a href="https://www.youtube.com/channel/UCylMUqkb21OVtQnIQHGtjuw">View Demo</a>
    ·
    <a href="https://github.com/dFohlen/GeoNFT/issues">Report Bug</a>
    ·
    <a href="https://github.com/dFohlen/GeoNFT/issues">Request Feature</a>
  </p>
</div>

# GeoNFT

## ℹ️ General Info

This project is designed and implemented by [Volker Dufner](https://github.com/dFohlen) as part of the [Solana Summer Hackathon](https://solana.com/summercamp).

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


## 🤕 Problems we run into
First of all, we had the major challenge in general of never having worked with Solana, Rust or React-Native before. But of course we embraced that and started by researching the best practices for creating and deploying smart contracts on Solana. We quickly came across Anchor and familiarized ourselves with its Anchor book and the basics of Solana Contracts.

### Transfer any NFT to our contract and back
It seems trivial at first, but after we had finished the basic contract for setting a geolocation of the geocache, we asked ourselves how we can transfer the associated NFT to the contract. Here the examples were significantly fewer. At some point we found a solution called Program Derived Addresses (PDAs).

### Minting own NFTs
WIP

### Limitation of the new mobile wallet adapter
After the contract was deployed, we wanted to start with the app. Here we quickly encountered limitations caused by the new mobile wallet adapter. Among other things, only Android and not iOS is currently supported, and you also need a fake wallet (also only Android) to sign transactions. There are also no examples of how to use an anchor contract with it. When we asked the developers, we were told that everything is still under development. So after some tests, we decided to implement a React app as a Progressive Web App (PWA) for mobile devices.
  
### Wallet connect on PWA
We started the implementation and everything worked at the browser level without any major incidents. But when we tested the app on a smartphone, we could not link a wallet, even though the Phantom app was also installed. After a Github search, we found out that the [deep links](https://phantom.app/blog/introducing-phantom-deeplinks) to the wallet are not yet supported by the Solana wallet adapter and would therefore only work in the in-app Phantom browser. Of course we tested this and ended up with the SSL requirement. We have also built a solution for this, but then we came to the next problem.

### Geolocation on the Phantom Wallet Browser
After we linked the wallet and tried to create a new geocache, we could not determine the current geolocation of the smartphone. This is because Phatom's internal browser does not support this feature. So we were faced with the decision to create a web-only application, which is of course very impractical for geocaching, or to switch back to the React-Native version.

### Switch back to React-Native
WIP


## 🧑‍💻 Technologies


### Solana-Blockchain

WIP

### Smart Contract

WIP

### Mobile App

WIP


## 🏗️ Getting started

### Project structure

In the project structure, you will see the following files and folders.

* packages - This is an Yarn workspace, new way to set up your package architecture. It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of them in a single pass.  
  * achnor - Anchor is a framework for Solana's Sealevel runtime providing several convenient developer tools for writing smart contracts.
    * program — This is the directory of Solana programs (Smart contracts)
    * test — This is where javascript test code lives
    * migrations — This is the deploy script
  * react-app — This is where the web-frontend is going to be built
  * react-native-app - This is where the mobile-frontend is going to be built

### Preparations

#### Rust
Go [here](https://www.rust-lang.org/tools/install) to install Rust.

#### Solana
Go [here](https://docs.solana.com/cli/install-solana-cli-tools) to install Solana and then run `solana-keygen new` to create a keypair at the default location. Anchor uses this keypair to run your program tests.

Switch to the Solana Devnet by running `solana config set devnet` and fund this wallet with `solana airdrop 2` or on https://solfaucet.com/.

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

### How to build/run

1. Run `yarn install` to install related dependencies.
2. Go to the packages/anchor folder and run `anchor build` to build the Smart Contract.
3. Run `anchor deploy:<network>` to deploy the Smart Contract to the Solana blockchain.
4. Go to the packages/react-app folder and run `yarn start` to start the development server which will serve the app on http://localhost:3000

---

Copyright: [Volker Dufner](https://github.com/dFohlen) | 2022
