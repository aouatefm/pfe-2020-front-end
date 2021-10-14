import axios from 'axios'
import {BASE_URL} from './config'
import {getTokenId} from "../firebase/auth";

export default {
    getProductList: async function () {
        try {
            const response = await axios.get(BASE_URL + '/products');
            return response.data;
        } catch (error) {
            return error
        }
    },
    getProductById: async function (id) {
        try {
            const response = await axios.get(BASE_URL + `/products/${id}`);
            return response.data;
        } catch (error) {
            return error
        }
    },
    getProductsByStore: async function (id) {
        try {
            //const response = await axios.get(BASE_URL + `/products/store/Cactus`);
             const response = await axios.get(BASE_URL + `/products/store/${id}`);
            return response.data;

        } catch (error) {
            return error
        }
    },

    addProduct: async function (name,price,shipping,category,stock,ptype,imageUrl,description) {
        try {
            const response = await axios.post(BASE_URL + `/products`,
                {name:name,price:price,images:imageUrl,description:description,shipping:shipping,category:category,stock:stock,ptype:ptype},
                {headers: {'Authorization': await getTokenId()}});
            return response.data;
        } catch (error) {
            return error
        }
    },



}