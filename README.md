# Rock the Block
Playing with the [Chain](https://chain.com/) API.<br/>
Install the Chain Wallets API:
```
unzip lib/chain-wallets-node-1.0.15.zip
npm install chain-wallets-node-1.0.15
```
You will need a file named **private.config.json** in the **config** directory that contains the API key and other private data.<br/>
The format of the file is:
```JSON
{
    "chain": {
        "api_key_id"    : "<API key ID>",
        "api_key_secret": "<API key secret>"
    }
}
```
