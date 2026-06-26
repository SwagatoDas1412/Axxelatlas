import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminDashboardPage() {
  return (
    <>
      <Navbar />

      <main className="page-container">
        <h1>Admin Panel</h1>

        <p>Manage product metadata, source coverage, and data requests.</p>

        <div style={{ display: "flex", gap: "16px", marginTop: "20px" }}>
          <Link to="/admin/products">
            <button>Manage Products</button>
          </Link>

          <Link to="/admin/requests">
            <button>Manage Requests</button>
          </Link>
        </div>
      </main>
    </>
  );
}