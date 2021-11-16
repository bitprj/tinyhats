<template>
    <v-col cols="6" sm="6" md="6" lg="4">
        <v-card class="h-full" :disabled="product.stock === 0">
            <div class="d-flex justify-center">
                <v-img
                        max-width="65%"
                        :src="product.url"
                />
            </div>

            <v-card-title class="pa-3 text-subtitle-1 text-xl-h6">
                {{ product.description }}
            </v-card-title>

            <v-card-subtitle class="pa-3 text-subtitle-1 text-xl-h6">
                ${{ 44 }}
            </v-card-subtitle>

            <v-card-text class="pa-3 text-left text caption"> </v-card-text>

            <v-divider />

            <v-card-actions class="pa-3 justify-space-between">
                <span>{{ 3 ? `3 in` : 'out of' }} stock</span>

                <v-btn
                    class="success"
                    :disabled="product.stock === 0"
                    @click="$emit('add', product.url)"
                >
                    <span class="d-xs-flex d-none d-xl-flex">Add to cart</span>
                    <v-icon right dark>mdi-cart-plus</v-icon>
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-col>
</template>

<script>
export default {
    name: 'Product',

    props: {
        product: {
            type: Object,
            required: true
        }
    }
};
</script>
