<template>
    <div class="week-event-overlay">
        <div class="week-event-container">
            <h2 v-if="!props.formMode">Thêm Action Config</h2>
            <h2 v-if="props.formMode">Sửa Action Config</h2>
            <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" class="close-button" @click="closeOverlay"/>
            <FloatLabel variant="on">
                <InputText id="title" v-model="action" autocomplete="off" disabled/>
                <label for="title">Action</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="endDate" id="endDate" dateFormat="dd/mm/yy" class="input-date"/>
                <label for="endDate" class="mb-2"> Ngày kết thúc </label>
            </FloatLabel>
            <Fieldset legend="StopAtLevelSelectionConfig">
                <p class="m-0" v-for="key in config">
                    {{ key }}
                </p>
            </Fieldset>
            <div class="form-action">
                <Button v-if="props.formMode"label="Cập nhật" @click="editConfig" class="btn add-event-btn"/>
                <Button v-else label="Thêm" @click="addConfig" class="btn add-event-btn"/>
                <Button class="btn cancel-btn" label="Hủy" @click="closeOverlay" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Guid } from 'js-guid';

onMounted(() => {
    if(props.data) {
        id.value = props.data.id;
        action.value = props.data.action;
        endDate.value = props.data.endDate != null ? new Date(props.data.endDate) : null;
        config.value = {...props.data.stopAtLevelSelectionConfig}
    }
});

const emit = defineEmits(['closeAddWeekEventForm', 'addConfig', 'updateConfig']);
const props = defineProps(['formMode', 'data'])

const id = ref(null);
const action = ref('');
const endDate = ref(null);
const config = ref({
    image: "",
    title: "",
    content: [],
    footer: []
});

function editConfig() {
    emit('updateConfig', {
        id: id.value,
        action: action.value,
        endDate: endDate.value,
        stopAtLevelSelectionConfig: config.value
    });
}

function addConfig() {
    emit('addConfig', {
        action: action.value,
        endDate: endDate.value,
        stopAtLevelSelectionConfig: config.value
    });
}

function closeOverlay() {
    emit('closeAddWeekEventForm');
}

</script>

<style scoped>
.form-action {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
}

.btn-show-rule {
    position: absolute;
    bottom: 20px;
    left: 20px;
}

.close-button {
    position: absolute !important; 
    top: 20px;
    right: 20px;
}

.week-event-container {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: 80%;
    height: 90vh;
    z-index: 1102;
    animation: appear 0.3s ease-out;
}

@keyframes appear {
    from {
        opacity: 0;
        scale: 0.4 0.4;
    }
    to {
        opacity: 1;
        scale: 1 1;
    }
}

.week-event-overlay {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1102;
    background-color: rgba(0, 0, 0, 0.7);
}

input[type=text] {
    width: 100%;
}

.btn {
    min-width: 80px;
    max-width: max-content;
}

.input-date {
    width: 100% !important;
}

textarea {
    width: 100%;
    height: 200px;
}

</style>