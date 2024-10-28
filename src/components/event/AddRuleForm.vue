<template>
    <div class="overlay">
        <div class="add-rule-form">
            <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" class="close-button" @click="closeOverlay"/>
            <h2 v-if="!props.formMode">Thêm mới rule</h2>
            <h2 v-else>Sửa rule</h2>
            <FloatLabel variant="on">
                <InputText class="name-prize" v-model="name" autocomplete="off" />
                <label for="name-prize">Tên giải thưởng</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText class="quantity-prize" v-model="quantity" autocomplete="off" />
                <label for="quantity-prize">Số lượng giải thưởng</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Textarea class="detail-prize" v-model="detail" rows="5" cols="30" style="resize: none" />
                <label for="detail-prize">Chi tiết giải thưởng</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <InputText class="rank-prize" v-model="rank" v-keyfilter.int/>
                <label for="rank-prize">Rank giải thưởng</label>
            </FloatLabel>
            <div class="form-action">
                <Button v-if="props.formMode"label="Cập nhật" @click="editRule" class="btn"/>
                <Button v-else class="btn submit-btn" label="Thêm" @click="addRule" />
                <Button class="btn cancel-btn" label="Hủy" @click="closeOverlay" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue'

const emit = defineEmits(['closeAddRuleForm', 'addRule', 'editRuleForm'])
const props = defineProps(['formMode', 'data'])

const id = ref(null);
const name = ref('');
const quantity = ref('');
const detail = ref('');
const rank = ref(null);
 
onBeforeMount(() => {
    if(props.data) {
        id.value = props.data.id;
        name.value = props.data.prizeName;
        quantity.value = props.data.prizeQuantity;
        detail.value = props.data.detail;
        rank.value = props.data.rank;
    }
});

function editRule() {
    emit('editRuleForm', {
        id: id.value,
        prizeName: name.value,
        prizeQuantity: quantity.value,
        detail: detail.value,
        rewardImagine: "string",
        rank: rank.value,
    });
}

function addRule() {
    emit('addRule', {
        prizeName: name.value,
        prizeQuantity: quantity.value,
        detail: detail.value,
        rewardImagine: "string",
        rank: rank.value,
    });
}

function closeOverlay() {
    emit('closeAddRuleForm');
}

</script>

<style>

.close-button {
    position: absolute !important; 
    top: 20px;
    right: 20px;
    width: 24px;
    height: 24px;
}

.form-action {
    display: flex;
    flex-direction: row-reverse;
    gap: 10px;
}

h2 {
    color: black;
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

.overlay {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1103;
    background-color: rgba(0, 0, 0, 0.7);
}

.add-rule-form {
    position: relative;
    padding: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    width: calc(100% - 400px);
    height: max-content;
    display: flex;
    flex-direction: column;
    gap: 20px;
    z-index: 1103;
    animation: appear 0.3s ease-out;
}

.add-rule-form .p-inputtext,
.add-rule-form .p-textarea {
    width: 100% !important;
}


</style>