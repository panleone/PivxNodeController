import * as dotenv from "dotenv";
dotenv.config();
checkEnv();
import express from "express";
import fetch from "node-fetch";
import cors from "cors";


const app = express()
app.use(cors());
const port = process.env["PORT"] || 3000;
const rpcPort = process.env["RPC_PORT"] || 51473;
const testnetRpcPort = process.env["TESTNET_RPC_PORT"];
const allowedRpcs = process.env["ALLOWED_RPCS"].split(",");

function checkEnv() {
    if(!process.env["ALLOWED_RPCS"]) throw new Error("Environment variable ALLOWED_RPCS was not set");
    if(!process.env["RPC_CREDENTIALS"]) throw new Error("Environment variable RPC_CREDENTIALS was not set");
}

const encodeBase64 = (data) => {
    return Buffer.from(data).toString('base64');
}

async function makeRpc(isTestnet, name, ...params){
    try{
	const output = await fetch(`http://127.0.0.1:${isTestnet ? testnetRpcPort : rpcPort}/`, {
	    method: 'POST',
	    headers: {
		'content-type': 'text/plain;',
		'Authorization': 'Basic ' + encodeBase64(process.env["RPC_CREDENTIALS"])
	    },
	    body: JSON.stringify({
		jsonrpc: "1.0",
		id: "pivxRerouter",
		method: name,
		params,
	    }),
	});
	const obj = await output.json();
	if(obj.error) {
	    const imATeapot = 418;
	    return { status: imATeapot, response: obj.error.message };
	} else {
	    const ok = 200;
	    return { status: ok, response: JSON.stringify(obj.result) };
	}
    } catch(error) {
	if (error.errno === "ECONNREFUSED") {
	    return { status: 503, response: "PIVX node was not responsive."};
	}
	if (error.name === 'AbortError') {
	    return "brequbest was aborted'";
	}else{
	    return "non u sac";
	}
    }
}

function parseParams(params) {
    return (params ? params.split(",") : [])
		  .map(v=>isNaN(v) ? v : parseInt(v))
        	  .map(v=>v === "true" ? true : v)
		  .map(v=>v === "false" ? false : v);
}

app.get('mainnet/:rpc', async function(req, res) {
    try {
	if (allowedRpcs.includes(req.params["rpc"])) {

	    const params = parseParams(req.query.params);
	    const { status, response } = await makeRpc(false, req.params["rpc"], ...params);
	    res.status(status).send(response + "");
	} else {
	    const forbiddenStatus = 403;
	    res.status(forbiddenStatus).send("Invalid RPC");
	}
    } catch (e) {
	const internalError = 500;
	res.status(internalError).send("Internal server error");
    }
});
if(testnetRpcPort) {
    app.get('testnet/:rpc', async function(req, res) {
	try {
	    if (allowedRpcs.includes(req.params["rpc"])) {
		
		const params = parseParams(req.query.params);
		const { status, response } = await makeRpc(true, req.params["rpc"], ...params);
		res.status(status).send(response + "");
	    } else {
		const forbiddenStatus = 403;
		res.status(forbiddenStatus).send("Invalid RPC");
	    }
	} catch (e) {
	    const internalError = 500;
	    res.status(internalError).send("Internal server error");
	}
    });
}

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
