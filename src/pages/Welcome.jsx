import { useState } from "react";
import { useEffect } from "react";

import "./Welcome.css";

function Welcome() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);
  return (
    <>
      <div class="container col-xxl-8 px-4 py-5 mt-5 intro">
        <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div class="col-10 col-sm-8 col-lg-6">
            <img
              src=" "
              class="d-block mx-lg-auto img-fluid"
              alt="Bootstrap Themes"
              width="700"
              height="500"
              loading="lazy"
            />
          </div>
          <div class="col-lg-6">
            <h1 class="display-5 fw-bold lh-1 mb-3">
              {" "}
              Welcome, {userName || "Guest"}! Your Dream Journal Awaits!
            </h1>
            <p class="lead text-light">
              "Every dream holds a story waiting to be uncovered. Track your
              dreams, explore hidden meanings, and gain deeper insights into
              your subconscious mind. Let’s embark on this journey of
              self-discovery together!"
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
