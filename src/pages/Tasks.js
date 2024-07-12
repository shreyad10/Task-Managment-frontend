import React, { useEffect, useState, useCallback } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Button, Modal, Container, Spinner, Alert } from "react-bootstrap"; // Import CloseButton from react-bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { getTasks, getProjects } from "../api/api";
import "./Tasks.css"; // Import custom CSS
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchTasks = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getTasks(authToken);
      setTasks(response.tasks);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response && error.response.data.error === "jwt expired") {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to fetch tasks. Please try again.");
      }
      setIsLoading(false);
    }
  }, [navigate]);

  const fetchProjects = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getProjects(authToken);
      setProjects(response.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response && error.response.data.error === "jwt expired") {
        setError("Session expired. Please login again.");
        navigate("/login");
      } else {
        setError("Failed to fetch projects. Please try again.");
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
    fetchProjects();
  }, [fetchTasks, fetchProjects]);

  const handleAlertClose = () => {
    setError(null); // Reset error state to close the Alert
  };

  return (
    <Container className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
      <h5 className="dashboard-animation">     📅 Stay focused and productive! What's your next move?</h5>
        <div className="position-relative">
          {projects.length > 0 ? (
            <Button variant="primary" onClick={handleShow} className="btn-add-task">
              Add Task 📝
            </Button>
          ) : (
            <Alert variant="warning" className="text-center" dismissible onClose={handleAlertClose}>
              No projects available. Please add a project first.
            </Alert>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center" dismissible onClose={handleAlertClose}>
          {error}
        </Alert>
      ) : (
        <TaskList tasks={tasks} />
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm fetchTasks={fetchTasks} closeModal={handleClose} setTasks={setTasks} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;