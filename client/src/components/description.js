import React from "react";

const Description = () => {
  return (
    <div className="instructions">
      <h2>Instructions:</h2>
      <h3>Input a url and press the fetch button</h3>
      <p style={{color: "red"}}>Please Note: This app can only scrape text and it might not work on all the webpages due to them blocking bots.</p>
    </div>
  );
};

export default Description;
