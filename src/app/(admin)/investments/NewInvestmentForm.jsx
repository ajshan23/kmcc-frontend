import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Toast,
  Row,
  Col,
  Card,
  Spinner,
  InputGroup,
  Badge,
  ListGroup,
  Modal,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const NewInvestmentForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState({
    submit: false,
    users: false,
    checking: false,
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    userId: "",
    initialDeposit: "",
    notes: "", // Added notes field
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showExistingInvestmentModal, setShowExistingInvestmentModal] =
    useState(false);
  const [existingInvestment, setExistingInvestment] = useState(null);

  // Fetch users when search term changes
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setUsers([]);
        setShowSuggestions(false);
        return;
      }

      try {
        setLoading((prev) => ({ ...prev, users: true }));
        const response = await axiosInstance.get(
          `/admin/users?search=${searchTerm}`
        );

        if (response.data?.data?.users) {
          setUsers(response.data.data.users);
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setToastMessage(
          error.response?.data?.message || "Failed to load users"
        );
        setShowToast(true);
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleInputFocus = () => {
    if (searchTerm && users.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setFormData((prev) => ({
      ...prev,
      userId: user.id.toString(),
    }));
    setSearchTerm(`${user.name} (${user.memberId})`);
    setShowSuggestions(false);
  };

  // Check for existing investment when user is selected
  useEffect(() => {
    if (selectedUser?.id) {
      checkExistingInvestment(selectedUser.id);
    }
  }, [selectedUser]);

  const checkExistingInvestment = async (userId) => {
    try {
      setLoading((prev) => ({ ...prev, checking: true }));
      const response = await axiosInstance.get(`/investments/check-active`, {
        params: { userId },
      });

      if (response.data.data.hasActiveInvestment) {
        setExistingInvestment(response.data.data.activeInvestment);
        setShowExistingInvestmentModal(true);
      }
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to check existing investments"
      );
      setShowToast(true);
    } finally {
      setLoading((prev) => ({ ...prev, checking: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedUser) {
      setToastMessage("Please select a user");
      setShowToast(true);
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, submit: true }));
      const createResponse = await axiosInstance.post("/investments", {
        userId: selectedUser.id,
        initialDeposit: formData.initialDeposit
          ? parseFloat(formData.initialDeposit)
          : undefined,
        notes: formData.notes || undefined, // Include notes in the request
      });

      setToastMessage("Investment created successfully!");
      setShowToast(true);
      setTimeout(
        () => navigate(`/investments/${createResponse.data.data.id}`),
        1500
      );
    } catch (error) {
      let errorMessage = "Failed to create investment";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setToastMessage(errorMessage);
      setShowToast(true);
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  };

  const handleViewExistingInvestment = () => {
    if (existingInvestment?.id) {
      navigate(`/investments/${existingInvestment.id}`);
    }
    setShowExistingInvestmentModal(false);
  };

  return (
    <>
      <PageTitle
        title="New Investment"
        breadcrumbItems={[
          { label: "Investments", path: "/investments" },
          { label: "New Investment", active: true },
        ]}
      />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Header>
          <strong className="me-auto">Notification</strong>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <Modal
        show={showExistingInvestmentModal}
        onHide={() => setShowExistingInvestmentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Existing Active Investment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This user already has an active investment:</p>
          <ul>
            <li>ID: {existingInvestment?.id}</li>
            <li>
              Started:{" "}
              {new Date(existingInvestment?.startDate).toLocaleDateString()}
            </li>
            <li>
              Total Deposited: $
              {existingInvestment?.totalDeposited?.toLocaleString()}
            </li>
          </ul>
          <p>Please close the existing investment before creating a new one.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowExistingInvestmentModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleViewExistingInvestment}>
            View Existing Investment
          </Button>
        </Modal.Footer>
      </Modal>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="userSearch">
                  <Form.Label>Select Member*</Form.Label>
                  <div style={{ position: "relative" }}>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        placeholder="Start typing name, member ID or iqama"
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          if (e.target.value === "") {
                            setSelectedUser(null);
                            setFormData((prev) => ({ ...prev, userId: "" }));
                          }
                        }}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        disabled={loading.submit || loading.checking}
                        autoComplete="off"
                      />
                      <Button
                        variant="outline-secondary"
                        disabled={
                          loading.users || loading.submit || loading.checking
                        }
                      >
                        {loading.users ? (
                          <Spinner size="sm" animation="border" />
                        ) : (
                          <IconifyIcon icon="mdi:magnify" />
                        )}
                      </Button>
                    </InputGroup>

                    {showSuggestions && users.length > 0 && (
                      <ListGroup
                        style={{
                          position: "absolute",
                          zIndex: 1000,
                          width: "100%",
                          maxHeight: "300px",
                          overflowY: "auto",
                          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        }}
                      >
                        {users.map((user) => (
                          <ListGroup.Item
                            key={user.id}
                            action
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleUserSelect(user)}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{user.name}</strong>
                                <div className="text-muted small">
                                  <span className="me-2">
                                    ID: {user.memberId}
                                  </span>
                                  <span>Iqama: {user.iqamaNumber}</span>
                                </div>
                              </div>
                              <Badge bg="primary">{user.phoneNumber}</Badge>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    )}
                  </div>
                  {loading.checking && (
                    <div className="mt-2">
                      <Spinner size="sm" animation="border" /> Checking for
                      existing investments...
                    </div>
                  )}
                </Form.Group>

                {selectedUser && (
                  <div className="mb-3 p-3 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-1">{selectedUser.name}</h6>
                        <div className="text-muted small">
                          <span className="me-2">
                            Member ID: {selectedUser.memberId}
                          </span>
                          <span>Iqama: {selectedUser.iqamaNumber}</span>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(null);
                          setSearchTerm("");
                          setFormData((prev) => ({ ...prev, userId: "" }));
                        }}
                        disabled={loading.checking}
                      >
                        <IconifyIcon icon="mdi:close" />
                      </Button>
                    </div>
                  </div>
                )}

                <Form.Group className="mb-3">
                  <Form.Label>Initial Deposit (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={formData.initialDeposit}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        initialDeposit: e.target.value,
                      })
                    }
                    disabled={loading.submit || loading.checking}
                  />
                </Form.Group>

                {/* Add Notes Field */}
                <Form.Group className="mb-3">
                  <Form.Label>Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter any notes about this initial deposit"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notes: e.target.value,
                      })
                    }
                    disabled={loading.submit || loading.checking}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/investments")}
                    disabled={loading.submit || loading.checking}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      loading.submit ||
                      loading.checking ||
                      !selectedUser ||
                      showExistingInvestmentModal
                    }
                  >
                    {loading.submit ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Creating...
                      </>
                    ) : (
                      "Create Investment"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default NewInvestmentForm;
