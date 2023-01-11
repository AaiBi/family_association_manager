<template>
    <form @submit.prevent="handleSunmit">
        <div class="mb-3">
            <input type="email" class="form-control" required placeholder="Entrer votre email" v-model="email">
        </div>
        <div class="mb-3">
            <input type="password" class="form-control" required placeholder="Entrer votre mot de passe" v-model="password">
        </div>
        <p></p>
        <div class="error">{{ error }}</div>
        <p></p>
        <button class="btn btn-info">Se connecter</button>
        <p></p>
    </form>
</template>

<script>
    import { ref } from 'vue'
    import useLogin from '@/composables/auth/useLogin'

    export default {
        setup (props, context) {
            // refs
            const email = ref('')
            const password = ref('')

            const { error, login } = useLogin()

            const handleSunmit = async () => {
                await login(email.value, password.value)
                if (!error.value) {
                    context.emit('login')
                }
            }

            return { email, password, handleSunmit, error }
        }
    }
</script>

<style>

</style>