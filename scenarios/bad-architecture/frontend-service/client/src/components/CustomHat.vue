<template>
    <div class="file-cont">
        <h3><b>Want to preview the hat?</b></h3>
        <h4>Choose a model!</h4>
        <a class="v-btn v-btn--is-elevated theme--light" @click="customHat(1)"><img style="width: 50%; float:left" src="https://image.freepik.com/free-photo/close-up-shot-pretty-woman-with-perfect-teeth-dark-clean-skin-having-rest-indoors-smiling-happily-after-received-good-positive-news_273609-1248.jpg"></a>
        <a class="v-btn v-btn--is-elevated theme--light" @click="customHat(2)"><img style="width: 50%; float:right" src="https://media.istockphoto.com/photos/handsome-young-man-on-white-background-picture-id523478288?k=20&m=523478288&s=612x612&w=0&h=Fg8yDwFhbB4XljB1aCclYbjJpUlRwB-jcPPFfd1Iteg="></a>
        <br><br>
        <h4>Upload a picture!</h4>
        <input type="file" class="file-upload" @change="customHat(3)" />

        <br />
        <b-spinner
            variant="success"
            type="grow"
            class="hidden mt-4"
            id="spinner"
        ></b-spinner>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import axios from '@/plugins/axios';

export default {
    props: {
        products: {
            type: Array,
            required: false,
            defaultValue: () => []
        },
        pictures: {
            type: Array,
            required: false,
            defaultValue: () => []
        }
    },

    methods: {
        ...mapActions({
            custom: 'products/custom'
        }),
        async customHat(event, type) {
            document.getElementById('spinner').classList.remove('hidden');
            let temp_products = this.products;
            console.log('updating');
            var file;
            const models = ["https://image.freepik.com/free-photo/close-up-shot-pretty-woman-with-perfect-teeth-dark-clean-skin-having-rest-indoors-smiling-happily-after-received-good-positive-news_273609-1248.jpg", "https://media.istockphoto.com/photos/handsome-young-man-on-white-background-picture-id523478288?k=20&m=523478288&s=612x612&w=0&h=Fg8yDwFhbB4XljB1aCclYbjJpUlRwB-jcPPFfd1Iteg="]

            if (type == 1) {
                var url = models[0];
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream'
                })

                file = await response.data;
            } else if (type == 2) {
                var url = models[1];
                const response = await axios({
                    url,
                    method: 'GET',
                    responseType: 'stream'
                })

                file = await response.data;
            } else if (type == 3) {
                file = event.target.files[0];
            }

            for (let i = 0; i < this.products.length; i++) {
                let description = this.products[i].Description
                const formData = new FormData();
                formData.append('file', file);
                console.log(formData)

                var response;

                try {
                    response = await this.custom({ formData, description});
                } catch (error) {
                    console.error(error);
                }

                console.log(response)
                temp_products[i].Hat = response.data.result.preview;
            }
            document.getElementById('spinner').classList.add('hidden');
        },
    }
};
</script>
