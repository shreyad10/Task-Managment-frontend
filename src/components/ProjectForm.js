import React, { useEffect, useState } from "react";
import { createProject } from "../api/api";
import { toast } from "react-toastify";


const ProjectForm = ({ fetchProjects, handleClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authToken = localStorage.getItem('authToken');
      await createProject(authToken, {
        name,
        description,
      }).then((res) => {
        fetchProjects();
        handleClose();
        toast.success("Project Added Successfully!");
      });
      setName("");
      setDescription("");
    } catch (error) {
      toast.error("Failed to add project. Please try again.");
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="projectName" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="projectName"
          placeholder="Enter project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="projectDescription" className="form-label">
          Description
        </label>
        <input
          type="text"
          className="form-control"
          id="projectDescription"
          placeholder="Enter project description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">Add Project</button>
    </form>
  );
};

export default ProjectForm;
