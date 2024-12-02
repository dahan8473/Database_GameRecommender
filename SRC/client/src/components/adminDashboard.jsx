import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export function AdminDashboard({ adminId }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    averageAge: 0,
    recentSignups: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3000/users");
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setUsers(data);

      // Calculate stats
      const total = data.length;
      const avgAge = data.reduce((sum, user) => sum + user.age, 0) / total;
      const recent = data.filter((user) => {
        const signupDate = new Date(user.registration_date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return signupDate > thirtyDaysAgo;
      }).length;

      setStats({
        totalUsers: total,
        averageAge: Math.round(avgAge),
        recentSignups: recent,
      });
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:3000/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ admin_id: adminId }),
        }
      );

      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
      console.error("Error:", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <div className="user-stats">
        <div className="stat-box">
          <h3>{stats.totalUsers}</h3>
          <p>Total Users</p>
        </div>
        <div className="stat-box">
          <h3>{stats.averageAge}</h3>
          <p>Average Age</p>
        </div>
        <div className="stat-box">
          <h3>{stats.recentSignups}</h3>
          <p>New Users (30 days)</p>
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Age</th>
            <th>Registration Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.username}</td>
              <td>{user.age}</td>
              <td>{new Date(user.registration_date).toLocaleDateString()}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user.user_id)}
                  className="delete-button"
                >
                  <i className="fa-solid fa-trash"></i>
                  Delete User
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
