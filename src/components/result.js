import React from "react";

const Result = props => {
  // Status state is used to show the loading bar when "Fetch" button is clicked.
  if (props.status === true) {
    return (
      <>
        <div className="load-bar">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>

        <div className="text">Fetching Data...</div>
      </>
    );
    // If server responds with an error.
  } else if (props.error !== "") {
    return (
      <div className="error-box">
        <p>An Error Occured. </p>
        <p>Please check your URL. This app does not works on all websites.</p>
        <p>Try it with another website</p>

      </div>
    );
    // Final result when data has been fetched successfuly.
  } else if (props.status === false && props.data !== "") {
    return (
      <div className="result">
        <h2>Scraped Emails</h2>
        <div className="result-box">{props.data}</div>
      </div>
    );
  }
  // Null is needed by React to render properly. It throws an error if "null" is not returned
  else return null;
};

export default Result;
