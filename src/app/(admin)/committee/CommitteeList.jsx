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
  Badge,
  Card,
  Table,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const CommitteeList = () => {
  const [committees, setCommittees] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/constitution-committees");
        if (response.status === 200) {
          setCommittees(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching committees:", error);
        setToastMessage("Failed to load committees");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchCommittees();
  }, []);

  const handleDeleteClick = (committee) => {
    setSelectedCommittee(committee);
    setShowModal(true);
  };

  const handleDeleteCommittee = async () => {
    if (!selectedCommittee) return;
    try {
      await axiosInstance.delete(`/constitution-committees/${selectedCommittee.id}`);
      setCommittees((prev) => prev.filter((c) => c.id !== selectedCommittee.id));
      setToastMessage("Committee deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting committee:", error);
      setToastMessage("Failed to delete committee");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedCommittee(null);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Constitution Committees" />

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
                <h4>Constitution Committees</h4>
                <Button variant="primary" as={Link} to="/constitution-committees/new">
                  <IconifyIcon icon="mdi:plus" className="me-1" />
                  Create New
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Members</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {committees.map((committee, index) => (
                    <tr key={committee.id}>
                      <td>{index + 1}</td>
                      <td>{committee.title}</td>
                      <td>
                        {committee.description
                          ? `${committee.description.substring(0, 50)}...`
                          : "No description"}
                      </td>
                      <td>
                        <Badge bg="info">{committee._count?.members || 0}</Badge>
                      </td>
                      <td>
                        {new Date(committee.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/constitution-committees/${committee.id}`}
                        >
                          <IconifyIcon icon="mdi:eye" color="white" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/constitution-committees/edit/${committee.id}`}
                        >
                          <IconifyIcon icon="mdi:pencil" color="white" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(committee)}
                        >
                          <IconifyIcon icon="mdi:delete" color="white" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Committee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedCommittee?.title}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCommittee}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommitteeList;