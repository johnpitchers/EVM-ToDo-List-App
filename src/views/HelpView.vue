<template>
  <div class="container todos-container about py-5">
    <h1>EVM Todo List Application</h1>
    <p>This todo application stores your tasks in a smart contract deployed on an Ethereum compatible layer 2 or testnet blockchain.</p>
    <p>Your tasks are owned by the address linked to your wallet.</p>
    <h3>Why Blockchain for a Todo App?</h3>
    <p>Well, actually, you shouldn't. The application of blockchain technology for a todo app is unnecessary overkill, but it was a valuable learning experience as a deep dive into building a Solidity smart contract and interacting with it via a Javascript frontend.</p>
    <p>I certainly wouldn't recommend using this app as a real-world task manager. Gas fees are quite high (testnet ETH is free). It's just a bit of learning fun and perfectly fine on a testnet.</p>
    <p>Set up <a href="https://metamask.io/download/" target="_blank">the Metamask extension</a> to connect to the <a href="https://metamask.io/download/" target="_blank">Sepolia Testnet</a>, get some <a href="https://sepolia-faucet.pk910.de/" target="_blank">free Sepolia ETH</a> and try it out. All the front-end and smart contract code is on Github.</p>
    <h5>Give me a follow</h5>
    <p><a href="https://viperfish.com.au" target="_blank">https://viperfish.com.au</a><br>
      <a href="https://twitter.com/johnpitchers" target="_blank">https://twitter.com/johnpitchers</a><br>
      <a href="https://github.com/johnpitchers" target="_blank">https://github.com/johnpitchers</a>
    </p>

  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {

  }
}
</style>
<script setup>
</script>
