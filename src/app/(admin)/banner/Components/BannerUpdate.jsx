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
import axios from "axios"; // For API calls
import fetchWithAuth from "../../../../globalFetch/fetch";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate } from "react-router-dom";
import smLogo from "@/assets/images/logo-sm.png"; // Import the logo for the toast

const ImageCropper = () => {
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
  const cropperRef = useRef(null);

  // Fixed aspect ratio for banner (376x388)
  const bannerAspectRatio = 376 / 388;

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

  // Handle upload to backend
  const handleUpload = async () => {
    if (!croppedImage) {
      alert("Please crop the image first.");
      return;
    }

    // Convert the cropped image to a File object
    const file = new File([croppedImage], "banner-image.png", {
      type: "image/png",
    });

    // Create FormData and append the file with the key 'image'
    const formData = new FormData();
    formData.append("image", file); // Use 'image' as the key

    try {
      // Use Axios for the POST request
      const response = await axiosInstance.post(
        "/admin/upload-banner",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Let Axios set the boundary
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        setShowToast(true); // Show Toast on success
        setTimeout(() => {
          navigate("/banner"); // Redirect to /banner after 2 seconds
        }, 2000);
      } else {
        alert("Failed to upload banner.");
        console.error("Upload failed:", response.data);
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner.");
    }
  };

  return (
    <>
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
        <ToastBody>Banner uploaded successfully.</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  {/* Image Upload */}
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Banner Image (376x388)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

                  {/* Cropper */}
                  {imageSrc && (
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
                  )}
                </Col>

                <Col lg={3}>
                  {/* Crop Data Preview */}
                  <div className="docs-data">
                    <Form.Group className="mb-2">
                      <Form.Label>X</Form.Label>
                      <Form.Control
                        type="text"
                        value={cropData.cropX}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Y</Form.Label>
                      <Form.Control
                        type="text"
                        value={cropData.cropY}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Width</Form.Label>
                      <Form.Control
                        type="text"
                        value={cropData.imageWidth}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Height</Form.Label>
                      <Form.Control
                        type="text"
                        value={cropData.imageHeight}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Label>Rotate</Form.Label>
                      <Form.Control
                        type="text"
                        value={cropData.imageRotate}
                        readOnly
                      />
                    </Form.Group>
                  </div>

                  {/* Upload Button */}
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!croppedImage}
                  >
                    <IconifyIcon icon="mdi:upload" /> Upload Banner
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Controls */}
      <Row className="mt-3">
        <Col xs={12}>
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
        </Col>
      </Row>
    </>
  );
};

export default ImageCropper;
