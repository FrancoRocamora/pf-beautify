import axios from "axios";

const URL_BASE = "http://localhost:3001";

export const getProductByName = async (searched) => {
    try {
        return await axios.get(`${URL_BASE}/products?name=${searched}`)
    } catch (error) {
        console.log(error.message);
    }
}

export const getProducts = async () => {
    try {
        return await axios.get(`${URL_BASE}/products`)
    } catch (error) {
        console.log(error.message);
    }
}
    ;
export const createProduct = async (product) => {
    try {
        return await axios.post(`${URL_BASE}/products`, product)
    } catch (error) {
        console.log(error.message);
    }
};
