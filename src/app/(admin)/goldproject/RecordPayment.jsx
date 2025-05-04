import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Toast, Row, Col, Card, Spinner } from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";

const RecordPayment = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: "",
    isPaid: true,
  });

  useEffect(() => {
    const fetchLot = async () => {
      try {
        const response = await axiosInstance.get(`/gold/lots/${lotId}`);
        setLot(response.data.data || null);
      } catch (error) {
        console.error("Error fetching lot:", error);
        setLot(null);
      }
    };
    fetchLot();
  }, [lotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.month || !formData.year) return;

    setLoading(true);
    try {
      await axiosInstance.post(`/gold/payments`, {
        lotId,
        year: parseInt(formData.year),
        month: parseInt(formData.month),
      });
      setToastMessage("Payment recorded successfully!");
      setShowToast(true);
      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Payment failed");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (!lot) return <Spinner animation="border" />;

  return (
    <Row>
      <Col md={6}>
        <Card>
          <Card.Body>
            <h5>Record Payment for {lot?.user?.name || "Unknown User"}</h5>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Year</Form.Label>
                    <Form.Control
                      type="number"
                      min={2020}
                      max={2099}
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      required
                    />
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Month</Form.Label>
                    <Form.Select
                      value={formData.month}
                      onChange={(e) =>
                        setFormData({ ...formData, month: e.target.value })
                      }
                      required
                    >
                      <option value="">Select month...</option>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(
                        (month) => {
                          const isAlreadyPaid = lot?.payments?.some(
                            (p) =>
                              p.month === month &&
                              p.year === parseInt(formData.year)
                          );
                          return (
                            <option
                              key={month}
                              value={month}
                              disabled={isAlreadyPaid}
                            >
                              {new Date(0, month - 1).toLocaleString(
                                "default",
                                {
                                  month: "long",
                                }
                              )}{" "}
                              {isAlreadyPaid ? "(Paid)" : ""}
                            </option>
                          );
                        }
                      )}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading || !formData.month || !formData.year}
                >
                  {loading ? <Spinner size="sm" /> : "Record Payment"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </Row>
  );
};

export default RecordPayment;
