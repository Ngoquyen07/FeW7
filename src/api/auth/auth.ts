import axiosClient from "./axios";
const auth = {
    async getCSRFToken(){
        try{
            return await axiosClient.get("/sanctum/csrf-cookie");
        }
        catch(error){
            console.log(error);
        }
    },
    async register(data : any) {
        await auth.getCSRFToken();
        return await axiosClient.post("/register", data);
    },
    async login(data : any) {
        await auth.getCSRFToken();
        return await axiosClient.post("/login", data);
    },
    async logout() {
        await auth.getCSRFToken();
        return await axiosClient.post("/logout");
    },
    async getUser(){
        await auth.getCSRFToken();
        return await axiosClient.get("/api/user");
    }

}
export default auth;