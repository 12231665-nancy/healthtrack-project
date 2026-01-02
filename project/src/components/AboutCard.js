import React from "react";
import "../styles/About.css"; 

function AboutCard({ image, title, description }) {
  return (
    <div className="about-card">
      <img src={image} alt={title} className="about-card-img" />
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  );
}

export default AboutCard;
