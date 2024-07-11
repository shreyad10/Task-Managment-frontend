import React, { useEffect, useCallback, useState } from "react";
import { getProjects, deleteProject, updateProject } from "../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Spinner, Alert, Button, Modal, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorProjects, setErrorProjects] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({
    name: "",
    description: "",
    id: "",
  });
  const navigate = useNavigate();

  const fetchProjects = useCallback(async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await getProjects(authToken);
      setProjects(response.projects);
      setIsLoadingProjects(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      if (error.response && error.response.data.error === "jwt expired") {
        setErrorProjects("Session expired. Please login again.");
        navigate("/login");
        // localStorage.clear();
      } else {
        setErrorProjects("Failed to fetch projects. Please try again.");
      }
      setIsLoadingProjects(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDelete = async (projectId) => {
    try {
      const authToken = localStorage.getItem("authToken");
      const response = await deleteProject(authToken, projectId);
      toast.success(response.message);
      fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete. Please try again.");
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
      toast.success(response.message);
      setShowEditModal(false);
      fetchProjects();
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h4>Your Projects:</h4>
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
          <p>No projects found.</p>
        ) : (
          <table className="table table-striped table-hover table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>Serial No.</th>
                <th>Name</th>
                <th>Description</th>
                <th>Owner</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr key={project._id}>
                  <td>{index + 1}</td>
                  <td>{project.name}</td>
                  <td>{project.description}</td>
                  <td>{project.owner.user_name}</td>
                  <td>{new Date(project.createdAt).toLocaleString()}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(project._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Project Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProjectName">
              <Form.Label>Project Name</Form.Label>
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
              <Form.Label>Project Description</Form.Label>
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
          {/* <Button variant="secondary" onClick={() => setShowEditModal(false)}>
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

export default ProjectList;
