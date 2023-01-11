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

                        Lieu de réunion à {{ association.associationAddresse[0].toUpperCase() + 
                        association.associationAddresse.slice(1) }}, le {{ association.associationMeetingDate }} de chaque mois.

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

export default {
    props: ['id'],
    components: {
        SideBarMenu, SuccessModal, ErrorModal
    },
    setup (props) {
        const { error, document: association } = getDocument('associations', props.id)

        return {
            association, error
        }
    }
}
</script>

<style scoped>
    
</style>