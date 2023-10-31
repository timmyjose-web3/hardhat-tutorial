require('@nomicfoundation/hardhat-toolbox');

const INFURIA_API_KEY = ''
const SEPOLIA_PRIVATE_KEY = ''

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURIA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    }
  }
};
