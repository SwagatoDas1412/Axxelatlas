import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { updateProduct } from "../api/admin";
import { getProduct } from "../api/products";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";
import AdminDataAvailabilityEditor from "../components/AdminDataAvailabilityEditor";
import AdminProductLinksEditor from "../components/AdminProductLinksEditor";
import AdminContinuousSeriesEditor from "../components/AdminContinuousSeriesEditor";
import AdminContractStatusEditor from "../components/AdminContractStatusEditor";
import Toast from "../components/Toast";

export default function AdminProductEditPage() {
  const { productId } = useParams();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchProduct = async () => {
    setLoading(true);
    setError("");

    try {
      const product = await getProduct(productId);

      setFormData({
        product_name: product.product_name || "",
        symbol: product.symbol || "",
        exchange: product.exchange || "",
        market: product.market || "",
        asset_class: product.asset_class || "",
        description: product.description || "",
        is_maintained: Boolean(product.is_maintained),
        has_databento_support: Boolean(product.has_databento_support),
        has_massive_support: Boolean(product.has_massive_support),
        preferred_source: product.preferred_source || "",
        maintainer: product.maintainer || "",
        status: product.status || "active",
      });
    } catch (err) {
      setError("Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await updateProduct(productId, formData);
      setSuccess("Product updated successfully.");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link to="/admin/products">
        <button type="button" className="button-secondary">
            ← Back to admin products
        </button>
        </Link>

        <div className="hero-card">
        <div className="page-header">
            <div className="page-title-block">
            <h1>Edit Product</h1>
            <p className="page-subtitle">
                Update product metadata, data coverage, links, roll rules, and active contract status.
            </p>
            </div>
        </div>
        </div>

        {loading && <p>Loading product...</p>}
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

        {formData && (
          <>
            <section
              style={{
                border: "1px solid #ddd",
                padding: "16px",
                marginTop: "20px",
              }}
            >
              <h2>Basic Product Metadata</h2>

              <ProductForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                submitting={submitting}
                submitLabel="Save Changes"
              />

              <div style={{ marginTop: "24px" }}>
                <Link to={`/products/${productId}`}>
                  <button type="button">View Product Detail Page</button>
                </Link>
              </div>
            </section>

            <AdminDataAvailabilityEditor productId={productId} />
            <AdminProductLinksEditor productId={productId} />
            <AdminContinuousSeriesEditor productId={productId} />
            <AdminContractStatusEditor productId={productId} />
          </>
        )}
      </main>
    </>
  );
}