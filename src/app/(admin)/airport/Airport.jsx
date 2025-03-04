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
  Container,
  Table,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const Airport = () => {
  const [airports, setAirports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAirportId, setSelectedAirportId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchAirports();
  }, []);

  const fetchAirports = async () => {
    try {
      const response = await axiosInstance.get("/airport");
      if (response.status === 200) {
        setAirports(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching airports:", error);
    }
  };

  const handleDeleteClick = (airportId) => {
    setSelectedAirportId(airportId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedAirportId(null);
  };

  const handleDeleteAirport = async () => {
    if (!selectedAirportId) return;

    try {
      const response = await axiosInstance.delete(
        `/airport/${selectedAirportId}`
      );
      if (response.status === 200) {
        setAirports((prevAirports) =>
          prevAirports.filter((airport) => airport.id !== selectedAirportId)
        );
        setToastMessage("Airport deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting airport:", error);
      setToastMessage("Failed to delete airport.");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  return (
    <Container className="p-4">
      <PageTitle title="Airport" />

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
            className="p-3 bg-white border rounded"
            style={{ width: "70vw" }}
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
                  variant="dark"
                  as={Link}
                  to="/airport/new"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                >
                  New Airport
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table
                striped
                bordered
                hover
                responsive
                className="mt-3 text-center"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Code</th>
                    <th style={{ textAlign: "center" }}>Country</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {airports.map((airport, idx) => (
                    <tr key={idx}>
                      <td style={{ verticalAlign: "middle" }}>
                        {airport.name}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {airport.iataCode}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {airport.country}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteClick(airport.id)}
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
              </Table>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Airport</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this airport? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteAirport}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Airport;
