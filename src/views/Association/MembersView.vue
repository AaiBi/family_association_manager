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
                            {{ association.associationName }}
                        </h2>
                    </div>
                    <div class="card-body">

                        <div class="error" v-if="error">
                            <div class="alert alert-danger" role="alert">
                                {{ error }}
                            </div>
                        </div>

                        <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true">
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
                            <button class="btn btn-secondary">Ajouter</button>
                        </form>

                        <hr>

                        <div v-if="members && showTable">
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
                                    <tr v-for="member in formattedDocuments" :key="member.id" align="center">
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
                                    <form class="row" @submit.prevent="handleSubmit">
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
        <SuccessModal :successMessage="message"></SuccessModal>    
    </div>

</template>

<script>
import SideBarMenu from '@/components/menu/SideBarMenu.vue'
import SuccessModal from '@/components/modal/SuccessModal'
import getCollection from '@/composables/getCollection'
import { computed, ref } from 'vue'
import useCollection from '@/composables/useCollection'
import { timestamp } from '@/firebase/config'
import { formatDistanceToNow } from 'date-fns'
import getDocument from '@/composables/getDocument'
import { doc, deleteDoc, getFirestore, updateDoc } from "firebase/firestore"

export default {
    props: ['id'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const { documents: members } = getCollection('members', ['associationId', '==', props.id])
        const { document: association } = getDocument('associations', props.id)
        const memberId = ref('')
        const memberFirstname = ref('')
        const memberLastname = ref('')
        const memberPhoneNumber = ref('')
        const memberAddresse = ref('')
        const memberAmount = ref('')
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const { addDoc, error } = useCollection('members')
        const message = ref('')
        const db = getFirestore()
        const showTable = ref(true)
        const showEditMemberForm = ref(false)

        const formattedDocuments = computed(() => {
            if (members.value) {
                return members.value.map(doc => {
                    let time = formatDistanceToNow(doc.createdAt.toDate())
                    return { ...doc, createdAt: time }
                })
            }
        })

        const updateDocument = async (docId) => {
            const docRef = doc(db, "members", docId);
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
        }

        const deleteDocument = async (docId) => {
            if(confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')){
                await deleteDoc(doc(db, "members", docId));
                showSuccessModal.value = true;
                
            }
        }

        const handleSubmit = async () => {
            const newMember = {
                memberFirstname: memberFirstname.value,
                memberLastname: memberLastname.value,
                memberPhoneNumber: memberPhoneNumber.value,
                memberAddresse: memberAddresse.value,
                memberAmount: memberAmount.value,
                associationId: props.id,
                createdAt: timestamp()
            }

            await addDoc(newMember)

            if (!error.value) {
                error.value = ''
                message.value = "Nouveau membre ajouté avec succès !"
                showForm.value = false
                showSuccessModal.value = true
            }else {
                success.value = ''
                showForm = false
            }

            memberFirstname.value = ''; 
            memberLastname.value = ''; 
            memberPhoneNumber.value = ''; 
            memberAddresse.value = ''; 
            memberAmount.value = ''; 

        }

        return {
            error, memberFirstname, memberLastname, memberPhoneNumber, memberAddresse, memberAmount, showForm, association, 
            handleSubmit, showSuccessModal, message, members, formattedDocuments, memberId, deleteDocument, showTable,
            showEditMemberForm, updateDocument
        }
    }   
}
</script>

<style scoped>
    .btn-secondary{
        margin-right: 10px;
    }
</style>