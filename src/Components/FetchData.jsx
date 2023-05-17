import axios from "axios";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./Pagination.css";
import { Spinner } from "react-bootstrap";

const FetchData = () => {
  const [api, setApi] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 12;
  const [filterOption, setFilterOption] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.spacexdata.com/v3/launches"
        );
        setApi(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };

    setTimeout(fetchData, 3000);
  }, []);
  console.log("ddd", api);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  let filteredRecords = api;
  if (filterOption === "success") {
    filteredRecords = api.filter((item) => item.launch_success);
  } else if (filterOption === "failure") {
    filteredRecords = api.filter((item) => !item.launch_success);
  } else if (filterOption === "upcoming") {
    filteredRecords = api.filter((item) => item.upcoming);
    console.log("ffff", filteredRecords);
  }

  const currentRecords = filteredRecords.slice(
    indexOfFirstRecord,
    indexOfLastRecord
  );

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const calculateIndex = (index) => {
    return indexOfFirstRecord + index + 1;
  };

  const handleFilterChange = (event) => {
    setFilterOption(event.target.value);
  };

  if (isLoading) {
    return (
      <div className="loading-spiner">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div>
      <h1 className="heading-title">Spacex</h1>
      <div className="header-part">
        <div>Past 6 Months</div>
        <div>
          <select
            name="filterOption"
            id="filterOption"
            value={filterOption}
            onChange={handleFilterChange}
          >
            <option value="all">All Launches</option>
            <option value="upcoming">Upcoming Launches</option>
            <option value="success">Success Launches</option>
            <option value="failure">Failure Launches</option>
          </select>
        </div>
      </div>
      <Table className="tborder">
        <thead>
          <tr className="bg-secondary bg-gradient">
            <th>No</th>
            <th>Launched(UTC)</th>
            <th>Location</th>
            <th>Mission</th>
            <th>Orbit</th>
            <th>Launch Status</th>
            <th>Rockets</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.length > 0 ? (
            currentRecords.map((item, index) => (
              <tr key={index}>
                <td>{calculateIndex(index)}</td>
                <td>{item.launch_date_local}</td>
                <td>{item.launch_site?.site_name}</td>
                <td>{item.mission_name}</td>
                <td>
                  {item.rocket?.second_stage?.payloads.map((payload) => (
                    <span key={payload.payload_id}>{payload.orbit} </span>
                  ))}
                </td>
                <td
                  className="rounded-pill"
                  style={{
                    color: item.launch_success ? "green" : "red",
                    backgroundColor: item.launch_success
                      ? "#D3F8D3"
                      : "#FFF0F5",
                    width: "100px"
                  }}
                >
                  {item.launch_success ? "Success" : "Failure"}
                </td>
                <td>{item.rocket?.rocket_name}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No data available</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <ul className="pagination">
        {Array(Math.ceil(filteredRecords.length / recordsPerPage))
          .fill()
          .map((_, index) => (
            <li
              key={index}
              className={currentPage === index + 1 ? "active" : ""}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default FetchData;
