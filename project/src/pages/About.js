import React from "react";
import "../styles/About.css";
import {useState} from 'react';
import AboutCard from "../components/AboutCard";
import about1 from "../assets/about1.jpg";
import about2 from "../assets/about2.jpg";
import about3 from "../assets/about3.jpg";
import team1 from "../assets/team1.jpg"; 
import team2 from "../assets/team2.jpg"; 
import team3 from "../assets/team3.jpg"; 
import team4 from "../assets/team4.jpg"; 
import team5 from "../assets/team5.jpg";

function About() {
  
  const aboutData = [
    {
      image: about1,
      title: "Our Mission",
      description: "To make health tracking simple and accessible for everyone."
    },
    {
      image: about2,
      title: "Our Vision",
      description: "We aim to connect technology and health for a better lifestyle."
    },
    {
      image: about3,
      title: "Meet Our Team",
      description: "A group of health professionals passionate about wellness."
    }
  ];
  const teamMembers =[
    {
      img: team1,
      name: "Medical Doctor",
      title: "Certified Health Practitioner",
      description: "Offers medical expertise, diagnosis, and professional health advice."
    },
    {
      img: team4,
      name: "Fitness Coach",
      title: "Workout & Training Specialist",
      description: "Designs personalized workout plans and improves overall strength.."
    },
    {
      img: team5,
      name: "Mental Health Advisor",
      title: "Well-Being & Motivation Expert",
      description: "Supports emotional balance, stress management, and motivation."
    },
    {
      img: team3,
      name: "Nutrition Specialist",
      title: "Healthy Meal Planning Expert",
      description: "Creates personalized nutrition plans for a healthier lifestyle."
    },
    {
      img: team2,
      name: "Healthcare Assistant",
      title: "Medical Support Coordinator",
      description: "Provides guidance and ensures users get reliable health support."
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevMember = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? teamMembers.length - 1 : prev - 1
    );
  };

  const nextMember = () => {
    setCurrentIndex((prev) =>
      prev === teamMembers.length - 1 ? 0 : prev + 1
    );
  };
  return (
    <div className="about-page">
      <h2>About HealthTrack</h2>
      <p className="about-intro">
        HealthTrack is a digital health platform that helps users monitor their fitness,
        track medical progress, and stay connected with professionals anytime.
      </p>

      <div className="about-container">
        {aboutData.map((item, index) => (
          <AboutCard
            key={index}
            image={item.image}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>

      <section className="about-team-section">
        <h3>Our Health Professionals</h3>

        <div className="carousel-container">
          <button className="carousel-btn left" onClick={prevMember}>◀</button>

        

          <div className="team-card">
            <img src={teamMembers[currentIndex].img} alt={teamMembers[currentIndex].name} />
            <h4>{teamMembers[currentIndex].name}</h4>
            <p className="job-title">{teamMembers[currentIndex].title}</p>
            <p className="team-desc">{teamMembers[currentIndex].description}</p>
              
          </div>

          
        <button className="carousel-btn right" onClick={nextMember}>▶</button>
        </div>
      </section>

      <section className="why-choose">
        <h3>Why Choose HealthTrack?</h3>
        <ul>
          <li>✅ Easy-to-use and reliable health tools</li>
          <li>✅ Personalized progress tracking</li>
          <li>✅ Trusted and verified health professionals</li>
          <li>✅ 24/7 customer support</li>
        </ul>
      </section>

    </div>
  );
}

export default About;

