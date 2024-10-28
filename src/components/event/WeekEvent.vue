<template>
    <div class="container">
        <Tabs value="0" class="tab-event">
            <TabList>
                <Tab value="0">Thêm mới sự kiện</Tab>
                <Tab value="1">Sửa sự kiện</Tab>
            </TabList>
            <TabPanels>
                <TabPanel value="0" class="add-event-panel">
                    <Button type="button" label="Reset" icon="pi pi-refresh" @click="resetValue" class="btn" />
                    <FloatLabel variant="on">
                        <InputText id="event-code" v-model="eventCode" autocomplete="on"/>
                        <label for="event-code">Mã sự kiện *</label>
                    </FloatLabel>
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
                    <Teleport to="body">
                        <AddWeekEventForm v-if="isShowAddWeekEventForm" @closeAddWeekEventForm="isShowAddWeekEventForm = false" @updateWeekEvent="handleUpdateWeekEvent" @addWeekEvent="handleAddWeekEvent" :formMode="formMode" :data="data"/>
                    </Teleport>
                    <Button label="Lưu" @click="saveEventConfig" class="btn"/>
                </TabPanel>
                <TabPanel value="1" class="add-event-panel">
                    <EditEvent />
                </TabPanel>
            </TabPanels>
        </Tabs>
        <Toast />
    </div>
</template>

<script setup>
import EventService from '@/service/service.js';
import AddWeekEventForm from './AddWeekEventForm.vue';
import EditEvent from './EditEvent.vue';
import { useToast } from "primevue/usetoast";

import { Guid } from 'js-guid';
import { ref } from 'vue';
const toast = useToast();

const eventCode = ref('');
const startRegisterDate = ref();
const endRegisterDate = ref();
const startAwardDate = ref();
const endAwardDate = ref();
const objectWeekEvent = ref({});
const dialogVisible = ref(false);
const isShowAddWeekEventForm = ref(false);
const formMode = ref(0);
const data = ref(null);

const resetValue = () => {
    eventCode.value = '';
    startRegisterDate.value = null;
    endRegisterDate.value = null;
    startAwardDate.value = null;
    endAwardDate.value = null;
    objectWeekEvent.value = {};
    dialogVisible.value = false;
    isShowAddWeekEventForm.value = false;
    formMode.value = 0;
    data.value = null;
}

const convertWeekEventToList = () => {
    let newListWeekEvent = [...Object.values(objectWeekEvent.value)];
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

const handleShowFormEditWeekEvent = (dataWeekEvent) => {
    formMode.value = 1;
    isShowAddWeekEventForm.value = true;
    data.value = { ...dataWeekEvent };
}

const handleDeleteWeekEvent = (data) => {
    delete objectWeekEvent.value[data.id];
};

function handleUpdateWeekEvent(weekEvent) {
    var id = weekEvent.id;
    objectWeekEvent.value[id] = weekEvent;
    isShowAddWeekEventForm.value = false;
}

function handleAddWeekEvent(weekEvent) {
    var id = Guid.newGuid();
    weekEvent.id = id;
    objectWeekEvent.value[id] = weekEvent;
    isShowAddWeekEventForm.value = false;
}

async function saveEventConfig() {
    var result = {
        "eventCode": eventCode.value,
        "eventContent": {
            "luckySpin": true,
            "paymentMonth": 0,
            "paymentDate": new Date(),
            "actions": ["StopAtLevelSelection"],
            "actionConfigs": [
                {
                    "action": "StopAtLevelSelection",
                    "endDate": new Date(),
                    "stopAtLevelSelectionConfig": {
                        "image": "string",
                        "title": "string",
                        "content": ["string"],
                        "footer": ["string"]
                    }
                }
            ],
            "byPassPaymentType": "Month",
            "isByPassPayment": true,
            "registerStartDate": startRegisterDate.value ?? new Date(),
            "registerEndDate": endRegisterDate.value ?? new Date(),
            "awardStartDate": startAwardDate.value ?? new Date(),
            "awardEndDate": endAwardDate.value ?? new Date(),
            "linkLeaderBoard": "string",
            "linkLuckyStar": "string",
            "leaderBoardGiftImage": "string",
            "luckySpinGiftImage": "string",
            "weekEvents": convertWeekEventToList(),
            "luckyStarRules": [
            {
                "title": "string",
                "rules": [
                {
                    "prizeName": "string",
                    "prizeQuantity": "string",
                    "detail": "string",
                    "rewardImagine": "string",
                    "rank": 0
                }
                ],
                "childrenRules": [
                {
                    "prizeName": "string",
                    "prizeQuantity": "string",
                    "detail": "string",
                    "rewardImagine": "string",
                    "rank": 0
                }
                ],
                "prizeCount": 0,
                "startDate": new Date(),
                "endDate": new Date(),
                "weekNumber": 0,
                "rule": "string"
            }
            ],
            "locationId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        },
        "schoolIds": [
            "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        ]
    }
    try {
        await EventService.createNewEvent(result);
        // resetValue();
        toast.add({ severity: 'success', summary: 'Hehe', detail: 'Thành công rồi', life: 3000 });
    } catch (error) {
        if(error && error.status) {
            switch(error.status) {
                case 400:
                    toast.add({ severity: 'error', summary: 'Hehe', detail: 'Mã sự kiện trùng rồi', life: 3000 });
                    break;
                default:
                    toast.add({ severity: 'error', summary: 'Hehe', detail: 'Lỗi không biết', life: 3000 });
                    break;
            }
        }
    }
}
</script>

<style>
.container {
    padding: 20px;
}

input[type=text] {
    width: 40%;
}

.btn {
    min-width: 80px;
    max-width: max-content;
}

.input-date {
    width: 40% !important;
}

.add-event-panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tab-event {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>

