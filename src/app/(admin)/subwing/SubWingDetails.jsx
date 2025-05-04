import PageTitle from "../../../components/PageTitle";
import { Link, useParams } from "react-router-dom";
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
  Card,
  Badge,
  Tab,
  Tabs,
  Table,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";
import MemberForm from "./MemberForm";

const SubWingDetails = () => {
  const { subWingId } = useParams();
  const [subWing, setSubWing] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [subWingRes, membersRes] = await Promise.all([
          axiosInstance.get(`/sub-wing/${subWingId}`),
          axiosInstance.get(`/sub-wing/${subWingId}/members`),
        ]);

        setSubWing(subWingRes.data.data);
        setMembers(membersRes.data.data);
      } catch (error) {
        console.error("Error fetching sub-wing details:", error);
        setToastMessage("Failed to load sub-wing details");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subWingId]);

  const handleMemberAdded = (newMember) => {
    setMembers([...members, newMember]);
    setShowAddMemberModal(false);
    setToastMessage("Member added successfully");
    setShowToast(true);
  };

  const handleDeleteMember = async (memberId) => {
    try {
      await axiosInstance.delete(`/sub-wing/${subWingId}/members/${memberId}`);
      setMembers(members.filter((m) => m.id !== memberId));
      setToastMessage("Member deleted successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting member:", error);
      setToastMessage("Failed to delete member");
      setShowToast(true);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  if (!subWing) {
    return (
      <div className="d-flex justify-content-center p-5">
        Sub-wing not found
      </div>
    );
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Sub-Wing Details" />

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
                <h4>
                  {subWing.name} Sub-Wing
                  <Badge bg="primary" className="ms-2">
                    {members.length} Members
                  </Badge>
                </h4>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
                    as={Link}
                    to={`/sub-wing/edit/${subWingId}`}
                  >
                    <IconifyIcon icon="mdi:pencil" className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => setShowAddMemberModal(true)}
                  >
                    <IconifyIcon icon="mdi:plus" className="me-1" />
                    Add Member
                  </Button>
                </div>
              </div>

              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="mb-3"
              >
                <Tab eventKey="details" title="Details">
                  <Row className="mt-3">
                    <Col md={4}>
                      <Card>
                        <Card.Body className="text-center">
                          {subWing.icon ? (
                            <img
                              src={subWing.icon}
                              alt={subWing.name}
                              style={{ height: "150px", marginBottom: "20px" }}
                            />
                          ) : (
                            <div
                              style={{
                                height: "150px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "20px",
                              }}
                            >
                              <span className="text-muted">No icon</span>
                            </div>
                          )}
                          <h5>Color Scheme</h5>
                          <div className="d-flex justify-content-center gap-3 mb-3">
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: subWing.backgroundColor,
                                border: "1px solid #ddd",
                              }}
                              title={`Background: ${subWing.backgroundColor}`}
                            ></div>
                            <div
                              style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: subWing.mainColor,
                                border: "1px solid #ddd",
                              }}
                              title={`Main color: ${subWing.mainColor}`}
                            ></div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={8}>
                      <Card>
                        <Card.Body>
                          <h5>Sub-Wing Information</h5>
                          <Table bordered>
                            <tbody>
                              <tr>
                                <th>Name</th>
                                <td>{subWing.name}</td>
                              </tr>
                              <tr>
                                <th>Background Color</th>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor:
                                          subWing.backgroundColor,
                                        marginRight: "10px",
                                        border: "1px solid #ddd",
                                      }}
                                    ></div>
                                    {subWing.backgroundColor}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>Main Color</th>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <div
                                      style={{
                                        width: "20px",
                                        height: "20px",
                                        backgroundColor: subWing.mainColor,
                                        marginRight: "10px",
                                        border: "1px solid #ddd",
                                      }}
                                    ></div>
                                    {subWing.mainColor}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <th>Created At</th>
                                <td>
                                  {new Date(subWing.createdAt).toLocaleString()}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Tab>
                <Tab eventKey="members" title="Members">
                  <div className="mt-3">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Image</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, index) => (
                          <tr key={member.id}>
                            <td>{index + 1}</td>
                            <td>{member.name}</td>
                            <td>{member.position}</td>
                            <td>
                              {member.image ? (
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  style={{ height: "50px" }}
                                />
                              ) : (
                                <span className="text-muted">No image</span>
                              )}
                            </td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteMember(member.id)}
                              >
                                <IconifyIcon icon="mdi:delete" color="white" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showAddMemberModal}
        onHide={() => setShowAddMemberModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MemberForm
            subWingId={subWingId}
            onSuccess={handleMemberAdded}
            onCancel={() => setShowAddMemberModal(false)}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SubWingDetails;
