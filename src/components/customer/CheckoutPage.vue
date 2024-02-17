<template>
    <div class="checkout-page">
        <div class="container text-center">
            <div class="row">
                <h1>Checkout</h1>
            </div>
        </div>
        <div class="row g-5">
      <div class="col-md-5 col-lg-4 order-md-last">
        <h4 class="d-flex justify-content-between align-items-center mb-3">
          <span class="text-primary">Your cart</span>
          <span class="badge bg-primary rounded-pill">{{ this.$store.state.cartItems.length }}</span>
        </h4>
        <ul class="list-group mb-3">
          <li v-for="item in $store.state.cartItems" :key="item.id" class="list-group-item d-flex justify-content-between lh-sm">
            <div>
              <h6 class="my-0">{{item.product.title}}</h6>
              <small class="text-body-secondary">Quantity <span>{{item.quantity}}</span></small>
            </div>
            <span class="text-body-secondary"><i class="bi bi-currency-rupee"></i>{{(item.product.price*(1-item.product.discount/100)).toFixed(2)}}</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span>Total (INR)</span>
            <strong><i class="bi bi-currency-rupee"></i>{{cartTotal}}</strong>
          </li>
        </ul>
      </div>
      <div class="col-md-7 col-lg-8 primary7-bg rounded-2 p-4 shadow2">
        <h4 class="mb-3">Billing address</h4>
        <form class="needs-validation" @submit.prevent="placeOrder()">
          <div class="row g-3">
            <div class="col-sm-6">
              <label for="firstName" class="form-label">First name</label>
              <input type="text" class="form-control" id="firstName" placeholder=""  required="" v-model="firstname">
              <div class="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div class="col-sm-6">
              <label for="lastName" class="form-label">Last name</label>
              <input type="text" class="form-control" id="lastName" placeholder=""  required="" v-model="lastname">
              <div class="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div class="col-12">
              <label for="address" class="form-label">Address</label>
              <input type="text" class="form-control" id="address" placeholder="1234 Main St" required="" v-model="address">
              <div class="invalid-feedback">
                Please enter your shipping address.
              </div>
            </div>

            <div class="col-12">
              <label for="address2" class="form-label">Address 2 <span class="text-body-secondary">(Optional)</span></label>
              <input type="text" class="form-control" id="address2" placeholder="Apartment or suite" v-model="address2">
            </div>

            <div class="col-md-5">
              <label for="country" class="form-label">Country</label>
              <input type="text" class="form-control" id="address2" placeholder="Apartment or suite" v-model="country">
              <div class="invalid-feedback">
                Please select a valid country.
              </div>
            </div>

            <div class="col-md-4">
              <label for="state" class="form-label">State</label>
              <input type="text" class="form-control" id="address2" placeholder="Apartment or suite" v-model="state">
              <div class="invalid-feedback">
                Please provide a valid state.
              </div>
            </div>

            <div class="col-md-3">
              <label for="zip" class="form-label">Zip</label>
              <input type="text" class="form-control" id="zip" placeholder="" required="" v-model="zip">
              <div class="invalid-feedback">
                Zip code required.
              </div>
            </div>
          </div>

          <hr class="my-4">

          <h4 class="mb-3">Payment</h4>

          <div class="my-3">
            <div class="form-check">
              <input id="credit" name="paymentMethod" type="radio" class="form-check-input" checked="" required="">
              <label class="form-check-label" for="credit">Credit card</label>
            </div>
            <div class="form-check">
              <input id="debit" name="paymentMethod" type="radio" class="form-check-input" required="">
              <label class="form-check-label" for="debit">Debit card</label>
            </div>
            <div class="form-check">
              <input id="paypal" name="paymentMethod" type="radio" class="form-check-input" required="">
              <label class="form-check-label" for="paypal">PayPal</label>
            </div>
          </div>

          <div class="row gy-3">
            <div class="col-md-6">
              <label for="cc-name" class="form-label">Name on card</label>
              <input type="text" class="form-control" id="cc-name" placeholder="" required="">
              <small class="text-body-secondary">Full name as displayed on card</small>
              <div class="invalid-feedback">
                Name on card is required
              </div>
            </div>

            <div class="col-md-6">
              <label for="cc-number" class="form-label">Credit card number</label>
              <input type="text" class="form-control" id="cc-number" placeholder="" required="">
              <div class="invalid-feedback">
                Credit card number is required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-expiration" class="form-label">Expiration</label>
              <input type="text" class="form-control" id="cc-expiration" placeholder="" required="">
              <div class="invalid-feedback">
                Expiration date required
              </div>
            </div>

            <div class="col-md-3">
              <label for="cc-cvv" class="form-label">CVV</label>
              <input type="text" class="form-control" id="cc-cvv" placeholder="" required="">
              <div class="invalid-feedback">
                Security code required
              </div>
            </div>
          </div>

          <hr class="my-4">

          <button class="w-100 btn btn-primary btn-lg" type="submit">Place Order</button>
        </form>
      </div>
    </div>
        </div>
</template>

<script>
export default {
    data() {
        return {
            firstname: '',
            lastname: '',
            address: '',
            address2: '',
            city: '',
            state: '',
            country: '',
            zip: '',
            paymentOptions: ['Net Banking', 'UPI', 'Cash on Delivery']
        }
    },
    computed: {
        cartTotal() {
            return this.$store.state.cartItems.reduce((total, item) => {
                return total + (item.quantity * (item.product.price*(1-item.product.discount/100)))
            }, 0).toFixed(2);
        }
    },
    methods: {
        placeOrder() {
            // Send order details to server and redirect to confirmation page
            console.log('Placing order...')
            this.customerDetails = JSON.stringify({
                name: this.firstname + ' ' + this.lastname,
                address: this.address + ' ' + this.address2,
                city: this.city,
                state: this.state,
                country: this.country,
                zip: this.zip
            })
            this.$privateAxios.post('/place-order',{
                addressDetails: this.customerDetails,
            }).then((res)=>{
                console.log(res);
                this.$store.dispatch('showMessage', {message: 'Order placed successfully', status: 'success'})
                localStorage.removeItem('cartItems')
                this.$router.push({name: 'orders'})
            }).catch((err)=>{
                console.log(err);
                if (err.response && err.response.data && err.response.data.message) {           
                    this.$store.dispatch('showMessage', {message: err.response.data.message, status: 'danger'})
                }
                this.$router.push({name: 'customer-dashboard'})
            })
    }
}
}
</script>

<style>/* Add styles for checkout page here */</style>
