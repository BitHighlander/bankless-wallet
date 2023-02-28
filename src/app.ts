import assert from "assert";

require("dotenv").config()
require('dotenv').config({path:"../../.env"});
require('dotenv').config({path:"./../../.env"});
require("dotenv").config({path:'../../../.env'})
require("dotenv").config({path:'../../../../.env'})

import * as core from "@shapeshiftoss/hdwallet-core";
let SDK = require('@pioneer-sdk/sdk')
import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
const log = require("@pioneer-platform/loggerdog")()
const bodyParser = require('body-parser')

//np
//constants
let blockchains = [
    'ethereum'
]

let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
let WALLET:any
let APP:any
let API:any

let STATUS = {
    online:false,
    funded:false
}

import express, { Application, Request, Response } from 'express';

const app: Application = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const PORT: number = 3001;

let tag = " WALLET "
let BLOCKCHAIN = 'ethereum'
let ASSET = 'LUSD'

const start_software_wallet = async function(){
    try{
        let mnemonic = process.env['WALLET_MAIN']
        if(!mnemonic) throw Error("Unable to load wallet! missing env WALLET_MAIN")
        const keyring = new core.Keyring();
        const nativeAdapter = NativeAdapter.useKeyring(keyring);
        let wallet = await nativeAdapter.pairDevice("testid");
        //@ts-ignore
        await nativeAdapter.initialize();
        // @ts-ignore
        wallet.loadDevice({ mnemonic });
        if(!wallet) throw Error("failed to init wallet!")
        return wallet
    }catch(e){
        console.error(e)
    }
}

let onStart = async function(){
    try{
        //if force new user
        //const queryKey = "sdk:pair-keepkey:"+uuidv4();
        const queryKey = process.env['PIONEER_QUERY_KEY']
        assert(queryKey)

        const username = process.env['PIONEER_USERNAME'];
        assert(username)

        let config:any = {
            blockchains,
            username,
            queryKey,
            spec,
            wss,
            paths:[]
        }
        APP = new SDK.SDK(spec,config)
        // log.debug(tag,"app: ",app)

        //start
        WALLET = await start_software_wallet()

        //init with HDwallet
        log.debug(tag,"Pre-init: ",WALLET)
        // @ts-ignore
        API = await APP.init(WALLET)


        //getBalances
        log.info("balances: ",APP.balances.length)
        log.info("pubkeys: ",APP.pubkeys.length)

        if(APP.balances.length > 0){
            STATUS.funded = true
        }
        if(APP.pubkeys.length > 0){
            STATUS.online = true
        }
    }catch(e){
        console.error(e)
    }
}
onStart()

app.use('/info', (req: Request, res: Response): void => {
    res.send(STATUS);
});

app.use('/balances', (req: Request, res: Response): void => {
    res.send(APP.balances);
});

app.use('/balance', (req: Request, res: Response): void => {
    res.send(APP.balances.filter((e:any) => e.symbol === ASSET));
});

app.use('/address', (req: Request, res: Response): void => {
    res.send(APP.pubkeys.filter((e:any) => e.blockchain === BLOCKCHAIN));
});

let sendToAddress = async function(address:string,amount:string){
    try{
        let send = {
            blockchain:BLOCKCHAIN,
            asset:ASSET,
            address,
            amount,
            noBroadcast:true
        }

        let tx = {
            type:'sendToAddress',
            payload:send
        }

        console.log("tx: ",tx)
        let invocationId = await APP.build(tx)
        log.info(tag,"invocationId: ",invocationId)

        //sign
        let resultSign = await APP.sign(invocationId)
        log.info(tag,"resultSign: ",resultSign)

        //get txid
        let payload = {
            noBroadcast:false,
            sync:true,
            invocationId
        }
        let resultBroadcast = await APP.broadcast(payload)
        log.info(tag,"resultBroadcast: ",resultBroadcast)
        return resultBroadcast
    }catch(e){
        console.error("Failed to send crypto!")
    }
}

app.post('/sendToAddress', async (req, res) => {
    let data = req.body;
    console.log("input: ",JSON.stringify(data))
    if(!data.address) throw Error("Address required!")
    if(!data.amount) throw Error("Amount required!")
    // let result = await sendToAddress(data.address,data.amount)
    let result = {txid:"fakeTxidBro"}
    res.send(result);
})

app.listen(PORT, (): void => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
