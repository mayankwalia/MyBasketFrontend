<template>
  <div class="mt-5">
      <footer class="footer">
		<div class="container row">
			<div class="footer-col">
				<h4>company</h4>
				<ul>
					<li><a href="#">about us</a></li>
					<li><a href="#">our services</a></li>
					<li><a href="#">privacy policy</a></li>
					<li><a href="#">visit website</a></li>
				</ul>
			</div>
			<div class="footer-col">
				<h4>get help</h4>
				<ul>
					<li><a href="#">FAQ</a></li>
					<li><a href="#">shipping</a></li>
					<li><a href="#">returns</a></li>
					<li><a href="#">order status</a></li>
					<li><a href="#">payment options</a></li>
				</ul>
			</div>
			<div class="footer-col">
				<h4>online shop</h4>
				<ul>
					<li><a href="#">download</a></li>
					<li><a href="#">changelog</a></li>
					<li><a href="#">github</a></li>
					<li><a href="#">all version</a></li>
				</ul>
			</div>
			<div class="footer-col">
				<h4>follow us</h4>
				<div class="social-links">
					<a href="#"><i class="bi bi-facebook"></i></a>
					<a href="#"><i class="bi bi-twitter-x"></i></a>
					<a href="#"><i class="bi bi-instagram"></i></a>
					<a href="#"><i class="bi bi-linkedin"></i></a>
				</div>
			</div>
		</div>
    <p class="mt-3 primary2 text-center">Created By <span class="primary5">Mayank Walia</span> as part of Mordern
      Application Development 2 Project, IIT Madras | <span class="primary5">Roll no: 21f1004343</span></p>
	</footer>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

*,
*::before,
*::after {
	box-sizing: border-box;
}

* {
	margin: 0;
	padding: 0;
}

body {
	line-height: 1.5;
	font-family: 'Poppins', sans-serif;
}

.footer {
	background-color: #1A5D1A;
	padding: 80px 0;
}

.container {
	max-width: 1170px;
	margin: auto;
}

.row {
	display: flex;
	flex-wrap: wrap;
}

ul {
	list-style: none;
}

.footer-col {
	width: 25%;
	padding: 0 15px;
}

.footer-col h4 {
	font-size: 18px;
	color: #FFF;
	text-transform: capitalize;
	margin-bottom: 35px;
	font-weight: 500;
	position: relative;
}

.footer-col h4::before {
	content: "";
	position: absolute;
	left: 0;
	bottom: -10px;
	background-color: #E91E63;
	width: 50px;
	height: 2px;
}

.footer-col ul li:not(:last-child) {
	margin-bottom: 10px;
}

.footer-col ul li a {
	color: #DDD;
	display: block;
	font-size: 1rem;
	font-weight: 300;
	text-transform: capitalize;
	text-decoration: none;
	transition: all 0.3s ease;
}

.footer-col ul li a:hover {
	color: #FFF;
	padding-left: 7px;
}

.footer-col .social-links a {
	color: #FFF;
	background-color: rgba(255, 255, 255, 0.2);
	display: inline-block;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	text-align: center;
	margin: 0 10px 10px 0;
	line-height: 40px;
	transition: all 0.5s ease;
}

.footer-col .social-links a:hover {
	color: #1A5D1A;
	background-color: #FFF;
}

@media(max-width: 767px) {
	.footer-col {
		width: 50%;
		margin-bottom: 30px;
	}
}

@media(max-width: 574px) {
	.footer-col {
		width: 100%;
	}
}
</style>