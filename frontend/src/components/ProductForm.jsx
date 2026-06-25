export default function ProductForm({
  formData,
  setFormData,
  onSubmit,
  submitting,
  submitLabel,
}) {
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: "900px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <Input label="Product Name" name="product_name" value={formData.product_name} onChange={handleChange} required />
        <Input label="Symbol" name="symbol" value={formData.symbol} onChange={handleChange} required />
        <Input label="Exchange" name="exchange" value={formData.exchange} onChange={handleChange} />
        <Input label="Market" name="market" value={formData.market} onChange={handleChange} />
        <Input label="Asset Class" name="asset_class" value={formData.asset_class} onChange={handleChange} />
        <Input label="Preferred Source" name="preferred_source" value={formData.preferred_source} onChange={handleChange} />
        <Input label="Maintainer" name="maintainer" value={formData.maintainer} onChange={handleChange} />

        <div>
          <label>Status</label>
          <br />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="active">active</option>
            <option value="deprecated">deprecated</option>
            <option value="experimental">experimental</option>
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
          rows="4"
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
        <label>
          <input
            type="checkbox"
            name="is_maintained"
            checked={formData.is_maintained}
            onChange={handleChange}
          />
          Maintained
        </label>

        <label>
          <input
            type="checkbox"
            name="has_databento_support"
            checked={formData.has_databento_support}
            onChange={handleChange}
          />
          Databento Support
        </label>

        <label>
          <input
            type="checkbox"
            name="has_massive_support"
            checked={formData.has_massive_support}
            onChange={handleChange}
          />
          Massive Support
        </label>
      </div>

      <button type="submit" disabled={submitting} style={{ marginTop: "20px" }}>
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Input({ label, name, value, onChange, required = false }) {
  return (
    <div>
      <label>{label}</label>
      <br />
      <input
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        style={{ width: "100%", padding: "8px" }}
      />
    </div>
  );
}