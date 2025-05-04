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
  Table,
  ButtonGroup,
  Badge,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const Service = () => {
  const [services, setServices] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axiosInstance.get("/services");
        if (response.status === 200) {
          setServices(response.data.data.services);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
        setToastMessage("Failed to load services");
        setShowToast(true);
      }
    };
    fetchServices();
  }, []);

  const handleDeleteClick = (serviceId) => {
    setSelectedServiceId(serviceId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedServiceId(null);
  };

  const handleDeleteService = async () => {
    if (!selectedServiceId) return;

    try {
      const response = await axiosInstance.delete(
        `/services/${selectedServiceId}`
      );
      if (response.status === 200) {
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== selectedServiceId)
        );
        setToastMessage("Service deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      setToastMessage("Failed to delete service.");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <PageTitle title="Service Management" />

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

      <Card className="shadow-sm">
        <CardBody>
          <Row className="mb-4">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: "300px", borderRadius: "8px" }}
                />
              </div>
            </Col>
            <Col md={6} className="text-md-end">
              <Button
                variant="primary"
                as={Link}
                to="/service/new"
                className="px-4"
              >
                <IconifyIcon icon="mdi:plus" className="me-2" />
                New Service
              </Button>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table striped bordered hover>
              <thead className="table-light">
                <tr>
                  <th>Title</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Days</th>
                  <th>Phone</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length > 0 ? (
                  filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td>{service.title}</td>
                      <td>{service.location}</td>
                      <td>
                        {service.startingTime} - {service.stoppingTime}
                      </td>
                      <td>
                        <Badge bg="info">{service.availableDays}</Badge>
                      </td>
                      <td>{service.phoneNumber}</td>
                      <td>
                        {service.image ? (
                          <img
                            src={service.image}
                            alt="Service"
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <span className="text-muted">No image</span>
                        )}
                      </td>
                      <td>
                        <ButtonGroup>
                          <Button
                            variant="primary"
                            size="sm"
                            as={Link}
                            to={`/service/edit/${service.id}`}
                            className="me-2"
                          >
                            <IconifyIcon icon="mdi:pencil" className="me-1" />
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(service.id)}
                          >
                            <IconifyIcon icon="mdi:trash" className="me-1" />
                            Delete
                          </Button>
                        </ButtonGroup>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      {searchTerm
                        ? "No services match your search"
                        : "No services found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </CardBody>
      </Card>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
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
