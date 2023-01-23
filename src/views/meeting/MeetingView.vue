<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-2">
                <SideBarMenu />
            </div>
            <div class="col-sm-10">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">
                            {{ association.associationName }} ({{ association.associationCountry }})
                        </h2>
                    </div>
                    <div class="card-body">
                        
                        <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true" style="float:right; margin-bottom: 50px;">
                            Nouvelle réunion
                        </button>
                        
                        <div class="card form-card" v-if="showForm">
                            <form @submit.prevent="handleSubmitNewMeeting">
                                <!-- step one -->
                                <div class="card">
                                    <div class="card-header">
                                        <h4>Entrer le sujet principal de la réunion</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <textarea class="form-control" v-model="subjects" required rows="3"></textarea>
                                        </div>

                                        <p></p>

                                        <div class="row">
                                            <div class="col-sm-12">
                                                <button class="btn btn-secondary" style="width: 100%">
                                                    Commencer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p></p>
                            </form>
                            
                        </div>

                        <!-- <div class="row" v-if="meetings && !showForm" style="margin-top: 100px">

                            <div class="col-sm-4" v-for="meeting in formattedDocuments" :key="meeting.id">
                                <div class="card text-white bg-secondary mb-3" style="max-width: 18rem;">
                                    <div class="card-header">{{ meeting.createdAt }}</div>
                                    <div class="card-body">
                                        <p class="card-text">
                                            {{ meeting.subjects }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div> -->

                    </div>
                </div>
            </div>
        </div>    
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal">
        <SuccessModal :successMessage="message"></SuccessModal>    
    </div>

</template>

<script>
import SideBarMenu from '@/components/menu/SideBarMenu.vue'
import SuccessModal from '@/components/modal/SuccessModal'
import getDocument from '@/composables/getDocument'
import getCollection from '@/composables/getCollection'
import { computed, ref } from 'vue'
import useCollection from '@/composables/useCollection'
import { timestamp } from '@/firebase/config'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'vue-router'
import { 
    doc, deleteDoc, getFirestore, updateDoc, collection, query, getDocFromCache, get, getDocs, onSnapshot , where
} from "firebase/firestore"
import { projectFirestore } from "@/firebase/config";

export default {
    props: ['associationId'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const { 
            error: errorGetCollection, documents: meetings 
        } = getCollection('meetings', ['associationId', '==', props.associationId])
        const { error: errorGetDocument, document: association } = getDocument('associations', props.associationId)
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const { addDoc, error: errorUseCollection } = useCollection('meetings')
        const subjects = ref('')
        const router = useRouter()
        const meetingId = ref('')

        // get members subcollection from the collection 'associations'
        const membersList = ref(null)
        const messageRef = collection(projectFirestore, "associations", props.associationId, "members");
        onSnapshot(messageRef, (snapshot) => {
            let members = []
            snapshot.docs.forEach((doc) => {
                members.push({ ...doc.data(), id:doc.id })
            })
            membersList.value = members
        })

        // Add meeting subcollection
        const handleSubmitNewMeeting = async () => {
            if(confirm("Êtes-vous sûr de vouloir commencer une nouvelle reunion ?")){
                projectFirestore.collection('associations').doc(props.associationId).collection('meetings').add({
                    subjects: subjects.value,
                    createdAt: timestamp()
                })
                .then(function(docRef) {
                    
                    for (const doc of membersList.value) {
                        projectFirestore.collection('associations').doc(props.associationId).collection('meetings')
                        .doc(docRef.id).collection('payments').add({
                            memberFirstname: doc.memberFirstname,
                            memberLastname: doc.memberLastname,
                            memberPhoneNumber: doc.memberPhoneNumber,
                            memberAddresse: doc.memberAddresse,
                            memberAmount: doc.memberAmount,
                            payment: false,
                            delay: false,
                            absence: false,
                            createdAt: timestamp()
                        })
                    }

                    router.push({ name: 'NewMeeting', params: {associationId:props.associationId, meetingId: docRef.id} })
                })
                
            }
        }

        const formattedDocuments = computed(() => {
            if (members.value) {
                return members.value.map(doc => {
                    let time = formatDistanceToNow(doc.createdAt.toDate())
                    return { ...doc, createdAt: time }
                })
            }
        })

        return {
            association, errorGetCollection, meetings, errorGetDocument, showForm, subjects, errorUseCollection, showSuccessModal, 
            formattedDocuments, handleSubmitNewMeeting, membersList
        }
    }
}
</script>

<style scoped>
.form-card{
    box-shadow: 0px 10px 10px #c4d2e2;
    margin: auto;
}

form .btn-outline-secondary, form .btn-secondary{
    width: 100%;
}
</style>