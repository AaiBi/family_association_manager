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
                                        <div class="card-header"><h4>Membres</h4></div>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ association.associationName }} compte aujourd'hui {{ number }} 
                                                membres inscris.
                                            </h5>
                                            <p class="card-text"></p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-6">
                                    <div class="card text-dark bg-slight mb-3">
                                        <div class="card-header bg-secondary text-white" align="center"><h4>Ce mois</h4></div>
                                        <div class="card-body">
                                            <h5 class="card-title">Nombre d'absences : {{ totalPresenceThisMonth }}</h5>
                                            <h5 class="card-title">Nombre de retards : {{ totatDelayThisMonth }} </h5>
                                            <!-- <h5 class="card-title">
                                                Montant total récolté : {{ totalPaymentThisMonth }} {{ association.associationCurrency }}
                                            </h5> -->
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
        const totalPaymentThisMonth = ref('')
        const nowDate = new Date();
        const month = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"]
        const nowMonthName = month[nowDate.getMonth()]
        const totatDelayThisMonth = ref('')
        const totalPresenceThisMonth = ref('')
        const paymentsList = ref('')

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

        //
        const meetingListRef = collection(projectFirestore, "associations", props.associationId, "meetings")
        onSnapshot(meetingListRef, (snapshot) => {
            let datas = []
            snapshot.docs.forEach((doc) => {
                datas.push({ ...doc.data(), id:doc.id })

                //get all the total of payment of the actual month
                // const totalPaymentThisMonthRef = collection(
                //     projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                // )
                // const totalPaymentThisMonthQuery = query(totalPaymentThisMonthRef, where("createdMonth", "==", nowMonthName))
                // const totalPaymentThisMonthQuery1 = query(totalPaymentThisMonthQuery, where("payment", "==", true))
                // onSnapshot(totalPaymentThisMonthQuery1, (snapshot) => {
                //     let totalPaymentThisMonthDatas = []
                //     snapshot.docs.forEach((totalPaymentThisMonthDoc) => {
                //         totalPaymentThisMonthDatas.push({ ...totalPaymentThisMonthDoc.data(), id:totalPaymentThisMonthDoc.id })
                //         totalPaymentThisMonthDatas += totalPaymentThisMonthDoc.memberAmount
                //     })
                //     totalPaymentThisMonth.value = totalPaymentThisMonthDatas
                // })

                //get all the total of delays of the actual month
                const totalDelayThisMonthRef = collection(
                    projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                )
                const totalDelayThisMonthQuery = query(totalDelayThisMonthRef, where("createdMonth", "==", nowMonthName))
                const totalDelayThisMonthQuery1 = query(totalDelayThisMonthQuery, where("delay", "==", true))
                onSnapshot(totalDelayThisMonthQuery1, (snapshot) => {
                    let totalDelayThisMonthDatas = []
                    let count = 0
                    snapshot.docs.forEach((totalDelayThisMonthDoc) => {
                        totalDelayThisMonthDatas.push({ ...totalDelayThisMonthDoc.data(), id:totalDelayThisMonthDoc.id })
                        count += 1 
                    })
                    totatDelayThisMonth.value = count
                })

                //get all the total of absence of the actual month
                const totalAbsenceThisMonthRef = collection(
                    projectFirestore, "associations", props.associationId, "meetings", doc.id, "payments"
                )
                const totalAbsenceThisMonthQuery = query(totalAbsenceThisMonthRef, where("createdMonth", "==", nowMonthName))
                const totalAbsenceThisMonthQuery1 = query(totalAbsenceThisMonthQuery, where("presence", "==", false))
                onSnapshot(totalAbsenceThisMonthQuery1, (snapshot) => {
                    let totalAbsenceThisMonthDatas = []
                    let count = 0
                    snapshot.docs.forEach((totalAbsenceThisMonthDoc) => {
                        totalAbsenceThisMonthDatas.push({ ...totalAbsenceThisMonthDoc.data(), id:totalAbsenceThisMonthDoc.id })
                        count += 1 
                    })
                    totalPresenceThisMonth.value = count
                })

            })
        })

        return {
            association, error, number, totalPaymentThisMonth, totatDelayThisMonth, totalPresenceThisMonth, paymentsList
        }
    }
}
</script>

<style scoped>
    
</style>