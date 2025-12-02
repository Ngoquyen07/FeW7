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
    },
    async forgotPassword(email: string) {
        try {
            await this.getCSRFToken();
            return await axiosClient.post("/forgot-password", {
                email: email
            });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    async resetPassword(data : any){
        await auth.getCSRFToken();
        return  await axiosClient.post("/reset-password" , data);

    }
}
export default auth;