import axios from "axios";

// it will be come from process.env
const PRODUCT_SERVICE_URL = 
    "https://zl6q2g9sn5.execute-api.us-east-1.amazonaws.com/prod/products-queue";
    // "http://127.0.0.1:3000/products-queue";  

export const PullData = async(requestData: Record<string, unknown>) => {
    return axios.post(PRODUCT_SERVICE_URL, requestData);
};