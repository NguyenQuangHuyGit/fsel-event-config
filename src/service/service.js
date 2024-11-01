import axios from "axios";

const EventService = {
    // host: 'https://fsel-gateway-testing-api.fsel.edu.vn/user-gateway/v1/event',
    host: 'https://fsel-gateway-beta-api.fsel.edu.vn/user-gateway/v1/event',

    async createNewEvent(data) {
        const response = await axios.post(`${this.host}`, data);
        return response.data;
    },

    async findEventByCode(code) {
        const response = await axios.get(`${this.host}/${code}`);
        return response.data;
    },

    async updateEvent(data) {
        const response = await axios.put(`${this.host}`, data);
        return response.data;
    },
}

export default EventService;