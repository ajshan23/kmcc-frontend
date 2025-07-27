import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../globalFetch/api";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Col,
  Row,
  ModalTitle,
  Toast,
  ToastContainer,
  ButtonGroup,
  InputGroup,
  FormControl,
  Tabs,
  Tab,
  Badge,
  Pagination,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import EventAttendance from "./EventAttendance";
import EventStats from "./EventStats";
import PageTitle from "../../../components/PageTitle";

const Event = () => {
  const [events, setEvents] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("events");
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/get-events?page=${currentPage}&limit=${limit}`
        );
        if (response.status === 200) {
          setEvents(response.data.data);
          setTotalEvents(response.data.totalEvents);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error(error);
        setToastMessage("Failed to load events");
        setShowToast(true);
      }
    };
    fetchEvents();
  }, [currentPage, limit]);

  const handleUpdateClick = (event) => {
    setSelectedEvent(event);
    setShowUpdateModal(true);
  };

  const handleDeleteClick = (event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setShowDeleteModal(false);
    setSelectedEvent(null);
  };

  const handleSaveChanges = async () => {
    if (!selectedEvent) return;

    try {
      const response = await axiosInstance.patch(
        `/admin/status/event/${selectedEvent.id}`
      );

      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? { ...event, isFinished: true }
              : event
          )
        );
        setToastMessage("Event marked as completed!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      setToastMessage("Failed to update event status.");
      setShowToast(true);
    } finally {
      handleCloseModal();
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const response = await axiosInstance.delete(
        `/admin/event/${selectedEvent.id}`
      );

      if (response.status === 200) {
        setEvents((prevEvents) =>
          prevEvents.filter((event) => event.id !== selectedEvent.id)
        );
        setTotalEvents(prev => prev - 1);
        setToastMessage("Event deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      setToastMessage("Failed to delete event.");
      setShowToast(true);
    } finally {
      handleCloseModal();
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Pagination items
  const renderPaginationItems = () => {
    let items = [];
    const maxVisiblePages = 5; // Number of visible page buttons
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" />);
      }
    }

    // Middle pages
    for (let number = startPage; number <= endPage; number++) {
      items.push(
        <Pagination.Item 
          key={number} 
          active={number === currentPage} 
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" />);
      }
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={totalPages === currentPage} 
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div className="p-4">
      <PageTitle title="Event Management" />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header className="bg-primary text-white">
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Modal show={showUpdateModal} onHide={handleCloseModal} centered>
        <ModalHeader closeButton className="bg-light">
          <ModalTitle as="h5">Confirm Completion</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedEvent && (
            <div>
              <p>
                Are you sure you want to mark{" "}
                <strong>"{selectedEvent.title}"</strong> as completed?
              </p>
              <p className="text-muted">
                This will change the event status to "Finished".
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Confirm
          </Button>
        </ModalFooter>
      </Modal>

      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <ModalHeader closeButton className="bg-light">
          <ModalTitle as="h5">Confirm Deletion</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedEvent && (
            <div>
              <p>
                Are you sure you want to delete{" "}
                <strong>"{selectedEvent.title}"</strong>?
              </p>
              <p className="text-danger">
                This action cannot be undone and will permanently remove the
                event.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="outline-secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteEvent}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="events" title="Events Management">
          <Card className="shadow-sm mt-3">
            <CardBody>
              <Row className="mb-4">
                <Col md={6} className="mb-3 mb-md-0">
                  <InputGroup>
                    <FormControl
                      placeholder="Search events..."
                      aria-label="Search events"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-end-0"
                    />
                    <Button
                      variant="outline-secondary"
                      className="border-start-0"
                    >
                      <IconifyIcon icon="mdi:magnify" />
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={6} className="text-md-end">
                  <div className="d-flex justify-content-md-end align-items-center">
                    <div className="me-3">
                      <FormControl
                        as="select"
                        value={limit}
                        onChange={handleLimitChange}
                        style={{ width: '80px' }}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                      </FormControl>
                    </div>
                    <Button
                      variant="primary"
                      as={Link}
                      to="/event/new"
                      className="px-4"
                    >
                      <IconifyIcon icon="mdi:plus" className="me-2" />
                      Create New Event
                    </Button>
                  </div>
                </Col>
              </Row>

              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="text-center">Title</th>
                      <th className="text-center">Date</th>
                      <th className="text-center">Location</th>
                      <th className="text-center">Timing</th>
                      <th className="text-center">Image</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEvents.length > 0 ? (
                      filteredEvents.map((event) => (
                        <tr key={event.id}>
                          <td className="align-middle">{event.title}</td>
                          <td className="align-middle">
                            {new Date(event.eventDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )}
                          </td>
                          <td className="align-middle">{event.place}</td>
                          <td className="align-middle">{event.timing}</td>
                          <td className="align-middle">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt="Event banner"
                                className="rounded"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span className="text-muted">No image</span>
                            )}
                          </td>
                          <td className="align-middle">
                            <span
                              className={`badge ${
                                event.isFinished ? "bg-danger" : "bg-success"
                              } p-2`}
                            >
                              {event.isFinished ? "Finished" : "Ongoing"}
                            </span>
                          </td>
                          <td className="align-middle">
                            <ButtonGroup>
                              <Button
                                variant="primary"
                                size="sm"
                                as={Link}
                                to={`/event/edit/${event.id}`}
                                className="me-2"
                              >
                                <IconifyIcon
                                  icon="mdi:pencil"
                                  className="me-1"
                                />
                                Edit
                              </Button>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setActiveTab("attendance");
                                }}
                                className="me-2"
                              >
                                <IconifyIcon
                                  icon="mdi:attendance"
                                  className="me-1"
                                />
                                Attendance
                              </Button>
                              <Button
                                variant={
                                  event.isFinished ? "secondary" : "warning"
                                }
                                size="sm"
                                onClick={() => handleUpdateClick(event)}
                                disabled={event.isFinished}
                                className="me-2"
                              >
                                <IconifyIcon
                                  icon="mdi:check-circle"
                                  className="me-1"
                                />
                                {event.isFinished ? "Completed" : "Complete"}
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteClick(event)}
                              >
                                <IconifyIcon
                                  icon="mdi:trash"
                                  className="me-1"
                                />
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
                            ? "No events match your search"
                            : "No events found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="text-muted">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, totalEvents)} of {totalEvents}{" "}
                    events
                  </div>
                  <Pagination>
                    <Pagination.First 
                      onClick={() => handlePageChange(1)} 
                      disabled={currentPage === 1} 
                    />
                    <Pagination.Prev 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1} 
                    />
                    {renderPaginationItems()}
                    <Pagination.Next 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages} 
                    />
                    <Pagination.Last 
                      onClick={() => handlePageChange(totalPages)} 
                      disabled={currentPage === totalPages} 
                    />
                  </Pagination>
                </div>
              )}
            </CardBody>
          </Card>
        </Tab>
        <Tab eventKey="attendance" title="Attendance Tracking">
          {selectedEvent ? (
            <EventAttendance eventId={selectedEvent.id} />
          ) : (
            <Card className="shadow-sm mt-3">
              <CardBody className="text-center py-5">
                <h5>Please select an event from the Events Management tab</h5>
              </CardBody>
            </Card>
          )}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Event;