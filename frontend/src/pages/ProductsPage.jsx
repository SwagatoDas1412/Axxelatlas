import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import Navbar from "../components/Navbar";
import StatusBadge from "../components/StatusBadge";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [market, setMarket] = useState("");
  const [exchange, setExchange] = useState("");
  const [assetClass, setAssetClass] = useState("");
  const [maintainedOnly, setMaintainedOnly] = useState(false);
  const [databentoOnly, setDatabentoOnly] = useState(false);
  const [massiveOnly, setMassiveOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (search) params.search = search;
      if (market) params.market = market;
      if (exchange) params.exchange = exchange;
      if (assetClass) params.asset_class = assetClass;
      if (maintainedOnly) params.is_maintained = true;
      if (databentoOnly) params.has_databento_support = true;
      if (massiveOnly) params.has_massive_support = true;

      const data = await getProducts(params);
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

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    fetchProducts();
  };

  const clearFilters = () => {
    setSearch("");
    setMarket("");
    setExchange("");
    setAssetClass("");
    setMaintainedOnly(false);
    setDatabentoOnly(false);
    setMassiveOnly(false);

    setTimeout(() => {
      fetchProducts();
    }, 0);
  };

  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="hero-card">
        <div className="page-header">
            <div className="page-title-block">
            <h1>Product Catalog</h1>
            <p className="page-subtitle">
                Search and inspect all maintained and externally available product coverage.
            </p>
            </div>
        </div>
        </div>

        <section className="glass-card" style = {{ marginBottom : "20px"}}>
        <form onSubmit={handleFilterSubmit} className="product-filter-form">
        <div className="product-filter-inputs">
          <input
            placeholder="Search product, symbol, description"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <input
            placeholder="Market"
            value={market}
            onChange={(event) => setMarket(event.target.value)}
          />

          <input
            placeholder="Exchange"
            value={exchange}
            onChange={(event) => setExchange(event.target.value)}
          />

          <input
            placeholder="Asset class"
            value={assetClass}
            onChange={(event) => setAssetClass(event.target.value)}
          />
        </div>

        <div className="product-filter-bottom-row">
          <CheckboxCard
            label="Maintained"
            subtitle="Maintained only"
            name="maintainedOnly"
            checked={maintainedOnly}
            onChange={(event) => setMaintainedOnly(event.target.checked)}
          />

          <CheckboxCard
            label="Databento"
            subtitle="Databento only"
            name="databentoOnly"
            checked={databentoOnly}
            onChange={(event) => setDatabentoOnly(event.target.checked)}
          />

          <CheckboxCard
            label="Massive"
            subtitle="Massive only"
            name="massiveOnly"
            checked={massiveOnly}
            onChange={(event) => setMassiveOnly(event.target.checked)}
          />

          <div className="product-filter-actions">
            <button type="submit">Apply Filters</button>

            <button
              type="button"
              className="button-secondary"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </div>
      </form>
        </section>

        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
        <section className = "glass-card">
          <table
            className="data-table"
          >
            <thead>
              <tr>
                <th>Product</th>
                <th>Symbol</th>
                <th>Exchange</th>
                <th>Market</th>
                <th>Asset Class</th>
                <th>Maintained</th>
                <th>Databento</th>
                <th>Massive</th>
                <th>Preferred Source</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <Link to={`/products/${product.id}`}>
                      {product.product_name}
                    </Link>
                  </td>
                  <td>{product.symbol}</td>
                  <td>{product.exchange}</td>
                  <td>{product.market}</td>
                  <td>{product.asset_class}</td>
                  <td>
                    <span className={product.is_maintained ? "status-badge success" : "status-badge danger"}>
                        {product.is_maintained ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span className={product.has_databento_support ? "status-badge success" : "status-badge"}>
                        {product.has_databento_support ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span className={product.has_massive_support ? "status-badge success" : "status-badge"}>
                        {product.has_massive_support ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>{product.preferred_source}</td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        )}
      </main>
    </>
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