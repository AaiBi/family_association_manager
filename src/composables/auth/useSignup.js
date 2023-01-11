import { ref } from "vue"
import { projectAuth } from '@/firebase/config'
import { useRouter } from "vue-router"

const error = ref(null)
const success = ref(null)
const router = useRouter()

const signup = async (email, password, firstName, lastName, phoneNumber, country, address) => {
    error.value = null
    success.value = null

    try {
        const res = await projectAuth.createUserWithEmailAndPassword(email, password)
        if (!res) {
            throw new Error("Impossible de completer l'inscription !")
        }
        await res.user.updateProfile({ firstName, lastName, phoneNumber, country, address })
        success.value = "Inscription terminée! Veuillez cliquer sur 'Se connecter' pour vous connecter à votre compte utilisateur"
        error.value = null

        return res
        
    }catch(err) {
        console.log(err.message)
        error.value = err.message
    }
}

const useSignup = () => {
    return { error, signup, success }
}

export default useSignup