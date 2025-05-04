import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Tab,
  Tabs,
  Row,
  Col,
  Badge,
  Table,
  Spinner,
  Toast,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const GoldProgramDetails = () => {
  const { id: programId } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("lots");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/gold/${programId}`);
        setProgram(response.data.data);
      } catch (error) {
        console.error("Error fetching program:", error);
        setToastMessage("Failed to load program data");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProgram();
  }, [programId]);

  const handleExportPayments = async () => {
    try {
      const response = await axiosInstance.get(
        `/gold/${programId}/export-payments`,
        {
          responseType: "blob",
          headers: {
            Accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        }
      );

      // Create blob from response
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Try to get filename from content-disposition header
      let filename = `gold_payments_${program.name || programId}.xlsx`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      link.parentNode.removeChild(link);

      setToastMessage("Payment report downloaded successfully");
      setShowToast(true);
    } catch (error) {
      console.error("Error exporting payments:", error);
      setToastMessage(
        error.response?.data?.message || "Failed to export payment data"
      );
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="d-flex justify-content-center p-5">Program not found</div>
    );
  }

  return (
    <>
      <PageTitle
        title={program.name}
        breadcrumbItems={[
          { label: "Gold Programs", path: "/gold-programs" },
          { label: program.name, active: true },
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

      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>{program.name}</h4>
              <p className="text-muted">{program.description}</p>
              <div className="d-flex gap-2 mb-3">
                <Badge bg={program.isActive ? "success" : "secondary"}>
                  {program.isActive ? "Active" : "Ended"}
                </Badge>
                <Badge bg="info">{program._count?.lots || 0} Lots</Badge>
                <Badge bg="primary">
                  {program._count?.winners || 0} Winners
                </Badge>
              </div>
            </Col>
            <Col md={6} className="text-end">
              <p>
                <strong>Started:</strong>{" "}
                {new Date(program.startDate).toLocaleDateString()}
              </p>
              {program.endDate && (
                <p>
                  <strong>Ended:</strong>{" "}
                  {new Date(program.endDate).toLocaleDateString()}
                </p>
              )}
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2">
            {program.isActive && (
              <>
                <Button
                  variant="warning"
                  onClick={() =>
                    navigate(`/gold-programs/${programId}/lots/new`)
                  }
                >
                  <IconifyIcon icon="mdi:account-plus" className="me-1" />
                  Assign Lot
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    navigate(`/gold-programs/${programId}/winners`)
                  }
                >
                  <IconifyIcon icon="mdi:trophy" className="me-1" />
                  Manage Winners
                </Button>
              </>
            )}
            <Button
              variant="primary"
              onClick={handleExportPayments}
              // disabled={!program._count?.lots}
            >
              <IconifyIcon icon="mdi:file-excel" className="me-1" />
              Export Payments
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="lots" title="Lots">
          <Card>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Member ID</th>
                    <th>Name</th>
                    <th>Payments</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {program.lots?.map((lot, index) => (
                    <tr key={lot.id}>
                      <td>{index + 1}</td>
                      <td>{lot.user?.memberId || "N/A"}</td>
                      <td>{lot.user?.name || "N/A"}</td>
                      <td>
                        {lot.payments?.filter((p) => p.isPaid).length || 0} paid
                      </td>
                      <td>
                        <Badge bg={lot.winners?.length ? "success" : "primary"}>
                          {lot.winners?.length ? "Winner" : "Active"}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() =>
                            navigate(
                              `/gold-programs/${programId}/lots/${lot.id}/payments`
                            )
                          }
                          title="View Payments"
                        >
                          <IconifyIcon icon="mdi:cash" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="winners" title="Winners">
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <h5>Monthly Winners</h5>
                {program.isActive && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/gold-programs/${programId}/winners`)
                    }
                  >
                    <IconifyIcon icon="mdi:plus" className="me-1" />
                    Add Winners
                  </Button>
                )}
              </div>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Month</th>
                    <th>Member ID</th>
                    <th>Winner Name</th>
                  </tr>
                </thead>
                <tbody>
                  {program.winners?.map((winner, index) => (
                    <tr key={winner.id}>
                      <td>{index + 1}</td>
                      <td>
                        {new Date(0, winner.month - 1).toLocaleString(
                          "default",
                          {
                            month: "long",
                          }
                        )}{" "}
                        {winner.year}
                      </td>
                      <td>{winner.lot?.user?.memberId || "N/A"}</td>
                      <td>{winner.lot?.user?.name || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </>
  );
};

export default GoldProgramDetails;
