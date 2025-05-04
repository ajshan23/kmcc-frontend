import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Button,
  Toast,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  InputGroup,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const AssignLotForm = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState({
    users: false,
    submit: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    userId: "",
    programId: programId,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading((prev) => ({ ...prev, users: true }));
        setError(null);
        const response = await axiosInstance.get(
          `/admin/users?search=${searchTerm}`
        );

        if (!response.data?.data?.users) {
          throw new Error("Invalid users data structure");
        }

        setUsers(response.data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load users"
        );
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchUsers();
      } else {
        setUsers([]);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.userId) {
      setToastMessage("Please select a user");
      setShowToast(true);
      return;
    }

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      await axiosInstance.post("/gold/lots", formData);
      setToastMessage("Lot assigned successfully!");
      setShowToast(true);
      setTimeout(() => navigate(`/gold-programs/${programId}/lots`), 1500);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to assign lot");
      setShowToast(true);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData({
      ...formData,
      userId: user.id,
    });
    setSearchTerm(`${user.name} (${user.memberId})`);
  };

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Error loading users</Alert.Heading>
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <PageTitle title="Assign New Lot" />
      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Search User</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by name, member ID or iqama"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        if (e.target.value === "") {
                          setSelectedUser(null);
                          setFormData({ ...formData, userId: "" });
                        }
                      }}
                      disabled={loading.submit}
                    />
                    <Button
                      variant="outline-secondary"
                      disabled={loading.users || loading.submit}
                    >
                      {loading.users ? (
                        <Spinner size="sm" animation="border" />
                      ) : (
                        <IconifyIcon icon="mdi:magnify" />
                      )}
                    </Button>
                  </InputGroup>

                  {/* Search results dropdown */}
                  {searchTerm && users.length > 0 && (
                    <div
                      className="mt-2 border rounded p-2"
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`p-2 cursor-pointer ${
                            selectedUser?.id === user.id ? "bg-light" : ""
                          }`}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div className="d-flex justify-content-between">
                            <span>{user.name}</span>
                            <small className="text-muted">
                              {user.memberId}
                            </small>
                          </div>
                          <small className="text-muted">
                            {user.iqamaNumber}
                          </small>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>

                {/* Selected user display */}
                {selectedUser && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <h6>Selected User:</h6>
                    <div className="d-flex justify-content-between">
                      <span>{selectedUser.name}</span>
                      <span className="text-muted">
                        {selectedUser.memberId}
                      </span>
                    </div>
                    <div className="text-muted small">
                      {selectedUser.iqamaNumber}
                    </div>
                    <div className="text-muted small">
                      {selectedUser.phoneNumber}
                    </div>
                  </div>
                )}

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(-1)}
                    disabled={loading.submit}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading.submit || !selectedUser}
                  >
                    {loading.submit ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Assigning...
                      </>
                    ) : (
                      "Assign Lot"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Header closeButton={false}>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </>
  );
};

export default AssignLotForm;
