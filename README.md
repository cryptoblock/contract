
# Ethereum Contract Tool


## Install

```bash
$ npm install -g @crypto/contract
```


## Command Line Options

```bash
# print all available options
$ contract -h
```

### Specify Contract File

```bash
# specify a contract file and enter prompt mode
$ contract -f <path_to_file>
```

```bash
# additionally specify the RPC host and port
$ contract -h amazing.com -p 9999 -f <path_to_file>
```

> If omitted host defaults to `localhost` and port defaults to `6767`.


## Prompt Options


### Compile

```bash
# compile the contract
contract$ compile
```

### Deploy

```bash
# deploy the contract
contract$ deploy
```

```bash
# additionally set the account address to use when deploying
contract$ deploy -a <account_address>
```

> If omitted account address defaults to the first account `web3.eth.accounts[0]`.

```bash
# additionally set the gas amount to use when deploying
contract$ deploy -g <gas_amount>
```

> If omitted the gas amount defaults to `1000000`.


### Init

```bash
# instantiate the contract
contract$ init -a <contract_address>
```

### Set Name

```bash
# set contract instance name
contract$ name <name>
```

```bash
# enter interactive REPL mode
contract$ <name>
```

### Execute Methods

```bash
# execute contract specific methods
contract$ name: newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```

### Watch for Events

```bash
# subscribe for specific event
contract$ notereth$ DocumentEvent({}, {fromBlock: 0, toBlock: 'latest'}).watch
```

```bash
# subscribe for all events
contract$ notereth$ allEvents({}, {fromBlock: 0, toBlock: 'latest'}).watch
```


## Example

### Basics

```bash
# specify contract file
$ contract -f <path_to_file>
# deploy the contract using the first unlocked account
contract$ deploy
# set contract instance name
contract$ name notereth
# enter contract interactive REPL
contract$ notereth
# execute methods from that contract
notereth$ notereth: newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```

### Watching

```bash
# instantiate the contract in two separate console windows at the same time
$ contract -f <path_to_file>
contract$ init -a 0x241bbd0ef9492aa17866c662b750f24003c812c6
contract$ name notereth
contract$ notereth
contract$ notereth:
```

```bash
# set a watcher in the first console window
contract$ notereth$ DocumentEvent({}, {fromBlock: 0, toBlock: 'latest'}).watch
```

> Notice that the callback for the `watch` method is missing.

```bash
# execute some command in the second console window
contract$ notereth$ newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```
