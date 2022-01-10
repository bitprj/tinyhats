<template>
    <div class="file-cont">
        <h3><b>Want to preview the hat?</b></h3>
        <h4>Choose a model!</h4>
        <a class="v-btn v-btn--is-elevated theme--light" @click="chooseOne"><img style="width: 50%; float:left" src="https://image.freepik.com/free-photo/close-up-shot-pretty-woman-with-perfect-teeth-dark-clean-skin-having-rest-indoors-smiling-happily-after-received-good-positive-news_273609-1248.jpg"></a>
        <a class="v-btn v-btn--is-elevated theme--light" @click="chooseTwo"><img style="width: 50%; float:right" src="https://media.istockphoto.com/photos/handsome-young-man-on-white-background-picture-id523478288?k=20&m=523478288&s=612x612&w=0&h=Fg8yDwFhbB4XljB1aCclYbjJpUlRwB-jcPPFfd1Iteg="></a>
        <br><br>
        <h4>Upload a picture!</h4>
        <input type="file" class="file-upload" @change="customHat" />

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
        async customHat(event) {
            document.getElementById('spinner').classList.remove('hidden');
            let temp_products = this.products;
            console.log('updating');
            const file = event.target.files[0];
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
                // const response = await fetch(
                //     `http://localhost:3000/api/products/custom?name=${this.products[i].Description}`,
                //     {
                //         method: 'POST',
                //         body: formData
                //     }
                // );

                console.log(response)
                temp_products[i].Hat = response.data.result.preview;
            }
            document.getElementById('spinner').classList.add('hidden');
        },
        async chooseOne() {
            let temp_products = this.products;
            for (let i = 0; i < this.products.length; i++) {
                temp_products[i].Hat = temp_products[i].Preview1;
            }
        },

        async chooseTwo() {
            let temp_products = this.products;
            for (let i = 0; i < this.products.length; i++) {
                temp_products[i].Hat = temp_products[i].Preview2;
            }
        },
    }
};
</script>
