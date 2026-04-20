import { api } from "../../../../config/api";

export class UserData {
    constructor(email, first_name, last_name, role ){
        this.email = email;
        this.first_name = first_name;
        this.last_name = last_name;
        this.role = role;

    }
}

export const userRepository =  {
    async getUserData() {
        const userData = await api.auth.me();
        console.log("Data from API:", userData);
        return new UserData(userData.email, userData.first_name, userData.last_name, userData.role);
    }

}