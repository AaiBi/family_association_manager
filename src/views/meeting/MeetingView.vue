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
                        
                        <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true" style="float:right; margin-bottom: 50px;">
                            Nouvelle réunion
                        </button>
                        
                        <div class="card form-card" v-if="showForm">
                            <form @submit.prevent="handleSubmitNewMeeting">
                                <!-- step one -->
                                <div class="card" v-if="showFormPart1">
                                    <div class="card-header">
                                        <h4>Entrer le sujet principal de la réunion</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group">
                                            <textarea class="form-control" v-model="subjects" required rows="3"></textarea>
                                        </div>

                                        <p></p>

                                        <div class="row">
                                            <div class="col-sm-6">
                                                <button @click="showForm=false" class="btn btn-danger" style="width: 100%">
                                                    Annuler
                                                </button>
                                            </div>
                                            <div class="col-sm-6">
                                                <button 
                                                    type="button" class="btn btn-outline-secondary" @click="showFormPart2=true; 
                                                    showFormPart1=false;">
                                                    Suivant
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <p></p>
                            
                                <!-- step two -->
                                <div class="card" v-if="showFormPart2">

                                    <div v-if="members">
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
                                                        <th scope="col">Payment</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr v-for="member in members" :key="member.id" align="center">
                                                        <td>{{ member.memberFirstname }}</td>
                                                        <td>{{ member.memberLastname }}</td>
                                                        <td>{{ member.memberPhoneNumber }}</td>
                                                        <td>
                                                            <label class="switch">
                                                                <input type="checkbox" class="default" v-model="present">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <label class="switch">
                                                                <input type="checkbox" class="default" v-model="payment">
                                                                <span class="slider round"></span>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <p></p>
                                            <div class="row">
                                                <div class="col-sm-6">
                                                    <button 
                                                        type="button" class="btn btn-outline-secondary" @click="showFormPart2=false; 
                                                        showFormPart1=true;">
                                                        Précédent
                                                    </button>
                                                </div>
                                                <div class="col-sm-6">
                                                    <button class="btn btn-secondary"> Valider </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <p></p>
                        
                            </form>
                        </div>
                        
                        <div class="row" v-if="meetings && !showForm" style="margin-top: 100px">

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

export default {
    props: ['id'],
    components: {
        SideBarMenu, SuccessModal
    },
    setup (props) {
        const { error: errorGetCollection, documents: meetings } = getCollection('meetings', ['associationId', '==', props.id])
        const { documents: members } = getCollection('members', ['associationId', '==', props.id])
        const { error: errorGetDocument, document: association } = getDocument('associations', props.id)
        const showForm = ref(false)
        const showSuccessModal = ref(false)
        const { addDoc, error: errorUseCollection } = useCollection('meetings')
        const subjects = ref('')
        const showFormPart1 = ref(true)
        const showFormPart2 = ref(false)
        const present = ref('')
        const payement = ref('')

        const handleSubmitNewMeeting = async () => {
            if(confirm("Êtes-vous sûr d'avoir bien marquer toutes les présences et payements ?")){
                const newMeeting = {
                    subjects: subjects.value,
                    associationId: props.id,
                    createdAt: timestamp()
                }

                await addDoc(newMeeting)

                if (!errorUseCollection.value) {
                    errorUseCollection.value = ''
                    showForm.value = false
                    showSuccessModal.value = true
                }else {
                    showForm = false
                }

                subjects.value = '';
            }
        }

        const formattedDocuments = computed(() => {
            if (meetings.value) {
                return meetings.value.map(doc => {
                    let time = formatDistanceToNow(doc.createdAt.toDate())
                    return { ...doc, createdAt: time }
                })
            }
        })

        return {
            association, errorGetCollection, meetings, errorGetDocument, showForm, subjects, errorUseCollection, 
            handleSubmitNewMeeting, showSuccessModal, formattedDocuments, members, showFormPart1, showFormPart2, payement, present
        }
    }
}
</script>

<style scoped>


/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 55px;
  height: 28px;
}

/* Hide default HTML checkbox */
.switch input {display:none;}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input.default:checked + .slider {
  background-color: #444;
}
input.primary:checked + .slider {
  background-color: #2196F3;
}
input.success:checked + .slider {
  background-color: #8bc34a;
}
input.info:checked + .slider {
  background-color: #3de0f5;
}
input.warning:checked + .slider {
  background-color: #FFC107;
}
input.danger:checked + .slider {
  background-color: #f44336;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

.form-card{
    box-shadow: 0px 10px 10px #c4d2e2;
    margin: auto;
}

form .btn-outline-secondary, form .btn-secondary{
    width: 100%;
}
</style>