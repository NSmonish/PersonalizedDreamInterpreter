import { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [selectedDate, setSelectedDate] = useState("");
  const [dream, setDream] = useState(null);
  const [error, setError] = useState("");

  // Fetch the dream based on the selected date
  const fetchDream = async (date) => {
    try {
      setError(""); // Reset error message
      const formattedDate = new Date(date).toISOString().split("T")[0]; // Format date
      console.log("Fetching dream for:", formattedDate);

      const response = await axios.get(
        `http://localhost:5001/api/dreams/${formattedDate}`
      );
      setDream(response.data[0]); // Assuming only one dream per date
    } catch (err) {
      setDream(null);
      setError("No dreams found for this date.");
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    fetchDream(date);
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");

    setUserData({
      username: storedUsername || "Guest",
      email: storedEmail || "Not provided",
      password: storedPassword || "********",
    });
  }, []);

  return (
    <>
      <div className="container col-xxl-8 px-4 py-5 mt-5 intro">
        <div className="row flex-lg-row-reverse align-items-center g-5 py-5">
          <div className="col-lg-12">
            <h1 className="display-5 fw-bold lh-1 mb-3">Your Profile</h1>
            <p className="lead text-light">UserName: {userData.username}</p>
            <p className="lead text-light">EmailID: {userData.email}</p>
            <p className="lead text-light">Password: {userData.password}</p>
          </div>

          <h1 className="display-5 fw-bold lh-1 mb-3">View Your Dreams</h1>

          {/* Date Picker for selecting the date */}
          <form className="p-4 p-md-5 border rounded-3 date">
            <div className="form-floating mb-3">
              <input
                type="date"
                className="form-control"
                value={selectedDate}
                onChange={handleDateChange}
              />
              <label htmlFor="floatingInput">Select a Date</label>
            </div>
          </form>

          {/* Display the fetched dream description */}
          {dream && (
            <div className="dream-entry">
              <h3>Dream Description:</h3>
              <p>{dream.description}</p>
            </div>
          )}

          {/* Display error if no dream is found for the selected date */}
          {error && <p className="text-danger">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default Profile;
