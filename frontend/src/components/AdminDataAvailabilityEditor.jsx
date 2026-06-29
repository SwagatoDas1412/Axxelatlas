import { useEffect, useState } from "react";
import { createDataAvailability, updateDataAvailability, deleteDataAvailability} from "../api/admin";
import { getProductDataAvailability } from "../api/products";
import Toast from "../components/Toast";

const emptyForm = {
  data_type: "",
  granularity: "",
  source: "",
  start_date: "",
  end_date: "",
  update_frequency: "",
  last_verified_at: "",
  notes: "",
};

export default function AdminDataAvailabilityEditor({ productId }) {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProductDataAvailability(productId);
      setItems(data);
    } catch (err) {
      setError("Failed to load data availability.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setSuccess("");
    setError("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);

    setFormData({
      data_type: item.data_type || "",
      granularity: item.granularity || "",
      source: item.source || "",
      start_date: item.start_date || "",
      end_date: item.end_date || "",
      update_frequency: item.update_frequency || "",
      last_verified_at: item.last_verified_at
        ? item.last_verified_at.slice(0, 16)
        : "",
      notes: item.notes || "",
    });

    setSuccess("");
    setError("");
  };

  const handleDelete = async (availabilityId) => {
  const confirmed = window.confirm("Delete this data availability record?");

  if (!confirmed) return;

  try {
    await deleteDataAvailability(availabilityId);
    await fetchItems();
  } catch (err) {
    setError(
      err.response?.data?.detail || "Failed to delete data availability."
    );
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      data_type: formData.data_type,
      granularity: formData.granularity || null,
      source: formData.source || null,
      start_date: formData.start_date || null,
      end_date: formData.end_date || null,
      update_frequency: formData.update_frequency || null,
      last_verified_at: formData.last_verified_at || null,
      notes: formData.notes || null,
    };

    try {
      if (editingId) {
        await updateDataAvailability(editingId, payload);
        setSuccess("Data availability updated.");
      } else {
        await createDataAvailability(productId, payload);
        setSuccess("Data availability added.");
      }

      resetForm();
      await fetchItems();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save data availability.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
    className = "glass-card"
      style={{
        marginBottom : "24px"
      }}
    >
      <h2>Manage Data Availability</h2>

      {loading && <p>Loading data availability...</p>}
      <Toast
        type="error"
        message={error}
        onClose={() => setError("")}
        />

        <Toast
        type="success"
        message={success}
        onClose={() => setSuccess("")}
        />

      {!loading && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}
        >
          <thead>
            <tr>
              <th>Data Type</th>
              <th>Granularity</th>
              <th>Source</th>
              <th>Start</th>
              <th>End</th>
              <th>Update Frequency</th>
              <th>Last Verified</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.data_type}</td>
                <td>{item.granularity || "N/A"}</td>
                <td>{item.source || "N/A"}</td>
                <td>{item.start_date || "N/A"}</td>
                <td>{item.end_date || "Present"}</td>
                <td>{item.update_frequency || "N/A"}</td>
                <td>{item.last_verified_at || "N/A"}</td>
                <td>
                  <button type="button" className="button-secondary" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button-danger"
                    onClick={() => handleDelete(item.id)}
                    style={{ marginLeft: "8px" }}
                >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  No data availability records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <h3>{editingId ? "Edit Data Availability" : "Add Data Availability"}</h3>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <Input
            label="Data Type"
            name="data_type"
            value={formData.data_type}
            onChange={handleChange}
            required
            placeholder="ohlcv, trades, quotes"
          />

          <Input
            label="Granularity"
            name="granularity"
            value={formData.granularity}
            onChange={handleChange}
            placeholder="tick, 1m, daily"
          />

          <Input
            label="Source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            placeholder="internal_db, databento"
          />

          <Input
            label="Start Date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
          />

          <Input
            label="End Date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
          />

          <Input
            label="Update Frequency"
            name="update_frequency"
            value={formData.update_frequency}
            onChange={handleChange}
            placeholder="daily, weekly, manual"
          />

          <Input
            label="Last Verified"
            name="last_verified_at"
            type="datetime-local"
            value={formData.last_verified_at}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Notes</label>
          <br />
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update" : "Add"}
          </button>

          {editingId && (
            <button
              type="button"
              className="button-secondary"
              onClick={resetForm}
              style={{ marginLeft: "8px" }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}) {
  return (
    <div>
      <label>{label}</label>
      <br />
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
}