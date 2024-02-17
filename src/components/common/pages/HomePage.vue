<template>
    <div class="container p-4 rounded-4 border-2 shadow"
        style="background-color: #F6FDC3;min-width: 200px;max-width: 1000px">
        <div class="text-center">
            <h1>Welcome to MyBasket App</h1>
            <p>Find all your grocery needs in one place!</p>
            <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
                        aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
                        aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
                        aria-label="Slide 3"></button>
                </div>
                <div class="carousel-inner">
                    <div class="carousel-item active" data-bs-interval="2000">
                        <img src="@/assets/images/slide1.jpeg" class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                        <img src="@/assets/images/slide2.jpeg" class="d-block w-100" alt="...">
                    </div>
                    <div class="carousel-item" data-bs-interval="2000">
                        <img src="@/assets/images/slide3.jpeg" class="d-block w-100" alt="...">
                    </div>
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
                    data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
        <h6 class="mt-5 primary8-bg p-2 rounded-4 m-2 text-center">At MyBasket, we're dedicated to making your grocery
            shopping experience easy, convenient, and
            enjoyable. Say
            goodbye to long lines and crowded aisles. Say hello to online grocery shopping done right.</h6>
        <h2 class="primary5-bg text-center p-2 rounded-4 mx-5 mt-2">Why Choose FreshCart?</h2>
        <ul>
            <li><span class="primary4 fw-bold">Wide Selection: </span>We offer a vast selection of fresh produce, pantry
                staples,
                dairy products, and more. Find
                everything you need in one place.</li>
            <li><span class="primary4 fw-bold">Quality Guaranteed: </span>We source our products from trusted suppliers to
                ensure
                the highest quality. Freshness
                is our promise.</li>
            <li><span class="primary4 fw-bold">Convenience:</span> Shop from the comfort of your home or on the go. Our
                user-friendly app lets you browse, order,
                and schedule deliveries with ease.</li>
            <li><span class="primary4 fw-bold">Customized Orders: </span>Tailor your grocery list to your needs. Add items
                to your
                cart and remove them as your
                preferences change.</li>
            <li><span class="primary4 fw-bold">Fast Delivery:</span>We'll deliver your groceries to your doorstep at a time
                that
                suits you. No more
                time-consuming trips to the store.</li>
            <li><span class="primary4 fw-bold">Savings: </span>Take advantage of our special offers, discounts, and loyalty
                rewards.
                Saving on groceries has never
                been this simple.</li>
        </ul>
        <div class="row m-2">
            <CardComponent v-for="item, index in items" :title="item.title" :body="item.body" :index="index"
                :color="item.backgroundColor" :image="item.image" :key="item"></CardComponent>
        </div>
    </div>
</template>

<script>
import CardComponent from "@/components/common/CardComponent.vue";
export default {
    name: 'HomePage',
    data() {
        return {
            items: [
                {
                    title: "Best Safety Standards",
                    body: "Everyday we check temperature of our staff before they start working.",
                    backgroundColor: "#F7A4A4",
                    image: "../../assets/hand-sanitizer.png"
                },
                {
                    title: "No Contact Delivery",
                    body: "Have your order delivered to your doorstep with no contact.",
                    backgroundColor: "#82CD47",
                    image: "../../assets/food-delivery-boy.svg"
                },
                {
                    title: "Regular Warehouse Sanitization",
                    body: "We keep our warehouse sanitized regularly to ensure safety of our staff and customers.",
                    backgroundColor: "#BC7AF9",
                    image: "../../assets/grocery.png"
                },
            ]
        }
    },
    components: {
        CardComponent
    }
}
</script>

<style></style>
