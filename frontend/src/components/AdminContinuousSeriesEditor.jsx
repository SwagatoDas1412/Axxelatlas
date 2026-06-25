import { useEffect, useState } from "react";
import {
  createContinuousSeriesRule,
  updateContinuousSeriesRule,
  deleteContinuousSeriesRule
} from "../api/admin";
import { getProductContinuousSeriesRule } from "../api/products";

const emptyForm = {
  rule_name: "",
  roll_method: "",
  roll_days_before_expiry: "",
  adjustment_method: "",
  description: "",
  notes: "",
};

export default function AdminContinuousSeriesEditor({ productId }) {
  const [rules, setRules] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchRules = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProductContinuousSeriesRule(productId);
      setRules(data);
    } catch (err) {
      setError("Failed to load continuous series rules.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
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
    setError("");
    setSuccess("");
  };

  const startEdit = (rule) => {
    setEditingId(rule.id);

    setFormData({
      rule_name: rule.rule_name || "",
      roll_method: rule.roll_method || "",
      roll_days_before_expiry:
        rule.roll_days_before_expiry === null ||
        rule.roll_days_before_expiry === undefined
          ? ""
          : String(rule.roll_days_before_expiry),
      adjustment_method: rule.adjustment_method || "",
      description: rule.description || "",
      notes: rule.notes || "",
    });

    setError("");
    setSuccess("");
  };

  const handleDelete = async (ruleId) => {
  const confirmed = window.confirm("Delete this continuous series rule?");

  if (!confirmed) return;

  try {
    await deleteContinuousSeriesRule(ruleId);
    await fetchRules();
  } catch (err) {
    setError(
      err.response?.data?.detail || "Failed to delete continuous series rule."
    );
  }
};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      rule_name: formData.rule_name || null,
      roll_method: formData.roll_method || null,
      roll_days_before_expiry: formData.roll_days_before_expiry
        ? Number(formData.roll_days_before_expiry)
        : null,
      adjustment_method: formData.adjustment_method || null,
      description: formData.description || null,
      notes: formData.notes || null,
    };

    try {
      if (editingId) {
        await updateContinuousSeriesRule(editingId, payload);
        setSuccess("Continuous series rule updated.");
      } else {
        await createContinuousSeriesRule(productId, payload);
        setSuccess("Continuous series rule added.");
      }

      resetForm();
      await fetchRules();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Failed to save continuous series rule."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section
      style={{
        border: "1px solid #ddd",
        padding: "16px",
        marginTop: "32px",
      }}
    >
      <h2>Manage Continuous Series Rules</h2>

      {loading && <p>Loading continuous series rules...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {!loading && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th>Rule Name</th>
              <th>Roll Method</th>
              <th>Roll Days Before Expiry</th>
              <th>Adjustment Method</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {rules.map((rule) => (
              <tr key={rule.id}>
                <td>{rule.rule_name || "N/A"}</td>
                <td>{rule.roll_method || "N/A"}</td>
                <td>{rule.roll_days_before_expiry ?? "N/A"}</td>
                <td>{rule.adjustment_method || "N/A"}</td>
                <td>{rule.description || "N/A"}</td>
                <td>
                  <button type="button" onClick={() => startEdit(rule)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rule.id)}
                    style={{ marginLeft: "8px" }}
                >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {rules.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No continuous series rules found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <h3>
        {editingId ? "Edit Continuous Series Rule" : "Add Continuous Series Rule"}
      </h3>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <Input
            label="Rule Name"
            name="rule_name"
            value={formData.rule_name}
            onChange={handleChange}
            placeholder="Default ES Continuous Rule"
          />

          <div>
            <label>Roll Method</label>
            <br />
            <select
              name="roll_method"
              value={formData.roll_method}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Select roll method</option>
              <option value="volume">volume</option>
              <option value="open_interest">open_interest</option>
              <option value="fixed_days">fixed_days</option>
              <option value="calendar">calendar</option>
            </select>
          </div>

          <Input
            label="Roll Days Before Expiry"
            name="roll_days_before_expiry"
            type="number"
            value={formData.roll_days_before_expiry}
            onChange={handleChange}
            placeholder="5"
          />

          <div>
            <label>Adjustment Method</label>
            <br />
            <select
              name="adjustment_method"
              value={formData.adjustment_method}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="">Select adjustment method</option>
              <option value="none">none</option>
              <option value="back_adjusted">back_adjusted</option>
              <option value="ratio_adjusted">ratio_adjusted</option>
              <option value="panama">panama</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop: "12px" }}>
          <label>Description</label>
          <br />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            style={{ width: "100%", padding: "8px" }}
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
            {saving ? "Saving..." : editingId ? "Update Rule" : "Add Rule"}
          </button>

          {editingId && (
            <button
              type="button"
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
        placeholder={placeholder}
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
}