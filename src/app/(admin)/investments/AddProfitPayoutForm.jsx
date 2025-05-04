import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Toast,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const AddProfitPayoutForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [profitSummary, setProfitSummary] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
    payoutDate: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    const fetchProfitSummary = async () => {
      try {
        const response = await axiosInstance.get(
          `/investments/${id}/profit-summary`
        );
        setProfitSummary(response.data.data);
      } catch (error) {
        setToastMessage("Failed to load profit data");
        setShowToast(true);
      }
    };
    fetchProfitSummary();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToastMessage("Please enter a valid payout amount");
      setShowToast(true);
      return;
    }

    if (
      profitSummary &&
      parseFloat(formData.amount) > profitSummary.profitPending
    ) {
      setToastMessage("Payout amount exceeds available pending profit");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/investments/${id}/profit-payouts`, {
        amount: parseFloat(formData.amount),
        notes: formData.notes,
        payoutDate: formData.payoutDate,
      });

      setToastMessage("Profit payout recorded successfully!");
      setShowToast(true);
      setTimeout(() => navigate(`/investments/${id}`), 1500);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to record profit payout"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Distribute Profit"
        breadcrumbItems={[
          { label: "Investments", path: "/investments" },
          { label: `Investment #${id}`, path: `/investments/${id}` },
          { label: "Distribute Profit", active: true },
        ]}
      />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Body>
              {profitSummary && (
                <Alert variant="info" className="mb-4">
                  <div className="d-flex justify-content-between">
                    <span>
                      Total Profit:{" "}
                      <strong>
                        ${profitSummary.totalProfit.toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      Pending:{" "}
                      <strong>
                        ${profitSummary.profitPending.toLocaleString()}
                      </strong>
                    </span>
                    <span>
                      Distributed:{" "}
                      <strong>
                        ${profitSummary.profitDistributed.toLocaleString()}
                      </strong>
                    </span>
                  </div>
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Payout Amount*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Enter payout amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    disabled={loading}
                    max={profitSummary?.profitPending || undefined}
                  />
                  <Form.Text className="text-muted">
                    Available: $
                    {profitSummary?.profitPending.toLocaleString() || "0"}
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Payout Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.payoutDate}
                    onChange={(e) =>
                      setFormData({ ...formData, payoutDate: e.target.value })
                    }
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Optional notes (e.g., 'Quarterly dividend')"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/investments/${id}`)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="success"
                    disabled={
                      loading ||
                      !formData.amount ||
                      (profitSummary?.profitPending || 0) <= 0
                    }
                  >
                    {loading ? (
                      <>
                        <Spinner
                          size="sm"
                          animation="border"
                          className="me-2"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <IconifyIcon icon="mdi:cash-check" className="me-2" />
                        Record Payout
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddProfitPayoutForm;
