<template>
    <div class="week-event-overlay">
        <div class="week-event-container">
            <h2 v-if="!props.formMode">Thêm sự kiện tuần</h2>
            <h2 v-if="props.formMode">Sửa sự kiện tuần</h2>
            <Button icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" class="close-button" @click="closeOverlay"/>
            <FloatLabel variant="on">
                <InputText id="title" v-model="title" autocomplete="off" />
                <label for="title">Tiêu đề</label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="startDate" id="startDate" dateFormat="dd/mm/yy" class="input-date"/>
                <label for="startDate" class="mb-2"> Ngày bắt đầu </label>
            </FloatLabel>
            <FloatLabel variant="on">
                <DatePicker v-model="endDate" id="endDate" dateFormat="dd/mm/yy" class="input-date"/>
                <label for="endDate" class="mb-2"> Ngày kết thúc </label>
            </FloatLabel>
            <FloatLabel variant="on">
                <Textarea id="rule" v-model="rule" rows="5" cols="30" style="resize: none" />
                <label for="rule">Luật lệ</label>
            </FloatLabel>
            <OverlayBadge :value="convertListRule().length" class="btn-show-rule">
                <Button label="Các rule đã thêm" icon="pi pi-external-link" @click="dialogVisible = true" />
            </OverlayBadge>
            <Dialog v-model:visible="dialogVisible" header="Các rule hiện có" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
                <DataTable :value="convertListRule()" size="small" stripedRows scrollable scrollHeight="300px" dataKey="id">
                    <Column field="prizeName" header="Tên giải thưởng"></Column>
                    <Column field="prizeQuantity" header="Số lượng giải thưởng"></Column>
                    <Column field="detail" header="Chi tiết"></Column>
                    <Column field="rank" header="Hạng"></Column>
                    <Column :exportable="false" style="width: 12rem;">
                        <template #body="{ data }">
                            <Button icon="pi pi-pencil" outlined rounded class="mr-2" size="small" @click="showEditRuleForm(data)" style="margin-right: 10px;"/>
                            <Button icon="pi pi-trash" outlined rounded severity="danger" size="small" @click="handleDeleteRule(data)" />
                        </template>
                    </Column>
                </DataTable>
                <template #footer>
                    <Button label="Thêm rule" icon="pi pi-plus" @click="showAddRuleForm" />
                    <Button label="Hoàn tất" icon="pi pi-check" @click="dialogVisible = false" />
                </template>
            </Dialog>
            <div class="form-action">
                <Button v-if="props.formMode"label="Cập nhật" @click="editWeekEvent" class="btn add-event-btn"/>
                <Button v-else label="Thêm" @click="addWeekEvent" class="btn add-event-btn"/>
                <Button class="btn cancel-btn" label="Hủy" @click="closeOverlay" />
            </div>
        </div>
    </div>
    <Teleport to="body">
        <AddRuleForm v-if="isShowAddRuleForm" @closeAddRuleForm="closeAddRuleForm" @addRule="handleAddRule" @editRuleForm="handleEditRule" :formMode="formRuleMode" :data="dataRule"/>
    </Teleport>
</template>

<script setup>
import AddRuleForm from './AddRuleForm.vue';
import { ref, onMounted } from 'vue';
import { Guid } from 'js-guid';

onMounted(() => {
    if(props.data) {
        id.value = props.data.id;
        title.value = props.data.title;
        startDate.value = props.data.startDate ? new Date(props.data.startDate) : null;
        endDate.value = props.data.endDate ? new Date(props.data.endDate) : null;
        objectRule.value = convertObjectRule(props.data.rules);
        rule.value = props.data.rule;
    }
});

const emit = defineEmits(['closeAddWeekEventForm', 'addWeekEvent', 'updateWeekEvent']);
const props = defineProps(['formMode', 'data'])

const id = ref(null);
const title = ref('');
const dialogVisible = ref(false);
const isShowAddRuleForm = ref(false);
const startDate = ref(null);
const endDate = ref(null);
const rule = ref('');
const objectRule = ref({});
const formRuleMode = ref(0);
const dataRule = ref(null);

const convertListRule = () => {
    var listRule = [...Object.values(objectRule.value)];
    return listRule;
};

const convertObjectRule = (data) => {
    const result = {};
    data.forEach(item => {
        if(Object.hasOwnProperty(item, "id")) {
            result[item.id] = { ...item };
        } else {
            var id = Guid.newGuid();
            result[id] = {...item, id };
        }
    });
    return result;
}

function editWeekEvent() {
    emit('updateWeekEvent', {
        id: id.value,
        title: title.value,
        rules: convertListRule(),
        childrenRules: convertListRule(),
        prizeCount: 0,
        startDate: startDate.value ?? new Date(),
        endDate: endDate.value ?? new Date(),
        weekNumber: 0,
        rule: rule.value
    });
}

function addWeekEvent() {
    emit('addWeekEvent', {
        title: title.value,
        rules: convertListRule(),
        childrenRules: convertListRule(),
        prizeCount: 0,
        startDate: startDate.value ?? new Date(),
        endDate: endDate.value ?? new Date(),
        weekNumber: 0,
        rule: rule.value
    });
}

function closeOverlay() {
    emit('closeAddWeekEventForm');
}

const showAddRuleForm = () => {
    formRuleMode.value = 0;
    isShowAddRuleForm.value = true;
    dataRule.value = null;
}

const showEditRuleForm = (data) => {
    formRuleMode.value = 1;
    isShowAddRuleForm.value = true;
    dataRule.value = { ...data };
}

function handleAddRule(rule) {
    var id = Guid.newGuid();
    rule.id = id;
    objectRule.value[id] = rule;
    isShowAddRuleForm.value = false;
}

function handleEditRule(rule) {
    var id = rule.id;
    objectRule.value[id] = rule;
    isShowAddRuleForm.value = false;
}

function handleDeleteRule(rule) {
    delete objectRule.value[rule.id];
}

function closeAddRuleForm() {
    isShowAddRuleForm.value = false;
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