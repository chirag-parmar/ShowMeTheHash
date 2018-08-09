/** 
*Author: Chirag Mahaveer Parmar 
*Website: https://www.chiragparmar.me
*GitHub: chirag-parmar
*LinkedIn: https://www.linkedin.com/in/chirag-parmar
*/

var Web3 = require('web3');
const abiDecoder = require('abi-decoder'); 
var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
var web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/107c7b12d9004f8d81a50a88a27b8042"))

port = process.env.PORT || 6969;
app.use(bodyParser.json({ type: 'application/json' }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, content-type");
  next()
});

registrar = "0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef"
//----------------------------------------------------------Registrar ABI-------------------------------------------//
const registrarABI = [{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"releaseDeed","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"getAllowedTime","outputs":[{"name":"timestamp","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"unhashedName","type":"string"}],"name":"invalidateName","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"owner","type":"address"},{"name":"value","type":"uint256"},{"name":"salt","type":"bytes32"}],"name":"shaBid","outputs":[{"name":"sealedBid","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"bidder","type":"address"},{"name":"seal","type":"bytes32"}],"name":"cancelBid","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"entries","outputs":[{"name":"","type":"uint8"},{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"ens","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_value","type":"uint256"},{"name":"_salt","type":"bytes32"}],"name":"unsealBid","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"transferRegistrars","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"sealedBids","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"state","outputs":[{"name":"","type":"uint8"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"newOwner","type":"address"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_timestamp","type":"uint256"}],"name":"isAllowed","outputs":[{"name":"allowed","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"finalizeAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"registryStarted","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"launchLength","outputs":[{"name":"","type":"uint32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sealedBid","type":"bytes32"}],"name":"newBid","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"labels","type":"bytes32[]"}],"name":"eraseNode","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hashes","type":"bytes32[]"}],"name":"startAuctions","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hash","type":"bytes32"},{"name":"deed","type":"address"},{"name":"registrationDate","type":"uint256"}],"name":"acceptRegistrarTransfer","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"}],"name":"startAuction","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"rootNode","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"hashes","type":"bytes32[]"},{"name":"sealedBid","type":"bytes32"}],"name":"startAuctionsAndBid","outputs":[],"payable":true,"type":"function"},{"inputs":[{"name":"_ens","type":"address"},{"name":"_rootNode","type":"bytes32"},{"name":"_startDate","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"AuctionStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"bidder","type":"address"},{"indexed":false,"name":"deposit","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"statu3s","type":"uint8"}],"name":"BidRevealed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"owner","type":"address"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"HashReleased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"hash","type":"bytes32"},{"indexed":true,"name":"name","type":"string"},{"indexed":false,"name":"value","type":"uint256"},{"indexed":false,"name":"registrationDate","type":"uint256"}],"name":"HashInvalidated","type":"event"}]
abiDecoder.addABI(registrarABI);

// ----------------------------------------- MAIN SEQUENCE ----------------------------------------------//

//mimic structures of c++ - ADT
function newensData(){
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
	return ensData
}

// Global variables - ensDataArray is shared among functions 
var ensDataArray = []
var firstrun = false
var lastBlockNumber = 6060000

//read the previous file
try{
	data = fs.readFileSync('data.json')
	data = JSON.parse(data)
	ensDataArray = data["ensDataArray"]
	lastBlockNumber = data["lastBlockNumber"]
}
catch(error){
	firstrun = true
}


//check if it is the first run, if yes then process all blocks startng from the last block to the current block
if (firstrun){
	console.log("First Run Sequence")
}
web3.eth.getBlockNumber(function(err, blockNum){
	var prevLength = ensDataArray.length
	processBlocks(registrar, lastBlockNumber, blockNum, function(err){
		if(!err){
			lastBlockNumber = blockNum
			console.log("Block Processing Complete - " + (ensDataArray.length - prevLength).toString() + " unique auction(s) found")
			fs.writeFile('data.json', JSON.stringify({ensDataArray, "lastBlockNumber": lastBlockNumber}), 'utf8', function(err, data){
			    if (err) console.log(err);
			    console.log("Successfully Written to File.");
			});
			firstrun = false
			//After all blocks have been processed trigger the processBlocks funtion eery 5 minutes
			setInterval(function(){
				web3.eth.getBlockNumber(function(err, blockNum){
					var prevLength = ensDataArray.length
					processBlocks(registrar, lastBlockNumber, blockNum, function(err){
						if(!err){
							lastBlockNumber = blockNum
							console.log("Block Processing Complete - " + (ensDataArray.length - prevLength).toString() + " unique auction(s) found")
							fs.writeFile('data.json', JSON.stringify({ensDataArray, "lastBlockNumber": lastBlockNumber}), 'utf8', function(err, data){
							    if (err) console.log(err);
							    console.log("Successfully Written to File.");
							});
						}
						else{
							console.log("[ERROR] Could not process blocks")
						}
					})
				})
			}, 300000)
		}
		else{
			console.log("[ERROR] Could not process blocks")
		}
	})
})

//----------------------------------------------------REST API-------------------------------------------------------//
app.post('/', function (req, res) {
	for(var j=0; j< ensDataArray.length; j++){
		if(ensDataArray[j]["hash"] == req.body.hash){
			ensData = newensData()
			ensData = ensDataArray[j]
			res.json(ensData)
		}
	}
	res.json(404,'')
})

app.listen(port);
console.log("Server started on " + port.toString())

//----------------------------------------------------Helper Functions-----------------------------------------------//

/**
*This function processes all blocks from the start number to the end number
*for ENS transactions to a particular account
*@param myaccount specifies the account to look for while processing blocks 
*@param startBlockNumber The block number to start processing from 
*@param endBlockNumber The block number to end processing at
*@callback callback function with error code indicating successfull processing and otherwise
*/

async function processBlocks(myaccount, startBlockNumber, endBlockNumber, callback) {
	console.log("Processing Blocks......")
	var numBlockProcessed = 0;
	var ENS_hashes = [] // array if unique ENS hashes
	var unsealedBids = [] // contains the revealed bid amount, who made the bid and the hash against which the bid was made

	/*go through every block from start to end and filter out the transactions 
  	*referring to the account address
  	*/
  	for (var i = startBlockNumber; i <= endBlockNumber; i++) {
	    var block = web3.eth.getBlock(i, true, function(err, block){
	    	if (block!=null && block.transactions !=null && !err) {
	    		var numTxnProcessed = 0;
	    		var totalTxn = block.transactions.length

		      	block.transactions.forEach( function(e) {
		      		//count number of transactions to later check if all were processed.
		      		numTxnProcessed++;

		      		//intialize variables to store info
		      		var unsealInfo = {}

		      		/*check if the to address matches with the account*/
			        if (myaccount == e.to) {
						try{
							var inputData = abiDecoder.decodeMethod(e.input)
							var name = inputData["name"]
							var params = inputData["params"]
							var index = -1
						}
						catch(error){
							console.log("error reading input data")
						}

						//process different kinds of auction events
						switch(name){
							case 'unsealBid':
								unsealInfo["from"] = e.from
								unsealInfo["bidAmount"] = parseInt(params[1]["value"])
								index = checkUniqueness(params[0]["value"])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["events"]["revealedBids"].push(unsealInfo)
									ensData["hash"] = params[0]["value"]
									ensData["events"]["started"] = true
									ensDataArray[index] = ensData
								}
								else{
									if(checkUniquenessUnseal(unsealInfo, ensDataArray[index]["events"]["revealedBids"])){
										ensDataArray[index]["events"]["revealedBids"].push(unsealInfo)
										ensDataArray[index]["events"]["started"] = true
									}
								}
								index = -1
								break;
							case 'transfer':
								index = checkUniqueness(params[0]["value"])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["owner"] = params[1]['value']
									ensData["events"]["transferred"] = true
									ensData["hash"] = params[0]["value"]
									ensDataArray[index] = ensData
								}
								else{
									ensDataArray[index]["events"]["transferred"] = true
									ensDataArray[index]["owner"] = params[1]['value']
								}
								index = -1
								break;
							case 'startAuctionsAndBid':
								index = checkUniqueness(params[0]["value"][0])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["owner"] = e.from
									ensData["events"]["started"] = true
									ensData["hash"] = params[0]["value"][0]
									ensDataArray[index] = ensData
								}
								else{
									ensDataArray[index]["events"]["started"] = true
									ensDataArray[index]["owner"] = e.from
								}
								index = -1
								break;
							case 'startAuction':
								index = checkUniqueness(params[0]["value"])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["owner"] = e.from
									ensData["events"]["started"] = true
									ensData["hash"] = params[0]["value"]
									ensDataArray[index] = ensData
								}
								else{
									ensDataArray[index]["events"]["started"] = true
									ensDataArray[index]["owner"] = e.from
								}
								index = -1
								break;
							case 'finalizeAuction':
								index = checkUniqueness(params[0]["value"])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["events"]["finalized"] = true
									ensData["hash"] = params[0]["value"]
									ensDataArray[index] = ensData
								}
								else{
									ensDataArray[index]["events"]["finalized"] = true
									ensDataArray[index]["owner"] = highestBidder(ensData['events']['revealedBids'])
								}
								index = -1
								break;
							case 'releaseDeed':
								index = checkUniqueness(params[0]["value"])
								if(index == ensDataArray.length){
									ensData = newensData()
									ensData["owner"] = e.from
									ensData["events"]["released"] = true
									ensData["hash"] = params[0]["value"]
									ensDataArray[index] = ensData
								}
								else{
									ensDataArray[index]["events"]["released"] = true
									ensDataArray[index]["owner"] = e.from
								}
								index = -1
								break;
							default:
								console.log("[WARN]: Unidentified contract events found")
						}
			        }
			        if(numTxnProcessed == totalTxn){
			        	numBlockProcessed++
			        	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
			        		callback(0)
			        	}
			        }
			    });
			    if(totalTxn == 0){
			    	console.log("[OBS]: block " + block.number + " without transactions")
			    	numBlockProcessed++
			    	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
		        		callback(0)
		        	}
			    }
		    }
		    else{
		    	console.log("[ERROR]: Couldn't get block")
		    	numBlockProcessed++
		    	if(numBlockProcessed > (endBlockNumber-startBlockNumber)){
		        	callback(0)
		        }
		    }
	    })
		await sleep(100) //to ensure that getBlock requests are not overlapping too much
  	}
}

/**
*This checks if a record of the particular hash already exists in the Data Array
*@param hash hash of the ENS domain
*@return index of the pre-existing record, if no pre-existing record index 
*        for the creation of new record
*/
function checkUniqueness(hash){
	for(var i=0; i<ensDataArray.length; i++){
		if(hash == ensDataArray[i]["hash"]){
			return (i)
		}
	}
	return (ensDataArray.length)
}

/**
*This checks if a record of the unsealBid event already exists in the hash record
*@param unsealInfo the unsealBid event record {'from':<address>,'bidAmount':<value>}
*@param arrayInfo the array which contains all other unsealBid event records
*@return true if the record doesn't exist. false if the record exists
*/
function checkUniquenessUnseal(unsealInfo, arrayInfo){
	if(arrayInfo.length > 0){
		for(var i=0; i<arrayInfo.length; i++){
			if(unsealInfo['from'] == arrayInfo[i]["from"] && unsealInfo['bidAmount'] == arrayInfo[i]['bidAmount']){
				return (false)
			}
		}
		return (true)
	}
	else{
		return (true)
	}
}

/**
*This finds out the highest bidder among an array of revealed bids
*@param array the array of unsealBid records. Found at ensDataArray['events']['revealedBids']
*@return the address of the highest bidder
*/
function highestBidder(array){
	max = 0
	pos = 0
	if(array.length > 0){
		for(var i=0; i<array.length; i++){
			if(array[i]['bidAmount'] > max){
				max = array[i]['bidAmount']
				pos = i
			}
		}

		return (array[pos]['from'])
	}
	else{
		return ('')
	}
}

/**
*Sleep/Delay function to put a momentary delay before the next block is fetched
*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}