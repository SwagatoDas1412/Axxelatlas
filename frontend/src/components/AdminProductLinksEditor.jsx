import { useEffect, useState } from "react";
import { getProductLinks } from "../api/products";
import {
  createProductLink,
  updateProductLink,
  deleteProductLink,
} from "../api/admin";


const emptyForm = {
  link_type: "",
  title: "",
  url: "",
};

export default function AdminProductLinksEditor({ productId }) {
  const [links, setLinks] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchLinks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProductLinks(productId);
      setLinks(data);
    } catch (err) {
      setError("Failed to load product links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [productId]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleDelete = async (linkId) => {
    const confirmed = window.confirm("Delete this product link?");

    if (!confirmed) return;

    try {
        await deleteProductLink(linkId);
        await fetchLinks();
    } catch (err) {
        setError(err.response?.data?.detail || "Failed to delete product link.");
    }
    };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  const startEdit = (link) => {
    setEditingId(link.id);
    setFormData({
      link_type: link.link_type || "",
      title: link.title || "",
      url: link.url || "",
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      link_type: formData.link_type || null,
      title: formData.title,
      url: formData.url,
    };

    try {
      if (editingId) {
        await updateProductLink(editingId, payload);
        setSuccess("Product link updated.");
      } else {
        await createProductLink(productId, payload);
        setSuccess("Product link added.");
      }

      resetForm();
      await fetchLinks();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to save product link.");
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
      <h2>Manage Product Links</h2>

      {loading && <p>Loading product links...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      {!loading && (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}
        >
          <thead>
            <tr>
              <th>Link Type</th>
              <th>Title</th>
              <th>URL</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr key={link.id}>
                <td>{link.link_type || "N/A"}</td>
                <td>{link.title}</td>
                <td>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.url}
                  </a>
                </td>
                <td>
                  <button type="button" onClick={() => startEdit(link)}>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(link.id)}
                    style={{ marginLeft: "8px" }}
                    >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {links.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No product links found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <h3>{editingId ? "Edit Product Link" : "Add Product Link"}</h3>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(180px, 1fr))",
            gap: "12px",
          }}
        >
          <div>
            <label>Link Type</label>
            <br />
            <input
              name="link_type"
              value={formData.link_type}
              onChange={handleChange}
              placeholder="contract_specs, settlement_procedure"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div>
            <label>Title</label>
            <br />
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="CME Contract Specs"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div>
            <label>URL</label>
            <br />
            <input
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://..."
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : editingId ? "Update Link" : "Add Link"}
          </button>

          {editingId && (
            <button type="button" onClick={resetForm} style={{ marginLeft: "8px" }}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}