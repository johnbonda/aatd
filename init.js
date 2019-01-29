module.exports = async function () {
  console.log('enter dapp init')

  app.registerContract(1000, 'aatd.generateOneTimeDAppAddress')
  app.registerContract(1001, 'aatd.transfer')


  app.registerFee(1000, '0', 'BEL')
  app.registerFee(1001, '0', 'BEL')
  


  app.events.on('newBlock', (block) => {
    console.log('new block received', block.height)
  })
}