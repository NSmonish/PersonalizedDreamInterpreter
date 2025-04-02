import { useState } from "react";
import "./EnterDream.css";
import axios from "axios";

function EnterDream() {
  const [dreamData, setDreamData] = useState({
    date: "",
    description: "",
  });

  const handleChange = (e) => {
    setDreamData({ ...dreamData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userName = localStorage.getItem("userName"); // Get from localStorage
    if (!userName) {
      alert("User not logged in");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5001/api/dreams/add",
        {
          userName,
          date: dreamData.date,
          description: dreamData.description,
        }
      );

      alert(response.data.message);
      setDreamData({ date: "", description: "" }); // Reset form
    } catch (error) {
      alert("Error adding dream!");
    }
  };

  return (
    <>
      <div className="container col-xl-10 col-xxl-8 px-4 py-5 enterDream">
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            <h1 className="display-4 fw-bold lh-1 mb-3">
              Capture Your Dream Experience
            </h1>
            <p className="col-lg-10 fs-4 text-white">
              Write about your dream as vividly as you remember! Were you
              flying? Did you see something unusual? The more details you
              provide, the deeper the insights our AI can generate. Let your
              imagination flow
            </p>
          </div>
          <div className="col-md-10 mx-auto col-lg-5">
            <form
              className="p-4 p-md-5 border rounded-3 bg-body-tertiary"
              onSubmit={handleSubmit}
            >
              <div className="form-floating mb-3">
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  value={dreamData.date}
                  onChange={handleChange}
                  required
                />
                <label>Date</label>
              </div>
              <div className="form-floating mb-3">
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={dreamData.description}
                  onChange={handleChange}
                  required
                />
                <label>Describe your Dream!</label>
              </div>
              <button className="w-100 btn btn-lg btn-primary" type="submit">
                Add Dream
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EnterDream;
