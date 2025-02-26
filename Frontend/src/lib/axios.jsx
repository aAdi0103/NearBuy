import axios from 'axios'

export const axiosInstance = axios.create({
	baseURL:"http://localhost:3000/api/v1",
    withCredentials: true, // to include cookies in the request
})