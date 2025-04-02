import { useState } from "react";
import axios from "axios";
import "./Calendar.css";

function Calendar() {
  const [selectedDate, setSelectedDate] = useState("");
  const [dream, setDream] = useState(null);
  const [error, setError] = useState("");

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

  return (
    <div className="container text-white calendar">
      <h1>Your Personal Dream Calendar</h1>
      <p className="fs-5">
        "Your dreams evolve over time. Stay on top of your journey by navigating
        through past dream entries."
      </p>
      <form className="p-4 p-md-5 border rounded-3 date">
        <div className="form-floating mb-3">
          <input
            type="date"
            className="form-control"
            value={selectedDate}
            onChange={handleDateChange}
          />
          <label htmlFor="floatingInput">Date</label>
        </div>
      </form>

      {dream && (
        <div className="dream-entry">
          <h3>Dream Description:</h3>
          <p>{dream.description}</p>
        </div>
      )}

      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default Calendar;
