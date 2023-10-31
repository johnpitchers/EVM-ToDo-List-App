<template>
  <header>
    <nav class="navbar bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav flex-row">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link me-2">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/help" class="nav-link me-2">Help</RouterLink>
          </li>
        </ul>
        <button class="btn btn-danger" v-if="showCommitLink" :disabled="disableCommitLink" @click="commitToBlockchain">Commit to blockchain</button>
      </div>
    </nav>
  </header>
  <div class="container-fluid">
    <router-view v-slot="{ Component, route }">
      <Transition appear name="slide-fade">
        <component :is="Component" :key="route.path" @dataChanged="dataChanged"/>
      </Transition>
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
const web3 = Web3Singleton;

const dataChanged = (val) => {
  showCommitLink.value = val;
  disableCommitLink.value = false;
}

const commitToBlockchain = async () => {
  disableCommitLink.value = true;
  await web3.sendTransaction();
}

</script>

===========================================================

<style>

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(6px);
  opacity: 0;
}

h1 {
  font-weight: bold;
}
#overlay {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: #ffffff90;
}
</style>
