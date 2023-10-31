<template>
  <div class="todos-container container-sm py-4">
    <div class="card">
      <div class="card-header text-bg-primary text-light">
        <h1 class="fs-2 my-2 text-center">{{ pageTitle }}</h1>
      </div>
      <div class="todos card-body ">
        <input id="newtodoinput" class="form-control  d-block w-100 px-3 py-2 fs-4 mb-3" type="text" placeholder="Enter a task..." v-model="newTodoText" @blur="addNewTodo" @keyup.enter="addNewTodo">
        <todo-list :todos="todos" v-on:persist="persist"></todo-list>
      </div>
    </div>
  </div>

  <div v-if="awaitingConfirmation" class="position-fixed w-100 h-100 d-flex justify-content-center align-items-center" style="top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
    <!-- Bootstrap Card -->
    <div class="card" style="width: 18rem;">
      <div class="card-body text-center">
        <!-- Bootstrap Spinner -->
        <div class="d-flex justify-content-center align-items-center" style="height: 180px;">
          <div class="spinner-border text-primary" style="width: 4rem; height: 4rem;" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <h5 class="card-title">Awaiting Confirmation</h5>
        <p class="f6-6">Likely less than 15 seconds.</p>
        <transition name="slide-fade">
          <p v-if="slowNetwork" class="alert alert-danger">Taking longer than expected. Either wait for the transaction to confirm or speed up the transaction in Metamask.</p>
        </transition>
        <hr>
        <p class="fs-6">Transaction Hash: {{ shortenedTxHash }}</p>
        <a :href="'https://sepolia.etherscan.io/tx/'+web3.state.txHash" class="btn btn-primary btn-sm" target="_blank">View on Etherscan</a>
      </div>
    </div>
  </div>

  <div v-if="web3.state.error !== {} && web3.state.error.code" class="position-fixed w-100 h-100 d-flex justify-content-center align-items-center" style="top: 0; left: 0; background-color: rgba(0, 0, 0, 0.5); z-index: 1000;">
    <!-- Bootstrap Card -->
    <div class="card" style="width: 18rem;">
      <button type="button" class="btn btn-sm btn-close position-absolute top-0 end-0 p-2" @click="web3.state.error = {}"></button>
      <div class="card-body text-center">
        <h5 class="card-title">Metamask Error: {{ web3.state.error.code }}</h5>
        <hr>
        <p class="fs-6">{{ web3.state.error.message }}</p>
        <p>
          <button type="button" class="btn btn-sm btn-primary" @click="web3.state.error = {}">Dismiss</button>
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
const pageTitle = "Blockchain Todo List!";
const newTodoText = ref("");
const todos = ref([]);
const awaitingConfirmation = ref(false);
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

  try {
    if (todos.value.length === 0) {
      throw new Error();
    }
  } catch (e) {
    todos.value = [
      {id: "aaa", index: 0, task: "Delete these sample tasks", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aab", index: 0, task: "Enter your own", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
      {id: "aac", index: 0, task: "Commit them to the blockchain 😃", isDone: false, isDeleted: false, order: 0, edit: false, isStoredOnChain: false},
    ]
  }
});

watch(
  () => web3.state.awaitingConfirmation,
  () => {
    console.log("waiting changed to", web3.state.awaitingConfirmation);
    awaitingConfirmation.value = web3.state.awaitingConfirmation;
    if (web3.state.awaitingConfirmation) {
      slowNetwork.value = false;
      window.slowNetworkTimer = setTimeout(() => {
        slowNetwork.value = web3.state.awaitingConfirmation;
      }, 15000);
    } else {
      setBlockchainDataHash();
      persist()
    }
  }
);

watch(() => web3.state.error, () => {
  if (web3.state.error.code) {
    // A message will automatically be displayed to the user.
    // See template code.
    emit('dataChanged', dataChanged.value);
  }
});

/***************************
 * Functions
 ***************************/
const getDataFromChain = async () => {
  await web3.connectToMetamask();
  await web3.setUpEventListeners();
  return await web3.getTasks();
}

// Move tasks marked as deleted to the top of the array.
const reorderDeletedTasks = () => {
  for (let i = 0; i < todos.value.length; i++) {
    if (todos.value[i].isDeleted) {
      todos.value.splice(0, 0, todos.value[i]);
      todos.value.splice(i + 1, 1);
    }
  }
  console.log(todos.value)
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
  console.log(order);
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
  emit('dataChanged', dataChanged.value);
}

const setBlockchainDataHash = () => {
  window.localStorage.setItem('blockChainDataHash', web3.getDataHash(todos.value));
}
</script>

===========================================================

