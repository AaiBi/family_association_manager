<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-2">
                <SideBarMenu />
            </div>
            <div class="col-sm-10">
                <div class="card">
                    <div class="card-header text-center">
                        <h3 class="card-title">
                            {{ member.memberFirstname }} {{ member.memberLastname }} - {{ member.memberPhoneNumber }} 
                            (Inscrit le {{ member.createdAt.toDate().toLocaleString("fr") }})
                        </h3>
                    </div>
                    <div class="card-body">

                        <div class="row">

                            <div class="col-sm-4">
                                <div class="card text-white">
                                    <div class="card-header bg-secondary" align="center">
                                        Payments non éffectués
                                    </div>
                                    <div class="card-body bg-danger">
                                        Ce membre a au total {{ noPaymentNumber }} payement(s) non éffectué(s).
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="card bg-danger text-white">
                                    <div class="card-header bg-secondary" align="center">
                                        Absences
                                    </div>
                                    <div class="card-body bg-danger">
                                        Ce membre a {{ presenceNumber }} absence(s) au total.
                                    </div>
                                </div>
                            </div>

                            <div class="col-sm-4">
                                <div class="card bg-danger text-white">
                                    <div class="card-header bg-secondary" align="center">
                                        Retards
                                    </div>
                                    <div class="card-body bg-danger">
                                        Ce membre a {{ delayNumber }} retards(s) au total.
                                    </div>
                                </div>
                            </div>

                        </div>

                        <hr>

                        <div class="card">
                            <div class="card-header">
                                <select class="form-select bg-secondary text-white" v-model="yearSelected">
                                    <option disabled value="">Sélectionner une réunion</option>
                                    <option 
                                        v-for="meeting in membersMeetingList" :value="meeting.id" :key="meeting.id"
                                        @click="switchSelect(meeting.id)">
                                        Réunion du {{ meeting.createdAt.toDate().toLocaleString("fr") }}
                                    </option>
                                </select>
                            </div>
                            <div class="card-body">
                                <div class="row" v-if="memberMeetingHistory">
                                    <div class="col-sm-6" v-for="doc in memberMeetingHistory" :key="doc.id">
                                        <div class="card bg-secondary text-white">
                                            <div class="card-header">
                                                {{ doc.createdMonth }} {{ doc.createdYear }}
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-group">
                                                    <div v-if="doc.payment">
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-success">
                                                            <b>Payement enregistré</b>
                                                            <span class="badge badge-pill text-dark">Oui</span>
                                                        </li>
                                                    </div>
                                                    <div v-else>
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-danger">
                                                            <b>Payement enregistré</b>
                                                            <span class="badge badge-pill text-dark">Non</span>
                                                        </li>
                                                    </div>
                                                    <div v-if="doc.presence">
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-success">
                                                            <b>Présence enregistrée</b>
                                                            <span class="badge badge-pill text-dark">Oui</span>
                                                        </li>
                                                    </div>
                                                    <div v-else>
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-danger">
                                                            <b>Présence enregistrée</b>
                                                            <span class="badge badge-pill text-dark">Non</span>
                                                        </li>
                                                    </div>
                                                    <div v-if="doc.delay">
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-danger">
                                                            <b>Retard enregistré</b>
                                                            <span class="badge badge-pill text-dark">Oui</span>
                                                        </li>
                                                    </div>
                                                    <div v-else>
                                                        <li 
                                                            class="list-group-item d-flex justify-content-between align-items-center 
                                                            list-group-item-success">
                                                            <b>Retard enregistré</b>
                                                            <span class="badge badge-pill text-dark">Non</span>
                                                        </li>
                                                    </div>
                                                </ul>
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
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal">
        <SuccessModal></SuccessModal>    
    </div>

</template>

<script>
import SideBarMenu from '@/components/menu/SideBarMenu.vue'
import SuccessModal from '@/components/modal/SuccessModal'
import { computed, ref } from 'vue'
import { timestamp } from '@/firebase/config'
import { formatDistanceToNow } from 'date-fns'
import { 
    doc, collection, query, onSnapshot , where, orderBy
} from "firebase/firestore"
import { projectFirestore } from "@/firebase/config";

export default {
    props: ['associationId', 'memberId'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const yearSelected = ref('')
        const memberMeetingHistory = ref(null)
        const meetingRef = ref('')
        const noPaymentNumber = ref('')
        const presenceNumber = ref('')
        const delayNumber = ref('')

        // counting the number of non payments
        const meetingList = ref(null)
        const meetingListRef = collection(projectFirestore, "associations", props.associationId, "meetings")
        onSnapshot(meetingListRef, (snapshot) => {
            let datas = []
            snapshot.docs.forEach((doc) => {
                datas.push({ ...doc.data(), id:doc.id })

                //get all the payments = false
                const NoPaymentsListRef = collection(
                    projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                )
                const NoPaymentsListQuery = query(NoPaymentsListRef, where("payment", "==", false))
                const NoPaymentsListQuery1 = query(NoPaymentsListQuery, where("memberId", "==", props.memberId))
                onSnapshot(NoPaymentsListQuery1, (snapshot) => {
                    let noPaymentDatas = []
                    let count = 0
                    snapshot.docs.forEach((noPaymentDoc) => {
                        noPaymentDatas.push({ ...noPaymentDoc.data(), id:noPaymentDoc.id })
                        count = count + 1
                    })
                    noPaymentNumber.value = count
                })

                //get all the presence = false
                const presenceListRef = collection(
                    projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                )
                const presencesListQuery = query(presenceListRef, where("presence", "==", false))
                const presencesListQuery1 = query(presencesListQuery, where("memberId", "==", props.memberId))
                onSnapshot(presencesListQuery1, (snapshot) => {
                    let presenceDatas = []
                    let count = 0
                    snapshot.docs.forEach((presenceDoc) => {
                        presenceDatas.push({ ...presenceDoc.data(), id:presenceDoc.id })
                        count = count + 1
                    })
                    presenceNumber.value = count
                })

                //get all the delay = true
                const delaysListRef = collection(
                    projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                )
                const delaysListQuery = query(delaysListRef, where("delay", "==", true))
                const delaysListQuery1 = query(delaysListQuery, where("memberId", "==", props.memberId))
                onSnapshot(delaysListQuery1, (snapshot) => {
                    let delayDatas = []
                    let count = 0
                    snapshot.docs.forEach((delayDoc) => {
                        delayDatas.push({ ...delayDoc.data(), id:delayDoc.id })
                        count = count + 1
                    })
                    delayNumber.value = count
                })
            })
        })

        // get meetings subcollection from the collection 'associations'
        const membersMeetingList = ref(null)
        const membersMeetingRef = collection(
            projectFirestore, "associations", props.associationId, "meetings"
        )
        const q = query(membersMeetingRef, orderBy("createdAt", "desc"))
        onSnapshot(q, (snapshot) => {
            let meetings = []
            snapshot.docs.forEach((doc) => {
                meetings.push({ ...doc.data(), id:doc.id })
            })
            membersMeetingList.value = meetings
        })

        // getting a member doc
        const member = ref(null)
        const memberRef = projectFirestore
            .collection('associations').doc(props.associationId).collection("members").doc(props.memberId)
            memberRef.onSnapshot(doc => {
            member.value = {...doc.data(), id: doc.id}
        })

        // show the history of payments, delays and abences
        const membermeetingHistory = ref(null)
        const membersMeetingsRef = collection(
            projectFirestore, "associations", props.associationId, "meetings"
        )

        const switchSelect = async (docId) => {
            const membersPaymentRef = collection(
                projectFirestore, "associations", props.associationId, "meetings", docId, "payments"
            )
            const q = query(membersPaymentRef, where("memberId", "==", props.memberId))
            onSnapshot(q, (snapshot) => {
                let datas = []
                snapshot.docs.forEach((doc) => {
                    datas.push({ ...doc.data(), id:doc.id })
                })
                memberMeetingHistory.value = datas
            })
            return { memberMeetingHistory }
        }

        return {
            member, yearSelected, membersMeetingList, switchSelect, memberMeetingHistory, meetingList, noPaymentNumber, presenceNumber,
            delayNumber
        }
    },
    methods: {
        
    },
}
</script>

<style scoped>
</style>