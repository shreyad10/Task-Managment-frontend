import React, { useCallback, useEffect, useState } from "react";
import { Spinner, Alert, Button, Modal, Form } from "react-bootstrap";
import { getProjects, deleteProject, updateProject } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import FontAwesome icons
import "./ProjectList.css"; // Import custom CSS

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0); // Total number of projects
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({
    name: "",
    description: "",
    id: "",
  });
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const projectsPerPage = 10;

  const fetchProjects = useCallback(async (page) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getProjects(authToken, page, projectsPerPage);
      setProjects(response.projects);
      setTotalProjects(response.total);
      setIsLoadingProjects(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response && error.response.data.error === "jwt expired") {
        setErrorProjects("Session expired. Please login again.");
        navigate("/login");
      } else {
        setErrorProjects("Failed to fetch projects. Please try again.");
      }
      setIsLoadingProjects(false);
    }
  }, [navigate, projectsPerPage]);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage, fetchProjects]);

  const handleDelete = async (projectId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await deleteProject(authToken, projectId);
      toast.success("🗑️ " + response.message);
      fetchProjects(currentPage);
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("❌ Failed to delete. Please try again.");
    }
  };

  const handleEdit = (project) => {
    setEditProject({
      name: project.name,
      description: project.description,
      id: project._id,
    });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await updateProject(authToken, editProject.id, {
        name: editProject.name,
        description: editProject.description,
      });
      toast.success("✅ " + response.message);
      setShowEditModal(false);
      fetchProjects(currentPage);
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("❌ Failed to update. Please try again.");
    }
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    fetchProjects(pageNumber);
  };

  // Calculate indexes for current page
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;

  return (
    <div className="container mt-5">
      <h4>📋 Your Projects:</h4>
      <div className="mt-3">
        {isLoadingProjects ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : errorProjects ? (
          <Alert variant="danger" className="text-center">
            {errorProjects}
          </Alert>
        ) : projects.length === 0 ? (
          <p>🚫 No projects found.</p>
        ) : (
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-header">
              <tr>
                <th>Serial No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Created At</th>
                <th className="text-center">Edit</th>
                <th className="text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{indexOfFirstProject + index + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.owner.user_name}</td>
                  <td>{new Date(project.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <Button
                      variant="info"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(project)}
                    >
                      <FaEdit /> Edit
                    </Button>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {projects.length > 0 && (
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
              >
                Previous
              </button>
            </li>
            {[...Array(Math.ceil(totalProjects / projectsPerPage)).keys()].map(
              (pageNumber) => (
                <li
                  key={pageNumber + 1}
                  className={`page-item ${
                    pageNumber + 1 === currentPage ? "active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(pageNumber + 1)}
                  >
                    {pageNumber + 1}
                  </button>
                </li>
              )
            )}
            <li
              className={`page-item ${
                currentPage === Math.ceil(totalProjects / projectsPerPage)
                  ? "disabled"
                  : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProjectName">
              <Form.Label>📝 Project Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={editProject.name}
                onChange={(e) =>
                  setEditProject({ ...editProject, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formProjectDescription">
              <Form.Label>📄 Project Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter project description"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject({
                    ...editProject,
                    description: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectList;
