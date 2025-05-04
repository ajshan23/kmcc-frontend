import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Tab,
  Tabs,
  Row,
  Col,
  Badge,
  Table,
  Spinner,
  Toast,
  Button,
  Alert,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const InvestmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deposits");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [profitSummary, setProfitSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [investmentRes, summaryRes] = await Promise.all([
          axiosInstance.get(`/investments/${id}`),
          axiosInstance.get(`/investments/${id}/profit-summary`),
        ]);
        setInvestment(investmentRes.data.data);
        setProfitSummary(summaryRes.data.data);
      } catch (error) {
        setToastMessage("Failed to load investment data");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!investment) {
    return (
      <div className="d-flex justify-content-center p-5">
        Investment not found
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title={`Investment - ${investment.user?.name || "N/A"}`}
        breadcrumbItems={[
          { label: "Investments", path: "/investments" },
          { label: investment.user?.name || "Investment", active: true },
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
              <h4>{investment.user?.name || "N/A"}</h4>
              <p className="text-muted">
                Member ID: {investment.user?.memberId || "N/A"}
              </p>
              <div className="d-flex gap-2 mb-3">
                <Badge bg={investment.isActive ? "success" : "secondary"}>
                  {investment.isActive ? "Active" : "Closed"}
                </Badge>
                <Badge bg="info">
                  ${investment.totalDeposited.toLocaleString()} Deposited
                </Badge>
                {profitSummary && (
                  <>
                    <Badge bg="warning">
                      ${profitSummary.totalProfit.toLocaleString()} Profit
                    </Badge>
                    <Badge bg="success">
                      ${profitSummary.profitDistributed.toLocaleString()} Paid
                    </Badge>
                  </>
                )}
              </div>
            </Col>
            <Col md={6} className="text-end">
              <p>
                <strong>Started:</strong>{" "}
                {new Date(investment.startDate).toLocaleDateString()}
              </p>
              {investment.endDate && (
                <p>
                  <strong>Ended:</strong>{" "}
                  {new Date(investment.endDate).toLocaleDateString()}
                </p>
              )}
            </Col>
          </Row>

          <div className="d-flex flex-wrap gap-2">
            {investment.isActive && (
              <>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/investments/${id}/deposits/new`)}
                >
                  <IconifyIcon icon="mdi:cash-plus" className="me-1" />
                  Add Deposit
                </Button>
                <Button
                  variant="warning"
                  onClick={() => navigate(`/investments/${id}/profits/new`)}
                >
                  <IconifyIcon icon="mdi:finance" className="me-1" />
                  Add Profit
                </Button>
                <Button
                  variant="success"
                  onClick={() =>
                    navigate(`/investments/${id}/profit-payouts/new`)
                  }
                >
                  <IconifyIcon icon="mdi:cash-multiple" className="me-1" />
                  Distribute Profit
                </Button>
              </>
            )}
            <Button
              variant="secondary"
              onClick={() => navigate("/investments")}
            >
              Back to List
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k || "deposits")}
        className="mb-3"
      >
        <Tab eventKey="deposits" title="Deposits">
          <Card>
            <Card.Body>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {investment.deposits?.map((deposit) => (
                    <tr key={deposit.id}>
                      <td>
                        {new Date(deposit.depositDate).toLocaleDateString()}
                      </td>
                      <td>${deposit.amount.toLocaleString()}</td>
                      <td>{deposit.notes || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="profit-payouts" title="Profit Payouts">
          <Card>
            <Card.Body>
              {profitSummary && (
                <Alert variant="info" className="mb-3">
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
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {investment.profitPayouts?.map((payout) => (
                    <tr key={payout.id}>
                      <td>
                        {new Date(payout.payoutDate).toLocaleDateString()}
                      </td>
                      <td>${payout.amount.toLocaleString()}</td>
                      <td>{payout.notes || "-"}</td>
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

export default InvestmentDetails;
