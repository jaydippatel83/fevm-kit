
const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" }); 
require("hardhat-deploy");
require("hardhat-deploy-ethers");   
const util = require("util");
const request = util.promisify(require("request"));

const DEPLOYER_PRIVATE_KEY = process.env.PRIVATE_KEY;
  

async function callRpc(method, params) {
  var options = {
    method: "POST",
    url: "https://api.hyperspace.node.glif.io/rpc/v1", 
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: method,
      params: params,
      id: 1,
    }),
  };
  const res = await request(options); 
  return JSON.parse(res.body).result;
}

const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY);

module.exports = async ({ deployments }) => {
  const { deploy } = deployments; 

  const priorityFee = await callRpc("eth_maxPriorityFeePerGas");  

  await deploy("SimpleCoin", {
    from: deployer.address,
    args: [], 
    maxPriorityFeePerGas: priorityFee,
    log: true,
  });  
};


module.exports.tags = ["SimpleCoin"];
