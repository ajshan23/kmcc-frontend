// AirportForm.js
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardBody,
  Col,
  Form,
  Button,
  Toast,
  ToastHeader,
  ToastBody,
  Row,
} from "react-bootstrap";
import axiosInstance from "../../../../globalFetch/api";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const AirportForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (isEditMode) {
      const fetchAirport = async () => {
        try {
          const response = await axiosInstance.get(`/airport/${id}`);
          if (response.status === 200) {
            const airport = response.data.data || response.data;
            setName(airport.name);
            setCode(airport.iataCode);
            setCountry(airport.country);
          }
        } catch (error) {
          console.error("Error fetching airport:", error);
          setToastMessage("Failed to load airport data.");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchAirport();
    }
  }, [id, isEditMode]);

  const handleSubmit = async () => {
    if (!name || !code || !country) {
      setToastMessage("All fields (name, code, country) are required");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);
    const formData = { name, code, country };

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/airport/${id}`, formData);
      } else {
        response = await axiosInstance.post("/airport", formData);
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `Airport ${isEditMode ? "updated" : "created"} successfully!`
        );
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => navigate("/airport"), 2000);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} airport:`,
        error
      );
      setToastMessage(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "create"} airport.`
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Airport" : "New Airport"} />
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">TECHMIN</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      <Row>
        <Col xs={12}>
          <Card>
            <CardBody>
              <Row className="p-10">
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter airport name"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter airport code (IATA)"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter country"
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      <IconifyIcon
                        icon={isEditMode ? "mdi:pencil" : "mdi:plus"}
                      />{" "}
                      {isEditMode ? "Update Airport" : "Create Airport"}
                    </>
                  )}
                </Button>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AirportForm;
