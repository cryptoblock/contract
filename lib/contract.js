
import EventEmitter from 'events'
import util from 'util'
import {} from 'babel-polyfill'


class Contract extends EventEmitter {
  constructor (web3, source) {
    super()
    this.web3 = web3
    this.source = source
    this.instance = null
    this.name = ''
    this.deploying = false
  }

  async compile () {
    return await this.web3.eth.compile.solidity(this.source)
  }

  async deploy (accountAddress, gasAmount) {
    var self = this

    var compiled = await self.compile()
      , contractName = Object.keys(compiled)[0]
      , Contract = self.web3.eth.contract(compiled[contractName].info.abiDefinition)

    Contract.new(
      0, // (uint initialValue)
      {
        from: accountAddress,
        data: compiled[contractName].code,
        gas: gasAmount
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

    this.instance = this.web3.eth.contract(abiDefinition).at(contractAddress)
  }
}

export default Contract
