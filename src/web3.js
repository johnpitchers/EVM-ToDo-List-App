import {BrowserProvider, Contract, formatEther, hashMessage, id, sha256, toUtf8Bytes} from "ethers";
import {contractAddresses, contractABI} from "@/todoContractInterface";

import {reactive, watch} from "vue";

let instance = null

class Web3 {

  signer = null;
  provider = null;
  network = null;
  contract = null;
  allowedNetworks = ["sepolia", "polygon", "optimism"];
  state = reactive({
    network: {},
    awaitingConfirmation: false,
    txHash: "",
    txConfirmed: false,
    error: {},
  });


  constructor() {
    if (instance) {
      throw new Error("Only one instance allowed.")
    }
    instance = this
  }

  connectToMetamask = async () => {
    this.state.error = {};
    // Check web3 exention is available.
    if (!window.ethereum) {
      this.state.error = {
        code: 80000,
        message: "Web3 not available.",
        recoverable: false
      }
      throw new Error(this.state.error.valueOf().message);
    }

    // Connect to Metamask
    if (this.signer) {
      console.log("REFRESHING CONNECTION.")
    }
    console.log("CONNECTING TO METAMASK")

    this.provider = await new BrowserProvider(window.ethereum, "any");
    try {
      this.signer = await this.provider.getSigner();
      this.network = await this.provider.getNetwork();
    } catch (e) {
      this.state.error = {
        code: 80002,
        message: "Web3 not configured.",
        recoverable: false
      }
      throw new Error(this.state.error.valueOf().message);
    }
    this.state.network = {
      name: this.network.name,
      address: this.signer.address
    };
    if (!this.allowedNetworks.includes(this.network.name)) {
      this.state.error = {
        code: 80001,
        message: "Network not recognised.",
        recoverable: false
      }
    }
  }

  setUpEventListeners = async () => {
    this.provider.on('network', async (e) => {
      console.log("NETWORK EVENT", e);
      //alert("Network has been changed.");
      window.location.reload();
    })

    // This event fires when the user selects a different account/address in Metamask.
    window.ethereum.on('accountsChanged', async (e) => {
      if (e[0] !== this.signer.getAddress()) {
        await this.connectToMetamask();
        window.location.reload();
      }
    });

    window.ethereum.on('chainChanged', (e) => {
      this.provider.getNetwork().then((from, to) => {
      });
    })
    window.ethereum.on('connect', (e) => {
      console.log("ACCOUNT CONNECTED: ", e)
    })
  }

  getTasks = async () => {

    this.contract = new Contract(contractAddresses[this.state.network.name], contractABI, this.signer);
    let result = await this.contract.getTasksByOwner();
    let tasks = [];
    for (let task of result) {
      tasks.push({
        id: (Math.floor(Math.random() * Math.pow(16, 8))).toString(16),
        index: parseInt(task.index.toString()),
        task: task.task.task,
        isDone: task.task.isDone,
        isDeleted: task.task.isDeleted,
        order: parseInt(task.task.order.toString()),
        edit: false,
        isStoredOnChain: true
      });
    }
    tasks.sort((a, b) => a.order - b.order);
    return tasks;
  }

  getDataHash = (data) => {
    return id(JSON.stringify(data));
  }

  // connectToInfura = async () => {
  //   let url = `https://sepolia.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`;
  //   let ethProvider = new JsonRpcProvider(url);
  // }

  getBlockNumber = async () => {
    let blockNumber = await this.provider.getBlockNumber();
    return blockNumber;
  }

  getBalance = async () => {
    let ethBalance = await this.provider.getBalance(this.signer.getAddress());
    console.log("Eth balance:", formatEther(ethBalance));
    return ethBalance;
  }

  sendTransaction = async () => {
    let taskList = JSON.parse(window.localStorage.getItem('todoList'))
    this.state.error = {};
    this.state.txConfirmed = false;
    let txData = [];
    for (let i = 0; i < taskList.length; i++) {
      let taskData = [
        taskList[i].index,
        [
          this.signer.address,
          taskList[i].task,
          taskList[i].isDone,
          taskList[i].isDeleted,
          taskList[i].order
        ]
      ];
      txData.push(taskData);
    }
    let tx;
    try {
      tx = await this.contract.updateTasks(txData);
    } catch (e) {
      this.state.error = {
        code: e.info.error.code,
        message: e.info.error.message,
        recoverable: true
      };
      return;
    }
    this.state.txHash = tx.hash;
    this.state.awaitingConfirmation = true;
    await tx.wait();
    this.state.awaitingConfirmation = false;
    this.state.txConfirmed = true;
  }
}

let Web3Singleton = new Web3();
export default Web3Singleton;
