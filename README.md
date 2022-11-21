# PivxNodeController
Simple http server used to perform RPC calls to a Bitcoin based node

# HOW TO RUN

First, download the dependencies with 
```bash
npm i
```
Then, copy the example environment file with
```bash
cp .env.sample .env
```
If you are setting up a node for MPW, copy `.env.mpw.sample` instead.
Edit the file by chaning the credentials using the ones you set on your crypto node.
Finally, run the server with
```bash
npm run start
```
