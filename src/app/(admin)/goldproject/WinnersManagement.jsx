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

        // Get already winning lot IDs for this program (any year/month)
        const alreadyWinningLotIds = new Set(
          (programRes.data.data.winners || []).map((w) => w.lotId)
        );

        setAvailableLots(
          lotsRes.data.data.filter((lot) => !alreadyWinningLotIds.has(lot.id))
        );
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

    // Check if this month/year combination already has a winner
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

  // Get distinct years from winners for filtering
  const winnerYears = [...new Set(winners.map((w) => w.year))].sort(
    (a, b) => b - a
  );
  const [selectedYear, setSelectedYear] = useState(
    winnerYears[0] || new Date().getFullYear()
  );

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
                        {Array.from({ length: 5 }, (_, i) => {
                          const year = new Date().getFullYear() + i;
                          return (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          );
                        })}
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

                {/* <Form.Group className="mb-3">
                  <Form.Label>Prize Amount (Optional)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g. 5000"
                    value={newWinner.prizeAmount}
                    onChange={(e) =>
                      setNewWinner({
                        ...newWinner,
                        prizeAmount: e.target.value,
                      })
                    }
                  />
                </Form.Group> */}

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
                {winnerYears.length > 0 && (
                  <Form.Select
                    style={{ width: "120px" }}
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  >
                    {winnerYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </div>

              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Winner</th>
                    <th>Member ID</th>
                    <th>Prize</th>
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
                        {/* <td>
                          {winner.prizeAmount
                            ? `$${winner.prizeAmount.toLocaleString()}`
                            : "N/A"}
                        </td> */}
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
    </>
  );
};

export default WinnersManagement;
