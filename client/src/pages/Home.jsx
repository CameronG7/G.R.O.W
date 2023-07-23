import React from 'react';
import { Container, Col, Form, Button, Card, Row } from 'react-bootstrap';

import backgroundImage2 from '../assets/pexels-tom-swinnen-2249959.jpg';
import backgroundImage3 from '../assets/pexels-cottonbro-studio-5858235.jpg';
import backgroundImage4 from '../assets/pexels-teona-swift-6912806.jpg';
import carouselImage1 from '../assets/cactus.jpg';
import carouselImage2 from '../assets/variousPlants.jpg';
import carouselImage3 from '../assets/wallPlants.jpg';
import carouselImage4 from '../assets/plantCare.jpg';
import carouselImage5 from '../assets/floorPlants.jpg';

import { MDBCarousel, MDBCarouselItem } from 'mdb-react-ui-kit';

const Home = () => {
	return (
		<div>
			{/* New carousel with images */}
			<Container style={{ marginTop: '50px' }}>
				<MDBCarousel
					showIndicators
					showControls
					fade
				>
					<MDBCarouselItem
						className="w-100 d-block"
						itemId={1}
						src={carouselImage1}
						alt="Carousel 1"
					>
						{/* Add your content for the first carousel slide */}
					</MDBCarouselItem>
					<MDBCarouselItem
						className="w-100 d-block"
						itemId={2}
						src={carouselImage2}
						alt="Carousel 2"
					>
						{/* Add your content for the second carousel slide */}
					</MDBCarouselItem>
					<MDBCarouselItem
						className="w-100 d-block"
						itemId={3}
						src={carouselImage3}
						alt="Carousel 3"
					>
						{/* Add your content for the third carousel slide */}
					</MDBCarouselItem>
					<MDBCarouselItem
						className="w-100 d-block"
						itemId={3}
						src={carouselImage4}
						alt="Carousel 3"
					>
						{/* Add your content for the third carousel slide */}
					</MDBCarouselItem>
					<MDBCarouselItem
						className="w-100 d-block"
						itemId={3}
						src={carouselImage5}
						alt="Carousel 3"
					>
						{/* Add your content for the third carousel slide */}
					</MDBCarouselItem>
				</MDBCarousel>
			</Container>
			<Container
				className="main-content"
				style={{
					overflowY: 'auto',
					maxHeight: '150vh',
					marginTop: '100px',
				}}
			>
				<Row>
					<Col md={6}>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '100%',
							}}
						>
							<img
								src={backgroundImage2}
								alt="background"
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									padding: '20px',
									background: 'rgba(0, 0, 0, 0.6)',
									color: '#fff',
								}}
							>
								<h3>
									<li>Self Guide: Your Personal Indoor Plant Care Coach</li>
								</h3>
								<p>
									In this comprehensive section, we provide you with expert
									tips, tricks, and tutorials on how to care for your indoor
									plants like a pro. Whether you're a seasoned plant parent or
									just starting your green journey, our self-guided care
									resources will empower you to nurture your plants with
									confidence and joy. From watering schedules and lighting
									requirements to troubleshooting common issues, we've got you
									covered.
								</p>
							</div>
						</div>
					</Col>
					<Col md={6}>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '100%',
							}}
						>
							<img
								src={backgroundImage3}
								alt="background"
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									padding: '20px',
									background: 'rgba(0, 0, 0, 0.6)',
									color: '#fff',
								}}
							>
								<h3>
									<li>Plant Care: Get to Know Your Leafy Companions</li>
								</h3>
								<p>
									Welcome to the heart of our website, where we introduce you to
									a diverse array of indoor plants, each with its unique
									personality and care requirements. Our detailed plant care
									profiles act as your personalized plant encyclopedia, offering
									in-depth information on popular indoor plants. Discover which
									plants best suit your lifestyle, aesthetics, and space.
									Whether you're seeking air-purifying wonders, vibrant
									bloomers, or pet-friendly foliage, you'll find the perfect
									match here.
								</p>
							</div>
						</div>
					</Col>
				</Row>
				<Row>
					<Col
						md={12}
						className="text-center mt-3"
					>
						<div
							style={{
								position: 'relative',
								width: '100%',
								height: '50vh',
							}}
						>
							<img
								src={backgroundImage4}
								alt="Another background"
								style={{ width: '100%', height: '100%', objectFit: 'cover' }}
							/>
							<div
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									padding: '20px',
									background: 'rgba(0, 0, 0, 0.6)',
									color: '#fff',
								}}
							>
								<h3>
									<li>Plant Types: Explore the Green World of Possibilities</li>
								</h3>
								<p>
									Dive into the captivating world of indoor plants with our
									curated collection of plant types. Whether you're drawn to the
									low-maintenance allure of succulents and cacti or aspire to
									cultivate your culinary herbs and leafy greens, we've sorted
									them all. Explore different categories like air-purifying
									plants, tropical gems, and flowering wonders. Let your
									curiosity lead you to discover the extraordinary diversity of
									indoor plants.
								</p>
							</div>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};

export default Home;
