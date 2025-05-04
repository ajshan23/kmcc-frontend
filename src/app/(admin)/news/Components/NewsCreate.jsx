// NewsCreate.js
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

const NewsForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
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
  const [timeToRead, setTimeToRead] = useState("2 min read"); // Default value
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = useRef(null);
  const bannerAspectRatio = 402 / 335;

  useEffect(() => {
    if (isEditMode) {
      const fetchNews = async () => {
        try {
          const response = await axiosInstance.get(`/news/${id}`);
          if (response.status === 200) {
            const news = response.data.data || response.data;
            setType(news.type);
            setHeading(news.heading);
            setAuthor(news.author);
            setBody(news.body);
            setTimeToRead(news.timeToRead || "2 min read"); // Set timeToRead from API or default
            if (news.image) {
              setImageSrc(news.image);
              setCroppedImage(news.image);
            }
            if (news.authorImage) {
              setAuthorImageSrc(news.authorImage);
              setPreviewUrl(news.authorImage);
            }
          }
        } catch (error) {
          console.error("Error fetching news:", error);
          setToastMessage("Failed to load news data.");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchNews();
    }
  }, [id, isEditMode]);

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

  const handleSubmit = async () => {
    if (!isEditMode && !croppedImage) {
      setToastMessage("Please crop the image first.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    if (!type || !heading || !author || !body || !timeToRead) {
      setToastMessage("Please fill all required fields.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (croppedImage && typeof croppedImage !== "string") {
      formData.append("image", croppedImage, "news-image.png");
    }
    if (authorImageSrc && typeof authorImageSrc !== "string") {
      formData.append("authorImage", authorImageSrc, "author-image.png");
    }
    formData.append("type", type);
    formData.append("heading", heading);
    formData.append("author", author);
    formData.append("body", body);
    formData.append("timeToRead", timeToRead);

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/news/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        response = await axiosInstance.post("/news", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `News ${isEditMode ? "updated" : "created"} successfully!`
        );
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          navigate("/news");
        }, 2000);
      } else {
        throw new Error(`Failed to ${isEditMode ? "update" : "create"} news.`);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} news:`,
        error
      );
      setToastMessage(
        `Failed to ${isEditMode ? "update" : "create"} news. Please try again.`
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit News" : "New News"} />
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
                    <Form.Label>Upload News Image (402x335)</Form.Label>
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
                    <Form.Label>Time to Read</Form.Label>
                    <Form.Control
                      type="text"
                      value={timeToRead}
                      onChange={(e) => setTimeToRead(e.target.value)}
                      placeholder="e.g., 2 min read"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Body</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Enter news content"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={isLoading || (!isEditMode && !croppedImage)}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <IconifyIcon
                          icon={isEditMode ? "mdi:pencil" : "mdi:upload"}
                        />
                        {isEditMode ? " Update News" : " Create News"}
                      </>
                    )}
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

export default NewsForm;
