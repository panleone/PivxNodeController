import express from "express";
import fetch from "node-fetch";

const app = express()
const port = 3000
const allowedRpcs = ["getbalance", "help"];

export const encodeBase64 = (data) => {
    return Buffer.from(data).toString('base64');
}

/*
fetch('http://127.0.0.1:51473/', {
    method: 'POST',
    headers: {
        'content-type': 'text/plain;',
        'Authorization': 'Basic ' + encodeBase64btoa('masternode_test:p')
    },
    body: '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": [] }'
}).then(res => res.text())
.then(text => console.log(text));
*/

(async () => {
	try {
		await fetch(url, {signal});
	} catch (error) {
		if (error.name === 'AbortError') {
			console.log('request was aborted');
		}
	}
})();

async function makeRpc(name, ...params){
    try{
	const output = await fetch('http://127.0.0.1:51473/', {
	    method: 'POST',
	    headers: {
		'content-type': 'text/plain;',
		'Authorization': 'Basic ' + encodeBase64('masternode_test:p')
	    },
	    body: JSON.stringify({
		jsonrpc: "1.0",
		id: "pivxRerouter",
		method: name,
		params,
	    }),
	});
	const text = await output.text();
	console.log(text);
	return { status: 200, response: text };
    }catch(error){
	if (error.errno === "ECONNREFUSED") {
	    return { status: 503, response: "PIVX node was not responsive." };
	}
	if (error.name === 'AbortError') {
	    return "brequbest was aborted'";
	}else{
	    return "non u sac";
	}
    }
}

//ce9efce67bf55fed12a162ab3c02e5b58e8f69ceac51524ae067ab06ad558a7f


app.get('/:rpc', async function(req, res) {
    try {
	if (allowedRpcs.includes(req.params["rpc"])) {

	    const params = (req.query.params ? req.query.params.split(",") : [])
		  .map(v=>{
		      let n = parseInt(v); return n ? n : v
		  });
	    
	    const { status, response } = await makeRpc(req.params["rpc"], ...params);
	    res.status(status).send(response);
	} else {
	    const forbiddenStatus = 403;
	    res.status(forbiddenStatus).send("Invalid RPC");
	}
    } catch (e) {
	const internalError = 500;
	res.status(internalError).send("Internal server error");
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
