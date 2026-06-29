import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="page-container">
        <div className="hero-card">
          <div className="page-header">
            <div className="page-title-block">
              <h1>Admin Panel</h1>
              <p className="page-subtitle">
                Manage product metadata, source coverage, and data requests.
              </p>
            </div>
          </div>
        </div>

        <div className="admin-panel-links">
          <Link to="/admin/products" className="admin-panel-card">
            <div className="admin-panel-card-content">
              <h2>Manage Products</h2>
              <p>
                Create, edit, and maintain product metadata, support coverage,
                contract status, links, and continuous series rules.
              </p>
            </div>
          </Link>

          <Link to="/admin/requests" className="admin-panel-card">
            <div className="admin-panel-card-content">
              <h2>Manage Requests</h2>
              <p>
                Review researcher data requests, update statuses, and track
                request handling notes.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}