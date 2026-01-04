import { api } from "@/utils/api";

export const getUserFromToken = (token) =>{
     api.get('/profile/user')
        .then(res => {
            const userData = res.data.user;        
            console.log("User data: ", user)
            return userData
        })
        .catch(err => {
            console.error("Get user Error: ", err)
            return null
        });
};