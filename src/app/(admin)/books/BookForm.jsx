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
import { useState, useEffect } from "react";
import axiosInstance from "../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const BookForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // File size limits
  const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

  useEffect(() => {
    if (isEditMode) {
      const fetchBook = async () => {
        try {
          const response = await axiosInstance.get(`/book/${id}`);
          if (response.status === 200) {
            const book = response.data.data;
            setTitle(book.title || "");
            setAuthor(book.author || "");
            setDescription(book.description || "");
            setCoverPreview(book.coverImage || null);
          }
        } catch (error) {
          console.error("Error fetching book:", error);
          setToastMessage("Failed to load book data");
          setShowToast(true);
        }
      };
      fetchBook();
    }
  }, [id, isEditMode]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setToastMessage("Please select an image file");
      setShowToast(true);
      e.target.value = ""; // Clear the input
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setToastMessage("Image file size must be less than 2MB");
      setShowToast(true);
      e.target.value = ""; // Clear the input
      return;
    }

    setCoverImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setToastMessage("Please select a PDF file");
      setShowToast(true);
      e.target.value = ""; // Clear the input
      return;
    }

    if (file.size > MAX_PDF_SIZE) {
      setToastMessage("PDF file size must be less than 10MB");
      setShowToast(true);
      e.target.value = ""; // Clear the input
      return;
    }

    setPdfFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !author) {
      setToastMessage("Title and author are required");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (!isEditMode && (!coverImage || !pdfFile)) {
      setToastMessage("Both cover image and PDF file are required");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    // Additional size validation in case the user bypasses the file input
    if (coverImage && coverImage.size > MAX_IMAGE_SIZE) {
      setToastMessage("Image file size must be less than 2MB");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    if (pdfFile && pdfFile.size > MAX_PDF_SIZE) {
      setToastMessage("PDF file size must be less than 10MB");
      setShowToast(true);
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("description", description);
    if (coverImage) formData.append("coverImage", coverImage);
    if (pdfFile) formData.append("pdf", pdfFile);

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/book/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.post("/book", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `Book ${isEditMode ? "updated" : "created"} successfully!`
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/book");
        }, 1500);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} book:`,
        error
      );
      setToastMessage(
        `Failed to ${isEditMode ? "update" : "create"} book. Please try again.`
      );
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Book" : "Add New Book"} />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">KMCC</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title *</Form.Label>
                      <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter book title"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Author *</Form.Label>
                      <Form.Control
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Enter author name"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter book description"
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Cover Image {!isEditMode && "*"}</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        required={!isEditMode}
                      />
                      <Form.Text className="text-muted">
                        Max size: 2MB (JPEG, PNG, etc.)
                      </Form.Text>
                      {coverPreview && (
                        <div className="mt-3">
                          <p>Preview:</p>
                          <img
                            src={coverPreview}
                            alt="Cover preview"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>PDF File {!isEditMode && "*"}</Form.Label>
                      <Form.Control
                        type="file"
                        accept="application/pdf"
                        onChange={handlePdfChange}
                        required={!isEditMode}
                      />
                      <Form.Text className="text-muted">
                        Max size: 10MB
                      </Form.Text>
                      {pdfFile && (
                        <div className="mt-2">
                          <p>Selected file: {pdfFile.name}</p>
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-end mt-4">
                  <Button
                    variant="secondary"
                    className="me-2"
                    onClick={() => navigate("/book")}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-1"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : isEditMode ? (
                      "Update Book"
                    ) : (
                      "Add Book"
                    )}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default BookForm;
