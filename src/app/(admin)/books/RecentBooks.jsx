import { Card, Row, Col, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axiosInstance from "../../../globalFetch/api";
import { Link } from "react-router-dom";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const RecentBooks = () => {
  const [recentBooks, setRecentBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentBooks = async () => {
      try {
        const response = await axiosInstance.get("/book/recent/books?limit=5");
        if (response.status === 200) {
          setRecentBooks(response.data.data.books || []);
        }
      } catch (error) {
        console.error("Error fetching recent books:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentBooks();
  }, []);

  if (loading) {
    return <div className="text-center p-3">Loading recent books...</div>;
  }

  if (recentBooks.length === 0) {
    return <div className="text-center p-3">No recent books available</div>;
  }

  return (
    <Card>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title mb-0">Recent Books</h5>
          <Button variant="link" as={Link} to="/book">
            View All
          </Button>
        </div>
        <Row>
          {recentBooks.map((book) => (
            <Col key={book.id} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card className="h-100">
                {book.coverImage && (
                  <img
                    src={book.coverImage}
                    className="card-img-top"
                    alt={book.title || "Book cover"}
                    style={{ height: "150px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <h6 className="card-title">
                    {book.title || "Untitled Book"}
                  </h6>
                  <p className="card-text text-muted small">
                    {book.author || "Unknown Author"}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to={`/book/${book.id}`}
                  >
                    <IconifyIcon icon="mdi:eye" className="me-1" />
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default RecentBooks;
