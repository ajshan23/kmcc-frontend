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
  Spinner,
} from "react-bootstrap";
import { useRef, useState, useEffect } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "cropperjs/dist/cropper.css";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [startingTime, setStartingTime] = useState("");
  const [stoppingTime, setStoppingTime] = useState("");
  const [availableDays, setAvailableDays] = useState("Mon-Fri");
  const cropperRef = useRef(null);

  const bannerAspectRatio = 123 / 137;

  const daysOptions = [
    { label: "Monday to Friday", value: "Mon-Fri" },
    { label: "Monday to Saturday", value: "Mon-Sat" },
    { label: "Everyday", value: "Everyday" },
    { label: "Custom", value: "Custom" },
  ];

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/services/${id}`);
      const service = response.data.data;

      setTitle(service.title);
      setLocation(service.location);
      setPhoneNumber(service.phoneNumber);
      setStartingTime(service.startingTime);
      setStoppingTime(service.stoppingTime);
      setAvailableDays(service.availableDays);
      if (service.image) {
        setImageSrc(service.image);
      }
    } catch (error) {
      console.error("Error fetching service:", error);
      setToastMessage("Failed to load service data");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToastMessage("Please upload a valid image file.");
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
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !title ||
      !location ||
      !startingTime ||
      !stoppingTime ||
      !availableDays
    ) {
      setToastMessage("Please fill all required fields.");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("location", location);
    formData.append("startingTime", startingTime);
    formData.append("stoppingTime", stoppingTime);
    formData.append("availableDays", availableDays);
    formData.append("phoneNumber", phoneNumber);

    if (croppedImage) {
      const fileName = `service-image-${Date.now()}.png`;
      const file = new File([croppedImage], fileName, { type: "image/png" });
      formData.append("image", file);
    }

    try {
      let response;
      if (isEditing) {
        response = await axiosInstance.put(`/services/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.post("/services/new", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === 200 || response.status === 201) {
        setToastMessage(
          isEditing
            ? "Service updated successfully!"
            : "Service created successfully!"
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/service");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving service:", error);
      setToastMessage(
        isEditing ? "Failed to update service." : "Failed to create service."
      );
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditing ? "Edit Service" : "New Service"} />

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
                    <Form.Label>Service Image (123x137)</Form.Label>
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
                    <Form.Label>Service Title*</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter service title"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Location*</Form.Label>
                    <Form.Control
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter service location"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Start Time*</Form.Label>
                    <Form.Control
                      type="time"
                      value={startingTime}
                      onChange={(e) => setStartingTime(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>End Time*</Form.Label>
                    <Form.Control
                      type="time"
                      value={stoppingTime}
                      onChange={(e) => setStoppingTime(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Available Days*</Form.Label>
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

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button
                      variant="primary"
                      onClick={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      ) : (
                        <IconifyIcon
                          icon={isEditing ? "mdi:content-save" : "mdi:plus"}
                          className="me-2"
                        />
                      )}
                      {isEditing ? "Update Service" : "Create Service"}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate("/service")}
                    >
                      Cancel
                    </Button>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ServiceForm;
