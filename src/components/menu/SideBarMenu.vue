<template>
    <div class="card">
        <router-link :to="{ name: 'welcome' }" class="link">
            <div class="card-header">Acceuil</div>
        </router-link>
        <router-link :to="{ name: 'Association' }" class="link">
            <div class="card-header">Informations</div>
        </router-link>
        <router-link :to="{ name: 'members' }" class="link">
            <div class="card-header">Membres</div>
        </router-link>
        <router-link :to="{ name: 'Meetings' }" class="link">
            <div class="card-header">Réunions</div>
        </router-link>
        <button class="link btn btn-outline-danger" @click="handleClick">Déconnexion</button>
    </div>
</template>

<script>
import useLogout from '@/composables/auth/useLogout'
import { useRouter } from 'vue-router'

export default {
    setup() {
        const { logout, error } = useLogout()
        const router = useRouter()

        const handleClick = async () => {
            await logout()
            if(!error.value) {
                console.log('user logged out')
                router.push({ name: 'home' })
            }
        }

        return { handleClick }
    }
}
</script>

<style scoped>
    .link {
        text-decoration: none;
        color: black;
    }
    
</style>