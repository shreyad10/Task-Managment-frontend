import React, { useCallback, useEffect, useState } from "react";
import { getProjects, getTasks } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Import custom CSS

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const fetchTasks = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const user_email = localStorage.getItem("email");
      setEmail(user_email);

      const response = await getTasks(authToken);
      setTasks(response.tasks);
      setIsLoadingTasks(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response?.data?.error === "jwt expired") {
        setErrorTasks("Session expired. Please login again");
        navigate("/login");
        localStorage.clear();
      } else {
        setErrorTasks("Failed to fetch tasks. Please try again.");
      }
      setIsLoadingTasks(false);
    }
  }, []); // Removed navigate from the dependency array

  const fetchProjects = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getProjects(authToken);
      setProjects(response.projects);
      setIsLoadingProjects(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setErrorProjects("Failed to fetch projects. Please try again.");
      setIsLoadingProjects(false);
    }
  }, []); // Removed navigate from the dependency array

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const renderProjectRows = () => {
    return projects.slice(0, 5).map((project, index) => (
      <tr key={project._id}>
        <td>{index + 1}</td>
        <td>{project.name}</td>
        <td>{project.description}</td>
        <td>{project.owner.user_name}</td>
        <td>{new Date(project.createdAt).toLocaleString()}</td>
      </tr>
    ));
  };

  const renderTaskRows = () => {
    return tasks.slice(0, 5).map((task, index) => (
      <tr key={task._id}>
        <td>{index + 1}</td>
        <td>{task.projectId.name}</td>
        <td>{task.description}</td>
        <td>{task.priority.toUpperCase()}</td>
        <td>{task.status}</td>
        <td>{new Date(task.createdAt).toLocaleString()}</td>
        <td>{new Date(task.dueDate).toLocaleString()}</td>
      </tr>
    ));
  };

  return (
    <div className="container mt-5 dashboard-container">
      <h2 className="dashboard-heading">Welcome to Dashboard, </h2>
      <p className="dashboard-user">You are logged in as: {email}</p>
      <h5 className="dashboard-animation">
        Organize your tasks efficiently with projects. Stay on top of your goals and make progress every day!
      </h5>
      <div className="projects-section">
        <h4 className="section-heading">Your top projects:</h4>
        {isLoadingProjects ? (
          <p>Loading projects...</p>
        ) : errorProjects ? (
          <div className="alert alert-danger" role="alert">
            {errorProjects}
          </div>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-header">
                <tr>
                  <th>Serial No</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Owner</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>{renderProjectRows()}</tbody>
            </table>
            <Link to="/projects">View all projects...</Link>
          </div>
        )}
      </div>

      <div className="tasks-section">
        <h4 className="section-heading">Your top tasks:</h4>
        {isLoadingTasks ? (
          <p>Loading tasks...</p>
        ) : errorTasks ? (
          <div className="alert alert-danger" role="alert">
            {errorTasks}
          </div>
        ) : tasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-header">
                <tr>
                  <th>Serial No</th>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>{renderTaskRows()}</tbody>
            </table>
            <Link to="/tasks">View all tasks...</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
