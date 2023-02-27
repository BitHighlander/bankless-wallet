/*

    REST endpoints

 */
let TAG = ' | API | '

const pjson = require('../../package.json');
const log = require('@bithighlander/loggerdog-client')()
const {subscriber, publisher, redis} = require('@pioneer-platform/default-redis')

//rest-ts
import { Body, Controller, Get, Post, Route, Tags, SuccessResponse, Query, Request, Response, Header } from 'tsoa';
import * as express from 'express';
let pioneer = require('../wallet')
pioneer.init()

//types
interface Error {
    success:boolean
    tag:string
    e:any
}

interface Health {
    online:boolean
    name:string
    version:string
    system:any
}

export class ApiError extends Error {
    private statusCode: number;
    constructor(name: string, statusCode: number, message?: string) {
        super(message);
        this.name = name;
        this.statusCode = statusCode;
    }
}

//route
@Route('')
export class IndexController extends Controller {

    /*
        Health endpoint


    */

    @Get('/health')
    public async health() {
        let tag = TAG + " | health | "
        try{

            let status:any = await redis.hgetall("info:health")

            let output:Health = {
                online:true,
                name:pjson.name,
                version:pjson.version,
                system:status
            }

            return(output)
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

    /*
        get Address
    */

    @Get('/address')
    public async address() {
        let tag = TAG + " | address | "
        try{
            let address = await pioneer.getAddress()
            log.info(tag,"address: ",address)
            return({address})
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }

    /*
        send to address
    */

    @Post('/sendToAddress')
    public async sendToAddress(@Body() body: any) {
        let tag = TAG + " | sendToAddress | "
        try{
            log.info(tag,"body: ",body)
            let address = body.address
            let amount = body.amount
            if(!address) throw Error("Missing address!")
            if(!amount) throw Error("Missing amount!")
            let result = await pioneer.sendToAddress(address,amount)
            log.info(tag,"result: ",result)
            return({result})
        }catch(e){
            let errorResp:Error = {
                success:false,
                tag,
                e
            }
            log.error(tag,"e: ",{errorResp})
            throw new ApiError("error",503,"error: "+e.toString());
        }
    }
}
