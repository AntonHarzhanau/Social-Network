import { useQuery } from "@tanstack/react-query"
import { fetchUserProfile } from "../api/userApi"
import type { UserProfile } from "./types"

export const USER_PROFILE_QUERY_KEY = "userProfile"

export const useUserProfile = (userId: string | undefined) => {
    const {data, isError, error, isLoading} = useQuery<UserProfile>({
        queryKey: [USER_PROFILE_QUERY_KEY, userId],
        queryFn: () => fetchUserProfile(userId!),
        enabled: !!userId,
        placeholderData: (prev) => prev,
    })
    return {data, isError, error, isLoading}
}
