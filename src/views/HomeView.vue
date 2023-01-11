<template>
  <div class="welcome container">
    <div class="card card-body">
      <h1><b>Pellel Malal !</b></h1>
      <p></p>
      <div v-if="showLogin">
        <h2>Connexion</h2>
        <p></p>
        <LoginForm @login="enterUserAccount" />
        <p>Pas encore de compte utilisateur ? <span @click="showLogin=false">S'inscription</span> </p>
      </div>
      <div v-else>
        <h2>Inscription</h2>
        <p></p>
        <SignUpForm @signup="enterUserAccount" />
        <p>Avez-vous un compte utilisateur ? <span @click="showLogin=true">Se connecter</span> </p>
      </div> 
    </div>  
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import SignUpForm from '../components/auth/SignUpForm.vue'
import LoginForm from '../components/auth/LoginForm.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'HomeView',
  components: {
    HelloWorld, SignUpForm, LoginForm
  },
  setup () {
    const showLogin = ref(true)
    const router = useRouter()

    const enterUserAccount = () => {
      router.push({name: 'welcome'})
    }

    return { showLogin, enterUserAccount }
  }
}
</script>

<style scoped>
  .card {
    width: 900px;
    display: inline-block;
    align-items: center;
    margin: auto;
  }
    .welcome {
        text-align: center;
        padding: 20px 0;
    }
    .welcome span {
        font-weight: bold;
        text-decoration: underline;
        cursor: pointer;
    }
</style>
