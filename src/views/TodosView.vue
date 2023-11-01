<template>
  <div v-if="connectedToWeb3" class="todos-container container py-4">
    <div class="card">
      <div class="card-header text-bg-primary text-light">
        <h1 class="fs-2 my-2 text-center">{{ pageTitle }}</h1>
      </div>
      <div class="todos card-body ">
        <input id="newtodoinput" class="form-control d-block w-100 px-3 py-2 fs-4 mb-3" type="text" placeholder="Enter a task..." v-model="newTodoText" @blur="addNewTodo" @keyup.enter="addNewTodo">
        <todo-list :todos="todos" v-on:persist="persist"></todo-list>
      </div>
    </div>
  </div>

  <div v-else class="container todos-container py-5">
    <div class="card">
      <div class="card-body">
        <h4 class="text-center">Connecting to web3</h4>
        <div class="d-flex justify-content-center align-items-center py-4">
          <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-show="dataFrom === ''" class="container todos-container py-5">
    <div class="card">
      <div class="card-body">
        <h4 class="text-center">Data Conflict</h4>
        <div class="d-flex justify-content-between align-items-center py-4">
          <button id="confirmBlockchain">Blockchain</button>
          <button id="confirmMemory">Memory</button>
        </div>
      </div>
    </div>
  </div>

  <div v-if="awaitingConfirmation" class="position-fixed w-100 h-100 d-flex justify-content-center align-items-center" style="top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
    <div class="card" style="width: 18rem;">
      <div class="card-body text-center">
        <div class="d-flex justify-content-center align-items-center" style="height: 180px;">
          <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h5 class="card-title">Awaiting Confirmation</h5>
        <p class="fs-6">Likely less than {{txConfirmationTimeCountdown}} seconds.</p>
        <transition name="slide-fade">
          <p v-if="slowNetwork" class="alert alert-danger fs-6">Taking longer than expected. Either wait for the transaction to confirm or speed up the transaction in Metamask.</p>
        </transition>
        <hr>
        <p class="fs-6">Transaction Hash: {{ shortenedTxHash }}</p>
        <a :href="'https://sepolia.etherscan.io/tx/'+web3.state.txHash" class="btn btn-primary btn-sm" target="_blank">View on Etherscan</a>
      </div>
    </div>
  </div>

  <div v-if="web3.state.error !== {} && web3.state.error.code" class="position-fixed w-100 h-100 d-flex justify-content-center align-items-center" style="top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
    <div class="card" style="width: 18rem;">
      <button v-if="web3.state.error.recoverable" type="button" class="btn btn-sm btn-close position-absolute top-0 end-0 p-2" @click="web3.state.error = {}"></button>
      <div class="card-body fs-6">
        <h5 class="card-title">Something went wrong!</h5>
        <hr>
        <p class="fs-6" v-html="web3.state.error.message"></p>
        <p>
          <button v-if="web3.state.error.recoverable" type="button" class="btn btn-sm btn-primary" @click="web3.state.error = {}">Dismiss</button>
        </p>
      </div>
    </div>
  </div>
</template>

===========================================================

<script setup>
import {computed, ref, onMounted, watch} from "vue";
import TodoList from '../components/TodoList.vue';
import Web3Singleton from "@/web3";

/***************************
 * Props,refs and emits
 ***************************/
const pageTitle = "Your tasks...";
const dataFrom = ref('blockchain');
const connectedToWeb3 = ref(false);
const newTodoText = ref("");
const todos = ref([]);
const awaitingConfirmation = ref(false);
const txConfirmationTime = 15; // Seconds.
const txConfirmationTimeCountdown = ref(0); // Seconds.
const slowNetwork = ref(false);
const web3 = Web3Singleton;
const dataChanged = ref(false);
const emit = defineEmits(['dataChanged']);
const shortenedTxHash = computed(() => {
  if (web3.state.txHash) {
    return `${web3.state.txHash.slice(0, 4)}...${web3.state.txHash.slice(-4)}`;
  }
  return "";
});

/***************************
 * Lifecycle hooks and watchers
 ***************************/
onMounted(async () => {
  console.clear();
  todos.value = await getDataFromChain();
  reorderDeletedTasks();
  setBlockchainDataHash(todos.value);
  persist();

  if (todos.value.length === 0) {
    todos.value = [
      {id: "aaa", index: 0, task: "Welcome to the EVM Todo List.", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aab", index: 0, task: "A totally inappropriate use of blockchain space. LOL.", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aac", index: 0, task: "Delete these sample tasks.", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aad", index: 0, task: "Enter your own.", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aae", index: 0, task: "Commit them to the blockchain 😃", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
    ]
  }
});

watch(
  () => web3.state.awaitingConfirmation,
  () => {
    awaitingConfirmation.value = web3.state.awaitingConfirmation;
    if (awaitingConfirmation.value) {
      slowNetwork.value = false;
      txConfirmationTimeCountdown.value = txConfirmationTime;
      window.slowNetworkTimer = setTimeout(() => {
        slowNetwork.value = web3.state.awaitingConfirmation;
      }, txConfirmationTime * 1200); // wait time + 20%
      let timer = setInterval(() => {
        if (txConfirmationTimeCountdown.value > 0) {
          txConfirmationTimeCountdown.value--;
        } else {
          clearInterval(timer);
        }
      }, 1000);
    } else {
      setBlockchainDataHash();
      persist()
    }
  }
);

watch(() => web3.state.error, () => {
  if (web3.state.error.code) {
    if (web3.state.error.code === 80000) {
      web3.state.error.message = "<p><strong>Web3 is not available.</strong></p><p>Install and configure the Metamask extension and connect to the Sepolia testnet, Polygon L2 or Optimism L2.</p><p>Refresh the page when ready.</p>";
    }
    if (web3.state.error.code === 80001) {
      let networkName = web3.state.network.name.charAt(0).toUpperCase() + web3.state.network.name.slice(1);
      web3.state.error.message = "<p>You are currently connected to <strong>" + networkName + "</strong>.</p><p> This app will interact with:<ul><li>Sepolia testnet</li></ul><p>Or, if you want to spend some real-world gas fees:</p><ul><li>Polygon L2</li><li>Optimism L2</li></ul></p><p>Sepolia testnet is available as a preset in Metamask. Follow <a target='_blank' href='https://www.coingecko.com/learn/sepolia-eth#adding-sepolia-to-metamask'>this guide</a> to enable the Sepolia network. Get free testnet ETH from <a href='https://sepolia-faucet.pk910.de/' target='_blank'>here</a>.</p><p>Refresh the page when ready.</p>";
    }
    if (web3.state.error.code === 80002) {
      web3.state.error.message = "<p>Your browser is Web3 enabled but doesn't seem to be configured or is unable to interact with smart contracts.</p><p>Please install the Metamask extension if possible</p><p>Make sure you have set up a wallet and enabled web3 in your settings. Connect to the Sepolia testnet.</p><p>Refresh the page when ready.</p>";
    }
    // A message will automatically be displayed to the user. See template code.
    emit('dataChanged', dataChanged.value, false);
  }
});

/***************************
 * Functions
 ***************************/

const userConfirmDataLocation = () => {
  return new Promise((resolve, reject) => {
    dataFrom.value = '';
    document.getElementById('confirmBlockchain').addEventListener('click', () => {
      dataFrom.value = 'blockchain';
      resolve(true);
    });
    document.getElementById('confirmMemory').addEventListener('click', () => {
      dataFrom.value = 'memory';
      resolve(true);
    });
  })
}

const getDataFromChain = async () => {
  try {
    await web3.connectToMetamask();
    await web3.setUpEventListeners();
    let taskList = await web3.getTasks();
    connectedToWeb3.value = true;
    return taskList;
  } catch (e) {
    connectedToWeb3.value = false;
    console.log("ERROR CAUGHT:", e)
  }
}

// Move tasks marked as deleted to the top of the array.
const reorderDeletedTasks = () => {
  for (let i = 0; i < todos.value.length; i++) {
    if (todos.value[i].isDeleted) {
      todos.value.splice(0, 0, todos.value[i]);
      todos.value.splice(i + 1, 1);
    }
  }
}

const rearrange = (arr, oldIndex, newIndex) => {
  if (oldIndex > newIndex) {
    arr.splice(newIndex, 0, arr[oldIndex]);
    arr.splice(oldIndex + 1, 1);
  } else {
    arr.splice(newIndex + 1, 0, arr[oldIndex]);
    arr.splice(oldIndex, 1);
  }
}

const addNewTodo = () => {
  if (newTodoText.value.length === 0) return;
  let order = todos.value.length ? (todos.value[todos.value.length - 1].order) + 1000 : 1000;
  todos.value.push({
    id: (Math.floor(Math.random() * Math.pow(16, 8))).toString(16),
    index: 0, // This tells the smart contract this it is a new task.
    task: newTodoText.value,
    isDone: false,
    isDeleted: false,
    order: order,
    edit: false,
    isStoredOnChain: false
  })
  newTodoText.value = ""
  persist();
}

const persist = () => {
  let currentDataHash = web3.getDataHash(todos.value);
  window.localStorage.setItem('currentDataHash', currentDataHash);
  window.localStorage.setItem('todoList', JSON.stringify(todos.value));
  dataChanged.value = window.localStorage.getItem('blockChainDataHash') !== currentDataHash;
  emit('dataChanged', dataChanged.value, web3.state.txConfirmed);
  web3.state.txConfirmed = false
}

const setBlockchainDataHash = () => {
  window.localStorage.setItem('blockChainDataHash', web3.getDataHash(todos.value));
}
</script>

===========================================================

