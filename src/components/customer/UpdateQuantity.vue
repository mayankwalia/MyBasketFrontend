<template>
  <div>
    <span class="text-center">Add Item</span>
    <div class="d-flex justify-content-center bg-body-secondary">
      <button @click="decrementQuantity" type="button" class="btn btn-danger btn-decrement" :disabled="quantity <= 0"><i class="bi bi-dash-circle-fill"></i></button>
      <span class="quantity-display">{{ quantity }}</span>
      <button @click="incrementQuantity" type="button" class="btn btn-success btn-increment" :disabled="quantity >= stock"><i class="bi bi-plus-circle-fill"></i></button>
    </div>
  </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        localQuantity: this.quantity,
      };
    },
    props: {
      stock: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productId: {
        type: Number,
        required: true,
      },
    },
    methods: {
      decrementQuantity() {
        if (this.localQuantity > 0) {
          this.localQuantity--;
          this.updateQuantity()
        }
      },
      incrementQuantity() {
        if (this.localQuantity < this.stock) {
          this.localQuantity++;
          this.updateQuantity()
        }
      },
      updateQuantity(){
        this.$emit('update:quantity', this.localQuantity, this.productId)
      }
    },
  };
  </script>
  
  <style scoped>
  
  .btn {
    padding: 10px;
    font-size: 10px;
  }
  .quantity-display {
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
  }
  </style>
  