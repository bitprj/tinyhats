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
    },

    setCustom: (state, custom) => {
        state.custom = custom;
    }
};

const actions = {
    async fetch({ commit }) {
        const { data } = await axios.get('/api/products');

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
    },

    async custom({ commit }, {formData, description}) {
        console.log("making custom post request")
        console.log(formData)
        console.log(description)
        const response = await axios({
            method: 'post',
            url: `/api/products/custom?name=${description}`,
            data: formData,
            headers: {
                'Content-Type': `multipart/form-data`,
            },
        });

        let data = await response
        commit('setCustom', data);
        return data
    }
};

export default {
    state,
    getters,
    mutations,
    actions,
    namespaced: true,
};
