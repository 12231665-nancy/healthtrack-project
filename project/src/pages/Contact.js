import React, { useState } from "react";
import axios from "axios";
import "../styles/Contact.css";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

function Contact({ user }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("User ID being sent:", user.id);
    console.log("Posting to:", `${API_BASE_URL}/contacts`);

    try {
      await axios.post(`${API_BASE_URL}/contacts`, {
        full_name: fullName,
        email,
        subject,
        message,
        user_id: user.id,
      });

      setFullName("");
      setEmail("");
      setSubject("");
      setMessage("");
      navigate("/");
    } catch (err) {
      console.log("Contact error status:", err.response?.status);
      console.log("Contact error data:", err.response?.data);
      console.log("Full error:", err);

      alert(err.response?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-card">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>Fill out the form and our team will contact you shortly.</p>

          <div className="info-item">📍 <span>Beirut, Lebanon</span></div>
          <div className="info-item">📧 <span>contact@healthtrack.com</span></div>
          <div className="info-item">📞 <span>+961 71 123 456</span></div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Contact Form</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <textarea
            placeholder="Your Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default Contact;
