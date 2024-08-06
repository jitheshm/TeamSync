import axios from 'axios'
import { APIURL } from "./constants/constant"
import Cookies from 'js-cookie';
console.log("APIURL", APIURL);
const instance = axios.create({


    baseURL: String(`${APIURL}/api`),


});

instance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('team-sync-token');
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;