import PageTitle from "../../../components/PageTitle";
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
  Badge,
  Card,
  Table,
  Form,
  Pagination,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";
import moment from "moment";

const TravelList = () => {
  const [travels, setTravels] = useState([]);
  const [airports, setAirports] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    fromAirportId: "",
    toAirportId: "",
    travelDate: "",
    travelTime: "",
    status: "",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [travelsRes, airportsRes] = await Promise.all([
          axiosInstance.get(`/travel?page=${currentPage}&limit=${itemsPerPage}`),
          axiosInstance.get("/airport"),
        ]);

        if (travelsRes.status === 200) {
          setTravels(travelsRes.data.data.travels || travelsRes.data.data);
          setTotalItems(travelsRes.data.data.pagination?.total || travelsRes.data.data.length);
        }
        if (airportsRes.status === 200) {
          setAirports(airportsRes.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setToastMessage("Failed to load data");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentPage, itemsPerPage]);

  const handleDeleteClick = (travel) => {
    setSelectedTravel(travel);
    setShowModal(true);
  };

  const handleDeleteTravel = async () => {
    if (!selectedTravel) return;
    try {
      await axiosInstance.delete(`/travel/${selectedTravel.id}`);
      setTravels((prev) => prev.filter((t) => t.id !== selectedTravel.id));
      setToastMessage("Travel deleted successfully!");
      setShowToast(true);
      // Update total items count after deletion
      setTotalItems(prev => prev - 1);
    } catch (error) {
      console.error("Error deleting travel:", error);
      setToastMessage("Failed to delete Travel");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedTravel(null);
    }
  };

  const handleEditClick = (travel) => {
    setSelectedTravel(travel);
    setEditForm({
      fromAirportId: travel.fromAirportId,
      toAirportId: travel.toAirportId,
      travelDate: moment(travel.travelDate).format("YYYY-MM-DD"),
      travelTime: travel.travelTime,
      status: travel.status,
    });
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axiosInstance.put(`/travel/${selectedTravel.id}`, {
        fromAirportId: Number(editForm.fromAirportId),
        toAirportId: Number(editForm.toAirportId),
        travelDate: editForm.travelDate,
        travelTime: editForm.travelTime,
        status: editForm.status,
      });

      setTravels(
        travels.map((t) =>
          t.id === selectedTravel.id
            ? {
                ...t,
                ...response.data.data,
                fromAirport: airports.find(
                  (a) => a.id === Number(editForm.fromAirportId)
                ),
                toAirport: airports.find(
                  (a) => a.id === Number(editForm.toAirportId)
                ),
              }
            : t
        )
      );

      setToastMessage("Travel updated successfully!");
      setShowToast(true);
      setEditModal(false);
    } catch (error) {
      console.error("Error updating travel:", error);
      setToastMessage("Failed to update travel");
      setShowToast(true);
    }
  };

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/travel/export", {
        responseType: "blob", // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "travel_records.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();

      setToastMessage("Export started successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error exporting travels:", error);
      setToastMessage("Failed to export travels");
      setShowToast(true);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return <Badge bg="success">Available</Badge>;
      case "ONBOARD":
        return <Badge bg="primary">Onboard</Badge>;
      case "NOT_AVAILABLE":
        return <Badge bg="danger">Not Available</Badge>;
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Generate pagination items
  let paginationItems = [];
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item
        key={number}
        active={number === currentPage}
        onClick={() => setCurrentPage(number)}
      >
        {number}
      </Pagination.Item>
    );
  }

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Travels" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">KMCC</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row className="w-100">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Travels</h4>
                <Button variant="success" onClick={handleExport}>
                  <IconifyIcon icon="mdi:file-excel" className="me-2" />
                  Export to Excel
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Traveler</th>
                    <th>Phone</th>
                    <th>Area name</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {travels.map((travel, index) => (
                    <tr key={travel.id}>
                      <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                      <td>{travel.user?.name || "N/A"}</td>
                      <td>{travel.user?.phoneNumber || "N/A"}</td>
                      <td>{travel.user?.areaName || "N/A"}</td>
                      <td>{travel.fromAirport?.name || "N/A"}</td>
                      <td>{travel.toAirport?.name || "N/A"}</td>
                      <td>{moment(travel.travelDate).format("YYYY-MM-DD")}</td>
                      <td>{travel.travelTime}</td>
                      <td>{getStatusBadge(travel.status)}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleEditClick(travel)}
                        >
                          <IconifyIcon icon="mdi:pencil" color="white" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(travel)}
                        >
                          <IconifyIcon icon="mdi:delete" color="white" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {paginationItems}
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Travel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this Travel? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteTravel}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal
        show={editModal}
        onHide={() => setEditModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Travel Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="fromAirport">
                <Form.Label>From Airport</Form.Label>
                <Form.Select
                  value={editForm.fromAirportId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fromAirportId: e.target.value })
                  }
                >
                  <option value="">Select Airport</option>
                  {airports.map((airport) => (
                    <option key={`from-${airport.id}`} value={airport.id}>
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group as={Col} controlId="toAirport">
                <Form.Label>To Airport</Form.Label>
                <Form.Select
                  value={editForm.toAirportId}
                  onChange={(e) =>
                    setEditForm({ ...editForm, toAirportId: e.target.value })
                  }
                >
                  <option value="">Select Airport</option>
                  {airports.map((airport) => (
                    <option key={`to-${airport.id}`} value={airport.id}>
                      {airport.name} ({airport.iataCode})
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Row>

            <Row className="mb-3">
              <Form.Group as={Col} controlId="travelDate">
                <Form.Label>Travel Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editForm.travelDate}
                  onChange={(e) =>
                    setEditForm({ ...editForm, travelDate: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="travelTime">
                <Form.Label>Travel Time</Form.Label>
                <Form.Control
                  type="time"
                  value={editForm.travelTime}
                  onChange={(e) =>
                    setEditForm({ ...editForm, travelTime: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group as={Col} controlId="status">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="ONBOARD">Onboard</option>
                  <option value="NOT_AVAILABLE">Not Available</option>
                </Form.Select>
              </Form.Group>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEditSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TravelList;