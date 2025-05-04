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

const Survey = () => {
  const [survey, setSurvey] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const response = await axiosInstance.get("/survey");
      if (response.status === 200) {
        setSurvey(response.data.data.surveys);
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
    }
  };

  const handleDeleteClick = (surveyId) => {
    setSelectedSurveyId(surveyId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedSurveyId(null);
  };

  const handleDeleteSurvey = async () => {
    if (!selectedSurveyId) return;

    try {
      const response = await axiosInstance.delete(
        `/survey/${selectedSurveyId}`
      );
      if (response.status === 200) {
        setSurvey((prevSurveys) =>
          prevSurveys.filter((srvy) => srvy.id !== selectedSurveyId)
        );
        setToastMessage("Survey deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting survey:", error);
      setToastMessage("Failed to delete survey.");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  return (
    <Container className="p-4">
      <PageTitle title="Survey" />

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
            className="p-3 bg-white border rounded"
            style={{ width: "70vw" }}
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
                  as={Link}
                  to="/survey/new"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                >
                  New Survey
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <Table
                striped
                bordered
                hover
                responsive
                className="mt-3 text-center"
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Title</th>
                    <th style={{ textAlign: "center" }}>Description</th>
                    <th style={{ textAlign: "center" }}>Questions</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {survey.map((srvy, idx) => (
                    <tr key={idx}>
                      <td style={{ verticalAlign: "middle" }}>{srvy.title}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        {srvy.description || "N/A"}
                      </td>
                      <td>
                        <Button
                          className="m-2"
                          variant="light"
                          style={{
                            backgroundColor: "white",
                            padding: "5px 20px",
                            borderRadius: 10,
                          }}
                          as={Link}
                          to={`/questions/${srvy.id}`}
                        >
                          View
                        </Button>
                        <Button
                          variant="light"
                          style={{
                            backgroundColor: "white",
                            padding: "5px 20px",
                            borderRadius: 10,
                          }}
                          as={Link}
                          to={`/add/questions/${srvy.id}`}
                        >
                          Add
                        </Button>
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Button
                          variant="info"
                          className="me-2"
                          as={Link}
                          to={`/survey/answers/${srvy.id}`}
                        >
                          <IconifyIcon color="white" icon="mdi:eye-outline" />
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDeleteClick(srvy.id)}
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
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Survey</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this survey? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteSurvey}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Survey;
