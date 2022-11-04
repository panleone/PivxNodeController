import express from "express";
import fetch from "node-fetch";

const app = express()
const port = 3000

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
async function getgoogle(){
  let output= await fetch('https://google.com')
  return await output.text()
}



app.get('/', (req, res) => {
  res.send('Hello World!')
})

 app.get('/getbalance', async (req, res) => {
  res.send(await getgoogle());
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
