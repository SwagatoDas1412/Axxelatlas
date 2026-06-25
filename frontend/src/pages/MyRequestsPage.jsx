import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyRequests } from "../api/requests";
import Navbar from "../components/Navbar";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyRequests();
      setRequests(data);
    } catch (err) {
      setError("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <>
      <Navbar />

      <main style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>My Requests</h1>

          <Link to="/requests/new" style={{ marginLeft: "auto" }}>
            <button>New Request</button>
          </Link>
        </div>

        {loading && <p>Loading requests...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
          >
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Product</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Granularity</th>
                <th>Date Range</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => (
                <tr key={request.id}>
                  <td>{request.request_id}</td>
                  <td>
                    {request.product_name
                        ? `${request.product_name} (${request.product_symbol})`
                        : "N/A"}
                  </td>
                  <td>{request.request_type}</td>
                  <td>{request.data_type || "N/A"}</td>
                  <td>{request.granularity || "N/A"}</td>
                  <td>
                    {request.start_date || "N/A"} → {request.end_date || "Present"}
                  </td>
                  <td>{request.priority}</td>
                  <td>
                    <strong>{request.status}</strong>
                  </td>
                  <td>{request.created_at}</td>
                </tr>
              ))}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </main>
    </>
  );
}