import Cropper from 'react-cropper';
import { Card, CardBody, Col, FormControl, Row, Form, Button, Toast, ToastHeader, ToastBody } from 'react-bootstrap';
import { useRef, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import 'cropperjs/dist/cropper.css';
import axiosInstance from '../../../../globalFetch/api';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../../../../components/PageTitle';
import smLogo from '@/assets/images/logo-sm.png';

const EventCreate = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // State to control Toast visibility
  const [imageSrc, setImageSrc] = useState(null); // State for uploaded image
  const [cropData, setCropData] = useState({
    cropX: 0,
    cropY: 0,
    imageWidth: 0,
    imageHeight: 0,
    imageRotate: 0,
    scaleX: 0,
    scaleY: 0,
  });
  const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
  const [title, setTitle] = useState(''); // State for event title
  const [place, setPlace] = useState(''); // State for event place
  const [eventType, setEventType] = useState(''); // State for event type
  const [date, setDate] = useState(''); // State for date
  const [startTime, setStartTime] = useState(''); // State for start time
  const [endTime, setEndTime] = useState(''); // State for end time
  const [highlights, setHighlights] = useState(['']); // State for highlights (array of strings)
  const cropperRef = useRef(null);

  // Fixed aspect ratio for event (362x472)
  const bannerAspectRatio = 362 / 472;

  // Handle image upload
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

  // Handle crop event
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

      // Get the cropped image as a blob
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  // Handle adding a new highlight field
  const addHighlightField = () => {
    setHighlights([...highlights, '']); // Add an empty string to the highlights array
  };

  // Handle removing a highlight field
  const removeHighlightField = (index) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index); // Remove the highlight at the specified index
    setHighlights(updatedHighlights);
  };

  // Handle updating a highlight field
  const updateHighlightField = (index, value) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value; // Update the highlight at the specified index
    setHighlights(updatedHighlights);
  };

  // Handle upload to backend
  const handleUpload = async () => {
    if (!croppedImage) {
      alert('Please crop the image first.');
      return;
    }

    // Convert the cropped image to a File object
    const file = new File([croppedImage], 'banner-image.png', {
      type: 'image/png',
    });

    // Combine startTime and endTime into a single timing string (e.g., "9:00 AM - 5:00 PM")
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      const parsedHours = parseInt(hours, 10);
      const ampm = parsedHours >= 12 ? 'PM' : 'AM';
      const formattedHours = parsedHours % 12 || 12; // Convert to 12-hour format
      return `${formattedHours}:${minutes} ${ampm}`;
    };

    const timing = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    // Create FormData and append the file with the key 'image'
    const formData = new FormData();
    formData.append('image', file); // Use 'image' as the key
    formData.append('title', title);
    formData.append('place', place);
    formData.append('eventType', eventType);
    formData.append('eventDate', date);
    formData.append('timing', timing); // Append combined timing string
    formData.append('highlights', JSON.stringify(highlights.filter((h) => h.trim() !== '')));

    try {
      // Use Axios for the POST request
      const response = await axiosInstance.post('/admin/create-event', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Let Axios set the boundary
        },
      });
      console.log(response);

      if (response.status === 200) {
        setShowToast(true); // Show Toast on success
        setTimeout(() => {
          navigate("/event"); // Redirect to /event after 2 seconds
        }, 2000);
      } else {
        alert('Failed to upload banner.');
        console.error('Upload failed:', response.data);
      }
    } catch (error) {
      console.error('Error uploading banner:', error);
      alert('Failed to upload banner.');
    }
  };

  return (
    <>
      <PageTitle title="New event" />
      
      {/* Toast Notification */}
      <Toast 
        onClose={() => setShowToast(false)} 
        show={showToast} 
        delay={2000} 
        autohide
        style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">TECHMIN</strong>
        </ToastHeader>
        <ToastBody>Event created successfully.</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  {/* Image Upload */}
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Event Image (362x472)</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                  </Form.Group>

                  {/* Cropper */}
                  {imageSrc && (
                    <>
                      <div className="img-container">
                        <Cropper
                          src={imageSrc}
                          style={{ height: 400, width: '100%' }}
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
                            <Button onClick={() => cropperRef.current?.cropper.zoom(0.1)}>
                              <IconifyIcon icon="mdi:magnify-plus-outline" /> Zoom In
                            </Button>
                            <Button onClick={() => cropperRef.current?.cropper.zoom(-0.1)}>
                              <IconifyIcon icon="mdi:magnify-minus-outline" /> Zoom Out
                            </Button>
                            <Button onClick={() => cropperRef.current?.cropper.rotate(-45)}>
                              <IconifyIcon icon="mdi:rotate-left" /> Rotate Left
                            </Button>
                            <Button onClick={() => cropperRef.current?.cropper.rotate(45)}>
                              <IconifyIcon icon="mdi:rotate-right" /> Rotate Right
                            </Button>
                            <Button onClick={() => cropperRef.current?.cropper.reset()}>
                              <IconifyIcon icon="mdi:sync" /> Reset
                            </Button>
                            <Button onClick={() => cropperRef.current?.cropper.clear()}>
                              <IconifyIcon icon="mdi:close" /> Clear
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </Col>

                <Col lg={3}>
                  {/* Title Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Event Title</Form.Label>
                    <Form.Control
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter event title"
                    />
                  </Form.Group>

                  {/* Place Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Place</Form.Label>
                    <Form.Control
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="Enter event place"
                    />
                  </Form.Group>

                  {/* Event Type Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Event Type</Form.Label>
                    <Form.Control
                      as="select"
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                    >
                      <option value="">Select event type</option>
                      <option value="concert">Concert</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="other">Other</option>
                    </Form.Control>
                  </Form.Group>

                  {/* Date Input */}
                  <Form.Group className="mb-3">
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </Form.Group>

                  {/* Start Time Input */}
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Form.Group>

                  {/* End Time Input */}
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Form.Group>

                  {/* Highlights Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Highlights</Form.Label>
                    {highlights.map((highlight, index) => (
                      <div key={index} className="d-flex align-items-center mb-2">
                        <Form.Control
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlightField(index, e.target.value)}
                          placeholder={`Highlight ${index + 1}`}
                        />
                        <Button
                          variant="danger"
                          className="ms-2"
                          onClick={() => removeHighlightField(index)}
                        >
                          <IconifyIcon icon="mdi:delete" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={addHighlightField}
                    >
                      <IconifyIcon icon="mdi:plus" /> Add Highlight
                    </Button>
                  </Form.Group>

                  {/* Upload Button */}
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!croppedImage}
                  >
                    <IconifyIcon icon="mdi:upload" /> Create Event
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

export default EventCreate;