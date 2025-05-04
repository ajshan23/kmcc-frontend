// News.js
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
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const News = () => {
  const [news, setNews] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axiosInstance.get("/news");
        if (response.status === 200) {
          setNews(response.data.data.news);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };
    fetchNews();
  }, []);

  const handleDeleteClick = (newsId) => {
    setSelectedNewsId(newsId);
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
    setSelectedNewsId(null);
  };

  const handleDeleteNews = async () => {
    if (!selectedNewsId) return;

    try {
      const response = await axiosInstance.delete(`/news/${selectedNewsId}`);
      if (response.status === 200) {
        setNews((prevNews) =>
          prevNews.filter((nws) => nws.id !== selectedNewsId)
        );
        setToastMessage("News deleted successfully!");
        setShowToast(true);
      }
    } catch (error) {
      console.error("Error deleting news:", error);
      setToastMessage("Failed to delete news.");
      setShowToast(true);
    } finally {
      handleDeleteModalClose();
    }
  };

  return (
    <div className="d-flex p-4">
      <PageTitle title="News" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
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
          <div
            style={{
              width: "70vw",
              background: "white",
              border: "1px solid gray",
              padding: 10,
              borderRadius: 10,
            }}
          >
            <Row className="d-flex justify-content-between align-items-center p-2">
              <Col xs="auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  style={{ width: "250px", borderRadius: 10 }}
                />
              </Col>
              <Col xs="auto">
                <Button
                  type="button"
                  variant="dark"
                  style={{ padding: "10px 20px", borderRadius: 10 }}
                  as={Link}
                  to="/news/new"
                >
                  New News
                </Button>
              </Col>
            </Row>

            <div className="table-responsive">
              <table
                className="table table-striped"
                style={{ width: "100%", textAlign: "center" }}
              >
                <thead>
                  <tr>
                    <th style={{ textAlign: "center" }}>Type</th>
                    <th style={{ textAlign: "center" }}>Heading</th>
                    <th style={{ textAlign: "center" }}>Author</th>
                    <th style={{ textAlign: "center" }}>Image</th>
                    <th style={{ textAlign: "center" }}>Author Image</th>
                    <th style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {news.map((nws, idx) => (
                    <tr key={idx}>
                      <td style={{ verticalAlign: "middle" }}>{nws.type}</td>
                      <td style={{ verticalAlign: "middle" }}>{nws.heading}</td>
                      <td style={{ verticalAlign: "middle" }}>{nws.author}</td>
                      <td style={{ verticalAlign: "middle" }}>
                        {nws.image ? (
                          <img
                            src={nws.image}
                            alt="news"
                            style={{
                              width: "50px",
                              height: "auto",
                              borderRadius: 2,
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        {nws.authorImage ? (
                          <img
                            src={nws.authorImage}
                            alt="author"
                            style={{
                              width: "50px",
                              height: "auto",
                              borderRadius: 50,
                            }}
                          />
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td style={{ verticalAlign: "middle" }}>
                        <Button
                          type="button"
                          variant="primary"
                          className="me-2"
                          as={Link}
                          to={`/news/edit/${nws.id}`}
                        >
                          <IconifyIcon icon="mdi:pencil" />
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={() => handleDeleteClick(nws.id)}
                        >
                          <IconifyIcon icon="ri:delete-bin-4-fill" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>

      <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete News</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this news? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteNews}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default News;
