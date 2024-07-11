import React, { useEffect, useState, useCallback } from 'react';
import { getTasks, deleteTask, updateTask } from '../api/api';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0); // Total number of tasks
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10; // Number of tasks per page

  const fetchTasks = useCallback(async (page) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getTasks(authToken, page, tasksPerPage);
      setTasks(response.tasks);
      setTotalTasks(response.total); // Set total number of tasks
      setIsLoadingTasks(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response && error.response.data.error === "jwt expired") {
        setErrorTasks("Session expired. Please login again.");
        navigate("/login");
      } else {
        setErrorTasks("Failed to fetch tasks. Please try again.");
      }
      setIsLoadingTasks(false);
    }
  }, [navigate, tasksPerPage]);

  useEffect(() => {
    fetchTasks(currentPage);
  }, [currentPage, fetchTasks]);

  const handleDelete = async (taskId) => {
    const authToken = localStorage.getItem("authToken");
    const response = await deleteTask(authToken, taskId);
    toast.success(response.message);
    fetchTasks(currentPage);
  };

  const handleEdit = async (taskId) => {
    setEditTaskId(taskId);
    setShowEditModal(true);

    const authToken = localStorage.getItem("authToken");
    const response = await getTasks(authToken, currentPage, tasksPerPage);
    const task = response.tasks.find(task => task._id === taskId);

    setEditDescription(task.description);
    setEditPriority(task.priority);
    setEditStatus(task.status);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditTaskId(null);
    setEditDescription("");
    setEditPriority("");
    setEditStatus("");
  };

  const handleSaveEdit = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      await updateTask(authToken, editTaskId, {
        description: editDescription,
        priority: editPriority,
        status: editStatus
      });

      handleCloseEditModal();
      fetchTasks(currentPage);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchTasks(pageNumber);
  };

  // Calculate indexes for current page
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;  

  return (
    <div className="tasks-container container mt-2">
      {/* <h2>Tasks</h2> */}
      <div>
        <h4>Your tasks:</h4>
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
              <thead className="thead-dark">
                <tr>
                  <th>Serial No.</th>
                  <th>Task Name</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Created At</th>
                  <th>Due Date</th>
                  <th className="text-center">Edit</th>
                  <th className="text-center">Delete</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr key={task._id}>
                    <td>{indexOfFirstTask + index + 1}</td>
                    <td>{task?.title}</td>
                    <td>{task?.description}</td>
                    <td>{task?.priority.toUpperCase()}</td>
                    <td>{task?.status}</td>
                    <td>{new Date(task?.createdAt).toLocaleString()}</td>
                    <td>{new Date(task?.dueDate).toLocaleString()}</td>
                    <td className="text-center">
                      <Button
                       variant="info" 
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(task._id)}
                    >
                      Edit
                    </Button>
                    </td>
                    <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {tasks.length > 0 && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>Previous</button>
            </li>
            {[...Array(Math.ceil(totalTasks / tasksPerPage)).keys()].map(pageNumber => (
              <li key={pageNumber + 1} className={`page-item ${pageNumber + 1 === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => paginate(pageNumber + 1)}>{pageNumber + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === Math.ceil(totalTasks / tasksPerPage) ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>Next</button>
            </li>
          </ul>
        </nav>
      )}

      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="editDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="editPriority">
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="editStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="to-do">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button> */}
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TaskList;
