import { useEffect, useState, useCallback } from "react";
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
  Form,
  Pagination,
} from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import debounce from "lodash.debounce";

const EventAttendance = ({ eventId }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
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
  }, [eventId]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  const debouncedSearch = debounce((term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  }, 300);

  const handleExportRegistrations = async () => {
    try {
      const response = await axiosInstance.get(
        `/admin/events/${eventId}/registrations/download`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      // Create blob from response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Try to get filename from content-disposition header
      let filename = `event_registrations_${eventId}.xlsx`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);

      setToastMessage("Registrations exported successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error exporting registrations:", error);
      setToastMessage(
        error.response?.data?.message || "Failed to export registration data"
      );
      setShowToast(true);
    }
  };

  const markAttendance = async (userId, currentStatus) => {
    try {
      const response = await axiosInstance.patch(
        `/admin/events/${eventId}/attendance`,
        {
          userId,
          isAttended: !currentStatus,
        }
      );

      if (response.status === 200) {
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

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch = reg.user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "attended" && reg.isAttended) ||
      (selectedStatus === "pending" && !reg.isAttended);
    return matchesSearch && matchesStatus;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRegistrations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredRegistrations.length / itemsPerPage);

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
                  onChange={(e) => debouncedSearch(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={handleExportRegistrations}
                  disabled={registrations.length === 0 || isDownloading}
                >
                  {isDownloading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="ms-2">Downloading...</span>
                    </>
                  ) : (
                    <>
                      <i className="mdi mdi-download me-1"></i> Download Excel
                    </>
                  )}
                </Button>
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

          <Row className="mb-3">
            <Col md={3}>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">All Statuses</option>
                <option value="attended">Attended</option>
                <option value="pending">Pending</option>
              </Form.Select>
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
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
                    {currentItems.length > 0 ? (
                      currentItems.map((reg, index) => (
                        <tr key={reg.id}>
                          <td>{indexOfFirstItem + index + 1}</td>
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

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EventAttendance;
