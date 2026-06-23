import { useEffect, useState,useCallback} from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Dashboard() {
  const role = localStorage.getItem("role");

  const [stats, setStats] = useState({
    total: 0,
    selected: 0,
    pending: 0,
    rejected: 0,
    totalStudents: 0,
    totalCompanies: 0,
    totalApplications: 0,
    placementPercentage: 0,
  });


  const fetchStats = useCallback(async () => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (role === "admin") {
        const res = await axios.get(
          "https://placement-portal-8sbz.onrender.com/api/application/admin-stats"
        );

        setStats(res.data);
      } else {
        const res = await axios.get(
          `https://placement-portal-8sbz.onrender.com/api/application/stats/${user.id}`
        );

        setStats(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [role]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  return (
    <>
      <Navbar />

      <div className="container mt-4">

        {/* Welcome Card */}
        <div className="welcome-card">
          <h2>
            👋 Welcome, {user?.name}
          </h2>

          <p>
            Placement Portal Dashboard
          </p>
        </div>

        {/* Admin Dashboard */}
        {role === "admin" ? (
          <div className="dashboard-grid">

            <div className="dashboard-card gradient-purple">
              <h5>🎓 Total Students</h5>
              <h2>{stats.totalStudents}</h2>
            </div>

            <div className="dashboard-card gradient-blue">
              <h5>🏢 Total Companies</h5>
              <h2>{stats.totalCompanies}</h2>
            </div>

            <div className="dashboard-card gradient-orange">
              <h5>📄 Applications</h5>
              <h2>{stats.totalApplications}</h2>
            </div>

            <div className="dashboard-card gradient-green">
              <h5>📈 Placement %</h5>
              <h2>{stats.placementPercentage}%</h2>
            </div>

            <div className="dashboard-card gradient-green">
              <h5>✅ Selected</h5>
              <h2>{stats.selected}</h2>
            </div>

            <div className="dashboard-card gradient-pink">
              <h5>⏳ Pending</h5>
              <h2>{stats.pending}</h2>
            </div>

            <div className="dashboard-card gradient-red">
              <h5>❌ Rejected</h5>
              <h2>{stats.rejected}</h2>
            </div>

          </div>
        ) : (

          /* Student Dashboard */
          <div className="dashboard-grid">

            <div className="dashboard-card gradient-purple">
              <h5>📄 Applications</h5>
              <h2>{stats.total}</h2>
            </div>

            <div className="dashboard-card gradient-green">
              <h5>✅ Selected</h5>
              <h2>{stats.selected}</h2>
            </div>

            <div className="dashboard-card gradient-pink">
              <h5>⏳ Pending</h5>
              <h2>{stats.pending}</h2>
            </div>

            <div className="dashboard-card gradient-red">
              <h5>❌ Rejected</h5>
              <h2>{stats.rejected}</h2>
            </div>

          </div>
        )}

        {/* Info Card */}
        <div className="dashboard-info-card">
          <h4>🚀 Welcome to Placement Portal</h4>

          <p>
            Use the navigation bar above to manage
            companies, applications, profiles and
            announcements.
          </p>
        </div>

      </div>
    </>
  );
}

export default Dashboard;