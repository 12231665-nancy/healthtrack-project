import React from "react";

function FeaturesItem({image, title , description}) {
    return(
        <div className="featuresItem">
            <div className="featureImage" style={{ backgroundImage: `url(${image})` }}>

            </div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>

    );

}
export default FeaturesItem;