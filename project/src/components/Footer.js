import React from "react";
import "../styles/Footer.css";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


function Footer() {
    return(
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <h2>HealthTrack</h2>
                    <p>Your digital health partner. Empowering you to track, monitor, and improve your wellness journey!</p>
                </div>
               
                <div className="footer-social">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <FaFacebook />
                        <FaInstagram />
                        <FaTwitter />
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 HealthTrack. All rights reserved.</p>
            </div>

        </footer>
    );
}
export default Footer;