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

  useEffect(() => {
    if (!id) return;

    const fetchEvent = async () => {
      try {
        const response = await axiosInstance.get(`/admin/events/${id}`);
        if (response.status === 200) {
          const event = response.data.data;

          const [startTimeStr, endTimeStr] = event.timing.split(" - ");
          const startTime = convertTimeTo24Hour(startTimeStr);
          const endTime = convertTimeTo24Hour(endTimeStr);

          setFormData({
            title: event.title,
            place: event.place,
            eventType: event.eventType || "",
            eventDate: new Date(event.eventDate).toISOString().split("T")[0],
            startTime,
            endTime,
            highlights: event.highlights || [""],
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

  const convertTimeTo24Hour = (timeStr) => {
    if (!timeStr) return "";

    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }

    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}`;
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
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      setToastMessage(`Failed to ${id ? "update" : "create"} event`);
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
                      <Form.Label>Event Image (362x472)</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <Form.Text className="text-muted">
                        {id
                          ? "Upload new image to replace existing one"
                          : "Upload event image"}
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
                      <Form.Label>Event Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Enter event title"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Place</Form.Label>
                      <Form.Control
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleInputChange}
                        placeholder="Enter event place"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Event Type</Form.Label>
                      <Form.Control
                        as="select"
                        name="eventType"
                        value={formData.eventType}
                        onChange={handleInputChange}
                      >
                        <option value="">Select event type</option>
                        <option value="meeting">Meeting</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="social">Social Gathering</option>
                        <option value="other">Other</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Highlights</Form.Label>
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
