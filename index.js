const Moralis = require('moralis').default
const express = require('express')
const app = express()
const port = 8080
const cors = require("cors")
require("dotenv").config()

app.use(cors())

app.get('/', (req, res) => {
  res.send('Welcome to Xerxis!')
})

app.get('/from_moralis', (req, res) => {
  res.send('Welcome to Xerxis!')
})

app.get('/nativeBalance', async (req, res) => {

  await Moralis.start({apiKey: process.env.MORALIS_API_KEY})
  try {
    const {address, chain} = req.query
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address: address,
      chain: chain,
    });
    const nativeBalance = response.toJSON().balance
    console.log("native Balance: ", nativeBalance)

    let nativeCurrency   // wrapped contract
    if (chain == "0x1") {
      nativeCurrency = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" 
    } else if(chain == "0x89") {
      nativeCurrency = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270"
    }
    const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
      address: nativeCurrency,
      chain: chain
    })
  
    const totalInUsd = parseInt(nativeBalance) * nativePrice.toJSON().usdPrice
    console.log("Native Price: ", nativePrice.toJSON().usdPrice)
    console.log("Total in USD: ", totalInUsd)

    nativeBalance['usdValue']= totalInUsd

    const balance = {
      balance: nativeBalance, 
      balance_usd: totalInUsd
    }
    res.send(balance)
  } catch (error) {
    res.send(error)
  }
})

app.get('/tokenBalances', async (req, res) => {
  await Moralis.start({apiKey: process.env.MORALIS_API_KEY})

  try {
    const {address, chain} = req.query
    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address: address,
      chain: chain,
    });

    let tokens = response
    let legitTokens = []

    for( i = 0 ; i<tokens.length; i++){
      const tokenPrice = await Moralis.EvmApi.token.getTokenPrice({
        address: nativeCurrency,
        chain: chain
      })

      if (tokenPrice.toJSON().usdPrice > 0.0001){
        tokens[i].usd = tokenPrice.toJSON().usdPrice
        legitTokens.push(token[i])
      }
    }  

    res.send([legitTokens,tokens])

  } catch (error) {
    res.send(error)
  }
  
})

app.listen(port, () => {
  console.log(`Xerxis Wallet is listening on port ${port}`)
})
