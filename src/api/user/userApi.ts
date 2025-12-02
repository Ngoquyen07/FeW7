import axiosClient from "../auth/axios.ts";
const userApi = {
    update(data : FormData){
        return axiosClient.post("/api/user", data);
    }
}
export default userApi;