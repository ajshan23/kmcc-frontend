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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-events");
        if (response.status === 200) {
          setEvents(response.data.data);
        }
      } catch (error) {
        console.error(error);
        setToastMessage("Failed to load events");
        setShowToast(true);
      }
    };
    fetchEvents();
  }, []);

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
                  <Button
                    variant="primary"
                    as={Link}
                    to="/event/new"
                    className="px-4"
                  >
                    <IconifyIcon icon="mdi:plus" className="me-2" />
                    Create New Event
                  </Button>
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
        {/* <Tab eventKey="stats" title="Event Statistics">
          <EventStats />
        </Tab> */}
      </Tabs>
    </div>
  );
};

export default Event;
