import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Form,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
  Row,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const GoldProgramForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (id) {
      const fetchProgram = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/gold/${id}`);
          if (response.status === 200) {
            setFormData({
              name: response.data.data.name,
              description: response.data.data.description || "",
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error fetching program:", error);
          setToastMessage("Failed to load program data.");
          setShowToast(true);
          navigate("/gold-programs");
        } finally {
          setLoading(false);
        }
      };
      fetchProgram();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      setToastMessage("Program name is required");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEditing ? `/gold/${id}` : "/gold/start";
      const method = isEditing ? "put" : "post";

      const response = await axiosInstance[method](endpoint, formData);

      setToastMessage(
        isEditing
          ? "Program updated successfully"
          : "Program started successfully"
      );
      setShowToast(true);
      setTimeout(() => navigate("/gold-programs"), 1500);
    } catch (error) {
      console.error("Error:", error);
      setToastMessage(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "start"} program`
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditing ? "Edit Gold Program" : "New Gold Program"} />
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">GOLD PROGRAM</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Program Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Gold Investment 2024"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Program details..."
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/gold-programs")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    <IconifyIcon icon={isEditing ? "mdi:pencil" : "mdi:plus"} />{" "}
                    {loading
                      ? "Processing..."
                      : isEditing
                      ? "Update"
                      : "Start Program"}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default GoldProgramForm;
