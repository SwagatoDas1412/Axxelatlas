import { useEffect, useState } from "react";
import { createContractStatus, updateContractStatus } from "../api/admin";
import { getProductContractStatus } from "../api/products";

const emptyForm = {
  active_contract: "",
  active_contract_expiry: "",
  next_contract: "",
  next_contract_expiry: "",
  days_to_expiry: "",
  last_roll_date: "",
  next_expected_roll_date: "",
  source: "",
  last_updated_at: "",
  notes: "",
};

export default function AdminContractStatusEditor({ productId }) {
  const [contractStatus, setContractStatus] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchContractStatus = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProductContractStatus(productId);
      setContractStatus(data);

      if (data) {
        setFormData({
          active_contract: data.active_contract || "",
          active_contract_expiry: data.active_contract_expiry || "",
          next_contract: data.next_contract || "",
          next_contract_expiry: data.next_contract_expiry || "",
          days_to_expiry:
            data.days_to_expiry === null || data.days_to_expiry === undefined
              ? ""
              : String(data.days_to_expiry),
          last_roll_date: data.last_roll_date || "",
          next_expected_roll_date: data.next_expected_roll_date || "",
          source: data.source || "",
          last_updated_at: data.last_updated_at
            ? data.last_updated_at.slice(0, 16)
            : "",
          notes: data.notes || "",
        });
      } else {
        setFormData(emptyForm);
      }
    } catch (err) {
      setError("Failed to load contract status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractStatus();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      active_contract: formData.active_contract || null,
      active_contract_expiry: formData.active_contract_expiry || null,
      next_contract: formData.next_contract || null,
      next_contract_expiry: formData.next_contract_expiry || null,
      days_to_expiry: formData.days_to_expiry
        ? Number(formData.days_to_expiry)
        : null,
      last_roll_date: formData.last_roll_date || null,
      next_expected_roll_date: formData.next_expected_roll_date || null,
      source: formData.source || null,
      last_updated_at: formData.last_updated_at || null,
      notes: formData.notes || null,
    };

    try {
      if (contractStatus?.id) {
        await updateContractStatus(contractStatus.id, payload);
        setSuccess("Contract status updated.");
      } else {
        await createContractStatus(productId, payload);
        setSuccess("Contract status created.");
      }

      await fetchContractStatus();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save contract status.");
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
      <h2>Manage Contract Status</h2>

      <p>
        This controls the active contract and nearest expiry shown on the product
        detail page.
      </p>

      {loading && <p>Loading contract status...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {!loading && (
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            <Input
              label="Active Contract"
              name="active_contract"
              value={formData.active_contract}
              onChange={handleChange}
              placeholder="ESU26"
            />

            <Input
              label="Active Contract Expiry"
              name="active_contract_expiry"
              type="date"
              value={formData.active_contract_expiry}
              onChange={handleChange}
            />

            <Input
              label="Days to Expiry"
              name="days_to_expiry"
              type="number"
              value={formData.days_to_expiry}
              onChange={handleChange}
              placeholder="85"
            />

            <Input
              label="Next Contract"
              name="next_contract"
              value={formData.next_contract}
              onChange={handleChange}
              placeholder="ESZ26"
            />

            <Input
              label="Next Contract Expiry"
              name="next_contract_expiry"
              type="date"
              value={formData.next_contract_expiry}
              onChange={handleChange}
            />

            <Input
              label="Last Roll Date"
              name="last_roll_date"
              type="date"
              value={formData.last_roll_date}
              onChange={handleChange}
            />

            <Input
              label="Next Expected Roll Date"
              name="next_expected_roll_date"
              type="date"
              value={formData.next_expected_roll_date}
              onChange={handleChange}
            />

            <Input
              label="Source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              placeholder="manual_admin_update"
            />

            <Input
              label="Last Updated"
              name="last_updated_at"
              type="datetime-local"
              value={formData.last_updated_at}
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
              {saving
                ? "Saving..."
                : contractStatus?.id
                ? "Update Contract Status"
                : "Create Contract Status"}
            </button>
          </div>
        </form>
      )}
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