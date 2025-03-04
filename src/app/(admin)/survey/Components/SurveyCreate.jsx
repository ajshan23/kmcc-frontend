import {
  Card,
  CardBody,
  Col,
  Row,
  Form,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
} from "react-bootstrap";
import { useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const SurveyCreate = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    try {
      const response = await axiosInstance.post("/survey", formData);
      if (response.status === 201) {
        handleToast("Survey created successfully!");
        setTimeout(() => navigate("/survey"), 2000);
      } else {
        handleToast(response.data?.message || "Failed to create survey.");
      }
    } catch (error) {
      handleToast(
        error.response?.data?.message ||
          "Error creating survey. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="New Survey" />

      {/* Toast Notification */}
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={2000}
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
          <Card>
            <CardBody>
              <Row className="p-10">
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter description"
                  />
                </Form.Group>
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleUpload}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Creating..."
                  ) : (
                    <>
                      <IconifyIcon icon="mdi:upload" /> Create Survey
                    </>
                  )}
                </Button>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SurveyCreate;
