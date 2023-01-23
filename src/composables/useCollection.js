import { projectFirestore } from "@/firebase/config"
import { ref } from "vue"

const useCollection = (collection) => {
    const error = ref(null)
    const docId = ref('')

    const addDoc = async (doc) => {
        error.value = null
        docId.value = null

        try {
            await projectFirestore.collection(collection).add(doc)
            .then(docRef => { docId.value = docRef.id })
        } catch(err) {
            console.log(err.message)
            error.value = err.message
        }
    }

    return { error, addDoc, docId }
}

export default useCollection