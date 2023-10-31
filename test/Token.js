const { loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers')
const { expect } = require('chai')

describe('Token contract', () => {
    const deployTokenFixture = async () => {
        const [owner, addr1, addr2] = await ethers.getSigners()
        const hardhatToken = await ethers.deployContract('Token')
        await hardhatToken.waitForDeployment()

        return { hardhatToken, owner, addr1, addr2 }
    }

    describe('Deployment', () => {
        it('Should set the right owner', async () => {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
            expect(await hardhatToken.owner()).to.equal(owner.address)
        })

        it('Should assign the total supply of tokens to the owner', async () => {
            const { hardhatToken, owner } = await loadFixture(deployTokenFixture)
            expect(await hardhatToken.totalSupply()).to.equal(await hardhatToken.balanceOf(owner.address))
        })
    })

    describe('Transactions', () => {
        it('Should transfer tokens between accounts', async () => {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            // transfer 100 tokens from `owner` to `addr1`
            await hardhatToken.transfer(addr1.address, 100)
            expect(await hardhatToken.balanceOf(owner.address)).to.equal(999900)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100)

            // transfer 50 tokens from `addr1` to `addr2`
            await hardhatToken.connect(addr1).transfer(addr2.address, 50)
            expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50)
            expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50)
        })

        it('Should emit transfer events', async () => {
            const { hardhatToken, owner, addr1, addr2 } = await loadFixture(deployTokenFixture)

            // transfer 50 tokens from `owner` to `addr1` and check that the `Transfer` event is emitted
            await expect(hardhatToken.transfer(addr1.address, 50)).to.emit(hardhatToken, 'Transfer').withArgs(owner.address, addr1.address, 50)

            // transfer 25 tokens from `addr1` to `addr2` and check that the `Transfer` event is emitted
            await expect(hardhatToken.connect(addr1).transfer(addr2.address, 25)).to.emit(hardhatToken, 'Transfer').withArgs(addr1.address, addr2.address, 25)
        })

        it('Should fail if the sender doesn\'t have enough tokens', async () => {
            const { hardhatToken, owner, addr1 } = await loadFixture(deployTokenFixture)

            // note that `await` for the whole expect
            await expect(hardhatToken.connect(addr1).transfer(owner.address, 1)).to.be.revertedWith('Not enough tokens')
            expect(await hardhatToken.balanceOf(owner.address)).to.be.equal(await hardhatToken.totalSupply())
        })
    })
})