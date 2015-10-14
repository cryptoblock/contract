
# Ethereum Contract Tool


## Install

1. Clone the repo
2. `npm install` inside the repo
3. `cd /usr/local/bin && sudo ln -s <path_to_contract_tools/index.js> contract`
4. `contract -h` see all available flags


## Command Line Options

Print all available options:

```bash
$ contract -h
```

Specify a contract file and enter prompt mode:

```bash
$ contract -f <path_to_file>
```

Additionally specify the RPC host and port:

```bash
$ contract -h amazing.com -p 9999 -f <path_to_file>
```

> If omitted host defaults to `localhost` and port defaults to `6767`.


## Prompt Options

Compile the contract:

```bash
contract$ compile
```

Deploy the contract:

```bash
contract$ deploy
```

Additionally set the account address to use when deploying:

```bash
contract$ deploy -a <account_address>
```

> If omitted account address defaults to the first account `web3.eth.accounts[0]`.

Instantiate the contract:

```bash
contract$ init -a <contract_address>
```

Set contract instance name:

```bash
contract$ name <name>
```

Enter interactive REPL mode:

```bash
contract$ <name>
```

Execute contract specific methods:

```bash
contract$ name: newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```


## Example


### Basics

```bash
# Specify contract file:
$ contract -f <path_to_file>
# Deploy the contract using the first unlocked account:
contract$ deploy
# Set contract instance name:
contract$ name notereth
# Enter contract interactive REPL:
contract$ notereth
# Execute methods from that contract:
notereth$ notereth: newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```


### Watching

Instantiate the contract in two separate console windows at the same time:

```bash
$ contract -f <path_to_file>
contract$ init -a 0x241bbd0ef9492aa17866c662b750f24003c812c6
contract$ name notereth
contract$ notereth
contract$ notereth:
```

Set a watcher in the first console window:

```bash
contract$ notereth$ DocumentEvent({}, {fromBlock: 0, toBlock: 'latest'}).watch
```

> Notice that the callback for the `watch` method is missing.

Execute some command in the second console window:

```bash
contract$ notereth$ newDocument('hash', {from: web3.eth.coinbase, gas: 1800000})
```
