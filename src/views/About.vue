<template>
  <div class="about">
        <Menu />
          <img id="headerImg" alt="Vue logo" src="../assets/logo.png">
          <h1><b>About</b></h1>
          <a-spin :spinning="spinning">
            <img id="abtImg" src="https://github.com/abhinavjonnada82/wffawebapp/assets/30497847/341aabf2-ec54-420f-9b0c-7dacf28735b5" href="https://www.freepik.com/free-vector/computer-monitor-graphic-animator-creating-video-game-modeling-motion-processing-video-file-using-professional-editor-vector-illustration-graphic-design-art-designer-workplace-concept_11671412.htm#query=computer%20graphic&position=0&from_view=keyword&track=ais" />
          </a-spin>
          <h3> Need help with something? Submit your issue <a target="_blank" href="https://form.jotform.com/232801239882156">here. </a></h3>
          <Footer>Made with ❤️ in Wichita | Connect with us on <a target="_blank" href="https://www.facebook.com/WFFAPage">Facebook</a> | WFFA © 2023</Footer>
          <br />
          <br/>
  </div>
</template>

<script>
import Menu from '../components/Menu.vue';
import {ref } from 'vue';
export default {
  setup() {
    const spinning = ref(true);
    setTimeout(() => {
      spinning.value = false;
    }, 2000);

    return {
      spinning
    }

  },
components: {
   Menu
  }, 
}
</script>

<style>

#headerImg {
    width: 220px;
    height: 180px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

#abtImg {
  width: 500px;
    height: 400px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}
</style>
