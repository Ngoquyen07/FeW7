import axiosClient from "../auth/axios.ts";

const taskApi = {
    getAll(params: any) {
        return axiosClient.get("/api/tasks", { params }); // convert query  to string
    },

    getById(id: any) {
        return axiosClient.get(`/api/tasks/${id}`);
    },

    create(data: any) {
        return axiosClient.post("/api/tasks", data);
    },

    update(id: number, data: any) {
        return axiosClient.put(`/api/tasks/${id}`, data);
    },

    delete(id: number) {
        return axiosClient.delete(`/api/tasks/${id}`);
    }
};
export default taskApi;