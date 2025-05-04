import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import {
  Button,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const Job = () => {
  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axiosInstance.get("/jobs/admin/all");
        if (response.status === 200) {
          setJobs(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  const handleDeleteClick = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleDeleteJob = async () => {
    if (!selectedJob) return;
    try {
      await axiosInstance.delete(`/jobs/admin/${selectedJob.id}`);
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== selectedJob.id)
      );
      setToastMessage("Job deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting job:", error);
      setToastMessage("Failed to delete job.");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedJob(null);
    }
  };

  return (
    <div className="d-flex p-4">
      <PageTitle title="Job" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">TECHMIN</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <div
            style={{
              width: "70vw",
              background: "white",
              border: "1px solid gray",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Row className="d-flex justify-content-between align-items-center p-2">
              <Col xs="auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  style={{ width: "250px", borderRadius: 10 }}
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="button"
                  variant="dark"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                  as={Link}
                  to="/job/new"
                >
                  New Job
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <table
                className="table table-striped"
                style={{ width: "100%", textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Company Name</th>
                    <th style={{ textAlign: "center" }}>Position</th>
                    <th style={{ textAlign: "center" }}>Job Mode</th>
                    <th style={{ textAlign: "center" }}>Salary</th>
                    <th style={{ textAlign: "center" }}>Place</th>
                    <th style={{ textAlign: "center" }}>Image</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, idx) => (
                    <tr key={idx}>
                      <td style={{ verticalAlign: "middle" }}>
                        {job.companyName}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {job.position}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>{job.jobMode}</td>
                      <td style={{ verticalAlign: "middle" }}>{job.salary}</td>
                      <td style={{ verticalAlign: "middle" }}>{job.place}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        {job.logo ? (
                          <img
                            src={job.logo}
                            alt="Job Logo"
                            style={{
                              width: "50px",
                              height: "auto",
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {job.isClosed ? (
                          <span className="badge bg-danger">Closed</span>
                        ) : (
                          <span className="badge bg-success">Active</span>
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Button
                          type="button"
                          variant="info"
                          className="me-2"
                          as={Link}
                          to={`/job/applications/${job.id}`}
                        >
                          <IconifyIcon icon="mdi:eye" color="white" />
                        </Button>
                        <Button
                          type="button"
                          variant="primary"
                          className="me-2"
                          as={Link}
                          to={`/job/edit/${job.id}`}
                        >
                          <IconifyIcon icon="mdi:pencil" color="white" />
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteClick(job)}
                        >
                          <IconifyIcon
                            icon="ri:delete-bin-4-fill"
                            color="white"
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this job? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteJob}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Job;
