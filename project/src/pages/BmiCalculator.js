import React, { useState } from "react";
import "../styles/Bmi.css";
import axios from "axios";

export default function BmiCalculator({ user }) {
  const [weight, setWeight] = useState(""); 
  const [height, setHeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [advice, setAdvice] = useState("");
  const [message, setMessage] = useState("");

  const calculateBMI = async () => {
    if(!weight || !height){
      alert("Please enter weight and height");
      return;
    }

    const h = height / 100; 
    const result = (weight / (h * h)).toFixed(1);
    setBmi(result); 
    let bmiAdvice = "";

      if (result < 18.5) bmiAdvice="You are underweight. Try to eat more healthy meals.";
      else if (result >= 18.5 && result < 24.9) bmiAdvice="Great! Your BMI is normal.";
      else if (result >= 25 && result < 29.9) bmiAdvice="You are overweight. Consider exercising daily."; 
      else bmiAdvice="You are obese. Please consult a doctor."; 
      setAdvice(bmiAdvice);

      try {
        await axios.post("http://localhost:8083/bmi_records", {
        weight,
        height,
        bmi_value: result,
        user_id: user.id
        
      });

      setMessage("Your BMI has been saved successfully!");
      setWeight("");
      setHeight("");
     
        
      } catch (err) {
        console.log(err);
      setMessage("Failed to save BMI. Try again.");
          
      }
    }; 
    return ( 
    <div className="bmi-page"> 
    
     <div className="bmi-info">
       <h2>💪 What is BMI?</h2>
        <p> Body Mass Index (BMI) is a measure of body fat based on your weight and height. </p>
         <h3>BMI Categories</h3>
          <ul> 
            <li>Underweight: &lt;18.5</li> 
            <li>Normal: 18.5–24.9</li>
            <li>Overweight: 25–29.9</li>
            <li>Obese: 30+</li> 
            </ul>
            <p>Use this tool to check your BMI and get advice on maintaining a healthy weight.</p>
            </div>
               
            <div className="bmi-container"> 
            <h2>💙 BMI Calculator</h2>
             <input 
             type="number"
             placeholder="Weight (kg)" 
             value={weight}
             onChange={(e) => setWeight(e.target.value)} 
             />
            <input

            type="number" 
            placeholder="Height (cm)" 
            value={height} 
            onChange={(e) => setHeight(e.target.value)} 
            /> 

            <button onClick={calculateBMI}>Calculate</button> 

            {bmi && ( <div className="bmi-result-section"> 
              <div className="bmi-result">Your BMI: {bmi}</div>
               <div className="bmi-advice">{advice}</div> 
               </div> 
              )} 
              {message && <div className="bmi-message">{message}</div>}
               </div>
                </div> 
                ); 
              }