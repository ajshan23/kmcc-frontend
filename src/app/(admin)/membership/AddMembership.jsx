import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const AddMembership = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [loading, setLoading] = useState(false);

  const [memberId, setMemberId] = useState("");
  const [iqamaNumber, setIqamaNumber] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [areaName, setAreaName] = useState("");

  const handleSubmit = async () => {
    if (!memberId || !iqamaNumber || !name) {
      setToastMessage("Member ID, Iqama Number, and Name are required.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);
    const formData = {
      memberId,
      iqamaNumber,
      name,
      phoneNumber,
      status,
      areaName,
    };

    try {
      const response = await axiosInstance.post(
        "/admin/add-membership",
        formData
      );

      if (response.status === 201) {
        setToastMessage("Membership added successfully.");
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => navigate("/membership"), 2000);
      }
    } catch (error) {
      console.error("Error adding membership:", error);
      setToastMessage(
        error.response?.data?.message || "Failed to add membership."
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title="New Membership" />
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
                  <Form.Label>Member ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    placeholder="Enter Member ID"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Iqama Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={iqamaNumber}
                    onChange={(e) => setIqamaNumber(e.target.value)}
                    placeholder="Enter Iqama Number"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter Phone Number"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={loading}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Area Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={areaName}
                    onChange={(e) => setAreaName(e.target.value)}
                    placeholder="Enter Area Name"
                    disabled={loading}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  <IconifyIcon icon="mdi:account-plus" />{" "}
                  {loading ? "Adding..." : "Add Membership"}
                </Button>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddMembership;
