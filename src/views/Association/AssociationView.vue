<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-2">
                <SideBarMenu />
            </div>
            <div class="col-sm-10">
                <div class="card">
                    <div class="card-body">

                        <div class="jumbotron">
                            <h1 class="display-4">{{ association.associationName }}</h1>
                            <p class="lead">
                                Lieu de réunion à <b>{{ association.associationAddresse[0].toUpperCase() + 
                                association.associationAddresse.slice(1) }} ({{ association.associationCountry }})</b>, le 
                                <b>{{ association.associationMeetingDate }}</b> de chaque mois.
                            </p>
                            <hr class="my-4">
                            
                            <div class="row">
                                <div class="col-sm-6">
                                    <div class="card text-white bg-secondary mb-3">
                                        <div class="card-header">Membres</div>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ number }} membres.</h5>
                                            <p class="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="card text-white bg-dark mb-3">
                                        <div class="card-header">Membres</div>
                                        <div class="card-body">
                                            <h5 class="card-title">Nombre de membres</h5>
                                            <p class="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-sm-12">
                                    <div class="card text-dark bg-slight mb-3">
                                        <div class="card-header">Ce mois</div>
                                        <div class="card-body">
                                            <h5 class="card-title">Nombre d'absences : </h5>
                                            <h5 class="card-title">Nombre de retards : </h5>
                                            <h5 class="card-title">Montant total récolté : </h5>
                                        </div>
                                    </div>
                                </div>
                            </div>    

                        </div>

                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>

<script>
import SideBarMenu from '@/components/menu/SideBarMenu.vue'
import SuccessModal from '@/components/modal/SuccessModal'
import ErrorModal from '@/components/modal/ErrorModal'
import getDocument from '@/composables/getDocument'
import { ref } from '@vue/reactivity'
import { 
    doc, deleteDoc, getFirestore, updateDoc, collection, query, getDocFromCache, get, getDocs, onSnapshot , where, getCountFromServer
} from "firebase/firestore"
import { projectFirestore } from "@/firebase/config";

export default {
    props: ['associationId'],
    components: {
        SideBarMenu, SuccessModal, ErrorModal
    },
    setup (props) {
        const { error, document: association } = getDocument('associations', props.associationId)
        const number = ref('')

        // get members subcollection from the collection 'associations'
        const membersList = ref(null)
        const messageRef = collection(projectFirestore, "associations", props.associationId, "members");
        onSnapshot(messageRef, (snapshot) => {
            let members = []
            let count = 0
            snapshot.docs.forEach((doc) => {
                members.push({ ...doc.data(), id:doc.id })
                count = count + 1
            })
            number.value = count
            membersList.value = members
        })

        return {
            association, error, number
        }
    }
}
</script>

<style scoped>
    
</style>