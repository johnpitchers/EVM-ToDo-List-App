<template>
  <header>
    <nav class="navbar bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav flex-row">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link me-2">Your tasks</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/help" class="nav-link me-2">About</RouterLink>
          </li>
        </ul>
        <div class="d-flex align-items-center">
          <transition name="fade">
            <div v-if="showConfirmed" class="pe-2 fs-6 txconfirmation">
              Transaction confirmed
            </div>
          </transition>
          <button class="btn btn-danger" v-if="showCommitLink" :disabled="disableCommitLink" @click="commitToBlockchain">Commit to blockchain</button>
        </div>
      </div>
    </nav>
  </header>
  <div class="container-fluid">
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" @dataChanged="dataChanged"/>
    </router-view>
  </div>
</template>

===========================================================

<script setup>
import {ref} from "vue";
import {RouterLink, RouterView} from 'vue-router';
import Web3Singleton from "@/web3";

const showCommitLink = ref(false);
const disableCommitLink = ref(false);
const showConfirmed = ref(false);
const web3 = Web3Singleton;

const dataChanged = (val, isConfirmed = false) => {
  showCommitLink.value = val;
  disableCommitLink.value = false;
  if (isConfirmed) {
    showConfirmed.value = true;
    setTimeout(() => {
      showConfirmed.value = false;
    }, 3000);
  }
}

const commitToBlockchain = async () => {
  disableCommitLink.value = true;
  await web3.sendTransaction();
}

</script>

===========================================================

<style>

.fade-enter-active, .fade-leave-active {
  transition: opacity 3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.alert {
  /* Your alert styling here */
}
</style>
