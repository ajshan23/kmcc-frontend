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

const NewsCreate = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [imageSrc, setImageSrc] = useState(null);
  const [authorImageSrc, setAuthorImageSrc] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [type, setType] = useState("");
  const [heading, setHeading] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const cropperRef = useRef(null);
  const bannerAspectRatio = 402 / 335;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleAuthorImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const blob = new Blob([file], { type: file.type });
      setAuthorImageSrc(blob);
      setPreviewUrl(URL.createObjectURL(blob));
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => setCroppedImage(blob));
    }
  };

  const handleUpload = async () => {
    if (!croppedImage) {
      setToastMessage("Please crop the image first.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    const file = new File([croppedImage], "banner-image.png", {
      type: "image/png",
    });
    const authorFile = new File([authorImageSrc], "author-image.png", {
      type: "image/png",
    });
    const formData = new FormData();
    formData.append("image", file);
    formData.append("authorImage", authorFile);
    formData.append("type", type);
    formData.append("heading", heading);
    formData.append("author", author);
    formData.append("body", body);

    try {
      const response = await axiosInstance.post("/news", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.status === 201) {
        setToastMessage("News created successfully.");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => navigate("/news"), 2000);
      } else {
        throw new Error("Failed to upload news.");
      }
    } catch (error) {
      setToastMessage("Error uploading news.");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

  return (
    <>
      <PageTitle title="New News" />
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
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row>
                <Col lg={9}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Job Image (402x335)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

                  {imageSrc && (
                    <>
                      <Cropper
                        src={imageSrc}
                        style={{ height: 400, width: "100%" }}
                        initialAspectRatio={bannerAspectRatio}
                        aspectRatio={bannerAspectRatio}
                        guides={false}
                        crop={onCrop}
                        ref={cropperRef}
                      />
                    </>
                  )}

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Author Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorImageUpload}
                    />
                    {previewUrl && (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        width={150}
                        className="mt-3"
                      />
                    )}
                  </Form.Group>
                </Col>

                <Col lg={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                      type="text"
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      placeholder="Enter type"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Heading</Form.Label>
                    <Form.Control
                      type="text"
                      value={heading}
                      onChange={(e) => setHeading(e.target.value)}
                      placeholder="Enter heading"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Author</Form.Label>
                    <Form.Control
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter author name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      type="text"
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Enter news content"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!croppedImage}
                  >
                    <IconifyIcon icon="mdi:upload" /> Create News
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

export default NewsCreate;
