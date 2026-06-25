import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createDataRequest } from "../api/requests";
import { getProduct } from "../api/products";
import Navbar from "../components/Navbar";

export default function NewRequestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const productIdFromUrl = searchParams.get("productId");

  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    product_id: productIdFromUrl ? Number(productIdFromUrl) : null,
    request_type: "backfill",
    data_type: "",
    granularity: "",
    start_date: "",
    end_date: "",
    priority: "medium",
    description: "",
  });

  const [loadingProduct, setLoadingProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchProduct = async () => {
    if (!productIdFromUrl) return;

    setLoadingProduct(true);

    try {
      const data = await getProduct(productIdFromUrl);
      setProduct(data);
    } catch (err) {
      setError("Failed to load selected product.");
    } finally {
      setLoadingProduct(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productIdFromUrl]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        product_id: formData.product_id || null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        data_type: formData.data_type || null,
        granularity: formData.granularity || null,
        description: formData.description || null,
      };

      await createDataRequest(payload);
      navigate("/requests");
    } catch (err) {
      setError("Failed to submit data request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={{ padding: "24px", maxWidth: "800px" }}>
        <Link to={product ? `/products/${product.id}` : "/products"}>
          ← Back
        </Link>

        <h1>New Data Request</h1>

        {loadingProduct && <p>Loading product...</p>}

        {product && (
          <div
            style={{
              border: "1px solid #ddd",
              padding: "12px",
              marginBottom: "20px",
              background: "#f8f8f8",
            }}
          >
            <strong>Selected product:</strong> {product.product_name} ({product.symbol})
          </div>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "12px" }}>
            <label>Request Type</label>
            <br />
            <select
              name="request_type"
              value={formData.request_type}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="new_data">New Data</option>
              <option value="backfill">Backfill</option>
              <option value="new_granularity">New Granularity</option>
              <option value="data_issue">Data Issue</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Data Type</label>
            <br />
            <input
              name="data_type"
              placeholder="ohlcv, trades, quotes, settlement, open_interest"
              value={formData.data_type}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Granularity</label>
            <br />
            <input
              name="granularity"
              placeholder="tick, 1s, 1m, 5m, daily"
              value={formData.granularity}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div>
              <label>Start Date</label>
              <br />
              <input
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div>
              <label>End Date</label>
              <br />
              <input
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Priority</label>
            <br />
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              style={{ width: "100%", padding: "8px" }}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label>Description</label>
            <br />
            <textarea
              name="description"
              placeholder="Explain what data you need and why."
              value={formData.description}
              onChange={handleChange}
              rows="5"
              style={{ width: "100%", padding: "8px" }}
            />
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </main>
    </>
  );
}