import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import { Button, Modal, Container, Spinner, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getTasks } from "../api/api";
import "./Tasks.css"; // Import custom CSS
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const [show, setShow] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
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
  };

  return (
    <Container className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="text-left">Tasks</h2>
        <div className="position-relative">
        <Button variant="primary" onClick={handleShow} className="btn-add-task">
          Add Task
        </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="text-center">
          {error}
        </Alert>
      ) : (
        <TaskList tasks={tasks} isLoading={isLoading} error={error} />
      )}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskForm fetchTasks={fetchTasks} closeModal={handleClose} />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Tasks;
