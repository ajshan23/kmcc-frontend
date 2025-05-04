import PageTitle from "../../../../components/PageTitle";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../globalFetch/api";
import {
  Button,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
  Table,
  Badge,
  Image,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const JobApplications = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch job details
        const jobResponse = await axiosInstance.get(`/jobs/${jobId}`);
        setJobDetails(jobResponse.data.data);

        // Fetch applications
        const appsResponse = await axiosInstance.get(
          `/jobs/get-applications/${jobId}?page=${pagination.page}&limit=${pagination.limit}`
        );

        setApplications(appsResponse.data.data.applications);
        setPagination((prev) => ({
          ...prev,
          total: appsResponse.data.data.pagination.totalApplications,
          totalPages: appsResponse.data.data.pagination.totalPages,
        }));
      } catch (error) {
        console.error("Error fetching data:", error);
        setToastMessage("Failed to fetch job applications.");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jobId, pagination.page, pagination.limit]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const viewResume = (resumeData) => {
    if (!resumeData) {
      setToastMessage("No resume available for this application.");
      setShowToast(true);
      return;
    }

    setSelectedImage(resumeData);
    setShowImageModal(true);
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Job Applications" />

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

      <Row className="w-100">
        <Col xs={12}>
          <div
            style={{
              background: "white",
              border: "1px solid gray",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4>
                Applications for: {jobDetails?.position} at{" "}
                {jobDetails?.companyName}
              </h4>
              <Badge bg="info" className="fs-6">
                Total Applications: {pagination.total}
              </Badge>
            </div>

            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Applied On</th>
                    <th>Resume</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app, index) => (
                    <tr key={app.id}>
                      <td>
                        {(pagination.page - 1) * pagination.limit + index + 1}
                      </td>
                      <td>{app.fullName}</td>
                      <td>{app.email}</td>
                      <td>{app.phone}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                      <td>
                        {app.resume ? (
                          <Button
                            variant="link"
                            onClick={() => viewResume(app.resume)}
                          >
                            View Resume
                          </Button>
                        ) : (
                          "No Resume"
                        )}
                      </td>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => viewResume(app.resume)}
                          disabled={!app.resume}
                        >
                          <IconifyIcon icon="mdi:eye" color="white" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
              <div>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} entries
              </div>
              <div>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  className="me-2"
                >
                  Previous
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <Button as={Link} to="/job" variant="secondary">
                Back to Jobs
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Image Modal */}
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Applicant Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedImage && (
            <Image
              src={selectedImage}
              alt="Applicant Resume"
              fluid
              style={{ maxHeight: "70vh" }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            Close
          </Button>
          {selectedImage && (
            <Button
              variant="primary"
              onClick={() => {
                const link = document.createElement("a");
                link.href = selectedImage;
                link.download = `resume_${new Date().getTime()}.jpg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Image
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobApplications;
