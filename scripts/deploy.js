const main = async () => {
    const [deployer] = await ethers.getSigners()
    console.log(`Deploying contracts with the account: ${deployer.address}`)

    const token = await ethers.deployContract('Token')
    console.log(`Token address: ${await token.getAddress()}`)
}

main()
    .then(() => {
        process.exit(0)
    }).catch(err => console.log(err))