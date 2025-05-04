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
  Alert,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const UpdateQuestion = () => {
  const navigate = useNavigate();
  const { questionId } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);
  const [text, setText] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState([""]);
  const [position, setPosition] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    if (!questionId) {
      navigate(-1);
      return;
    }
    fetchQuestionData();
  }, [questionId]);

  const fetchQuestionData = async () => {
    try {
      const response = await axiosInstance.get(
        `/survey/question/${questionId}`
      );
      const question = response.data.data.question;
      setText(question.text);
      setType(question.type);
      setPosition(question.position);

      // Safely handle options initialization
      if (question.type === "multiple_choice") {
        setOptions(question.options || [""]);
      } else {
        setOptions([""]);
      }

      if (question.image) {
        setImagePreview(question.image);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setError("Failed to load question data");
    }
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    // Reset options when switching to text type
    if (newType === "text") {
      setOptions([""]);
    } else if (newType === "multiple_choice" && options.length === 0) {
      // Initialize with at least one option if empty
      setOptions([""]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const addOptionsField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionsField = (index) => {
    if (options.length > 1) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
    }
  };

  const updateOptionsField = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError("Question text is required");
      return;
    }

    if (type === "multiple_choice" && options.some((opt) => !opt.trim())) {
      setError("All options must be filled");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("text", text);
    formData.append("type", type);
    formData.append("position", position.toString());

    if (newImage) {
      formData.append("image", newImage);
    }

    if (type === "multiple_choice") {
      formData.append(
        "options",
        JSON.stringify(options.filter((opt) => opt.trim() !== ""))
      );
    }

    try {
      const response = await axiosInstance.put(
        `/survey/question/${questionId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setShowToast(true);
        setTimeout(() => {
          navigate(-1);
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setError("Failed to update question. Please try again.");
    }
  };

  return (
    <>
      <PageTitle title="Edit Question" />

      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

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
        <ToastBody>Question updated successfully.</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>Update Question Image (Optional)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Form.Group>

                  {imagePreview && (
                    <div className="mb-3">
                      <img
                        src={imagePreview}
                        alt="Question Preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: "300px",
                          borderRadius: "5px",
                        }}
                      />
                    </div>
                  )}
                </Col>

                <Col lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text *</Form.Label>
                    <Form.Control
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter question"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Question Position *</Form.Label>
                    <Form.Control
                      type="number"
                      value={position}
                      onChange={(e) =>
                        setPosition(parseInt(e.target.value) || 0)
                      }
                      min="0"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Question Type *</Form.Label>
                    <Form.Control
                      as="select"
                      value={type}
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                    </Form.Control>
                  </Form.Group>

                  {type === "multiple_choice" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Options *</Form.Label>
                      {options.map((option, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <Form.Control
                            type="text"
                            value={option}
                            onChange={(e) =>
                              updateOptionsField(index, e.target.value)
                            }
                            placeholder={`Option ${index + 1}`}
                            required
                          />
                          <Button
                            variant="danger"
                            className="ms-2"
                            onClick={() => removeOptionsField(index)}
                            disabled={options.length <= 1}
                          >
                            <IconifyIcon icon="mdi:delete" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="secondary"
                        className="w-100"
                        onClick={addOptionsField}
                      >
                        <IconifyIcon icon="mdi:plus" /> Add Option
                      </Button>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleSubmit}
                  >
                    <IconifyIcon icon="mdi:pencil" /> Update Question
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UpdateQuestion;
