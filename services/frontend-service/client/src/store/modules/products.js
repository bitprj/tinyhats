const fetch = require('node-fetch')
import axios from '@/plugins/axios';

const initialState = {
    products: []
};

const state = () => initialState;

const getters = {
    getProducts: state => state.products
};

const mutations = {
    setProducts: (state, products) => {
        state.products = products;
    }
};

const actions = {
    async fetch({ commit }) {
        let result = await fetch('http://aecd4af3f5b31453e901f0e4fd885a63-1647978061.us-west-2.elb.amazonaws.com/catalog');
        let data = await result.json()
        data = data.result
        console.log(data)

        const sorted = data.sort((a, b) => {
            if (a.Description.localeCompare(b.Description) > 0) {
                return 1;
            }

            if (a.Description.localeCompare(b.Description) < 0) {
                return -1;
            }

            return 0;
        });

        commit('setProducts', sorted);
        console.log(sorted)

        return sorted;
    },

    async reset({ dispatch }) {
        await axios.post('/api/products/reset');

        await dispatch('fetch');
        await dispatch('cart/fetch', null, { root: true });
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true
};
