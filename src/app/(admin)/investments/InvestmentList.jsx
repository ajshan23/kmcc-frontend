import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Table, Button, Badge, Spinner, Toast } from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const InvestmentList = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const response = await axiosInstance.get("/investments");
        setInvestments(response.data.data);
      } catch (error) {
        setToastMessage("Failed to load investments");
        setShowToast(true);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Long-Term Investments"
        breadcrumbItems={[
          { label: "Investments", path: "/investments" },
          { label: "All Investments", active: true },
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

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-3">
            <h4>Investment Accounts</h4>
            <Button
              variant="primary"
              onClick={() => navigate("/investments/new")}
            >
              <IconifyIcon icon="mdi:plus" className="me-1" />
              New Investment
            </Button>
          </div>

          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Member</th>
                <th>Status</th>
                <th>Deposited</th>
                <th>Profit</th>
                <th>Paid Out</th>
                <th>Pending</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((investment) => (
                <tr key={investment.id}>
                  <td>
                    {investment.user?.name || "N/A"} <br />
                    <small className="text-muted">
                      {investment.user?.memberId || "N/A"}
                    </small>
                  </td>
                  <td>
                    <Badge bg={investment.isActive ? "success" : "secondary"}>
                      {investment.isActive ? "Active" : "Closed"}
                    </Badge>
                  </td>
                  <td>${investment.totalDeposited.toLocaleString()}</td>
                  <td>${investment.totalProfit.toLocaleString()}</td>
                  <td>${investment.profitDistributed.toLocaleString()}</td>
                  <td>
                    <Badge
                      bg={investment.profitPending > 0 ? "warning" : "light"}
                    >
                      ${investment.profitPending.toLocaleString()}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      className="me-2"
                      onClick={() => navigate(`/investments/${investment.id}`)}
                    >
                      View
                    </Button>
                    {investment.isActive && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() =>
                          navigate(`/investments/${investment.id}`)
                        }
                      >
                        Close
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </>
  );
};

export default InvestmentList;
