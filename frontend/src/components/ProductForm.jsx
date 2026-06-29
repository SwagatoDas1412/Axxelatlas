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
    <section className="form-card">
    <form onSubmit={onSubmit}>
      <div className = "form-grid-2">
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

      <div className="checkbox-row">
        <CheckboxCard
            label="Maintained"
            subtitle="Visible and actively supported"
            name="is_maintained"
            checked={formData.is_maintained}
            onChange={handleChange}
        />

        <CheckboxCard
            label="Databento Support"
            subtitle="Coverage available via Databento"
            name="has_databento_support"
            checked={formData.has_databento_support}
            onChange={handleChange}
        />

        <CheckboxCard
            label="Massive Support"
            subtitle="Coverage available via Massive"
            name="has_massive_support"
            checked={formData.has_massive_support}
            onChange={handleChange}
        />
        </div>
      <div className = "actions-row">
      <button type="submit" disabled={submitting}>
        {submitting ? "Saving..." : submitLabel}
      </button>
      </div>
    </form>
    </section>
    
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

function CheckboxCard({ label, subtitle, name, checked, onChange }) {
  return (
    <label className="checkbox-card">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />

      <span className="checkbox-visual" />

      <span className="checkbox-text">
        <span className="checkbox-title">{label}</span>
        <span className="checkbox-subtitle">{subtitle}</span>
      </span>
    </label>
  );
}