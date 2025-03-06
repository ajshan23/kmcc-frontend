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
import { useRef, useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "cropperjs/dist/cropper.css";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const ServiceCreate = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
  const [title, setTitle] = useState("");
  const [place, setPlace] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [availableDays, setAvailableDays] = useState("Mon-Fri"); // Default value for dropdown
  const cropperRef = useRef(null);

  const bannerAspectRatio = 123 / 137;

  // Predefined options for available days
  const daysOptions = [
    { label: "Monday to Friday", value: "Mon-Fri" },
    { label: "Monday to Saturday", value: "Mon-Sat" },
    { label: "Everyday", value: "Everyday" },
    { label: "Custom", value: "Custom" }, // Add custom logic if needed
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToastMessage("Please upload a valid image file.");
      setShowToast(true);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToastMessage("File size must be less than 5MB.");
      setShowToast(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.readAsDataURL(file);
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

  const handleUpload = async () => {
    if (!croppedImage) {
      setToastMessage("Please crop the image first.");
      setShowToast(true);
      return;
    }

    if (
      !title ||
      !place ||
      !startTime ||
      !endTime ||
      !phoneNumber ||
      !availableDays
    ) {
      setToastMessage("Please fill all required fields.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const fileName = `service-image-${Date.now()}.png`;
    const file = new File([croppedImage], fileName, { type: "image/png" });

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("location", place);
    formData.append("startingTime", startTime); // Use startingTime
    formData.append("stoppingTime", endTime); // Use stoppingTime
    formData.append("phoneNumber", phoneNumber);
    formData.append("availableDays", availableDays); // Use selected availableDays

    const logFormData = (formData) => {
      const data = {};
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }
      console.log(data);
    };

    logFormData(formData);

    try {
      const response = await axiosInstance.post("/services/new", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setToastMessage("Service created successfully!");
        setShowToast(true);
        setTimeout(() => {
          navigate("/service");
        }, 2000);
      } else {
        setToastMessage("Failed to create service.");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error creating service:", error);
      if (error.response) {
        setToastMessage(
          error.response.data.message || "Failed to create service."
        );
      } else if (error.request) {
        setToastMessage("Network error. Please check your connection.");
      } else {
        setToastMessage("An unexpected error occurred.");
      }
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="New service" />

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
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Service Image (123x137)</Form.Label>
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
                    <Form.Label>Service Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter service title"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Place</Form.Label>
                    <Form.Control
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="Enter service place"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Available Days</Form.Label>
                    <Form.Select
                      value={availableDays}
                      onChange={(e) => setAvailableDays(e.target.value)}
                    >
                      {daysOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!croppedImage || isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Service"}
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

export default ServiceCreate;
