import {
  Card,
  CardBody,
  Col,
  FormControl,
  Row,
  Form,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
} from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import axiosInstance from "../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const SubWingForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState(""); // New state for description
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [mainColor, setMainColor] = useState("#000000");
  const [icon, setIcon] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchSubWing = async () => {
        try {
          const response = await axiosInstance.get(`/sub-wing/${id}`);
          if (response.status === 200) {
            const subWing = response.data.data;
            setName(subWing.name);
            setDescription(subWing.description || ""); // Set description
            setBackgroundColor(subWing.backgroundColor);
            setMainColor(subWing.mainColor);
            setIconPreview(subWing.icon);
          }
        } catch (error) {
          console.error("Error fetching sub-wing:", error);
          setToastMessage("Failed to load sub-wing data");
          setShowToast(true);
        }
      };
      fetchSubWing();
    }
  }, [id, isEditMode]);

  const handleIconChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate SVG file
      if (file.type !== "image/svg+xml") {
        setToastMessage("Only SVG files are allowed for the icon");
        setShowToast(true);
        return;
      }

      setIcon(file);
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name) {
      setToastMessage("Sub-wing name is required");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description); // Add description to form data
    formData.append("backgroundColor", backgroundColor);
    formData.append("mainColor", mainColor);
    if (icon) {
      formData.append("icon", icon);
    }

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/sub-wing/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.post("/sub-wing", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `Sub-wing ${isEditMode ? "updated" : "created"} successfully!`
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/sub-wing");
        }, 1500);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} sub-wing:`,
        error
      );
      setToastMessage(
        `Failed to ${
          isEditMode ? "update" : "create"
        } sub-wing. Please try again.`
      );
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Sub-Wing" : "Create Sub-Wing"} />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">KMCC</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Sub-Wing Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter sub-wing name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter sub-wing description (optional)"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Background Color *</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          style={{ width: "60px", height: "40px" }}
                        />
                        <Form.Control
                          type="text"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="ms-2"
                          placeholder="#FFFFFF"
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Main Color *</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={mainColor}
                          onChange={(e) => setMainColor(e.target.value)}
                          style={{ width: "60px", height: "40px" }}
                        />
                        <Form.Control
                          type="text"
                          value={mainColor}
                          onChange={(e) => setMainColor(e.target.value)}
                          className="ms-2"
                          placeholder="#000000"
                          required
                        />
                      </div>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Icon (SVG only)</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/svg+xml"
                        onChange={handleIconChange}
                      />
                      <Form.Text className="text-muted">
                        Optional SVG icon for the sub-wing
                      </Form.Text>
                      {iconPreview && (
                        <div className="mt-3">
                          <p>Preview:</p>
                          <img
                            src={iconPreview}
                            alt="Icon preview"
                            style={{ height: "100px" }}
                          />
                        </div>
                      )}
                    </Form.Group>

                    <div className="mt-4">
                      <h5>Color Preview</h5>
                      <div
                        style={{
                          backgroundColor,
                          color: mainColor,
                          padding: "20px",
                          borderRadius: "8px",
                          border: `1px solid ${mainColor}`,
                        }}
                      >
                        <p className="mb-0">
                          This is how your sub-wing colors will look together.
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/sub-wing")}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditMode ? (
                      "Update Sub-Wing"
                    ) : (
                      "Create Sub-Wing"
                    )}
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

export default SubWingForm;
