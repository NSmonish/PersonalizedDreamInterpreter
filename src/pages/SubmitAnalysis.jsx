import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubmitAnalysis.css";

function SubmitAnalysis() {
  const navigate = useNavigate();
  return (
    <>
      <div class="container my-5 submit">
        <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
          <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
            <h1 class="display-4 fw-bold lh-1">
              Unlock the Secrets of Your Dream!
            </h1>
            <p class="lead text-light">
              Once you submit your dream, our advanced AI-powered analysis will
              process it to extract key symbols, emotions, and hidden messages.
              Ready to uncover what your subconscious is trying to tell you?
            </p>
            <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
              <button
                type="button"
                class="btn btn-warning btn-lg px-4 me-md-2 fw-bold"
                onClick={() => navigate("/analysis")}
              >
                Submit for Interpretation
              </button>
            </div>
          </div>
          <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
            <img class="rounded-lg-3" src="#" alt="" width="720" />
          </div>
        </div>
      </div>
    </>
  );
}

export default SubmitAnalysis;
