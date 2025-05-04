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
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const MembershipForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    memberId: "",
    iqamaNumber: "",
    name: "",
    phoneNumber: "",
    status: "active",
    areaName: "",
  });

  useEffect(() => {
    if (id) {
      const fetchMembership = async () => {
        setLoading(true);
        try {
          const response = await axiosInstance.get(`/admin/memberships/${id}`);
          if (response.status === 200) {
            setFormData({
              memberId: response.data.data.memberId,
              iqamaNumber: response.data.data.iqamaNumber,
              name: response.data.data.name,
              phoneNumber: response.data.data.phoneNumber || "",
              status: response.data.data.status,
              areaName: response.data.data.areaName || "",
            });
            setIsEditing(true);
          }
        } catch (error) {
          console.error("Error fetching membership:", error);
          setToastMessage("Failed to load membership data.");
          setToastVariant("danger");
          setShowToast(true);
          navigate("/membership");
        } finally {
          setLoading(false);
        }
      };
      fetchMembership();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.memberId || !formData.iqamaNumber || !formData.name) {
      setToastMessage("Member ID, Iqama Number, and Name are required.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      let response;
      if (isEditing) {
        response = await axiosInstance.put(
          `/admin/memberships/${id}`,
          formData
        );
      } else {
        response = await axiosInstance.post("/admin/memberships", formData);
      }

      if (response.status === 200 || response.status === 201) {
        setToastMessage(
          isEditing
            ? "Membership updated successfully."
            : "Membership added successfully."
        );
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => navigate("/membership"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setToastMessage(
        error.response?.data?.message ||
          `Failed to ${isEditing ? "update" : "add"} membership.`
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditing ? "Edit Membership" : "New Membership"} />
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
                    name="memberId"
                    value={formData.memberId}
                    onChange={handleChange}
                    placeholder="Enter Member ID"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Iqama Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="iqamaNumber"
                    value={formData.iqamaNumber}
                    onChange={handleChange}
                    placeholder="Enter Iqama Number"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter Name"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    disabled={loading}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                    name="areaName"
                    value={formData.areaName}
                    onChange={handleChange}
                    placeholder="Enter Area Name"
                    disabled={loading}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/memberships")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="flex-grow-1"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    <IconifyIcon
                      icon={isEditing ? "mdi:account-edit" : "mdi:account-plus"}
                    />{" "}
                    {loading
                      ? isEditing
                        ? "Updating..."
                        : "Adding..."
                      : isEditing
                      ? "Update Membership"
                      : "Add Membership"}
                  </Button>
                </div>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default MembershipForm;
