// /*
//
//     Bankless Wallet
//
//     Send/Receive crypto
//
//     Defaults to LUSD
//
// */
//
// const TAG = " | Bankless-Backend | "
// const queue = require('@pioneer-platform/redis-queue');
// const uuid = require('short-uuid');
//
// const log = require('@pioneer-platform/loggerdog')()
//
// let wallet = require('./wallet')
//
// let wait = require('wait-promise');
// let sleep = wait.sleep;
//
// //hdwallet-core
// import * as core from "@shapeshiftoss/hdwallet-core";
// let SDK = require('@pioneer-sdk/sdk')
// import { NativeAdapter } from '@shapeshiftoss/hdwallet-native'
//
// //constants
// let BLOCKCHAIN = 'cosmos'
// let ASSET = 'ATOM'
// let blockchains = [
//     'ethereum'
// ]
//
// let spec = process.env['URL_PIONEER_SPEC'] || 'https://pioneers.dev/spec/swagger.json'
// let wss = process.env['URL_PIONEER_SOCKET'] || 'wss://pioneers.dev'
// let WALLET:any
// let APP:any
//
// module.exports = {
//     init: async function () {
//         return init();
//     },
//     status: async function () {
//         return get_status();
//     },
//     getBalance: async function () {
//         return get_balance();
//     },
//     getAddress: async function () {
//         return get_address();
//     },
//     sendToAddress: async function (address:string,amount:string) {
//         return send_to_address(address,amount);
//     }
// }
//
// const start_software_wallet = async function(){
//     try{
//         let mnemonic = process.env['WALLET_MAIN']
//         if(!mnemonic) throw Error("Unable to load wallet! missing env WALLET_MAIN")
//         const keyring = new core.Keyring();
//         // @ts-ignore
//         const nativeAdapter = NativeAdapter.useKeyring(keyring);
//         // @ts-ignore
//         let wallet = await nativeAdapter.pairDevice("testid");
//         //@ts-ignore
//         await nativeAdapter.initialize();
//         // @ts-ignore
//         wallet.loadDevice({ mnemonic });
//         if(!wallet) throw Error("failed to init wallet!")
//         return wallet
//     }catch(e){
//         console.error(e)
//     }
// }
//
// let init = async function () {
//     let tag = TAG + " | init | "
//     try {
//         //
//         //if force new user
//         //const queryKey = "sdk:pair-keepkey:"+uuidv4();
//         const queryKey = "sdk:pair-keepkey:test-123455513123";
//
//         const username = "sdk:test-user-123455123123";
//
//         let config:any = {
//             blockchains,
//             username,
//             queryKey,
//             spec,
//             wss,
//             paths:[]
//         }
//         APP = new SDK.SDK(spec,config)
//         log.debug(tag,"APP: ",APP)
//
//         //get HDwallet
//         let wallet = await start_software_wallet()
//         log.debug(tag,"wallet: ",wallet)
//
//         //init with HDwallet
//         let result = await APP.init(wallet)
//         log.info(tag,"result: ",result)
//
//         //getBalance
//
//
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         throw e
//     }
// }
//
// let get_balance = async function () {
//     let tag = TAG + " | get_balance | "
//     try {
//         //get_balance
//
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         throw e
//     }
// }
//
// let get_status = async function () {
//     let tag = TAG + " | get_status | "
//     try {
//         //get_status
//
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         throw e
//     }
// }
//
// let get_address = async function () {
//     let tag = TAG + " | get_address | "
//     try {
//         //
//
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         throw e
//     }
// }
//
// let send_to_address = async function (address:string,amount:string) {
//     let tag = TAG + " | send_to_address | "
//     try {
//         //
//         let send = {
//             blockchain:BLOCKCHAIN,
//             asset:ASSET,
//             address,
//             amount,
//             noBroadcast:true
//         }
//
//         let tx = {
//             type:'sendToAddress',
//             payload:send
//         }
//
//         console.log("tx: ",tx)
//         let invocationId = await APP.build(tx)
//         log.info(tag,"invocationId: ",invocationId)
//
//         //sign
//         let resultSign = await APP.sign(invocationId)
//         log.info(tag,"resultSign: ",resultSign)
//
//         //get txid
//         let payload = {
//             noBroadcast:false,
//             sync:true,
//             invocationId
//         }
//         let resultBroadcast = await APP.broadcast(payload)
//         log.info(tag,"resultBroadcast: ",resultBroadcast)
//     } catch (e) {
//         console.error(tag, "e: ", e)
//         throw e
//     }
// }
//
