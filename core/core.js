const { ethers } = require('ethers')
const ContractArtifact = require('./SimpleMarketplace.json')
const CONTRACT_ADDRESS = ContractArtifact.networks['3'].address

const ABI = [
  'function InstanceOwner () public view returns(address)',
  'function Description () public view returns(string)',
  'function AskingPrice () public view returns(int)',

  'function InstanceBuyer () public view returns(address)',
  'function OfferPrice () public view returns(int)',

  'function MakeOffer(int offerPrice) public',
  'function Reject() public',
  'function AcceptOffer() public'
]

let provider = new ethers.providers.Web3Provider(window.ethereum)
//С помощью провайдера мы подключаемся к сети Blockcain
let readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider)
//Дает нам возможность читать view методы контракта
let signer = provider.getSigner()
//Нужен для подтверждения транзакций
let contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer)
let contractSigner = contract.connect(signer)
//Дают возможность выполнять транзакции

export default {
  async getInstanceOwner() {
    const instanceOwner = await readOnlyContract.InstanceOwner()
    return {instanceOwner: instanceOwner}
  },
  async getDescription() {
    const description = await readOnlyContract.Description()
    return {description: description}
  },
  async getAskingPrice() {
    const askingPrice = await readOnlyContract.AskingPrice()
    return {askingPrice: askingPrice}
  },
  async getInstanceBuyer() {
    const instanceBuyer = await readOnlyContract.InstanceBuyer()
    return {instanceBuyer: instanceBuyer}
  },
  async getOfferPrice() {
    const offerPrice = await readOnlyContract.OfferPrice()
    return {offerPrice: offerPrice}
  },

  async makeOffer(offerPrice) {
    const txResponse = await contractSigner.MakeOffer(offerPrice, {gasLimit: 300000})
    const txReceipt = await txResponse.wait()
    return {transaction: txReceipt.transactionHash}
  },
  async reject() {
    const txResponse = await contractSigner.Reject({gasLimit: 300000})
    const txReceipt = await txResponse.wait()
    return {transaction: txReceipt.transactionHash}
  },
  async acceptOffer() {
    const txResponse = await contractSigner.AcceptOffer({gasLimit: 300000})
    const txReceipt = await txResponse.wait()
    return {transaction: txReceipt.transactionHash}
  }
}
