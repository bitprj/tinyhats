<template>
    <div class="file-cont">
        <h3>Want to try the hat on? Upload a picture!</h3>
        <input type="file" class="file-upload" @change="updatePictures" />

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
        async updatePictures(event) {
            document.getElementById('spinner').classList.remove('hidden');
            let temp_products = this.products;
            console.log('updating');
            const file = event.target.files[0];
            for (let i = 0; i < this.products.length; i++) {
                const formData = new FormData();
                formData.append('file', file);
                const response = await fetch(
                    `https://api.tinyhat.me/${this.products[i].description}`,
                    {
                        method: 'POST',
                        body: formData
                    }
                );
                const json = await response.json();
                console.log(json);
                temp_products[i].url = json.result.finalBaby;
            }
            document.getElementById('spinner').classList.add('hidden');
        }
    }
};
</script>
