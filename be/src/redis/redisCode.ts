import crypto from 'crypto';
import { appConfigs } from "../config/config";
import { userService } from "../modules/user/user.service";
import { getRedisAsync, setRedisAsync, clearRedisAsync } from "./index";

export const genCode = function (amount: number) {
return crypto.randomBytes(amount).toString('hex').toUpperCase();
};

export const setRedisCode  = async(email: string) => {
    const code = genCode(2)
    await setRedisAsync(email, code)
    await clearRedisAsync(email, 60)
    return code
}

export const getRedisCode = async(email: string) => {
    let data:any = await getRedisAsync(email)
    if(!data){
       data = setRedisCode(email)
    }
    return data
}