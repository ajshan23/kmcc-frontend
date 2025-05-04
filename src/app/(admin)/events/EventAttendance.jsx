import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Spinner,
  Badge,
  InputGroup,
  FormControl,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";

const EventAttendance = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await axiosInstance.get(
          `/admin/events/${eventId}/registrations`
        );
        if (response.status === 200) {
          setRegistrations(response.data.data.registrations || []);
        }
      } catch (error) {
        console.error("Error fetching registrations:", error);
        setToastMessage("Failed to load registrations");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [eventId]);

  const markAttendance = async (userId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/events/${eventId}/attendance`,
        {
          userId,
          isAttended: !currentStatus, // Toggle the status
        }
      );

      if (response.status === 200) {
        // Update the local state with the new data
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg.userId === userId ? { ...reg, isAttended: !currentStatus } : reg
          )
        );
        setToastMessage("Attendance updated successfully");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error updating attendance:", error);
      setToastMessage("Failed to update attendance");
      setShowToast(true);
    }
  };

  const filteredRegistrations = registrations.filter((reg) =>
    reg.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <PageTitle title="Event Attendance" />

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

      <Card className="shadow-sm">
        <CardBody>
          <Row className="mb-4">
            <Col md={6}>
              <InputGroup>
                <FormControl
                  placeholder="Search attendees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6} className="text-md-end">
              <Badge bg="info" className="p-2">
                Total Registered: {registrations.length}
              </Badge>
              <Badge bg="success" className="p-2 ms-2">
                Attended: {registrations.filter((r) => r.isAttended).length}
              </Badge>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Member ID</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegistrations.length > 0 ? (
                    filteredRegistrations.map((reg, index) => (
                      <tr key={reg.id}>
                        <td>{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            {reg.user.profileImage && (
                              <img
                                src={`data:image/jpeg;base64,${reg.user.profileImage}`}
                                alt="Profile"
                                className="rounded-circle me-2"
                                style={{ width: "30px", height: "30px" }}
                              />
                            )}
                            {reg.user.name}
                          </div>
                        </td>
                        <td>{reg.user.memberId}</td>
                        <td>{reg.user.phoneNumber}</td>
                        <td>
                          <Badge
                            bg={reg.isAttended ? "success" : "warning"}
                            className="p-2"
                          >
                            {reg.isAttended ? "Attended" : "Pending"}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant={reg.isAttended ? "warning" : "success"}
                            size="sm"
                            onClick={() =>
                              markAttendance(reg.userId, reg.isAttended)
                            }
                          >
                            {reg.isAttended ? "Mark Absent" : "Mark Present"}
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No registrations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EventAttendance;
