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
  Table,
  Modal,
  Badge,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const RecordPayment = () => {
  const { lotId } = useParams();
  const navigate = useNavigate();
  const [lot, setLot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [formData, setFormData] = useState({
    year: new Date().getFullYear(),
    month: "",
    isPaid: true,
  });

  useEffect(() => {
    const fetchLot = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/gold/lots/${lotId}`);
        setLot(response.data.data || null);
      } catch (error) {
        console.error("Error fetching lot:", error);
        setToastMessage("Failed to load lot data");
        setShowToast(true);
        setLot(null);
      } finally {
        setLoading(false);
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
      // Refresh the lot data
      const response = await axiosInstance.get(`/gold/lots/${lotId}`);
      setLot(response.data.data);
      // Reset form
      setFormData({
        year: new Date().getFullYear(),
        month: "",
        isPaid: true,
      });
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Payment failed");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment);
    setShowEditModal(true);
  };

  const handleUpdatePayment = async () => {
    if (!editingPayment) return;

    setLoading(true);
    try {
      await axiosInstance.put(`/gold/payments/${editingPayment.id}`, {
        year: parseInt(editingPayment.year),
        month: parseInt(editingPayment.month),
        isPaid: editingPayment.isPaid,
        lotId: editingPayment.lotId,
      });
      setToastMessage("Payment updated successfully!");
      setShowToast(true);
      setShowEditModal(false);
      // Refresh the lot data
      const response = await axiosInstance.get(`/gold/lots/${lotId}`);
      setLot(response.data.data);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to update payment"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (payment) => {
    setPaymentToDelete(payment);
    setShowDeleteModal(true);
  };

  const handleDeletePayment = async () => {
    if (!paymentToDelete) return;

    setLoading(true);
    try {
      await axiosInstance.delete(`/gold/payments/${paymentToDelete.id}`);
      setToastMessage("Payment deleted successfully");
      setShowToast(true);
      setShowDeleteModal(false);
      // Refresh the lot data
      const response = await axiosInstance.get(`/gold/lots/${lotId}`);
      setLot(response.data.data);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to delete payment"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const formatMonth = (month) => {
    return new Date(0, month - 1).toLocaleString("default", { month: "long" });
  };

  if (!lot) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={`Payments - ${lot.user?.name || "Unknown User"}`}
        breadcrumbItems={[
          { label: "Gold Programs", path: "/gold-programs" },
          {
            label: lot.program?.name || "Program",
            path: `/gold-programs/${lot.program?.id}`,
          },
          { label: "Lots", path: `/gold-programs/${lot.program?.id}/lots` },
          { label: "Payments", active: true },
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
          <Card className="mb-4">
            <Card.Body>
              <h5>Record New Payment</h5>
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
                            const isAlreadyPaid = lot.payments?.some(
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
                                {formatMonth(month)}{" "}
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
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={loading || !formData.month || !formData.year}
                  >
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      "Record Payment"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5>Payment History</h5>
              {lot.payments?.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  No payments recorded yet
                </div>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Month</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lot.payments
                      ?.sort((a, b) => b.year - a.year || b.month - a.month)
                      .map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.year}</td>
                          <td>{formatMonth(payment.month)}</td>
                          <td>
                            <Badge bg={payment.isPaid ? "success" : "warning"}>
                              {payment.isPaid ? "Paid" : "Pending"}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex gap-2">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleEditPayment(payment)}
                                disabled={loading}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteClick(payment)}
                                disabled={loading}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Payment Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Payment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPayment && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type="number"
                  value={editingPayment.year}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      year: e.target.value,
                    })
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Month</Form.Label>
                <Form.Select
                  value={editingPayment.month}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      month: e.target.value,
                    })
                  }
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <option key={month} value={month}>
                      {formatMonth(month)}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdatePayment}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Update Payment"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Payment Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this payment record? This action
          cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeletePayment}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete Payment"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default RecordPayment;
