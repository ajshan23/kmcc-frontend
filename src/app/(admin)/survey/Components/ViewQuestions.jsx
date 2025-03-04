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
        setQuestions(response.data.data.questions);
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

    // Optimistic update
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
      fetchQuestions(); // Re-fetch data if deletion failed
    } finally {
      setShowToast(true);
      handleDeleteModalClose();
    }
  };

  return (
    <Container className="p-4">
      <PageTitle title="Questions" />

      {/* Toast Notification */}
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
              <Table
                striped
                bordered
                hover
                responsive
                className="mt-3 text-center"
              >
                <thead>
                  <tr>
                    <th>Survey Id</th>
                    <th>Type</th>
                    <th>Text</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((qstn, idx) => (
                    <tr key={idx}>
                      <td>{qstn.surveyId}</td>
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
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteClick(qstn.id)}
                        >
                          <IconifyIcon
                            color="white"
                            icon="ri:delete-bin-4-fill"
                          />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
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
