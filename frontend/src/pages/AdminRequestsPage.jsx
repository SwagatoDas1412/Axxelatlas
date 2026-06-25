import { useEffect, useState } from "react";
import { getAdminRequests, updateAdminRequest } from "../api/admin";
import Navbar from "../components/Navbar";

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [editedRequests, setEditedRequests] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingRequestId, setSavingRequestId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const data = await getAdminRequests();
      setRequests(data);

      const initialEditedState = {};

      data.forEach((request) => {
        initialEditedState[request.request_id] = {
          status: request.status || "submitted",
          admin_notes: request.admin_notes || "",
        };
      });

      setEditedRequests(initialEditedState);
    } catch (err) {
      setError("Failed to load admin requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleFieldChange = (requestId, fieldName, value) => {
    setEditedRequests((previous) => ({
      ...previous,
      [requestId]: {
        ...previous[requestId],
        [fieldName]: value,
      },
    }));
  };

  const handleSave = async (requestId) => {
    setSavingRequestId(requestId);
    setError("");
    setSuccess("");

    const edited = editedRequests[requestId];

    try {
      await updateAdminRequest(requestId, {
        status: edited.status,
        admin_notes: edited.admin_notes || null,
      });

      setSuccess(`Request ${requestId} updated successfully.`);
      await fetchRequests();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update request.");
    } finally {
      setSavingRequestId(null);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "24px" }}>
        <h1>Manage Data Requests</h1>

        {loading && <p>Loading requests...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}

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
                <th>User</th>
                <th>Product</th>
                <th>Type</th>
                <th>Data Type</th>
                <th>Granularity</th>
                <th>Status</th>
                <th>Description</th>
                <th>Admin Notes</th>
                <th>Created At</th>
                <th>Save</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((request) => {
                const edited = editedRequests[request.request_id] || {
                  status: request.status,
                  admin_notes: request.admin_notes || "",
                };

                return (
                  <tr key={request.id}>
                    <td>{request.request_id}</td>
                    <td>
                    {request.user_name
                        ? `${request.user_name} (${request.user_email})`
                        : request.user_id}
                    </td>

                    <td>
                    {request.product_name
                        ? `${request.product_name} (${request.product_symbol})`
                        : "N/A"}
                    </td>
                    <td>{request.request_type}</td>
                    <td>{request.data_type || "N/A"}</td>
                    <td>{request.granularity || "N/A"}</td>

                    <td>
                      <select
                        value={edited.status}
                        onChange={(event) =>
                          handleFieldChange(
                            request.request_id,
                            "status",
                            event.target.value
                          )
                        }
                      >
                        <option value="submitted">submitted</option>
                        <option value="under_review">under_review</option>
                        <option value="approved">approved</option>
                        <option value="in_progress">in_progress</option>
                        <option value="completed">completed</option>
                        <option value="rejected">rejected</option>
                        <option value="duplicate">duplicate</option>
                        <option value="needs_clarification">
                          needs_clarification
                        </option>
                      </select>
                    </td>

                    <td style={{ maxWidth: "260px" }}>
                      {request.description || "N/A"}
                    </td>

                    <td>
                      <textarea
                        value={edited.admin_notes}
                        onChange={(event) =>
                          handleFieldChange(
                            request.request_id,
                            "admin_notes",
                            event.target.value
                          )
                        }
                        rows="3"
                        style={{ width: "260px", padding: "6px" }}
                        placeholder="Add internal notes..."
                      />
                    </td>

                    <td>{request.created_at}</td>

                    <td>
                      <button
                        type="button"
                        onClick={() => handleSave(request.request_id)}
                        disabled={savingRequestId === request.request_id}
                      >
                        {savingRequestId === request.request_id
                          ? "Saving..."
                          : "Save"}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {requests.length === 0 && (
                <tr>
                  <td colSpan="11" style={{ textAlign: "center" }}>
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