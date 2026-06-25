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

      <main style={{ padding: "24px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <h1>Manage Products</h1>

          <Link to="/admin/products/new" style={{ marginLeft: "auto" }}>
            <button>Add Product</button>
          </Link>
        </div>

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <table
            border="1"
            cellPadding="8"
            cellSpacing="0"
            style={{ width: "100%", borderCollapse: "collapse" }}
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
                <th>Actions</th>
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
                    <Link to={`/products/${product.id}`}>View</Link>
                    {" | "}
                    <Link to={`/admin/products/${product.id}/edit`}>Edit</Link>
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