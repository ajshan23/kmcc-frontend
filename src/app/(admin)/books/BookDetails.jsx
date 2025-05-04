import PageTitle from "../../../components/PageTitle";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import {
  Button,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
  Card,
  Badge,
  Table,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/book/${id}`);
        if (response.status === 200) {
          setBook(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setToastMessage("Failed to load book details");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDownload = async () => {
    try {
      const response = await axiosInstance.get(`/book/${id}/download`, {
        responseType: "blob",
      });

      if (!response.data) {
        throw new Error("No data received");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book?.title || "book"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading book:", error);
      setToastMessage("Failed to download book");
      setShowToast(true);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/book/${id}`);
      setToastMessage("Book deleted successfully");
      setShowToast(true);
      setTimeout(() => {
        window.location.href = "/book";
      }, 1500);
    } catch (error) {
      console.error("Error deleting book:", error);
      setToastMessage("Failed to delete book");
      setShowToast(true);
    } finally {
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  if (!book) {
    return (
      <div className="d-flex justify-content-center p-5">Book not found</div>
    );
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Book Details" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">KMCC</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row className="w-100">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{book.title || "Untitled Book"}</h4>
                <div>
                  <Button
                    variant="primary"
                    className="me-2"
                    as={Link}
                    to={`/book/edit/${id}`}
                  >
                    <IconifyIcon icon="mdi:pencil" className="me-1" />
                    Edit
                  </Button>
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={handleDownload}
                  >
                    <IconifyIcon icon="mdi:download" className="me-1" />
                    Download PDF
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    <IconifyIcon icon="mdi:delete" className="me-1" />
                    Delete
                  </Button>
                </div>
              </div>

              <Row>
                <Col md={4}>
                  <Card>
                    <Card.Body className="text-center">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          style={{ maxHeight: "300px", marginBottom: "20px" }}
                        />
                      ) : (
                        <div
                          style={{
                            height: "150px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "20px",
                          }}
                        >
                          <span className="text-muted">No cover image</span>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={8}>
                  <Card>
                    <Card.Body>
                      <h5>Book Information</h5>
                      <Table bordered>
                        <tbody>
                          <tr>
                            <th>Title</th>
                            <td>{book.title || "N/A"}</td>
                          </tr>
                          <tr>
                            <th>Author</th>
                            <td>{book.author || "N/A"}</td>
                          </tr>
                          <tr>
                            <th>Description</th>
                            <td>
                              {book.description || (
                                <span className="text-muted">
                                  No description
                                </span>
                              )}
                            </td>
                          </tr>
                          <tr>
                            <th>Added On</th>
                            <td>
                              {book.createdAt
                                ? new Date(book.createdAt).toLocaleDateString()
                                : "N/A"}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{book.title || "this book"}"? This
          action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookDetails;
