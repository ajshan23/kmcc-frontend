import PageTitle from "../../../components/PageTitle";
import { Link } from "react-router-dom";
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
  Badge,
  Card,
  Table,
  Pagination,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/book?page=${currentPage}&limit=${pageSize}`
        );
        if (response.status === 200) {
          setBooks(response.data.data.books);
          setTotalPages(response.data.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setToastMessage("Failed to load books");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [currentPage, pageSize]);

  const handleDeleteClick = (book) => {
    setSelectedBook(book);
    setShowModal(true);
  };

  const handleDeleteBook = async () => {
    if (!selectedBook) return;
    try {
      await axiosInstance.delete(`/book/${selectedBook.id}`);
      setBooks((prev) => prev.filter((b) => b.id !== selectedBook.id));
      setToastMessage("Book deleted successfully!");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting book:", error);
      setToastMessage("Failed to delete book");
      setShowToast(true);
    } finally {
      setShowModal(false);
      setSelectedBook(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleDownload = async (bookId, bookTitle) => {
    try {
      const response = await axiosInstance.get(`/book/${bookId}/download`, {
        responseType: "blob",
      });

      if (!response.data) {
        throw new Error("No data received");
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${bookTitle || "book"}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading book:", error);
      setToastMessage("Failed to download book");
      setShowToast(true);
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center p-5">Loading...</div>;
  }

  return (
    <div className="d-flex p-4">
      <PageTitle title="Books" />

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
                <h4>Books Management</h4>
                <Button variant="primary" as={Link} to="/book/new">
                  <IconifyIcon icon="mdi:plus" className="me-1" />
                  Add New Book
                </Button>
              </div>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cover</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Description</th>
                    <th>Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book, index) => (
                    <tr key={book.id}>
                      <td>{(currentPage - 1) * pageSize + index + 1}</td>
                      <td>
                        {book.coverImage ? (
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            style={{ height: "50px" }}
                          />
                        ) : (
                          <span className="text-muted">No cover</span>
                        )}
                      </td>
                      <td>{book.title || "N/A"}</td>
                      <td>{book.author || "N/A"}</td>
                      <td>
                        {book.description
                          ? `${book.description.substring(0, 50)}...`
                          : "No description"}
                      </td>
                      <td>
                        {book.createdAt
                          ? new Date(book.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/book/${book.id}`}
                        >
                          <IconifyIcon icon="mdi:eye" color="white" />
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          className="me-2"
                          as={Link}
                          to={`/book/edit/${book.id}`}
                        >
                          <IconifyIcon icon="mdi:pencil" color="white" />
                        </Button>
                        <Button
                          variant="success"
                          size="sm"
                          className="me-2"
                          onClick={() => handleDownload(book.id, book.title)}
                        >
                          <IconifyIcon icon="mdi:download" color="white" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteClick(book)}
                        >
                          <IconifyIcon icon="mdi:delete" color="white" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  <Pagination.First
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    )
                  )}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Book</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete "{selectedBook?.title}"? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBook}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookList;
