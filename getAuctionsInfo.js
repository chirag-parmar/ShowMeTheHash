/* Author: Chirag Mahaveer Parmar 
   Website: https://www.chiragparmar.me
   GitHub: chirag-parmar
   LinkedIn: https://www.linkedin.com/in/chirag-parmar
*/

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/107c7b12d9004f8d81a50a88a27b8042"))
const abiDecoder = require('abi-decoder');
var prompt = require('prompt-sync')();
var fs = require('fs');
var sleep = require('system-sleep')

process.stdin.setEncoding('utf8');
registrar = "0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef"
//----------------------------------------------------------Registrar ABI-------------------------------------------//
const registrarABI = [{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"sealedBid","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"statu3s","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]
abiDecoder.addABI(registrarABI);

// ----------------------------------------- MAIN SEQUENCE ----------------------------------------------//
var ensData = {
	"hash": '',
	"owner": '',
	"events": {
		"revealedBids": [],
		"finalized": false,
		"released": false,
		"started": false,
		"transferred": false,
	}
}
var ensDataArray = []
var firstrun = false

//read the previous file
try{
	data = fs.readFileSync('data.json')
	ensData = JSON.parse(data)
}
catch(error){
	firstrun = true
}

if (firstrun){
	console.log("First Run Sequence")
	web3.eth.getBlockNumber(function(err, blockNum){
		console.log(blockNum)
		processBlocks(registrar, 6079000, blockNum, function(err, ensData){
			if(!err){
				console.log("Block Processing Complete - " + ENS_hashes.length.toString() + " unique auctions found")
				firstrun = false
			}
			else{
				console.log("[ERROR] Could not process blocks")
			}
		})
	})
	//wait until first run sequence is completed
	while (firstrun){sleep(100)}
}

console.log("hello")



//----------------------------------------------------Helper Functions-----------------------------------------------//
//check if unique
Array.prototype.inArray = function(comparer) { 
    for(var i=0; i < this.length; i++) { 
        if(comparer == this[i]) return true; 
    }
    return false; 
}; 


//traverse the blockchain for ENS transactions
function processBlocks(myaccount, startBlockNumber, endBlockNumber, callback) {
	var numBlockProcessed = 0;
	var ENS_hashes = [] // array if unique ENS hashes
	var unsealedBids = [] // contains the revealed bid amount, who made the bid and the hash against which the bid was made
	/*go through every block from start to end and filter out the transactions 
  	referring to the account address*/
  	for (var i = startBlockNumber; i <= endBlockNumber; i++) {
	    var block = web3.eth.getBlock(i, true, function(err, block){
	    	if (!err) {
	    		var numTxnProcessed = 0;
	    		var totalTxn = block.transactions.length

		      	block.transactions.forEach( function(e) {
		      		//count number of transactions to later check if all were processed.
		      		numTxnProcessed++;

		      		//intialize variables to store infod
		      		var unsealInfo = {}

		      		/*check if the to address matches with the account*/
			        if (myaccount == e.to) {
						var inputData = abiDecoder.decodeMethod(e.input)
						var name = inputData["name"]
						var params = inputData["params"]
						// if(inputData["name"] == 'unsealBid'){
				  //         	params = inputData["params"]

				  //         	//create JSON data which stores the unsealBid attributes
				  //         	unsealInfo["hash"] = params[0]["value"]
				  //         	unsealInfo["from"] = e.from
				  //         	unsealInfo["bidAmount"] = parseInt(params[1]["value"])

				  //         	var unsealInfoJson = JSON.stringify(unsealInfo)
				  //         	unsealedBids.push(unsealInfoJson)
				  //         	//push only if it is not present in the array already
				  //         	if(!ENS_hashes.inArray(params[0]["value"])){
				  //         		ENS_hashes.push(params[0]["value"])
				  //         	}
						// }
			        }
			        if(numTxnProcessed == totalTxn){
			        	numBlockProcessed++
			        	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
			        		callback(0, ENS_hashes, unsealedBids)
			        	}
			        }
			    });
			    if(totalTxn == 0){
			    	console.log("[OBS]: block without transactions")
			    	numBlockProcessed++
			    	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
		        		callback(0, ENS_hashes, unsealedBids)
		        	}
			    }
		    }
		    else{
		    	console.log("[ERROR]: Couldn't get block")
		    	missedBlocks.push(i)
		    	numBlockProcessed++
		    	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
		        	callback(0, ENS_hashes, unsealedBids)
		        }
		    }
	    })
  	}
}
