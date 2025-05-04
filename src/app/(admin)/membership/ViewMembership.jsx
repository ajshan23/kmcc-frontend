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
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const ViewMembership = () => {
  const [memberships, setMemberships] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchMemberships = async () => {
      try {
        const response = await axiosInstance.get("/admin/see", {
          params: {
            search: searchTerm,
            page: pagination.page,
            limit: pagination.limit,
          },
        });
        if (response.status === 200) {
          setMemberships(response.data.data.memberships);
          setPagination({
            page: response.data.data.pagination.page,
            limit: response.data.data.pagination.limit,
            totalCount: response.data.data.pagination.totalCount,
            totalPages: response.data.data.pagination.totalPages,
          });
        }
      } catch (error) {
        console.error("Error fetching memberships:", error);
      }
    };
    fetchMemberships();
  }, [searchTerm, pagination.page, pagination.limit]);

  const handleDeleteClick = (membership) => {
    setSelectedMembership(membership);
    setShowModal(true);
  };

  const handleDeleteMembership = async () => {
    if (!selectedMembership) return;
    try {
      await axiosInstance.delete(`/admin/memberships/${selectedMembership.id}`);
      setMemberships((prevMemberships) =>
        prevMemberships.filter(
          (membership) => membership.id !== selectedMembership.id
        )
      );
      setToastMessage("Membership deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting membership:", error);
      setToastMessage("Failed to delete membership.");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedMembership(null);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="d-flex p-4">
      <PageTitle title="Memberships" />

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="button"
                  variant="dark"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                  as={Link}
                  to="/memberships/new"
                >
                  New Membership
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <table
                className="table table-striped"
                style={{ width: "100%", textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Member ID</th>
                    <th style={{ textAlign: "center" }}>Iqama Number</th>
                    <th style={{ textAlign: "center" }}>Name</th>
                    <th style={{ textAlign: "center" }}>Phone Number</th>
                    <th style={{ textAlign: "center" }}>Status</th>
                    <th style={{ textAlign: "center" }}>Area Name</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {memberships.map((membership, idx) => (
                    <tr key={idx}>
                      <td style={{ verticalAlign: "middle" }}>
                        {membership.memberId}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {membership.iqamaNumber}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {membership.name}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {membership.phoneNumber || "N/A"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <span
                          className={`badge bg-${
                            membership.status === "active"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {membership.status}
                        </span>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {membership.areaName || "N/A"}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Button
                          type="button"
                          variant="primary"
                          className="me-2"
                          as={Link}
                          to={`/memberships/edit/${membership.id}`}
                        >
                          <IconifyIcon icon="mdi:account-edit" color="white" />
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteClick(membership)}
                        >
                          <IconifyIcon
                            icon="ri:delete-bin-4-fill"
                            color="white"
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="d-flex justify-content-center mt-3">
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Previous
              </Button>
              <span className="mx-3">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="secondary"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Membership</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this membership? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMembership}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewMembership;
