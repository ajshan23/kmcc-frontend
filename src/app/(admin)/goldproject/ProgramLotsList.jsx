import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Badge,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";

const ProgramLotsList = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [lots, setLots] = useState([]);
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lotToDelete, setLotToDelete] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [programRes, lotsRes] = await Promise.all([
          axiosInstance.get(`/gold/${programId}`),
          axiosInstance.get(`/gold/${programId}/lots/`),
        ]);

        if (!programRes.data?.data || !lotsRes.data?.data) {
          throw new Error("Invalid data structure from API");
        }

        setProgram(programRes.data.data);
        setLots(lotsRes.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programId]);

  const handleDeleteLot = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/gold/lots/${lotToDelete.id}`);
      setLots(lots.filter((lot) => lot.id !== lotToDelete.id));
      setToastMessage("Lot removed successfully");
      setShowToast(true);
      setShowDeleteModal(false);
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to remove lot");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-4">
        <Alert.Heading>Error loading data</Alert.Heading>
        <p>{error}</p>
        <Button variant="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <>
      <PageTitle
        title={`Lots - ${program?.name || "Program"}`}
        breadcrumbItems={[
          { label: "Gold Programs", path: "/gold-programs" },
          {
            label: program?.name || "Program",
            path: `/gold-programs/${programId}`,
          },
          { label: "Lots", active: true },
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

      <Row className="mb-3">
        <Col>
          <Button
            variant="primary"
            onClick={() => navigate(`/gold-programs/${programId}/lots/new`)}
          >
            Assign New Lot
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              {lots.length === 0 ? (
                <Alert variant="info">No lots found for this program</Alert>
              ) : (
                <Table striped hover responsive>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Member ID</th>
                      <th>Payments</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lots.map((lot) => (
                      <tr key={lot.id}>
                        <td>{lot.user?.name || "N/A"}</td>
                        <td>{lot.user?.memberId || "N/A"}</td>
                        <td>
                          {lot.payments?.filter((p) => p.isPaid).length || 0} /
                          {program?.durationMonths || "N/A"}
                        </td>
                        <td>
                          <Badge
                            bg={lot.winners?.length ? "success" : "secondary"}
                          >
                            {lot.winners?.length ? "Winner" : "Active"}
                          </Badge>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/gold-programs/${programId}/lots/${lot.id}/payments`
                                )
                              }
                            >
                              Payments
                            </Button>
                            {!lot.winners?.length && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => {
                                  setLotToDelete(lot);
                                  setShowDeleteModal(true);
                                }}
                                disabled={loading}
                              >
                                Remove
                              </Button>
                            )}
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

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Lot Removal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this lot? This action cannot be
          undone.
          {lotToDelete?.payments?.length > 0 && (
            <Alert variant="warning" className="mt-3">
              <strong>Warning:</strong> This lot has payment records. Removing
              it will also delete all associated payment records.
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteLot}>
            {loading ? <Spinner size="sm" animation="border" /> : "Remove Lot"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProgramLotsList;
