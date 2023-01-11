<template>
  <div id="passwordModal" v-if="show">
    <div class="card mb-3">
      <div class="card-body" align="center">
        <img :src="checked" style="width: 100%;"/>
      </div>
      <div class="footer">
        <button class="btn btn-danger" @click="show=false">Fermer</button>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref } from '@vue/reactivity';
import checked from "@/assets/checked.png"

export default {
  name: "SuccessdModal",
  props: ['successMessage'],

  setup() {
    const show = ref(true)
    
    return { show, checked }
  }
}
</script>
  
<style scoped>
  #passwordModal {
    z-index: 1; 
    position: fixed;
    overflow: auto;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%; 
    position: fixed;
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4);
  }
  #passwordModal .card{
    margin: 15% auto; 
    padding: 20px; 
    border: 1px solid #888;
    width: 20%;
    background-color:#a3e4d7 ;
  }
  #passwordModal .footer{
    margin: auto;
  }
</style>