<template>
    <div id="passwordModal" v-if="show">
      <div class="card mb-3 text-white">
        <div class="card-body">
          <h5 class="card-title">{{ errorMessage }}</h5>
        </div>
        <div class="footer">
          <button class="btn btn-light" @click="show=false">Fermer</button>
        </div>
      </div>
    </div>
</template>
    
<script>
import { ref } from '@vue/reactivity';
export default {
    name: "ErrordModal",
    props: ['errorMessage'],

    setup() {
        const show = ref(true)

        if(!show){
          console.log('ca marche')
        }
        
        return { show }
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
      width: 30%;
      background-color:#c0392b;
    }
    #passwordModal .footer{
      margin: auto;
    }
  </style>