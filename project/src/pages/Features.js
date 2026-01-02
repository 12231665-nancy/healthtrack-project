import React from "react";
import "../styles/Features.css";
import { FeaturesList } from "../data/FeaturesList";
import FeaturesItem from "../components/FeaturesItem";

function Features() {
    return(
        <div className="features">
            <h1 className="featuresTitle">Our Features</h1>
            <p className="featuresSubTitle">Everything you need to manage your health in one place!</p>
            <div className="featuresList">
                {FeaturesList.map((item,key) =>(
                    <FeaturesItem key ={key} 
                    image={item.image} 
                    title={item.title} 
                    description={item.description} />
            ))}
            </div>
        </div>

    );
}
export default Features;

