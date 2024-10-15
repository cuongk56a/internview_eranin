import { getRedisAsync, setRedisAsync, clearRedisAsync } from "./index";

export const setRefresh = async(refresh: string, userId: string) => {
    await setRedisAsync(refresh, userId)
    await clearRedisAsync(refresh, 3600)
}

export const getRefresh = async(refresh: string) => {
    let data:any = await getRedisAsync(refresh)
    return data
}