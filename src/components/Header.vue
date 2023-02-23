<template>
  <div>
    <img alt="Vue logo" src="../assets/logo.png">
    <h1><b>{{title}}</b></h1>
  </div>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      default: "Wichita Flag Football Association"
    }

  }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

    img {
        width: 250px;
        height: 200px;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

    h1 {
        text-align:center;
        font-weight: bold;
    }

</style>