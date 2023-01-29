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

                        <div class="error" v-if="errorUseCollection || errorGetDocument || errorGetCollection">
                            <div class="alert alert-danger" role="alert">
                                {{ errorUseCollection || errorGetDocument || errorGetCollection }}
                            </div>
                        </div>

                        <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true; showTable=false;">
                            Ajouter un nouveau membre
                        </button><br><br>
                        
                        <form class="row" @submit.prevent="handleSubmit" v-if="showForm">
                            <div class="col-sm-6">
                                <div class="mb-3">
                                    <input type="text" class="form-control" required placeholder="Nom" v-model="memberFirstname">
                                </div>
                                <div class="mb-3">
                                    <input type="text" class="form-control" required placeholder="Prénom" v-model="memberLastname">
                                </div>
                            </div>    
                            <div class="col-sm-6">   
                                <div class="mb-3">
                                    <input 
                                        type="text" class="form-control" required placeholder="Téléphone" v-model="memberPhoneNumber"
                                        onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
                                    <div v-if="(memberPhoneNumber.length>0)" class="text-warning">
                                        Ne pas renseigner l'indicatif.  
                                    </div>
                                </div> 
                                <div class="mb-3">
                                    <input type="text" class="form-control" required placeholder="Addresse" v-model="memberAddresse">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="mb-3">
                                    <input type="number" class="form-control" placeholder="Montant payement mensuel"
                                        v-model="memberAmount" required>
                                </div>
                            </div>
                            <div class="col-sm-6" align="center">
                                <button class="btn btn-danger" @click="showForm=false; showTable=true;">Annuler</button>
                            </div>
                            <div class="col-sm-6" align="center">
                                <button class="btn btn-secondary">Ajouter</button>
                            </div>
                        </form>

                        <hr>

                        <div v-if="membersList && showTable">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr align="center">
                                        <th scope="col">Nom</th>
                                        <th scope="col">Prénom</th>
                                        <th scope="col">Téléphone</th>
                                        <th scope="col">Adresse</th>
                                        <th scope="col">Montant</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr 
                                        v-for="member in membersList" :key="member.id" align="center" type="button" 
                                        @click="openMemberDetails(member.id)">
                                        <td>{{ member.memberFirstname }}</td>
                                        <td>{{ member.memberLastname }}</td>
                                        <td>{{ member.memberPhoneNumber }}</td>
                                        <td>{{ member.memberAddresse }}</td>
                                        <td>{{ member.memberAmount }}</td>
                                        <td>
                                            <button 
                                                class="btn btn-secondary text-white" 
                                                @click="showEditMemberForm=true; showTable=false; showForm=false; memberId=member.id;
                                                memberFirstname=member.memberFirstname; memberLastname=member.memberLastname;
                                                memberPhoneNumber=member.memberPhoneNumber; memberAddresse=member.memberAddresse;
                                                memberAmount=member.memberAmount;">
                                                Modifier
                                            </button>
                                            <button class="btn btn-danger" @click="deleteDocument(member.id)">Supprimer</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        
                        <div v-if="showEditMemberForm">
                            <div class="card">
                                <div class="card-body">
                                    <div class="card-title"></div>
                                    <form class="row">
                                        <div class="col-sm-6">
                                            <div class="mb-3">
                                                <input type="text" class="form-control" required placeholder="Nom" v-model="memberFirstname">
                                            </div>
                                            <div class="mb-3">
                                                <input type="text" class="form-control" required placeholder="Prénom" v-model="memberLastname">
                                            </div>
                                        </div>    
                                        <div class="col-sm-6">   
                                            <div class="mb-3">
                                                <input 
                                                    type="text" class="form-control" required placeholder="Téléphone" v-model="memberPhoneNumber"
                                                    onkeypress='return event.charCode >= 48 && event.charCode <= 57'>
                                                <div v-if="(memberPhoneNumber.length>0)" class="text-warning">
                                                    Ne pas renseigner l'indicatif.  
                                                </div>
                                            </div> 
                                            <div class="mb-3">
                                                <input type="text" class="form-control" required placeholder="Addresse" v-model="memberAddresse">
                                            </div>
                                        </div>
                                        <div class="col-sm-12">
                                            <div class="mb-3">
                                                <input type="number" class="form-control" placeholder="Montant payement mensuel"
                                                    v-model="memberAmount" required>
                                            </div>
                                        </div>
                                        <button class="btn btn-secondary" @click="updateDocument(memberId)">Modifier</button>
                                    </form>
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
import getDocument from '@/composables/getDocument'
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
        const { document: association, error: errorGetDocument } = getDocument('associations', props.associationId)
        const memberFirstname = ref('')
        const memberLastname = ref('')
        const memberPhoneNumber = ref('')
        const memberAddresse = ref('')
        const memberAmount = ref('')
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const showTable = ref(true)
        const showEditMemberForm = ref(false)
        const router = useRouter()

        const openMemberDetails = async (memberId) => {
            router.push({ name: 'MemberInfos', params: {associationId: props.associationId, memberId: memberId} })
        }

        // get members subcollection from the collection 'associations'
        const membersList = ref(null)
        const messageRef = collection(projectFirestore, "associations", props.associationId,"members");
        onSnapshot(messageRef, (snapshot) => {
            let members = []
            snapshot.docs.forEach((doc) => {
                members.push({ ...doc.data(), id:doc.id })
            })
            membersList.value = members
        })

        // update a doc from members subcolletcion
        const updateDocument = async (docId) => {
            const docRef = doc(projectFirestore, "associations", props.associationId, "members", docId);
            const data = {
                memberFirstname: memberFirstname.value,
                memberLastname: memberLastname.value,
                memberPhoneNumber: memberPhoneNumber.value,
                memberAddresse: memberAddresse.value,
                memberAmount: memberAmount.value,
            };

            updateDoc(docRef, data)
            .then(docRef => {
                console.log("Value of an Existing Document Field has been updated");
            })
            .catch(error => {
                console.log(error);
            })
            showEditMemberForm.value = false
            showTable.value = true
            memberFirstname.value = ''; 
            memberLastname.value = ''; 
            memberPhoneNumber.value = ''; 
            memberAddresse.value = ''; 
            memberAmount.value = ''; 
        }

        // delete a doc from members subcolletcion
        const deleteDocument = async (docId) => {
            if(confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')){
                await deleteDoc(doc(projectFirestore, "associations", props.associationId, "members", docId));
                showSuccessModal.value = true;
            }
        }

        const handleSubmit = async () => {
            projectFirestore.collection('associations').doc(props.associationId).collection('members').add({
                memberFirstname: memberFirstname.value,
                memberLastname: memberLastname.value,
                memberPhoneNumber: memberPhoneNumber.value,
                memberAddresse: memberAddresse.value,
                memberAmount: memberAmount.value,
                createdAt: timestamp()
            })
            
            memberFirstname.value = ''; 
            memberLastname.value = ''; 
            memberPhoneNumber.value = ''; 
            memberAddresse.value = ''; 
            memberAmount.value = ''; 
            showForm.value = false
            showTable.value = true
        }

        return {
            memberFirstname, memberLastname, memberPhoneNumber, memberAddresse, memberAmount, showForm, showSuccessModal,
            updateDocument, showEditMemberForm, showTable, handleSubmit, deleteDocument, association, openMemberDetails,
            errorGetDocument, membersList
        }
    }   
}
</script>

<style scoped>
    .btn-secondary{
        margin-right: 10px;
    }
</style>