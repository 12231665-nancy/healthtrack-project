import React from "react";
import lifestyleImage from "../assets/lifestyle.jpg";
import "../styles/Home.css";
import { Carousel, Card } from "react-bootstrap";

function Home() {
    return(
        <div className="home">
            <header className="home-hero">
                <img src={lifestyleImage} alt="Wellness LifeStyle" className="hero-bg" />
                
                <div className="hero-text-right">
                <h1 className="home-title">Welcome To HealthTrack</h1>
                <p className="home-subtitle">Your daily guide to better health,fitness, and wellness </p>
                
                </div>
            </header>
        <section className="mission-section">
            <h2>Our Mission ✅</h2>
            <p>At HealthTrack, our mission is to help you take control of your health through smart tools, clear insights, and personalized guidance.</p>
        </section>
        <section className="statistics-section">
            <div className="container">
                    <div className="row text-center">
                        <div className="col-md-3 mb-4">
                            <div className="stat-box">
                                <h3>50+</h3>
                                <p>Health Experts</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-box">
                                <h3>5k+</h3>
                                <p>Active Users</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-box">
                                <h3>99%</h3>
                                <p>User Satisfaction</p>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <div className="stat-box">
                                <h3>150+</h3>
                                <p>Daily Reports</p>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
        <section className="reviews-section">
            <div className="container">
                    <h2 className="text-center mb-4">Users Reviews</h2>

                    <Carousel interval={3000} fade>
                       <Carousel.Item>
                 <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <Card.Body className="text-center">
                  <Card.Text>“HealthTrack helped me understand my habits and live healthier. I use it every day!”</Card.Text>
                  <Card.Title>Sarah</Card.Title>
                </Card.Body>
              </Card>
            </Carousel.Item>

            <Carousel.Item>
              <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <Card.Body className="text-center">
                  <Card.Text>“Very easy to use and super helpful. I love the fitness and nutrition tracking features.”</Card.Text>
                  <Card.Title>Dany</Card.Title>
                </Card.Body>
              </Card>
            </Carousel.Item>

            <Carousel.Item>
              <Card className="mx-auto" style={{ maxWidth: "600px" }}>
                <Card.Body className="text-center">
                  <Card.Text>“HealthTrack is amazing! It keeps me motivated every day.”</Card.Text>
                  <Card.Title>Hadi</Card.Title>
                </Card.Body>
              </Card>
            </Carousel.Item>
          </Carousel>
                </div>
        </section>
            
            
        </div>

    );
}
export default Home;
