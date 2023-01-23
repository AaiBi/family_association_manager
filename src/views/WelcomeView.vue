<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-10">
                <div class="card">
                    <div class="card-header text-center">
                        <h2 class="card-title">
                            Bienvenue sur l'application de gestion des différentes Associations de Pellel Malal
                        </h2>
                    </div>
                    <div class="card-body">

                        <button class="btn btn-secondary" v-if="!showForm" @click="showForm=true">
                            Ajouter une nouvelle Association
                        </button><br>
                        
                        <form class="row" @submit.prevent="handleSubmit" v-if="showForm">
                            <div class="col-sm-6">
                                <div class="mb-3">
                                    <input 
                                        type="text" class="form-control" required placeholder="Nom de l'Association" 
                                        v-model="associationName">
                                </div>
                                <div class="mb-3">
                                    <select class="form-control" v-model="associationCountry">
                                        <option disabled value="">Sélectionner le pays de base de l'association</option>
                                        <option value="Afghanistan">Afghanistan</option>
                                        <option value="Åland Islands">Åland Islands</option>
                                        <option value="Albania">Albania</option>
                                        <option value="Algeria">Algeria</option>
                                        <option value="American Samoa">American Samoa</option>
                                        <option value="Andorra">Andorra</option>
                                        <option value="Angola">Angola</option>
                                        <option value="Anguilla">Anguilla</option>
                                        <option value="Antarctica">Antarctica</option>
                                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                        <option value="Argentina">Argentina</option>
                                        <option value="Armenia">Armenia</option>
                                        <option value="Aruba">Aruba</option>
                                        <option value="Australia">Australia</option>
                                        <option value="Austria">Austria</option>
                                        <option value="Azerbaijan">Azerbaijan</option>
                                        <option value="Bahamas">Bahamas</option>
                                        <option value="Bahrain">Bahrain</option>
                                        <option value="Bangladesh">Bangladesh</option>
                                        <option value="Barbados">Barbados</option>
                                        <option value="Belarus">Belarus</option>
                                        <option value="Belgium">Belgium</option>
                                        <option value="Belize">Belize</option>
                                        <option value="Benin">Benin</option>
                                        <option value="Bermuda">Bermuda</option>
                                        <option value="Bhutan">Bhutan</option>
                                        <option value="Bolivia">Bolivia</option>
                                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                        <option value="Botswana">Botswana</option>
                                        <option value="Bouvet Island">Bouvet Island</option>
                                        <option value="Brazil">Brazil</option>
                                        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                        <option value="Brunei Darussalam">Brunei Darussalam</option>
                                        <option value="Bulgaria">Bulgaria</option>
                                        <option value="Burkina Faso">Burkina Faso</option>
                                        <option value="Burundi">Burundi</option>
                                        <option value="Cambodia">Cambodia</option>
                                        <option value="Cameroon">Cameroon</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Cape Verde">Cape Verde</option>
                                        <option value="Cayman Islands">Cayman Islands</option>
                                        <option value="Central African Republic">Central African Republic</option>
                                        <option value="Chad">Chad</option>
                                        <option value="Chile">Chile</option>
                                        <option value="China">China</option>
                                        <option value="Christmas Island">Christmas Island</option>
                                        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                        <option value="Colombia">Colombia</option>
                                        <option value="Comoros">Comoros</option>
                                        <option value="Congo">Congo</option>
                                        <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                        <option value="Cook Islands">Cook Islands</option>
                                        <option value="Costa Rica">Costa Rica</option>
                                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                                        <option value="Croatia">Croatia</option>
                                        <option value="Cuba">Cuba</option>
                                        <option value="Cyprus">Cyprus</option>
                                        <option value="Czech Republic">Czech Republic</option>
                                        <option value="Denmark">Denmark</option>
                                        <option value="Djibouti">Djibouti</option>
                                        <option value="Dominica">Dominica</option>
                                        <option value="Dominican Republic">Dominican Republic</option>
                                        <option value="Ecuador">Ecuador</option>
                                        <option value="Egypt">Egypt</option>
                                        <option value="El Salvador">El Salvador</option>
                                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                                        <option value="Eritrea">Eritrea</option>
                                        <option value="Estonia">Estonia</option>
                                        <option value="Ethiopia">Ethiopia</option>
                                        <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                        <option value="Faroe Islands">Faroe Islands</option>
                                        <option value="Fiji">Fiji</option>
                                        <option value="Finland">Finland</option>
                                        <option value="France">France</option>
                                        <option value="French Guiana">French Guiana</option>
                                        <option value="French Polynesia">French Polynesia</option>
                                        <option value="French Southern Territories">French Southern Territories</option>
                                        <option value="Gabon">Gabon</option>
                                        <option value="Gambia">Gambia</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Ghana">Ghana</option>
                                        <option value="Gibraltar">Gibraltar</option>
                                        <option value="Greece">Greece</option>
                                        <option value="Greenland">Greenland</option>
                                        <option value="Grenada">Grenada</option>
                                        <option value="Guadeloupe">Guadeloupe</option>
                                        <option value="Guam">Guam</option>
                                        <option value="Guatemala">Guatemala</option>
                                        <option value="Guernsey">Guernsey</option>
                                        <option value="Guinea">Guinea</option>
                                        <option value="Guinea-bissau">Guinea-bissau</option>
                                        <option value="Guyana">Guyana</option>
                                        <option value="Haiti">Haiti</option>
                                        <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                        <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                        <option value="Honduras">Honduras</option>
                                        <option value="Hong Kong">Hong Kong</option>
                                        <option value="Hungary">Hungary</option>
                                        <option value="Iceland">Iceland</option>
                                        <option value="India">India</option>
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                        <option value="Iraq">Iraq</option>
                                        <option value="Ireland">Ireland</option>
                                        <option value="Isle of Man">Isle of Man</option>
                                        <option value="Israel">Israel</option>
                                        <option value="Italy">Italy</option>
                                        <option value="Jamaica">Jamaica</option>
                                        <option value="Japan">Japan</option>
                                        <option value="Jersey">Jersey</option>
                                        <option value="Jordan">Jordan</option>
                                        <option value="Kazakhstan">Kazakhstan</option>
                                        <option value="Kenya">Kenya</option>
                                        <option value="Kiribati">Kiribati</option>
                                        <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                        <option value="Korea, Republic of">Korea, Republic of</option>
                                        <option value="Kuwait">Kuwait</option>
                                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                                        <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                        <option value="Latvia">Latvia</option>
                                        <option value="Lebanon">Lebanon</option>
                                        <option value="Lesotho">Lesotho</option>
                                        <option value="Liberia">Liberia</option>
                                        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                        <option value="Liechtenstein">Liechtenstein</option>
                                        <option value="Lithuania">Lithuania</option>
                                        <option value="Luxembourg">Luxembourg</option>
                                        <option value="Macao">Macao</option>
                                        <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                        <option value="Madagascar">Madagascar</option>
                                        <option value="Malawi">Malawi</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Maldives">Maldives</option>
                                        <option value="Mali">Mali</option>
                                        <option value="Malta">Malta</option>
                                        <option value="Marshall Islands">Marshall Islands</option>
                                        <option value="Martinique">Martinique</option>
                                        <option value="Mauritania">Mauritania</option>
                                        <option value="Mauritius">Mauritius</option>
                                        <option value="Mayotte">Mayotte</option>
                                        <option value="Mexico">Mexico</option>
                                        <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                        <option value="Moldova, Republic of">Moldova, Republic of</option>
                                        <option value="Monaco">Monaco</option>
                                        <option value="Mongolia">Mongolia</option>
                                        <option value="Montenegro">Montenegro</option>
                                        <option value="Montserrat">Montserrat</option>
                                        <option value="Morocco">Morocco</option>
                                        <option value="Mozambique">Mozambique</option>
                                        <option value="Myanmar">Myanmar</option>
                                        <option value="Namibia">Namibia</option>
                                        <option value="Nauru">Nauru</option>
                                        <option value="Nepal">Nepal</option>
                                        <option value="Netherlands">Netherlands</option>
                                        <option value="Netherlands Antilles">Netherlands Antilles</option>
                                        <option value="New Caledonia">New Caledonia</option>
                                        <option value="New Zealand">New Zealand</option>
                                        <option value="Nicaragua">Nicaragua</option>
                                        <option value="Niger">Niger</option>
                                        <option value="Nigeria">Nigeria</option>
                                        <option value="Niue">Niue</option>
                                        <option value="Norfolk Island">Norfolk Island</option>
                                        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                        <option value="Norway">Norway</option>
                                        <option value="Oman">Oman</option>
                                        <option value="Pakistan">Pakistan</option>
                                        <option value="Palau">Palau</option>
                                        <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                        <option value="Panama">Panama</option>
                                        <option value="Papua New Guinea">Papua New Guinea</option>
                                        <option value="Paraguay">Paraguay</option>
                                        <option value="Peru">Peru</option>
                                        <option value="Philippines">Philippines</option>
                                        <option value="Pitcairn">Pitcairn</option>
                                        <option value="Poland">Poland</option>
                                        <option value="Portugal">Portugal</option>
                                        <option value="Puerto Rico">Puerto Rico</option>
                                        <option value="Qatar">Qatar</option>
                                        <option value="Reunion">Reunion</option>
                                        <option value="Romania">Romania</option>
                                        <option value="Russian Federation">Russian Federation</option>
                                        <option value="Rwanda">Rwanda</option>
                                        <option value="Saint Helena">Saint Helena</option>
                                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                        <option value="Saint Lucia">Saint Lucia</option>
                                        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                        <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                        <option value="Samoa">Samoa</option>
                                        <option value="San Marino">San Marino</option>
                                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                        <option value="Senegal">Senegal</option>
                                        <option value="Serbia">Serbia</option>
                                        <option value="Seychelles">Seychelles</option>
                                        <option value="Sierra Leone">Sierra Leone</option>
                                        <option value="Singapore">Singapore</option>
                                        <option value="Slovakia">Slovakia</option>
                                        <option value="Slovenia">Slovenia</option>
                                        <option value="Solomon Islands">Solomon Islands</option>
                                        <option value="Somalia">Somalia</option>
                                        <option value="South Africa">South Africa</option>
                                        <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                        <option value="Spain">Spain</option>
                                        <option value="Sri Lanka">Sri Lanka</option>
                                        <option value="Sudan">Sudan</option>
                                        <option value="Suriname">Suriname</option>
                                        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                        <option value="Swaziland">Swaziland</option>
                                        <option value="Sweden">Sweden</option>
                                        <option value="Switzerland">Switzerland</option>
                                        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                        <option value="Taiwan">Taiwan</option>
                                        <option value="Tajikistan">Tajikistan</option>
                                        <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                        <option value="Thailand">Thailand</option>
                                        <option value="Timor-leste">Timor-leste</option>
                                        <option value="Togo">Togo</option>
                                        <option value="Tokelau">Tokelau</option>
                                        <option value="Tonga">Tonga</option>
                                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                        <option value="Tunisia">Tunisia</option>
                                        <option value="Turkey">Turkey</option>
                                        <option value="Turkmenistan">Turkmenistan</option>
                                        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                        <option value="Tuvalu">Tuvalu</option>
                                        <option value="Uganda">Uganda</option>
                                        <option value="Ukraine">Ukraine</option>
                                        <option value="United Arab Emirates">United Arab Emirates</option>
                                        <option value="United Kingdom">United Kingdom</option>
                                        <option value="United States">United States</option>
                                        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                        <option value="Uruguay">Uruguay</option>
                                        <option value="Uzbekistan">Uzbekistan</option>
                                        <option value="Vanuatu">Vanuatu</option>
                                        <option value="Venezuela">Venezuela</option>
                                        <option value="Viet Nam">Viet Nam</option>
                                        <option value="Virgin Islands, British">Virgin Islands, British</option>
                                        <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                        <option value="Wallis and Futuna">Wallis and Futuna</option>
                                        <option value="Western Sahara">Western Sahara</option>
                                        <option value="Yemen">Yemen</option>
                                        <option value="Zambia">Zambia</option>
                                        <option value="Zimbabwe">Zimbabwe</option>
                                    </select>
                                </div>
                            </div>    
                            <div class="col-sm-6">    
                                <div class="mb-3">
                                    <input 
                                        type="text" class="form-control" required placeholder="Addresse de réunion" 
                                        v-model="associationAddresse">
                                </div>
                                <div class="mb-3">
                                    <input 
                                        type="number" class="form-control" placeholder="Entrer le numéro correspondant à la date de réunion"
                                        v-model="associationMeetingDate" required>
                                </div>
                            </div>
                            <button class="btn btn-secondary">Ajouter</button>
                        </form>

                        <br>

                        <hr>
                        <div class="error" v-if="error">
                            <div class="alert alert-danger" role="alert">
                                {{ error }}
                            </div>
                        </div>
                        <div v-else>
                            <div v-if="success">
                                <div class="alert alert-success" role="alert">
                                    {{ success }}
                                </div>
                            </div>
                        </div>
                        
                        <div class="row" v-if="documents">
                            
                            <div v-for="doc in formattedDocuments" :key="doc.id" class="col-sm-4">
                                <!-- <router-link :to="{ name: 'Association', params: {id: doc.id} }" class="associations-infos"> -->
                                <div type="button" @click="showEntryAssociationModal=true; associationId=doc.id">
                                    <div class="card text-bg-secondary mb-3">
                                        <div class="card-header">{{ doc.associationCountry }}</div>
                                        <div class="card-body">
                                            <h5 class="card-title">{{ doc.associationName }}</h5>
                                            <p class="card-text">
                                                Lieu de réunion à {{ doc.associationAddresse[0].toUpperCase() + 
                                                doc.associationAddresse.slice(1) }}, le {{ doc.associationMeetingDate }} de 
                                                chaque mois.
                                            </p>
                                        </div>
                                    </div>
                                </div>    
                                <!-- </router-link>  -->
                            </div>    
                            
                        </div>

                    </div>
                </div>
            </div>
            <div class="col-sm-2">
                <div class="card">
                    <button class="link btn btn-outline-danger" @click="handleClick">Déconnexion</button>
                </div>
            </div>
        </div>    
    </div>
    
    <!-- Modal -->
    <div id="entryAssociationModal" v-if="showEntryAssociationModal">
        <div class="card mb-3">
            <div class="card-body">
                <h5 class="card-title text-center">Mot de passe d'accès requis</h5>
                <div class="card-text">
                    <form class="row" @submit.prevent="handleSubmitPassword">
                        <div class="mb-3">
                            <input type="password" class="form-control" required placeholder="Entrer le mot de passe d'accès" 
                                v-model="accessPassword">
                        </div>
                        <button class="btn btn-secondary">Entrer</button>
                    </form>
                </div>
            </div>
            <div class="footer">
                <button class="btn btn-danger" @click="showEntryAssociationModal=false">Fermer</button>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal">
        <SuccessModal></SuccessModal>    
    </div>
            
    <!-- The form -->
    <div v-if="showModal">
        <!-- Modal HTML -->
        <ErrorModal :errorMessage="message"></ErrorModal>
    </div>

</template>

<script>
import useLogout from '@/composables/auth/useLogout'
import { formatDistanceToNow } from 'date-fns'
import { computed, ref } from 'vue'
import SideBarMenu from '../components/menu/SideBarMenu.vue'
import SuccessModal from '@/components/modal/SuccessModal'
import ErrorModal from '@/components/modal/ErrorModal'
import useCollection from '@/composables/useCollection'
import { timestamp } from '@/firebase/config'
import getCollection from '@/composables/getCollection'
import { useRouter } from 'vue-router'

export default {
    components: {
        SideBarMenu, SuccessModal, ErrorModal
    },
    setup () {
        const showForm = ref(false)
        const associationName = ref('')
        const associationCountry = ref('')
        const associationAddresse = ref('')
        const associationMeetingDate = ref('')
        const accessPassword = ref('')
        const { addDoc, error } = useCollection('associations')
        const success = ref(null)
        const { documents } = getCollection('associations')
        const showModal = ref(false)
        const showEntryAssociationModal = ref(false)
        const router = useRouter()
        const associationId = ref('')
        const message = ref('')
        const { logout } = useLogout()
        const showSuccessModal = ref(false)

        const handleClick = async () => {
            await logout()
            if(!error.value) {
                console.log('user logged out')
                router.push({ name: 'home' })
            }
        }

        const handleSubmitPassword = async () => {
            if (accessPassword.value === "bien") {
                router.push({ name: 'Association', params: {associationId: associationId.value} })
            }else{
                showEntryAssociationModal.value = false
                message.value = "Accès refusé, mot de passe erroné !"
                showModal.value = true
            }
        }

        const handleSubmit = async () => {
            const newAssociation = {
                associationName: associationName.value,
                associationCountry: associationCountry.value,
                associationAddresse: associationAddresse.value,
                associationMeetingDate: associationMeetingDate.value,
                createdAt: timestamp()
            }

            await addDoc(newAssociation)
            if (!error.value) {
                error.value = ''
                success.value = "Nouvelle association créée avec succès !"
                showForm.value = false
            }else {
                success.value = ''
                showForm.value = false
            }

            associationName.value = ''
            associationCountry.value = ''
            associationAddresse.value = ''
            associationMeetingDate.value = ''

        }

        const formattedDocuments = computed(() => {
            if (documents.value) {
                return documents.value.map(doc => {
                    let time = formatDistanceToNow(doc.createdAt.toDate())
                    return { ...doc, createdAt: time }
                })
            }
        })

        return {
            showForm, associationName, associationCountry, associationAddresse, associationMeetingDate, handleSubmit, error, success,
            documents, formattedDocuments, showModal, showEntryAssociationModal, accessPassword, associationId, message,
            handleSubmitPassword, handleClick
        }
    }
}
</script>

<style scoped>
    .btn-secondary{
        float: right;
    }
    form{
        align-content: center;
        text-align: center;
    }
    .associations-infos {
        text-decoration: none;
    }

    #entryAssociationModal {
    z-index: 1; 
    position: fixed;
    overflow: auto;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%; 
    position: fixed;
    background-color: rgb(0,0,0); 
    background-color: rgba(0,0,0,0.4);
  }
  #entryAssociationModal .card{
    margin: 15% auto; 
    padding: 20px; 
    border: 1px solid #888;
    width: 40%;
    background-color:white;
  }
  #entryAssociationModal .footer{
    margin: auto;
  }
</style>