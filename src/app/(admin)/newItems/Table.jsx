import { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Modal,
  Row,
  Toast,
  Spinner,
  InputGroup,
  FormControl,
  ButtonGroup,
} from "react-bootstrap";
import PageTitle from "../../../components/PageTitle";
import axiosInstance from "../../../globalFetch/api";
import NoImg from "./assets/no.png";
import { useNavigate } from "react-router-dom";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const Table = () => {
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/users", {
        params: {
          page,
          limit: 10,
          search: searchTerm,
        },
      });

      setUsers(response.data.data.users);
      setTotalPages(response.data.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
      setToastMessage(error.response?.data?.message || "Failed to fetch users");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchTerm]);

  const handleExportAllUsers = async () => {
    try {
      setExportLoading(true);
      const response = await axiosInstance.get("/user/export", {
        responseType: 'blob', // Important for file downloads
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with current date
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `kmcc_users_export_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

      setToastMessage("All users data exported successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error exporting users:", error);
      setToastMessage(error.response?.data?.message || "Failed to export users data");
      setShowToast(true);
    } finally {
      setExportLoading(false);
    }
  };

  const handleSearchClick = () => {
    setSearchTerm(searchInput);
    setPage(1); // Reset to first page when searching
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchTerm("");
    setPage(1);
  };

  const handleDeleteClick = (userId) => {
    setSelectedUserId(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedUserId) return;

    try {
      await axiosInstance.delete(`/admin/users/${selectedUserId}`);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUserId)
      );
      setToastMessage("User deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting user:", error);
      setToastMessage(error.response?.data?.message || "Failed to delete user");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  const handleEditClick = (userId, e) => {
    e.stopPropagation();
    navigate(`/users/${userId}/edit`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Number of pages to show around current page
    const ellipsis = <Button variant="outline-primary" disabled>...</Button>;

    if (totalPages <= 7) {
      // Show all pages if there are 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={i === page ? "primary" : "outline-primary"}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        );
      }
    } else {
      // Always show first page
      pageNumbers.push(
        <Button
          key={1}
          variant={1 === page ? "primary" : "outline-primary"}
          onClick={() => setPage(1)}
        >
          1
        </Button>
      );

      if (page > 3) {
        pageNumbers.push(ellipsis);
      }

      // Determine range of pages around current page
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust if we're near the start or end
      if (page <= 3) {
        endPage = 4;
      } else if (page >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      // Add the range pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Button
            key={i}
            variant={i === page ? "primary" : "outline-primary"}
            onClick={() => setPage(i)}
          >
            {i}
          </Button>
        );
      }

      if (page < totalPages - 2) {
        pageNumbers.push(ellipsis);
      }

      // Always show last page
      pageNumbers.push(
        <Button
          key={totalPages}
          variant={totalPages === page ? "primary" : "outline-primary"}
          onClick={() => setPage(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <PageTitle title="Users Table" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between mb-3">
                <InputGroup style={{ width: "400px" }}>
                  <FormControl
                    placeholder="Search users..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSearchClick();
                      }
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={handleSearchClick}
                  >
                    Search
                  </Button>
                  {searchTerm && (
                    <Button
                      variant="outline-danger"
                      onClick={handleClearSearch}
                    >
                      Clear
                    </Button>
                  )}
                </InputGroup>

                {/* Export Button */}
                <Button
                  variant="success"
                  onClick={handleExportAllUsers}
                  disabled={exportLoading}
                >
                  {exportLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <IconifyIcon icon="mdi:file-excel" className="me-2" />
                      Export to Excel
                    </>
                  )}
                </Button>
              </div>

              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Iqama Number</th>
                      <th>Member ID</th>
                      <th>Area name</th>
                      <th>Phone</th>
                      <th>Profile</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr
                          key={user.id}
                          className="align-middle"
                          onClick={() => navigate(`/users/${user.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <td>{user.name}</td>
                          <td>{user.iqamaNumber}</td>
                          <td>{user.memberId}</td>
                          <td>{user.areaName}</td>
                          <td>{user.phoneNumber}</td>
                          <td>
                            {user.profileImage ? (
                              <img
                                src={`data:image/png;base64,${user.profileImage}`}
                                alt="Profile"
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            ) : (
                              <img
                                src={NoImg}
                                alt="Profile"
                                className="rounded-circle"
                                width="40"
                                height="40"
                              />
                            )}
                          </td>
                          <td>
                            <Button
                              variant="primary"
                              className="me-2"
                              onClick={(e) => handleEditClick(user.id, e)}
                            >
                              <IconifyIcon icon="mdi:pencil" />
                            </Button>
                            <Button
                              variant="danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(user.id);
                              }}
                            >
                              <IconifyIcon icon="ri:delete-bin-4-fill" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="primary"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                
                <ButtonGroup className="mx-2">
                  {renderPageNumbers()}
                </ButtonGroup>
                
                <Button
                  variant="primary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Table;