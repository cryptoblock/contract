
import events from 'events'
import util from 'util'
import web3 from 'web3'


class Contract extends events.EventEmitter {
  constructor(source) {
    super()
    this.source = source
    this.instance = null
    this.name = ''
    this.deploying = false
  }

  async compile () {
    return await web3.eth.compile.solidity(this.source)
  }

  async deploy (accountAddress) {
    var self = this

    var compiled = await self.compile()
      , contractName = Object.keys(compiled)[0]
      , Contract = web3.eth.contract(compiled[contractName].info.abiDefinition)

    Contract.new(
      0, // (uint initialValue)
      {
        from: accountAddress,
        data: compiled[contractName].code,
        gas: 1000000
      },
      function (err, contract) {
        if (err) return done(err)

        if (!contract.address) {
          self.deploying = true
          self.emit('deploying', contract)
        }
        else {
          self.instance = contract
          self.deploying = false
          self.emit('deployed', self.instance)
        }
    })
  }

  async init (contractAddress) {
    var compiled = await this.compile()
      , contractName = Object.keys(compiled)[0]
      , abiDefinition = compiled[contractName].info.abiDefinition

    this.instance = web3.eth.contract(abiDefinition).at(contractAddress)
  }
}

export default Contract
