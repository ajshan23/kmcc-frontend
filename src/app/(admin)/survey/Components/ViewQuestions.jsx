import PageTitle from "../../../../components/PageTitle";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../globalFetch/api";
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
import smLogo from "../../../../assets/images/logo-sm.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ViewQuestions = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!id) navigate("/survey");
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/survey/surveys/${id}/questions`
      );
      if (response.status === 200) {
        // Sort questions by position before setting state
        const sortedQuestions = response.data.data.questions.sort(
          (a, b) => a.position - b.position
        );
        setQuestions(sortedQuestions);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
    setLoading(false);
  };

  const handleDeleteClick = (questionId) => {
    setSelectedQuestionId(questionId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedQuestionId(null);
  };

  const handleDeleteQuestion = async () => {
    if (!selectedQuestionId) return;

    setQuestions((prev) => prev.filter((q) => q.id !== selectedQuestionId));

    try {
      const response = await axiosInstance.delete(
        `/survey/question/${selectedQuestionId}`
      );
      if (response.status !== 200) throw new Error("Failed to delete");
      setToastMessage("Question deleted successfully!");
    } catch (error) {
      console.error("Error deleting question:", error);
      setToastMessage("Failed to delete question.");
      fetchQuestions();
    } finally {
      setShowToast(true);
      handleDeleteModalClose();
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for responsive UI
    setQuestions(items);

    // Prepare the new order of question IDs
    const questionIds = items.map((q) => q.id);

    try {
      // Send the new order to the backend
      const response = await axiosInstance.post(
        `/survey/surveys/${id}/reorder-questions`,
        { questionIds }
      );

      if (response.status !== 200) {
        throw new Error("Failed to save new order");
      }

      setToastMessage("Question order updated successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error reordering questions:", error);
      // Revert to previous state if API call fails
      fetchQuestions();
      setToastMessage("Failed to update question order.");
      setShowToast(true);
    }
  };

  return (
    <Container className="p-4">
      <PageTitle title="Questions" />

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
                  variant="dark"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                  to={`/add/questions/${id}`}
                  as={Link}
                >
                  New Questions
                </Button>
              </Col>
            </Row>

            {loading ? (
              <p className="text-center mt-3">Loading questions...</p>
            ) : (
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
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
                          <th>Type</th>
                          <th>Text</th>
                          <th>Image</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {questions.map((qstn, idx) => (
                          <Draggable
                            key={qstn.id}
                            draggableId={String(qstn.id)}
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
                                <td>{qstn.type}</td>
                                <td>{qstn.text}</td>
                                <td>
                                  {qstn.image ? (
                                    <img
                                      src={qstn.image}
                                      alt="Question"
                                      style={{
                                        width: "50px",
                                        height: "auto",
                                        borderRadius: 2,
                                      }}
                                    />
                                  ) : (
                                    "N/A"
                                  )}
                                </td>
                                <td style={{ verticalAlign: "middle" }}>
                                  <div className="d-flex justify-content-center gap-2">
                                    <Button
                                      variant="primary"
                                      size="sm"
                                      onClick={() =>
                                        navigate(`/question/edit/${qstn.id}`)
                                      }
                                    >
                                      <IconifyIcon
                                        icon="mdi:pencil"
                                        color="white"
                                      />
                                    </Button>
                                    <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteClick(qstn.id)}
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
          <Modal.Title>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this question? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteQuestion}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ViewQuestions;
