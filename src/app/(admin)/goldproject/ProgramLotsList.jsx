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
                          <Button
                            size="sm"
                            variant="info"
                            onClick={() =>
                              navigate(
                                `/gold-programs/${programId}/lots/${lot.id}`
                              )
                            }
                          >
                            View
                          </Button>
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
    </>
  );
};

export default ProgramLotsList;
