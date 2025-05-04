import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
  Badge,
  Table,
  Card,
  CardBody,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const GoldProgramsList = () => {
  const [programs, setPrograms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });
  console.log("ethy");

  const navigate = useNavigate();

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/gold/all", {
        params: { page: pagination.page, limit: pagination.limit },
      });
      setPrograms(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.data.length,
      }));
    } catch (error) {
      console.error("Error fetching programs:", error);
      setToastMessage("Failed to load programs");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [pagination.page]);

  const handleEndProgram = async (programId) => {
    try {
      await axiosInstance.post(`/gold/end`, { programId });
      setToastMessage("Program ended successfully");
      setShowToast(true);
      fetchPrograms();
    } catch (error) {
      console.error("Error ending program:", error);
      setToastMessage(error.response?.data?.message || "Failed to end program");
      setShowToast(true);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="p-4">
      <PageTitle title="Gold Investment Programs" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">GOLD PROGRAM</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row className="mb-3">
        <Col>
          <Button as={Link} to="/gold-programs/new" variant="primary">
            <IconifyIcon icon="mdi:plus" /> Start New Program
          </Button>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Table striped hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Lots</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program) => (
                    <tr key={program.id}>
                      <td>{program.name}</td>
                      <td>
                        <Badge bg={program.isActive ? "success" : "secondary"}>
                          {program.isActive ? "Active" : "Ended"}
                        </Badge>
                      </td>
                      <td>
                        {new Date(program.startDate).toLocaleDateString()}
                      </td>
                      <td>
                        {program.endDate
                          ? new Date(program.endDate).toLocaleDateString()
                          : "-"}
                      </td>
                      <td>{program._count?.lots || 0}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="info"
                          className="me-2"
                          onClick={() =>
                            navigate(`/gold-programs/${program.id}`)
                          }
                        >
                          <IconifyIcon icon="mdi:eye" />
                        </Button>
                        {program.isActive && (
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => handleEndProgram(program.id)}
                          >
                            <IconifyIcon icon="mdi:stop" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              <div className="d-flex justify-content-center mt-3">
                <Button
                  variant="light"
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  Previous
                </Button>
                <span className="mx-3 align-self-center">
                  Page {pagination.page}
                </span>
                <Button
                  variant="light"
                  disabled={programs.length < pagination.limit}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  Next
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GoldProgramsList;
