<template>
    <div class="search-container">
        <FloatLabel variant="on" style="flex-grow: 1;">
            <IconField>
                <InputIcon v-if="!isSearching" class="pi pi-search" />
                <InputIcon class="pi pi-spin pi-spinner" v-else />
                <InputText id="event-code" v-model="eventCode" autocomplete="on" class="search-input-field"/>
            </IconField>
            <label for="event-code"> Tìm kiếm theo mã sự kiện </label>
        </FloatLabel>
        <Button type="button" label="Tìm kiếm" icon="pi pi-search" :loading="isSearching" @click="handleSearchEvent" class="btn"/>
        <Button type="button" label="Reset" icon="pi pi-refresh" @click="resetValue" class="btn"/>
    </div>
    <div v-if="isExistEventCode" class="add-event-panel">
        <FloatLabel variant="on">
            <DatePicker v-model="startRegisterDate" id="startRegisterDate" dateFormat="dd/mm/yy" class="input-date" showButtonBar/>
            <label for="startRegisterDate" class="mb-2"> Ngày bắt đầu đăng kí </label> 
        </FloatLabel>
        <FloatLabel variant="on">
            <DatePicker v-model="endRegisterDate" id="endRegisterDate" dateFormat="dd/mm/yy" class="input-date" showButtonBar/>
            <label for="endRegisterDate" class="mb-2"> Ngày kết thúc đăng kí </label>
        </FloatLabel>
        <FloatLabel variant="on">
            <DatePicker v-model="startAwardDate" id="startAwardDate" dateFormat="dd/mm/yy" class="input-date" showButtonBar/>
            <label for="startAwardDate" class="mb-2"> Ngày bắt đầu trao giải </label> 
        </FloatLabel>
        <FloatLabel variant="on">
            <DatePicker v-model="endAwardDate" id="endAwardDate" dateFormat="dd/mm/yy" class="input-date" showButtonBar/>
            <label for="endAwardDate" class="mb-2"> Ngày kết thúc trao giải </label>
        </FloatLabel>
        <OverlayBadge :value="convertWeekEventToList().length" style="width: max-content; margin: 10px 0;">
            <Button class="btn" label="Các sự kiện tuần đã thêm" icon="pi pi-external-link" @click="dialogVisible = true" />
        </OverlayBadge>
        <Button class="btn" label="ActionConfigs" icon="pi pi-external-link" @click="dialogActionConfig = true" />
        <Dialog v-model:visible="dialogVisible" header="Sự kiện tuần" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
            <DataTable :value="convertWeekEventToList()" dataKey="id" size="small" stripedRows scrollable scrollHeight="300px">
                <Column field="title" header="Tiêu đề"></Column>
                <Column field="rules" header="Rule">
                    <template #body="{ data }">
                        {{ data.rules ? data.rules.length + ' rule đã thêm' : 'Chưa có rule'  }}
                    </template>
                </Column>
                <Column field="startDate" header="Ngày bắt đầu">
                    <template #body="{ data }">
                        {{ formatDate(data.startDate).result }}
                    </template>
                </Column>
                <Column field="endDate" header="Ngày kết thúc">
                    <template #body="{ data }">
                        {{ formatDate(data.endDate).result }}
                    </template>
                </Column>
                <Column :exportable="false" style="width: 12rem;">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" size="small" @click="handleShowFormEditWeekEvent(data)" style="margin-right: 10px;"/>
                        <Button icon="pi pi-trash" outlined rounded severity="danger" size="small" @click="handleDeleteWeekEvent(data)" />
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button class="btn" label="Thêm sự kiện tuần" icon="pi pi-plus" @click="handleShowFormAddWeekEvent" />
                <Button class="btn" label="Hoàn tất" icon="pi pi-check" @click="dialogVisible = false" />
            </template>
        </Dialog>
        <Dialog v-model:visible="dialogActionConfig" header="ActionConfig" :style="{ width: '75vw' }" maximizable modal :contentStyle="{ height: '300px' }">
            <DataTable :value="convertActionConfigToList()" dataKey="id" size="small" stripedRows scrollable scrollHeight="300px">
                <Column field="action" header="Action"></Column>
                <Column field="endDate" header="EndDate">
                    <template #body="{ data }">
                        {{ formatDate(data.endDate).result }}
                    </template>
                </Column>
                <Column :exportable="false" style="width: 12rem;">
                    <template #body="{ data }">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" size="small" @click="handleShowFormEditActionConfig(data)" style="margin-right: 10px;"/>
                        <Button icon="pi pi-trash" outlined rounded severity="danger" size="small" @click="handleDeleteActionConfig(data)" />
                    </template>
                </Column>
            </DataTable>
            <template #footer>
                <Button class="btn" label="Thêm mới actionconfig" icon="pi pi-plus" @click="handleShowFormAddActionConfig" />
            </template>
        </Dialog>
        <Teleport to="body">
            <AddWeekEventForm v-if="isShowAddWeekEventForm" @closeAddWeekEventForm="isShowAddWeekEventForm = false" @updateWeekEvent="handleUpdateWeekEvent" @addWeekEvent="handleAddWeekEvent" :formMode="formMode" :data="data"/>
            <AddActionConfigForm v-if="isShowAddActionConfigForm" @closeAddWeekEventForm="isShowAddActionConfigForm  = false" @addConfig="handleAddConfig" @updateConfig="handleUpdateConfig" :formMode="formMode" :data="data"/>
        </Teleport>
        <Button label="Lưu" @click="saveEventConfig" class="btn"/>
    </div>
</template>

<script setup>
import AddWeekEventForm from './AddWeekEventForm.vue';
import EventService from '@/service/service.js';
import AddActionConfigForm from './AddActionConfigForm.vue';
import { useToast } from "primevue/usetoast";
import { ref } from 'vue';
import { Guid } from 'js-guid';

const eventCode = ref('');
const startRegisterDate = ref(null);
const endRegisterDate = ref(null);
const startAwardDate = ref(null);
const endAwardDate = ref(null);
const objectWeekEvent = ref({});
const dialogVisible = ref(false);
const dialogActionConfig = ref(false);
const isShowAddWeekEventForm = ref(false);
const isShowAddActionConfigForm = ref(false);
const formMode = ref(0);
const data = ref(null);
const initData = ref(null);
const objectActionConfigs = ref({});

const isExistEventCode = ref(false);
const isSearching = ref(false);
const toast = useToast();

const convertObjectWeekEvent = (weekEvents) => {
    let newObjectWeekEvent = {};
    weekEvents.forEach(weekEvent => {
        var id = Guid.newGuid();
        newObjectWeekEvent[id] = {...weekEvent, id: id };
    });
    return newObjectWeekEvent;
}

const convertObjectActionConfig = (actionConfig) => {
    let newObjectActionConfig = {};
    actionConfig.forEach(config => {
        var id = Guid.newGuid();
        newObjectActionConfig[id] = {...config, id: id };
    });
    return newObjectActionConfig;
}

const handleSearchEvent = async () => {
    try {
        isSearching.value = true;
        const data = await EventService.findEventByCode(eventCode.value.trim());
        if (data.result) {
            initData.value = { ...data.result };
            var event = data.result.eventContent;
            startRegisterDate.value = event.registerStartDate ? new Date(event.registerStartDate) : new Date();
            endRegisterDate.value = event.registerEndDate ? new Date(event.registerEndDate) : new Date();
            startAwardDate.value = event.awardStartDate ? new Date(event.awardStartDate) : new Date();
            endAwardDate.value = event.awardEndDate ? new Date(event.awardEndDate) : new Date();
            objectWeekEvent.value = convertObjectWeekEvent(event.weekEvents);
            objectActionConfigs.value = convertObjectActionConfig(event.actionConfigs);
            isExistEventCode.value = true;
        }else {
            toast.add({ severity: 'error', summary: 'Hehe', detail: 'Không tìm thấy sự kiện', life: 3000 });
        }
    } catch (error) {
        console.log(error);
        toast.add({ severity: 'error', summary: 'Hehe', detail: 'Không biết lỗi gì', life: 3000 });
    } finally {
        isSearching.value = false;
    }
}

const convertWeekEventToList = () => {
    let newListWeekEvent = [...Object.values(objectWeekEvent.value)];
    return newListWeekEvent;
}

const convertActionConfigToList = () => {
    let newListWeekEvent = [...Object.values(objectActionConfigs.value)];
    return newListWeekEvent;
}

function formatDate(date) {
        if (!date) {
            return { result: "", resultForForm: null };
        }
        let newDate = new Date(date);
        let day = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        if (day < 10) {
            day = `0${day}`;
        }
        if (month < 10) {
            month = `0${month}`;
        }
        let result = `${day}/${month}/${year}`;
        let resultForForm = `${year}-${month}-${day}`;
        return { result, resultForForm };
};

const handleShowFormAddWeekEvent = () => {
    formMode.value = 0;
    isShowAddWeekEventForm.value = true;
    data.value = null;
}

const handleShowFormAddActionConfig = () => {
    formMode.value = 0;
    isShowAddActionConfigForm.value = true;
    data.value = null;
}

const handleShowFormEditWeekEvent = (dataWeekEvent) => {
    formMode.value = 1;
    isShowAddWeekEventForm.value = true;
    data.value = { ...dataWeekEvent };
}

const handleShowFormEditActionConfig = (dataActionConfig) => {
    formMode.value = 1;
    isShowAddActionConfigForm.value = true;
    data.value = { ...dataActionConfig };
}

const handleDeleteWeekEvent = (data) => {
    delete objectWeekEvent.value[data.id];
};

const handleDeleteActionConfig = (data) => {
    delete objectActionConfigs.value[data.id];
};

function handleUpdateWeekEvent(weekEvent) {
    var id = weekEvent.id;
    objectWeekEvent.value[id] = weekEvent;
    isShowAddWeekEventForm.value = false;
}

function handleUpdateConfig(actionConfig) {
    var id = actionConfig.id;
    objectActionConfigs.value[id] = actionConfig;
    isShowAddActionConfigForm.value = false;
}

function handleAddWeekEvent(weekEvent) {
    var id = Guid.newGuid();
    weekEvent.id = id;
    objectWeekEvent.value[id] = weekEvent;
    isShowAddWeekEventForm.value = false;
}

function handleAddConfig(actionConfig) {
    var id = Guid.newGuid();
    actionConfig.id = id;
    objectActionConfigs.value[id] = actionConfig;
    isShowAddActionConfigForm.value = false;
}

const resetValue = () => {
    eventCode.value = '';
    startRegisterDate.value = null;
    endRegisterDate.value = null;
    startAwardDate.value = null;
    endAwardDate.value = null;
    objectWeekEvent.value = {};
    objectActionConfigs.value = {};
    dialogVisible.value = false;
    dialogActionConfig.value = false;
    isShowAddWeekEventForm.value = false;
    isShowAddActionConfigForm.value = false;
    formMode.value = 0;
    data.value = null;
    initData.value = null;
    isExistEventCode.value = false;
}

async function saveEventConfig() {
    var eventContent = {
        ...initData.value.eventContent, 
        registerStartDate: startRegisterDate.value ?? new Date(),
        registerEndDate: endRegisterDate.value ?? new Date(),
        awardStartDate: startAwardDate.value ?? new Date(),
        awardEndDate: endAwardDate.value ?? new Date(),
        weekEvents: convertWeekEventToList(),
        actionConfigs: convertActionConfigToList()
    };
    var result = { 
        ...initData.value, 
        eventCode: eventCode.value,
        eventContent
    }
    try {
        await EventService.updateEvent(result);
        toast.add({ severity: 'success', summary: 'Hehe', detail: 'Đã xong :))', life: 3000 });
        resetValue();
    } catch (error) {
        console.log(error);
    }
}
</script>

<style>
.search-container {
    display: flex;
    gap: 10px;
    width: 60%;
}

.search-input-field {
    width: 100% !important;
}
</style>