import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Toast, Row, Col, Card, Spinner } from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";

const AddDepositForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [formData, setFormData] = useState({
    amount: "",
    notes: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setToastMessage("Please enter a valid amount");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post(`/investments/${id}/deposits`, {
        amount: parseFloat(formData.amount),
        notes: formData.notes,
      });

      setToastMessage("Deposit recorded successfully!");
      setShowToast(true);
      setTimeout(() => navigate(`/investments/${id}`), 1500);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to record deposit"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title="Add Deposit"
        breadcrumbItems={[
          { label: "Investments", path: "/investments" },
          { label: `Investment #${id}`, path: `/investments/${id}` },
          { label: "Add Deposit", active: true },
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
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Amount*</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="Enter deposit amount"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    required
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Optional notes"
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
                    variant="primary"
                    disabled={loading || !formData.amount}
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Record Deposit"
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

export default AddDepositForm;
