import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api/products";
import Navbar from "../components/Navbar";

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

      <main style={{ padding: "24px" }}>
        <h1>Product Catalog</h1>

        <form
          onSubmit={handleFilterSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(180px, 1fr))",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
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

          <label>
            <input
              type="checkbox"
              checked={maintainedOnly}
              onChange={(event) => setMaintainedOnly(event.target.checked)}
            />
            Maintained only
          </label>

          <label>
            <input
              type="checkbox"
              checked={databentoOnly}
              onChange={(event) => setDatabentoOnly(event.target.checked)}
            />
            Databento only
          </label>

          <label>
            <input
              type="checkbox"
              checked={massiveOnly}
              onChange={(event) => setMassiveOnly(event.target.checked)}
            />
            Massive only
          </label>

          <div>
            <button type="submit">Apply Filters</button>
            <button type="button" onClick={clearFilters} style={{ marginLeft: "8px" }}>
              Clear
            </button>
          </div>
        </form>

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
                  <td>{product.is_maintained ? "Yes" : "No"}</td>
                  <td>{product.has_databento_support ? "Yes" : "No"}</td>
                  <td>{product.has_massive_support ? "Yes" : "No"}</td>
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
        )}
      </main>
    </>
  );
}