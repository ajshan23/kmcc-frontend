import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cropper from "react-cropper";
import {
  Card,
  CardBody,
  Col,
  Form,
  Row,
  Button,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import axiosInstance from "../../../../globalFetch/api";
import PageTitle from "../../../../components/PageTitle";
import "cropperjs/dist/cropper.css";

const EventForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const cropperRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    place: "",
    eventType: "",
    eventDate: "",
    startTime: "",
    endTime: "",
    highlights: [""],
  });

  const bannerAspectRatio = 362 / 472;

  const convertTimeTo24Hour = (timeStr) => {
    if (!timeStr) return "";

    try {
      // Handle both "HH:MM AM/PM" and "HH:MM" formats
      if (timeStr.includes("AM") || timeStr.includes("PM")) {
        const [time, modifier] = timeStr.split(" ");
        let [hours, minutes] = time.split(":");

        if (modifier === "PM" && hours !== "12") {
          hours = parseInt(hours, 10) + 12;
        } else if (modifier === "AM" && hours === "12") {
          hours = "00";
        }

        return `${hours.padStart(2, "0")}:${minutes}`;
      }

      // If already in 24-hour format
      return timeStr;
    } catch (e) {
      console.error("Error converting time:", e);
      return "";
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/admin/events/${id}`);
        if (response.status === 200) {
          const event = response.data.data.event; // Access nested event object

          // Fix date handling
          let eventDate;
          try {
            eventDate = new Date(event.eventDate);
            if (isNaN(eventDate.getTime())) {
              // Handle invalid date
              eventDate = new Date(); // fallback to current date
            }
          } catch (e) {
            eventDate = new Date(); // fallback to current date
          }

          const [startTimeStr, endTimeStr] = event.timing?.split(" - ") || [
            "",
            "",
          ];
          const startTime = convertTimeTo24Hour(startTimeStr);
          const endTime = convertTimeTo24Hour(endTimeStr);

          setFormData({
            title: event.title || "",
            place: event.place || "",
            eventType: event.eventType || "",
            eventDate: eventDate.toISOString().split("T")[0],
            startTime: startTime || "",
            endTime: endTime || "",
            highlights: Array.isArray(event.highlights)
              ? event.highlights.filter((h) => h)
              : [""],
          });

          if (event.image) {
            setImageSrc(event.image);
          }
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setToastMessage("Failed to load event data");
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match("image.*")) {
      setToastMessage("Please upload an image file");
      setShowToast(true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setValidationErrors((prev) => ({ ...prev, image: null }));
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationErrors((prev) => ({ ...prev, [name]: null }));
  };

  const addHighlightField = () => {
    setFormData((prev) => ({
      ...prev,
      highlights: [...prev.highlights, ""],
    }));
  };

  const removeHighlightField = (index) => {
    const updatedHighlights = formData.highlights.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      highlights: updatedHighlights,
    }));
  };

  const updateHighlightField = (index, value) => {
    const updatedHighlights = [...formData.highlights];
    updatedHighlights[index] = value;
    setFormData((prev) => ({
      ...prev,
      highlights: updatedHighlights,
    }));
    setValidationErrors((prev) => ({ ...prev, highlights: null }));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!formData.title.trim()) {
      errors.title = "Event title is required";
      isValid = false;
    }

    if (!formData.place.trim()) {
      errors.place = "Event place is required";
      isValid = false;
    }

    if (!formData.eventType) {
      errors.eventType = "Event type is required";
      isValid = false;
    }

    if (!formData.eventDate) {
      errors.eventDate = "Event date is required";
      isValid = false;
    }

    if (!formData.startTime) {
      errors.startTime = "Start time is required";
      isValid = false;
    }

    if (!formData.endTime) {
      errors.endTime = "End time is required";
      isValid = false;
    }

    // Validate time sequence
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);
      if (start >= end) {
        errors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    // Validate highlights
    if (
      formData.highlights.length === 0 ||
      formData.highlights.some((h) => !h.trim())
    ) {
      errors.highlights = "All highlights must be filled";
      isValid = false;
    }

    // Validate image for new events
    if (!id && !croppedImage && !imageSrc) {
      errors.image = "Event image is required";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      setToastMessage("Please fill all required fields correctly");
      setShowToast(true);
      return;
    }

    try {
      const formDataToSend = new FormData();

      if (croppedImage) {
        formDataToSend.append("image", croppedImage);
      }

      const formatTime = (time) => {
        const [hours, minutes] = time.split(":");
        const parsedHours = parseInt(hours, 10);
        const ampm = parsedHours >= 12 ? "PM" : "AM";
        const formattedHours = parsedHours % 12 || 12;
        return `${formattedHours}:${minutes} ${ampm}`;
      };

      const timing = `${formatTime(formData.startTime)} - ${formatTime(
        formData.endTime
      )}`;

      if (id) formDataToSend.append("id", id);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("place", formData.place);
      formDataToSend.append("eventType", formData.eventType);
      formDataToSend.append("eventDate", formData.eventDate);
      formDataToSend.append("timing", timing);
      formDataToSend.append(
        "highlights",
        JSON.stringify(formData.highlights.filter((h) => h.trim() !== ""))
      );

      const response = await axiosInstance.post(
        id ? `/admin/events/${id}` : "/admin/create-event",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setToastMessage(
          id ? "Event updated successfully!" : "Event created successfully!"
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/event");
        }, 2000);
      }
    } catch (error) {
      console.error("Error saving event:", error);
      setToastMessage(
        `Failed to ${id ? "update" : "create"} event: ${
          error.response?.data?.message || error.message
        }`
      );
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <>
      <PageTitle title={id ? "Edit Event" : "Create Event"} />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Notification</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col lg={9}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Event Image (362x472){" "}
                        {!id && <span className="text-danger">*</span>}
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        isInvalid={!!validationErrors.image}
                        required={!id ? !imageSrc : false}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.image}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        {id
                          ? "Upload new image to replace existing one"
                          : "Upload event image (required)"}
                      </Form.Text>
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

                        <Card className="mt-3">
                          <CardBody>
                            <div className="d-flex gap-2 flex-wrap">
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.zoom(0.1)
                                }
                              >
                                Zoom In
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.zoom(-0.1)
                                }
                              >
                                Zoom Out
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.rotate(-45)
                                }
                              >
                                Rotate Left
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.rotate(45)
                                }
                              >
                                Rotate Right
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.reset()
                                }
                              >
                                Reset
                              </Button>
                              <Button
                                variant="outline-secondary"
                                onClick={() =>
                                  cropperRef.current?.cropper.clear()
                                }
                              >
                                Clear
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </>
                    )}
                  </Col>

                  <Col lg={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        Event Title <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                        isInvalid={!!validationErrors.title}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.title}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Place <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        placeholder="Enter event place"
                        required
                        isInvalid={!!validationErrors.place}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.place}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Event Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!validationErrors.eventType}
                      >
                        <option value="">Select event type</option>
                        <option value="meeting">Meeting</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="social">Social Gathering</option>
                        <option value="other">Other</option>
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.eventType}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Date <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!validationErrors.eventDate}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.eventDate}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Start Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!validationErrors.startTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.startTime}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        End Time <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                        isInvalid={!!validationErrors.endTime}
                      />
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.endTime}
                      </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>
                        Highlights <span className="text-danger">*</span>
                      </Form.Label>
                      {formData.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="d-flex align-items-center mb-2"
                        >
                          <Form.Control
                            type="text"
                            value={highlight}
                            onChange={(e) =>
                              updateHighlightField(index, e.target.value)
                            }
                            placeholder={`Highlight ${index + 1}`}
                            required
                            isInvalid={!!validationErrors.highlights}
                          />
                          <Button
                            variant="danger"
                            className="ms-2"
                            onClick={() => removeHighlightField(index)}
                            disabled={formData.highlights.length === 1}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                      <Form.Control.Feedback type="invalid">
                        {validationErrors.highlights}
                      </Form.Control.Feedback>
                      <Button
                        variant="secondary"
                        className="w-100"
                        onClick={addHighlightField}
                      >
                        Add Highlight
                      </Button>
                    </Form.Group>

                    <div className="d-grid gap-2">
                      <Button
                        variant="primary"
                        type="submit"
                        className="mt-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                            {id ? " Updating..." : " Creating..."}
                          </>
                        ) : id ? (
                          "Update Event"
                        ) : (
                          "Create Event"
                        )}
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => navigate("/event")}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default EventForm;
