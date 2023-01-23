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
                            Réunion du 
                        </h2>
                    </div>
                    <div class="card-body">

                        <div v-if="membersPaymentList">
                            <div class="card-header">
                                <h4>Cocher les présences et payements</h4>
                            </div>
                            <div class="card-block p-0">
                                <table class="table table-bordered">
                                    <thead class="">
                                        <tr align="center">
                                            <th scope="col">Nom</th>
                                            <th scope="col">Prénom</th>
                                            <th scope="col">Téléphone</th>
                                            <th scope="col">Présence</th>
                                            <th scope="col">Retard</th>
                                            <th scope="col">Payment</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="member in membersPaymentList" :key="member.id" align="center">

                                            <td>{{ member.memberFirstname }}</td>
                                            <td>{{ member.memberLastname }}</td>
                                            <td>{{ member.memberPhoneNumber }}</td>
                                            <td>
                                                <div v-if="member.absence==false">
                                                    <button 
                                                        class="btn btn-success" 
                                                        @click="updateAbsenceDocument(member.id, absenceValue=true)">
                                                        Présent
                                                    </button>
                                                </div>
                                                <div v-else>
                                                    <button 
                                                        class="btn btn-danger" 
                                                        @click="updateAbsenceDocument(member.id, absenceValue=false)">
                                                        Annuler
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div v-if="member.delay==false">
                                                    <button class="btn btn-success" @click="updateDelayDocument(member.id, delayValue=true)">
                                                        Oui
                                                    </button>
                                                </div>
                                                <div v-else>
                                                    <button class="btn btn-danger" @click="updateDelayDocument(member.id, delayValue=false)">
                                                        Annuler
                                                    </button>
                                                </div>
                                            </td>
                                            <td>
                                                <div v-if="member.payment==false">
                                                    <button class="btn btn-success" @click="updateDocument(member.id, paymentValue=true)">
                                                        Payer
                                                    </button>
                                                </div>
                                                <div v-else>
                                                    <button class="btn btn-danger" @click="updateDocument(member.id, paymentValue=false)">
                                                        Annuler
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
    props: ['associationId', 'meetingId'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const { document: meeting } = getDocument('meetings', props.meetingId)
        const { documents: members } = getCollection('members')
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const router = useRouter()

        const paymentRef = collection(projectFirestore, 'payments')

        // get members subcollection from the collection 'associations'
        const membersPaymentList = ref(null)
        const membersPaymentRef = collection(
            projectFirestore, "associations", props.associationId, "meetings", props.meetingId, "payments"
        )
        onSnapshot(membersPaymentRef, (snapshot) => {
            let members = []
            snapshot.docs.forEach((doc) => {
                members.push({ ...doc.data(), id:doc.id })
            })
            membersPaymentList.value = members
        })

        // update a doc from payments subcolletcion
        const updateDocument = async (docId, paymentValue) => {
            const docRef = doc(
                projectFirestore, "associations", props.associationId, "meetings", props.meetingId, "payments", docId
            )
            const data = {
                payment: paymentValue
            };

            updateDoc(docRef, data)
            .then(docRef => {
                console.log("Value of an Existing Document Field has been updated");
            })
            .catch(error => {
                console.log(error);
            })
        }

        // update a doc from payments subcolletcion
        const updateAbsenceDocument = async (docId, absenceValue) => {
            const docRef = doc(
                projectFirestore, "associations", props.associationId, "meetings", props.meetingId, "payments", docId
            )
            const data = {
                absence: absenceValue
            };

            updateDoc(docRef, data)
            .then(docRef => {
                console.log("Value of an Existing Document Field has been updated");
            })
            .catch(error => {
                console.log(error);
            })
        }

        // update a doc from payments subcolletcion
        const updateDelayDocument = async (docId, delayValue) => {
            const docRef = doc(
                projectFirestore, "associations", props.associationId, "meetings", props.meetingId, "payments", docId
            )
            const data = {
                delay: delayValue
            };

            updateDoc(docRef, data)
            .then(docRef => {
                console.log("Value of an Existing Document Field has been updated");
            })
            .catch(error => {
                console.log(error);
            })
        }

        return {
            showForm, showSuccessModal, meeting, members, membersPaymentList, meeting, updateDocument, updateAbsenceDocument,
            updateDelayDocument
        }
    }
}
</script>

<style scoped>
</style>