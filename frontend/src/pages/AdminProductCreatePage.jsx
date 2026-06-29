import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createProduct } from "../api/admin";
import Navbar from "../components/Navbar";
import ProductForm from "../components/ProductForm";

const initialFormData = {
  product_name: "",
  symbol: "",
  exchange: "",
  market: "",
  asset_class: "",
  description: "",
  is_maintained: false,
  has_databento_support: false,
  has_massive_support: false,
  preferred_source: "",
  maintainer: "QuantTeam",
  status: "active",
};


export default function AdminProductCreatePage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const product = await createProduct(formData);
      navigate(`/admin/products/${product.id}/edit`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create product.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link to="/admin/products" className="button-secondary">
            ← Back to admin products
        </Link>

        <div className="centered-form-wrap">
            <div className="hero-card">
            <div className="page-header">
                <div className="page-title-block">
                <h1>Add Product</h1>
                <p className="page-subtitle">
                    Create a new product record with metadata, source support, and research visibility.
                </p>
                </div>
            </div>
            </div>

            <ProductForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            submitting={submitting}
            submitLabel="Create Product"
            />
        </div>
        </main>
    </>
  );
}