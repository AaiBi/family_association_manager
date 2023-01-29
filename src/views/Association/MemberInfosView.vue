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
                            {{ member.memberFirstname }} {{ member.memberLastname }} - {{ member.memberPhoneNumber }} 
                            (Inscrit le {{ member.createdAt.toDate().toLocaleString("fr") }})
                        </h2>
                    </div>
                    <div class="card-body">

                        <div class="card">
                            <div class="card-header">
                                <select class="form-select bg-secondary text-white" v-model="yearSelected">
                                    <option disabled value="">Sélectionner une année</option>
                                    <option>2023</option>
                                    <option>2024</option>
                                    <option>2025</option>
                                    <option>2026</option>
                                    <option>2027</option>
                                    <option>2028</option>
                                    <option>2029</option>
                                    <option>2030</option>
                                </select>
                            </div>
                            <div class="card-body">
                                {{ yearSelected }}
                                <div class="row">
                                    <div class="col-sm-4">
                                        <div class="card bg-secondary text-white">
                                            <div class="card-header">
                                                Janvier
                                            </div>
                                            <div class="card-body">
                                                <ul class="list-group">
                                                    <li 
                                                        class="list-group-item d-flex justify-content-between align-items-center 
                                                        list-group-item-secondary">
                                                        <b>Payement</b>
                                                        <span class="badge badge-pill text-dark">Oui</span>
                                                    </li>
                                                    <li 
                                                        class="list-group-item d-flex justify-content-between align-items-center 
                                                        list-group-item-secondary">
                                                        <b>Absence</b>
                                                        <span class="badge badge-pill text-dark">Oui</span>
                                                    </li>
                                                    <li 
                                                        class="list-group-item d-flex justify-content-between align-items-center 
                                                        list-group-item-secondary">
                                                        <b>Retard</b>
                                                        <span class="badge badge-pill text-dark">Oui</span>
                                                    </li>
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
    doc, collection, query, onSnapshot , where
} from "firebase/firestore"
import { projectFirestore } from "@/firebase/config";

export default {
    props: ['associationId', 'memberId'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const yearSelected = ref('')

        // getting a meeting doc
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
        // if (yearSelected > 0){
        //     const resultQuery = query(membersMeetingsRef, where("createdYear", "==", yearSelected))
        //     resultQuery = resultQuery.where("memberPhoneNumber", "==", member.memberPhoneNumber)
        //     onSnapshot(resultQuery, (snapshot) => {
        //         let members = []
        //         snapshot.docs.forEach((doc) => {
        //             members.push({ ...doc.data(), id:doc.id })
        //         })
        //         membermeetingHistory.value = members
        //     })
        // }

        return {
            member, yearSelected
        }
    }   
}
</script>

<style scoped>
</style>