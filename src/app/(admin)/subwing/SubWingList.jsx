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

const SubWingList = () => {
  const [subWings, setSubWings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSubWing, setSelectedSubWing] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubWings = async () => {
      try {
        const response = await axiosInstance.get("/sub-wing");
        if (response.status === 200) {
          setSubWings(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching sub-wings:", error);
        setToastMessage("Failed to load sub-wings");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchSubWings();
  }, []);

  const handleDeleteClick = (subWing) => {
    setSelectedSubWing(subWing);
    setShowModal(true);
  };

  const handleDeleteSubWing = async () => {
    if (!selectedSubWing) return;
    try {
      await axiosInstance.delete(`/sub-wing/${selectedSubWing.id}`);
      setSubWings((prev) => prev.filter((sw) => sw.id !== selectedSubWing.id));
      setToastMessage("Sub-wing deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting sub-wing:", error);
      setToastMessage("Failed to delete sub-wing");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedSubWing(null);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Sub-Wings" />

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
                <h4>Sub-Wings Management</h4>
                <Button
                  variant="primary"
                  as={Link}
                  to="/sub-wing/new"
                >
                  <IconifyIcon icon="mdi:plus" className="me-1" />
                  Create New
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Icon</th>
                    <th>Members</th>
                    <th>Colors</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subWings.map((subWing, index) => (
                    <tr key={subWing.id}>
                      <td>{index + 1}</td>
                      <td>{subWing.name}</td>
                      <td>
                        {subWing.icon ? (
                          <img
                            src={subWing.icon}
                            alt={subWing.name}
                            style={{ height: "30px" }}
                          />
                        ) : (
                          <span className="text-muted">No icon</span>
                        )}
                      </td>
                      <td>
                        <Badge bg="info">{subWing.memberCount}</Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: subWing.backgroundColor,
                              border: "1px solid #ddd",
                            }}
                            title={`Background: ${subWing.backgroundColor}`}
                          ></div>
                          <div
                            style={{
                              width: "20px",
                              height: "20px",
                              backgroundColor: subWing.mainColor,
                              border: "1px solid #ddd",
                            }}
                            title={`Main color: ${subWing.mainColor}`}
                          ></div>
                        </div>
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/sub-wing/${subWing.id}`}
                        >
                          <IconifyIcon icon="mdi:eye" color="white" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/sub-wing/edit/${subWing.id}`}
                        >
                          <IconifyIcon icon="mdi:pencil" color="white" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(subWing)}
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
          <Modal.Title>Delete Sub-Wing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedSubWing?.name}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSubWing}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SubWingList;