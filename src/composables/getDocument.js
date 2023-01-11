import { projectFirestore } from "@/firebase/config";
import { ref, watchEffect } from "vue";

const getDocument = (collection, id) => {
    const document = ref(null)
    const error = ref(null)

    let documentnRef = projectFirestore.collection(collection).doc(id)
        
    const unsub = documentnRef.onSnapshot(doc => {
        if (doc.data()) {
            document.value = {...doc.data(), id: doc.id}
            error.value = null
        } else {
            error.value = "That document doesn't exist !"
        }
        
    }, (err) => {
        console.log(err.message)
        error.value = 'Could not fetch document !'
    })

    watchEffect((onInvalidate) => {
        // unsub from prev collextion when watch is stopped (component unmounted)
        onInvalidate(() => unsub())
    })

    return { document, error }
}

export default getDocument