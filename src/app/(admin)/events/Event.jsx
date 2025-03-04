import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "react-bootstrap";

const Event = () => {
  const [events, setEvents] = useState([]); // State to store events
  const [showUpdateModal, setShowUpdateModal] = useState(false); // State to control modal visibility
  const [selectedEvent, setSelectedEvent] = useState(null); // State to store the selected event for update
  const [showToast, setShowToast] = useState(false); // State to control toast visibility
  const [toastMessage, setToastMessage] = useState(""); // State to store toast message

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosInstance.get("/admin/get-events");
        if (response.status === 200) {
          setEvents(response.data.data); // Set the fetched events to state
          console.log(response.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchEvents();
  }, []);

  // Function to handle the Update button click
  const handleUpdateClick = (event) => {
    setSelectedEvent(event); // Set the selected event
    setShowUpdateModal(true); // Show the modal
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedEvent(null); // Reset the selected event
  };

  // Function to handle Save Changes
  const handleSaveChanges = async () => {
    if (!selectedEvent) return; // Ensure an event is selected

    try {
      // Call the backend API to update the event status
      const response = await axiosInstance.patch(
        `/admin/status/event/${selectedEvent.id}`
      );

      if (response.status === 200) {
        // Update the local state to reflect the changes
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === selectedEvent.id
              ? { ...event, isFinished: true }
              : event
          )
        );
        setToastMessage("Event status updated successfully!");
        setShowToast(true); // Show toast
      }
    } catch (error) {
      console.error("Error updating event status:", error);
      setToastMessage("Failed to update event status.");
      setShowToast(true); // Show toast
    } finally {
      // Close the modal
      setShowUpdateModal(false);
      setSelectedEvent(null);
    }
  };

  return (
    <div className="d-flex p-4">
      <PageTitle title="Event" />

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Top Modal for Update */}
      <Modal
        show={showUpdateModal}
        onHide={handleCloseModal}
        dialogClassName="modal-top"
      >
        <ModalHeader closeButton>
          <ModalTitle as="h4">Update Event</ModalTitle>
        </ModalHeader>
        <ModalBody>
          {selectedEvent && (
            <div>
              <p>The event is already finished?</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onClick={handleCloseModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            disabled={selectedEvent?.isFinished} // Disable if event is finished
          >
            Save Changes
          </Button>
        </ModalFooter>
      </Modal>

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
                  to="/event/new" // Link to the event creation page
                >
                  New Event
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
                          <th style={{ textAlign: "center" }}>Event Date</th>
                          <th style={{ textAlign: "center" }}>Place</th>
                          <th style={{ textAlign: "center" }}>Timing</th>
                          <th style={{ textAlign: "center" }}>Image</th>
                          <th style={{ textAlign: "center" }}>Status</th>
                          <th style={{ textAlign: "center" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.map((event, idx) => (
                          <tr key={idx}>
                            <td style={{ verticalAlign: "middle" }}>
                              {event.title}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {new Date(event.eventDate).toLocaleDateString()}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {event.place}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {event.timing}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              {event.image ? (
                                <img
                                  src={event.image}
                                  alt="Event Banner"
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
                              {event.isFinished ? "Finished" : "Ongoing"}
                            </td>
                            <td style={{ verticalAlign: "middle" }}>
                              <Button
                                type="button"
                                variant="outline-dark"
                                className="me-2"
                                style={{ borderRadius: 5, padding: "5px 10px" }}
                                onClick={() => handleUpdateClick(event)} // Open modal on Update click
                                disabled={event.isFinished} // Disable if event is finished
                              >
                                Update
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
    </div>
  );
};

export default Event;
