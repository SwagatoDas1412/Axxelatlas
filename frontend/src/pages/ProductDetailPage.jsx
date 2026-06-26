import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getProduct,
  getProductContractStatus,
  getProductContinuousSeriesRule,
  getProductDataAvailability,
  getProductLinks,
} from "../api/products";
import Navbar from "../components/Navbar";

export default function ProductDetailPage() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [dataAvailability, setDataAvailability] = useState([]);
  const [links, setLinks] = useState([]);
  const [continuousRules, setContinuousRules] = useState([]);
  const [contractStatus, setContractStatus] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProductDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        productData,
        availabilityData,
        linksData,
        rulesData,
        contractStatusData,
      ] = await Promise.all([
        getProduct(productId),
        getProductDataAvailability(productId),
        getProductLinks(productId),
        getProductContinuousSeriesRule(productId),
        getProductContractStatus(productId),
      ]);

      setProduct(productData);
      setDataAvailability(availabilityData);
      setLinks(linksData);
      setContinuousRules(rulesData);
      setContractStatus(contractStatusData);
    } catch (err) {
      setError("Failed to load product details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="message info">Loading product details...</div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="message error">{error}</div>
          <Link to="/admin/products">
        <button type="button" className="button-secondary">
            ← Back to products
        </button>
        </Link>
        </main>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="message error">Product not found.</div>
          <Link to="/admin/products">
        <button type="button" className="button-secondary">
            ← Back to products
        </button>
        </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-container">
        <Link to="/admin/products">
        <button type="button" className="button-secondary">
            ← Back to products
        </button>
        </Link>

        <div className="hero-card">
          <div className="page-header">
            <div className="page-title-block">
              <h1>
                {product.product_name} ({product.symbol})
              </h1>
              <p className="page-subtitle">
                Coverage, active contract, links, continuous construction rules,
                and request actions.
              </p>
            </div>
          </div>
        </div>

        <section className="glass-card" style={{ marginBottom: "20px" }}>
          <h2>Overview</h2>

          <div className="card-grid">
            <InfoItem label="Product Name" value={product.product_name} />
            <InfoItem label="Symbol" value={product.symbol} />
            <InfoItem label="Exchange" value={product.exchange} />
            <InfoItem label="Market" value={product.market} />
            <InfoItem label="Asset Class" value={product.asset_class} />
            <InfoItem label="Status" value={product.status} />
            <InfoItem
              label="Maintained"
              value={product.is_maintained ? "Yes" : "No"}
            />
            <InfoItem
              label="Databento Support"
              value={product.has_databento_support ? "Yes" : "No"}
            />
            <InfoItem
              label="Massive Support"
              value={product.has_massive_support ? "Yes" : "No"}
            />
            <InfoItem
              label="Preferred Source"
              value={product.preferred_source}
            />
            <InfoItem label="Maintainer" value={product.maintainer} />
          </div>

          {product.description && (
            <p style={{ marginTop: "16px" }}>{product.description}</p>
          )}
        </section>

        <section
          className="glass-card"
          style={{
            marginBottom: "20px",
            borderColor: "rgba(56, 189, 248, 0.35)",
            boxShadow:
              "0 28px 90px rgba(0,0,0,0.38), 0 0 50px rgba(56,189,248,0.16)",
          }}
        >
          <h2>
            Current Active Contract{" "}
            <span className="stat-pill">Live Metadata</span>
          </h2>

          {contractStatus ? (
            <div className="card-grid">
              <InfoItem
                label="Active Contract"
                value={contractStatus.active_contract}
              />
              <InfoItem
                label="Active Contract Expiry"
                value={contractStatus.active_contract_expiry}
              />
              <InfoItem
                label="Days to Expiry"
                value={contractStatus.days_to_expiry}
              />
              <InfoItem
                label="Next Contract"
                value={contractStatus.next_contract}
              />
              <InfoItem
                label="Next Contract Expiry"
                value={contractStatus.next_contract_expiry}
              />
              <InfoItem
                label="Next Expected Roll Date"
                value={contractStatus.next_expected_roll_date}
              />
              <InfoItem label="Source" value={contractStatus.source} />
              <InfoItem
                label="Last Updated"
                value={contractStatus.last_updated_at}
              />
              <InfoItem label="Notes" value={contractStatus.notes} />
            </div>
          ) : (
            <p>No contract status available.</p>
          )}
        </section>

        <section className="glass-card" style={{ marginBottom: "20px" }}>
          <h2>Data Availability</h2>

          <div className="table-card">
            <div className="table-scroll">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Data Type</th>
                    <th>Granularity</th>
                    <th>Source</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Update Frequency</th>
                    <th>Last Verified</th>
                    <th>Notes</th>
                  </tr>
                </thead>

                <tbody>
                  {dataAvailability.map((item) => (
                    <tr key={item.id}>
                      <td>{item.data_type}</td>
                      <td>{item.granularity || "N/A"}</td>
                      <td>{item.source || "N/A"}</td>
                      <td>{item.start_date || "N/A"}</td>
                      <td>{item.end_date || "Present"}</td>
                      <td>{item.update_frequency || "N/A"}</td>
                      <td>{item.last_verified_at || "N/A"}</td>
                      <td>{item.notes || "N/A"}</td>
                    </tr>
                  ))}

                  {dataAvailability.length === 0 && (
                    <tr>
                      <td colSpan="8" className="empty-state">
                        No data availability records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="glass-card" style={{ marginBottom: "20px" }}>
          <h2>Continuous Series Rules</h2>

          {continuousRules.length > 0 ? (
            continuousRules.map((rule) => (
              <div
                key={rule.id}
                className="glass-card"
                style={{ marginBottom: "12px" }}
              >
                <h3>{rule.rule_name || "Unnamed Rule"}</h3>

                <div className="card-grid">
                  <InfoItem label="Roll Method" value={rule.roll_method} />
                  <InfoItem
                    label="Roll Days Before Expiry"
                    value={rule.roll_days_before_expiry}
                  />
                  <InfoItem
                    label="Adjustment Method"
                    value={rule.adjustment_method}
                  />
                </div>

                {rule.description && <p>{rule.description}</p>}
                {rule.notes && (
                  <p>
                    <strong>Notes:</strong> {rule.notes}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No continuous series rules available.</p>
          )}
        </section>

        <section className="glass-card" style={{ marginBottom: "20px" }}>
          <h2>External Links</h2>

          {links.length > 0 ? (
            <ul>
              {links.map((link) => (
                <li key={link.id}>
                  <strong>{link.link_type || "Link"}:</strong>{" "}
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No links available.</p>
          )}
        </section>

        <section className="glass-card" style={{ marginBottom: "20px" }}>
          <h2>Data Request</h2>
          <p>
            Request missing data, a backfill, new granularity, or report an
            issue for this product.
          </p>

          <Link to={`/requests/new?productId=${product.id}`}>
            <button>Request Data</button>
          </Link>
        </section>
      </main>
    </>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="info-item">
      <div className="info-label">{label}</div>
      <div className="info-value">
        {value === null || value === undefined || value === "" ? "N/A" : value}
      </div>
    </div>
  );
}