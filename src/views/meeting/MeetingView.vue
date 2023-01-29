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
                        
                        <div v-if="meetingsList">
                            <div v-for="meeting in meetingsList" :key="meeting.id">
                                <div v-if="meeting.createdAt.toDate().getMonth() === nowMonth">
                                    <div style="display: none">
                                        {{ meetingPresence=true }}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div v-if="!meetingPresence" style="margin-bottom: 100px;">
                            <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true" style="float:right;">
                                Nouvelle réunion
                            </button>
                        </div>
                        
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

                        <div class="row" v-if="meetingsList && !showForm">

                            <div class="col-sm-4" v-for="meeting in meetingsList" :key="meeting.id">
                                <div type="button" @click="openMeeting(meeting.id)">
                                    <div class="card text-white bg-secondary mb-3" style="max-width: 18rem;">
                                        <div class="card-header">{{meeting.createdAt.toDate().toLocaleString("fr")}}</div>
                                        <div class="card-body">
                                            <p class="card-text">
                                                {{ meeting.subjects }}
                                            </p>
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
    doc, deleteDoc, getFirestore, updateDoc, collection, query, getDocFromCache, get, getDocs, onSnapshot , where, orderBy
} from "firebase/firestore"
import { projectFirestore } from "@/firebase/config";

export default {
    props: ['associationId'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const { error: errorGetDocument, document: association } = getDocument('associations', props.associationId)
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const { addDoc, error: errorUseCollection } = useCollection('meetings')
        const subjects = ref('')
        const router = useRouter()
        const meetingId = ref('')
        const nowDate = new Date();
        const nowMonth = nowDate.getMonth()
        const month = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
        const monthName = month[nowDate.getMonth()];
        const nowYear = nowDate.getFullYear()

        // get meetings subcollection from the collection 'associations'
        const meetingsList = ref(null)
        const associationMeetings = collection(
            projectFirestore, "associations", props.associationId, "meetings"
        )
        const q = query(associationMeetings, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            let meetings = []
            snapshot.docs.forEach((doc) => {
                meetings.push({ ...doc.data(), id:doc.id })
            })
            meetingsList.value = meetings
        })

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
                        createdMonth: monthName,
                        createdYear: nowYear,
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

        const openMeeting = async (meetingId) => {
            router.push({ name: 'NewMeeting', params: {associationId: props.associationId, meetingId: meetingId} })
        }

        return {
            association, errorGetDocument, showForm, subjects, errorUseCollection, showSuccessModal, meetingsList, nowMonth,
            handleSubmitNewMeeting, membersList, meetingPresence: false, openMeeting
        }
    },
    methods: {
        getHumanDate : function (date) {
            return moment(date).format("MMM Do YYYY");
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