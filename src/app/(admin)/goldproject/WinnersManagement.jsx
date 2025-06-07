import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Button,
  Table,
  Form,
  Toast,
  Row,
  Col,
  Spinner,
  Badge,
  Modal,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const WinnersManagement = () => {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [availableLots, setAvailableLots] = useState([]);
  const [winners, setWinners] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [winnerToDelete, setWinnerToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWinner, setEditingWinner] = useState(null);

  const [newWinner, setNewWinner] = useState({
    month: "",
    year: new Date().getFullYear(),
    lotId: "",
    prizeAmount: "",
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get year range based on program dates
  const getYearRange = () => {
    if (!program) return [];

    const startYear = new Date(program.startDate).getFullYear();
    const endYear = program.endDate
      ? new Date(program.endDate).getFullYear()
      : new Date().getFullYear();

    const years = [];
    for (let year = startYear; year <= endYear + 1; year++) {
      years.push(year);
    }
    return years;
  };

  // Get unique winner years for filtering
  const winnerYears = [...new Set(winners.map((w) => w.year))].sort(
    (a, b) => b - a
  );
  const [selectedYear, setSelectedYear] = useState(
    winnerYears[0] || new Date().getFullYear()
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [programRes, lotsRes] = await Promise.all([
          axiosInstance.get(`/gold/${programId}`),
          axiosInstance.get(`/gold/${programId}/lots?eligibleOnly=true`),
        ]);

        setProgram(programRes.data.data);
        setWinners(programRes.data.data.winners || []);

        const alreadyWinningLotIds = new Set(
          (programRes.data.data.winners || []).map((w) => w.lotId)
        );

        setAvailableLots(
          lotsRes.data.data.filter((lot) => !alreadyWinningLotIds.has(lot.id))
        );

        // Set selected year to current year if no winners exist yet
        if (!programRes.data.data.winners?.length) {
          setSelectedYear(new Date().getFullYear());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setToastMessage("Failed to load program data");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [programId]);

  const handleAddWinner = async (e) => {
    e.preventDefault();
    if (!newWinner.month || !newWinner.lotId || !newWinner.year) {
      setToastMessage("Month, year and lot selection are required");
      setShowToast(true);
      return;
    }

    const existingWinner = winners.find(
      (w) =>
        w.month === parseInt(newWinner.month) &&
        w.year === parseInt(newWinner.year)
    );

    if (existingWinner) {
      setToastMessage(`This month/year combination already has a winner`);
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/gold/winners`, {
        programId,
        winners: [
          {
            ...newWinner,
            month: parseInt(newWinner.month),
            year: parseInt(newWinner.year),
          },
        ],
      });

      setWinners([...winners, ...response.data.data]);
      setAvailableLots((prev) =>
        prev.filter((lot) => lot.id !== parseInt(newWinner.lotId))
      );
      setToastMessage("Winner added successfully!");
      setNewWinner({
        month: "",
        year: new Date().getFullYear(),
        lotId: "",
        prizeAmount: "",
      });
    } catch (error) {
      setToastMessage(error.response?.data?.message || "Failed to add winner");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEditWinner = (winner) => {
    setEditingWinner(winner);
    setShowEditModal(true);
  };

  const handleUpdateWinner = async () => {
    if (!editingWinner.month || !editingWinner.lotId || !editingWinner.year) {
      setToastMessage("Month, year and lot selection are required");
      setShowToast(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(
        `/gold/winners/${editingWinner.id}`,
        {
          month: parseInt(editingWinner.month),
          year: parseInt(editingWinner.year),
          lotId: parseInt(editingWinner.lotId),
          prizeAmount: editingWinner.prizeAmount,
          programId: editingWinner.programId,
        }
      );

      setWinners(
        winners.map((w) => (w.id === editingWinner.id ? response.data.data : w))
      );
      setToastMessage("Winner updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to update winner"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (winner) => {
    setWinnerToDelete(winner);
    setShowDeleteModal(true);
  };

  const handleDeleteWinner = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/gold/winners/${winnerToDelete.id}`);
      setWinners(winners.filter((w) => w.id !== winnerToDelete.id));
      setToastMessage("Winner deleted successfully");
      setShowDeleteModal(false);
    } catch (error) {
      setToastMessage(
        error.response?.data?.message || "Failed to delete winner"
      );
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle
        title={`Winners - ${program?.name || "Loading..."}`}
        breadcrumbItems={[
          { label: "Gold Programs", path: "/gold-programs" },
          {
            label: program?.name || "Program",
            path: `/gold-programs/${programId}`,
          },
          { label: "Winners Management", active: true },
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
              <h5>Add New Winner</h5>
              <Form onSubmit={handleAddWinner}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Year*</Form.Label>
                      <Form.Select
                        value={newWinner.year}
                        onChange={(e) =>
                          setNewWinner({ ...newWinner, year: e.target.value })
                        }
                        required
                      >
                        {getYearRange().map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Month*</Form.Label>
                      <Form.Select
                        value={newWinner.month}
                        onChange={(e) =>
                          setNewWinner({ ...newWinner, month: e.target.value })
                        }
                        required
                      >
                        <option value="">Select month...</option>
                        {months.map((month, index) => (
                          <option key={month} value={index + 1}>
                            {month}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Select Lot*</Form.Label>
                  <Form.Select
                    value={newWinner.lotId}
                    onChange={(e) =>
                      setNewWinner({ ...newWinner, lotId: e.target.value })
                    }
                    required
                  >
                    <option value="">Choose lot...</option>
                    {availableLots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.user?.name} (Member ID: {lot.user?.memberId})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" disabled={loading}>
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Add Winner"
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Current Winners</h5>
                <Form.Select
                  style={{ width: "120px" }}
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                >
                  {getYearRange().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Winner</th>
                    <th>Member ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {winners
                    .filter((w) => w.year === selectedYear)
                    .sort((a, b) => a.month - b.month)
                    .map((winner) => (
                      <tr key={winner.id}>
                        <td>
                          <Badge bg="info">{months[winner.month - 1]}</Badge>
                        </td>
                        <td>{winner.lot?.user?.name || "N/A"}</td>
                        <td>{winner.lot?.user?.memberId || "N/A"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleEditWinner(winner)}
                              disabled={loading}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteClick(winner)}
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

              {winners.filter((w) => w.year === selectedYear).length === 0 && (
                <div className="text-center py-4 text-muted">
                  No winners for {selectedYear}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Winner Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Winner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingWinner && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Year</Form.Label>
                <Form.Select
                  value={editingWinner.year}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      year: e.target.value,
                    })
                  }
                >
                  {getYearRange().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Month</Form.Label>
                <Form.Select
                  value={editingWinner.month}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      month: e.target.value,
                    })
                  }
                >
                  {months.map((month, index) => (
                    <option key={month} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lot</Form.Label>
                <Form.Select
                  value={editingWinner.lotId}
                  onChange={(e) =>
                    setEditingWinner({
                      ...editingWinner,
                      lotId: e.target.value,
                    })
                  }
                >
                  {availableLots
                    .concat(
                      winners
                        .filter((w) => w.id === editingWinner.id)
                        .map((w) => w.lot)
                    )
                    .map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.user?.name} (Member ID: {lot.user?.memberId})
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
          <Button variant="primary" onClick={handleUpdateWinner}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Update Winner"
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
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this winner? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteWinner}>
            {loading ? (
              <Spinner size="sm" animation="border" />
            ) : (
              "Delete Winner"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WinnersManagement;
