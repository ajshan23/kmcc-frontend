import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png"; // Import the logo for the toast

const Service = () => {
  const [services, setServices] = useState([]); // State to store services
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State to control delete modal visibility
  const [selectedServiceId, setSelectedServiceId] = useState(null); // State to store the selected service ID for deletion
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [showToast, setShowToast] = useState(false); // State to control toast visibility

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/services");
        if (response.status === 200) {
          setServices(response.data.data.services); // Set the fetched services to state
          console.log(services);
          
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Handle delete confirmation modal open
  const handleDeleteClick = (serviceId) => {
    setSelectedServiceId(serviceId); // Set the selected service ID
    setShowDeleteModal(true); // Show the delete confirmation modal
  };

  // Handle delete confirmation modal close
  const handleDeleteModalClose = () => {
    setShowDeleteModal(false); // Hide the delete confirmation modal
    setSelectedServiceId(null); // Reset the selected service ID
  };

  // Handle service deletion
  const handleDeleteService = async () => {
    if (!selectedServiceId) return; // Ensure a service ID is selected

    try {
      const response = await axiosInstance.delete(
        `/services/${selectedServiceId}`
      );
      if (response.status === 200) {
        // Remove the deleted service from the state
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== selectedServiceId)
        );
        setToastMessage("Service deleted successfully!");
        setShowToast(true); // Show success toast
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setToastMessage("Failed to delete service.");
      setShowToast(true); // Show error toast
    } finally {
      handleDeleteModalClose(); // Close the delete confirmation modal
    }
  };

  return (
    <div className="d-flex p-4">
      <PageTitle title="Service" />

      {/* Toast Notification */}
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
                  to="/service/new" // Link to the service creation page
                >
                  New Service
                </Button>
              </Col>
            </Row>

            <div>
              <div className="responsive-table-plugin">
                <div className="table-rep-plugin">
                  <div
                    className="table-responsive"
                    data-pattern="priority-columns"
                  >
                    <table
                      id="tech-companies-1"
                      className="table table-striped"
                      style={{ width: "100%", textAlign: "center" }} // Stretch table and center text
                    >
                      <thead>
                        <tr>
                          <th style={{ textAlign: "center" }}>Title</th>
                          <th style={{ textAlign: "center" }}>Location</th>
                          <th style={{ textAlign: "center" }}>Time</th>
                          <th style={{ textAlign: "center" }}>Phone Number</th>
                          <th style={{ textAlign: "center" }}>Image</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service, idx) => (
                          <tr key={idx}>
                            <td style={{ verticalAlign: "middle" }}>
                              {service.title}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {service.location}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {service.startingTime +
                                "-" +
                                service.stoppingTime}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {service.phoneNumber}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {service.image ? (
                                <img
                                  src={service.image}
                                  alt="Service Banner"
                                  style={{
                                    width: "50px",
                                    height: "auto",
                                    display: "block",
                                    margin: "0 auto",
                                    borderRadius: 2,
                                  }} // Center image
                                />
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <Button
                                type="button"
                                variant="danger"
                                onClick={() => handleDeleteClick(service.id)} // Trigger delete modal
                              >
                                <IconifyIcon
                                  color="white"
                                  icon="ri:delete-bin-4-fill"
                                />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this service? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteService}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Service;
