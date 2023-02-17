<template>
  <div class="about">
        <Menu />
        <img alt="Vue logo" src="../assets/logo.png">
           <h1><b>About</b></h1>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
export default {


components: {
   Menu
  }, 
}
</script>

<style>

img {
    width: 220px;
    height: 180px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
