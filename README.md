
# Ethereum Contract Tools

1. Clone the repo
2. `npm install` inside the repo
3. `cd /usr/local/bin && sudo ln -s <path_to_contract_tools/index.js> contract`
4. `contract -h` see all available flags


### Compile

```bash
contract -f <path_to_file> -c
```

### Deploy

```bash
contract -f <path_to_file> -a <account_address> -d
```

### Instantiate

```bash
contract -f <path_to_file> -a <contract_address> -i
```
