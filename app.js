const express = require('express');
const fetch = require('node-fetch');

const app = express()
const port = 3000

fetch('http://127.0.0.1:51473/', {
    method: 'POST',
    headers: {
        'content-type': 'text/plain;',
        'Authorization': 'Basic ' + btoa('masternode_test:p')
    },
    body: '{"jsonrpc": "1.0", "id":"curltest", "method": "getbalance", "params": [] }'
}).then(res => res.text())
.then(text => console.log(text));

/*
fetch('https://google.com')
    .then(res => res.text())
    .then(text => console.log(text));
*/


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/porcodio', (req, res) => {
    res.send('dio porco World!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
