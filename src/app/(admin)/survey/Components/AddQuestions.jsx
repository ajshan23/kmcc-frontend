import Cropper from "react-cropper";
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
import "cropperjs/dist/cropper.css";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const AddQuestions = () => {
  const navigate = useNavigate();
  const { id, questionId } = useParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropData, setCropData] = useState({
    cropX: 0,
    cropY: 0,
    imageWidth: 0,
    imageHeight: 0,
    imageRotate: 0,
    scaleX: 0,
    scaleY: 0,
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [text, setText] = useState("");
  const [type, setType] = useState("text");
  const [options, setOptions] = useState([""]);
  const [position, setPosition] = useState(0);
  const cropperRef = useRef(null);
  const bannerAspectRatio = 400 / 400;

  useEffect(() => {
    if (questionId) {
      setIsEditMode(true);
      fetchQuestionData();
    } else {
      // For new questions, set position to the end
      fetchQuestionCount();
    }
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
      if (question.type === "multiple_choice" && question.options) {
        setOptions(question.options);
      }
      if (question.image) {
        setImageSrc(question.image);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const fetchQuestionCount = async () => {
    try {
      const response = await axiosInstance.get(
        `/survey/surveys/${id}/questions`
      );
      if (response.status === 200) {
        // Set position to the count of existing questions (will be last)
        setPosition(response.data.data.questions.length);
      }
    } catch (error) {
      console.error("Error fetching question count:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const data = cropper.getData();
      const imageData = cropper.getImageData();
      setCropData({
        cropX: Math.ceil(data.x),
        cropY: Math.ceil(data.y),
        imageWidth: Math.ceil(imageData.width),
        imageHeight: Math.ceil(imageData.height),
        imageRotate: Math.ceil(imageData.rotate),
        scaleX: Math.ceil(imageData.scaleX),
        scaleY: Math.ceil(imageData.scaleY),
      });

      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  const addOptionsField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionsField = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    setOptions(updatedOptions);
  };

  const updateOptionsField = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert("Question text is required.");
      return;
    }

    if (type === "multiple_choice" && options.some((opt) => !opt.trim())) {
      alert("All options must be filled.");
      return;
    }

    const file = croppedImage
      ? new File([croppedImage], "question-image.png", {
          type: "image/png",
        })
      : null;

    const formData = new FormData();
    formData.append("surveyId", id);
    if (file) formData.append("image", file);
    formData.append("text", text);
    formData.append("type", type);
    formData.append("position", position.toString());

    if (type === "multiple_choice") {
      formData.append(
        "options",
        JSON.stringify(options.filter((h) => h.trim() !== ""))
      );
    }

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(
          `/survey/question/${questionId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axiosInstance.post("/survey/question", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200) {
        setShowToast(true);
        setTimeout(() => {
          navigate(`/questions/${id}`);
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(`Failed to ${isEditMode ? "update" : "create"} question.`);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Question" : "New Question"} />

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
        <ToastBody>
          Question {isEditMode ? "updated" : "created"} successfully.
        </ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Question Image (400x400)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

                  {imageSrc && (
                    <>
                      <div className="img-container">
                        <Cropper
                          src={imageSrc}
                          style={{ height: 400, width: "100%" }}
                          initialAspectRatio={bannerAspectRatio}
                          aspectRatio={bannerAspectRatio}
                          guides={false}
                          crop={onCrop}
                          ref={cropperRef}
                          rotatable
                          scalable
                          zoomable
                        />
                      </div>

                      <Card>
                        <CardBody>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.zoom(0.1)
                              }
                            >
                              <IconifyIcon icon="mdi:magnify-plus-outline" />{" "}
                              Zoom In
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.zoom(-0.1)
                              }
                            >
                              <IconifyIcon icon="mdi:magnify-minus-outline" />{" "}
                              Zoom Out
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.rotate(-45)
                              }
                            >
                              <IconifyIcon icon="mdi:rotate-left" /> Rotate Left
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.rotate(45)
                              }
                            >
                              <IconifyIcon icon="mdi:rotate-right" /> Rotate
                              Right
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.reset()
                              }
                            >
                              <IconifyIcon icon="mdi:sync" /> Reset
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.clear()
                              }
                            >
                              <IconifyIcon icon="mdi:close" /> Clear
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </Col>

                <Col lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Question Text</Form.Label>
                    <Form.Control
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter question"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Question Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="multiple_choice">Multiple Choice</option>
                    </Form.Control>
                  </Form.Group>

                  {isEditMode && (
                    <Form.Group className="mb-3">
                      <Form.Label>Position</Form.Label>
                      <Form.Control
                        type="number"
                        value={position}
                        onChange={(e) =>
                          setPosition(parseInt(e.target.value) || 0)
                        }
                        min="0"
                      />
                    </Form.Group>
                  )}

                  {type === "multiple_choice" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Options</Form.Label>
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
                        <IconifyIcon icon="mdi:plus" /> Add Options
                      </Button>
                    </Form.Group>
                  )}

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={
                      !text.trim() ||
                      (type === "multiple_choice" &&
                        options.some((opt) => !opt.trim()))
                    }
                  >
                    <IconifyIcon
                      icon={isEditMode ? "mdi:pencil" : "mdi:plus"}
                    />
                    {isEditMode ? "Update Question" : "Create Question"}
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

export default AddQuestions;
