import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import Navbar from "../components/Navbar";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className="hero-card">
        <div className="page-header">
            <div className="page-title-block">
            <h1>Manage Products</h1>
            <p className="page-subtitle">
                Create and maintain product metadata, source support, and research visibility.
            </p>
            </div>
        </div>
        </div>

          <Link to="/admin/products/new" style={{ marginLeft: "auto" }}>
            <button>Add Product</button>
          </Link>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <table
            className="data-table"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Symbol</th>
                <th>Exchange</th>
                <th>Market</th>
                <th>Maintained</th>
                <th>Status</th>
                <th style={{textAlign: "center"}}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.symbol}</td>
                  <td>{product.exchange}</td>
                  <td>{product.market}</td>
                  <td>{product.is_maintained ? "Yes" : "No"}</td>
                  <td>{product.status}</td>
                  <td>
                    <div className="table-actions" style={{justifyContent:"center"}}>
                        <Link
                        to={`/products/${product.id}`}
                        className="action-link action-view"
                        >
                        View
                        </Link>

                        <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="action-link action-edit"
                        >
                        Edit
                        </Link>
                    </div>
                    </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No products found.
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