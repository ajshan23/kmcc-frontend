import PageTitle from "../../../components/PageTitle";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  Spinner,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";
import MemberForm from "./MemberForm";

const CommitteeDetails = () => {
  const { committeeId } = useParams();
  const navigate = useNavigate();
  const [committee, setCommittee] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [committeeRes, membersRes] = await Promise.all([
          axiosInstance.get(`/constitution-committees/${committeeId}`),
          axiosInstance.get(`/constitution-committees/${committeeId}/members`),
        ]);

        setCommittee(committeeRes.data.data);
        setMembers(membersRes.data.data);
      } catch (error) {
        console.error("Error fetching committee details:", error);
        setToastMessage(
          error.response?.data?.message || "Failed to load committee details"
        );
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [committeeId]);

  const handleMemberAdded = (newMember) => {
    setMembers([...members, newMember]);
    setShowAddMemberModal(false);
    setToastMessage("Member added successfully");
    setShowToast(true);
  };

  const handleMemberUpdated = (updatedMember) => {
    setMembers(
      members.map((m) => (m.id === updatedMember.id ? updatedMember : m))
    );
    setToastMessage("Member updated successfully");
    setShowToast(true);
  };

  const handleDeleteMember = async () => {
    if (!selectedMember) return;

    try {
      setDeleting(true);
      await axiosInstance.delete(
        `/constitution-committees/members/${selectedMember.id}`
      );
      setMembers(members.filter((m) => m.id !== selectedMember.id));
      setToastMessage("Member deleted successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting member:", error);
      setToastMessage(
        error.response?.data?.message || "Failed to delete member"
      );
      setShowToast(true);
    } finally {
      setDeleting(false);
      setShowDeleteMemberModal(false);
      setSelectedMember(null);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!committee) {
    return (
      <div className="d-flex justify-content-center p-5">
        Committee not found
      </div>
    );
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Committee Details" />

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
                  {committee.title}
                  <Badge bg="primary" className="ms-2">
                    {members.length} Members
                  </Badge>
                </h4>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
                    as={Link}
                    to={`/constitution-committees/edit/${committeeId}`}
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
                    <Col md={12}>
                      <Card>
                        <Card.Body>
                          <h5>Committee Information</h5>
                          <Table bordered>
                            <tbody>
                              <tr>
                                <th>Title</th>
                                <td>{committee.title}</td>
                              </tr>
                              <tr>
                                <th>Description</th>
                                <td>
                                  {committee.description || (
                                    <span className="text-muted">
                                      No description
                                    </span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <th>Created At</th>
                                <td>
                                  {new Date(
                                    committee.createdAt
                                  ).toLocaleString()}
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
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() =>
                                  navigate(
                                    `/constitution-committees/${committeeId}/members/edit/${member.id}`
                                  )
                                }
                              >
                                <IconifyIcon icon="mdi:pencil" color="white" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setSelectedMember(member);
                                  setShowDeleteMemberModal(true);
                                }}
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
            committeeId={committeeId}
            onSuccess={handleMemberAdded}
            onCancel={() => setShowAddMemberModal(false)}
          />
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteMemberModal}
        onHide={() => !deleting && setShowDeleteMemberModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedMember?.name}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteMemberModal(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteMember}
            disabled={deleting}
          >
            {deleting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CommitteeDetails;
