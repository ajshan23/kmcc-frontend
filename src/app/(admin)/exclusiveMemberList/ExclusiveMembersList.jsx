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
  Container,
  Table,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ExclusiveMembers = () => {
  const [members, setMembers] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/exclusive-members");
      if (response.status === 200) {
        setMembers(response.data.data.members);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setToastMessage("Failed to fetch members");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (memberId) => {
    setSelectedMemberId(memberId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedMemberId(null);
  };

  const handleDeleteMember = async () => {
    if (!selectedMemberId) return;

    try {
      const response = await axiosInstance.delete(
        `/exclusive-members/${selectedMemberId}`
      );
      if (response.status === 200) {
        setMembers((prev) => prev.filter((m) => m.id !== selectedMemberId));
        setToastMessage("Member deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting member:", error);
      setToastMessage("Failed to delete member");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(members);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for responsive UI
    setMembers(items);

    // Prepare the new order of member IDs
    const memberIds = items.map((m) => m.id);

    try {
      // Send the new order to the backend
      const response = await axiosInstance.post(
        "/exclusive-members/reorder-members",
        { memberIds }
      );

      if (response.status !== 200) {
        throw new Error("Failed to save new order");
      }

      setToastMessage("Member order updated successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error reordering members:", error);
      // Revert to previous state if API call fails
      fetchMembers();
      setToastMessage("Failed to update member order.");
      setShowToast(true);
    }
  };

  return (
    <Container className="p-4">
      <PageTitle title="Exclusive Members" />

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
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="button"
                  variant="dark"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                  as={Link}
                  to="/exclusive-members/new"
                >
                  New Member
                </Button>
              </Col>
            </Row>

            {loading ? (
              <p className="text-center mt-3">Loading members...</p>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="members">
                  {(provided) => (
                    <Table
                      striped
                      bordered
                      hover
                      responsive
                      className="mt-3 text-center"
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.map((member, idx) => (
                          <Draggable
                            key={member.id}
                            draggableId={String(member.id)}
                            index={idx}
                          >
                            {(provided) => (
                              <tr
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <td>
                                  <div className="d-flex align-items-center">
                                    <IconifyIcon
                                      icon="mdi:drag"
                                      className="me-2"
                                    />
                                    {idx + 1}
                                  </div>
                                </td>
                                <td>
                                  {member.image && (
                                    <img
                                      src={member.image}
                                      alt={member.name}
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                      }}
                                    />
                                  )}
                                </td>
                                <td>{member.name}</td>
                                <td>{member.position}</td>
                                <td>
                                  <div className="d-flex justify-content-center gap-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      as={Link}
                                      to={`/exclusive-members/edit/${member.id}`}
                                    >
                                      <IconifyIcon
                                        icon="mdi:pencil"
                                        color="white"
                                      />
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() =>
                                        handleDeleteClick(member.id)
                                      }
                                    >
                                      <IconifyIcon
                                        icon="ri:delete-bin-4-fill"
                                        color="white"
                                      />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </tbody>
                    </Table>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this member? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteMember}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ExclusiveMembers;
