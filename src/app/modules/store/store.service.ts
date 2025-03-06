import bcrypt from "bcryptjs";
import config from "../../config";
const signup = async (payload: any) => {
    const {store_name, password, ...userData } = payload;
    const salt = bcrypt.genSaltSync(Number(config.password_salt_round as string));
    const hash = bcrypt.hashSync(password, salt);
    console.log(hash);
    console.log(userData);
    const signupData = {
        ...userData,
        password: hash
    }
    console.log(signupData);
// const password = 

    }
    
    export const AuthServices = {
        signup,
    }