import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Toast,
  Row,
  Col,
  Card,
  Spinner,
  FormControl,
  FormGroup,
  FormLabel,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    // User fields
    name: "",
    email: "",
    phoneNumber: "",
    isAdmin: false,
    isSuperAdmin: false,
    // Profile fields
    occupation: "",
    employer: "",
    place: "",
    dateOfBirth: "",
    bloodGroup: "",
    kmccPosition: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get(`/admin/users/${id}`);
        const userData = response.data.data || response.data;

        if (!userData) {
          throw new Error("User data not found");
        }

        setFormData({
          name: userData.name || "",
          email: userData.email || "",
          phoneNumber: userData.phoneNumber || "",
          isAdmin: userData.isAdmin || false,
          isSuperAdmin: userData.isSuperAdmin || false,
          occupation: userData.profile?.occupation || "",
          employer: userData.profile?.employer || "",
          place: userData.profile?.place || "",
          dateOfBirth: userData.profile?.dateOfBirth
            ? new Date(userData.profile.dateOfBirth).toISOString().split("T")[0]
            : "",
          bloodGroup: userData.profile?.bloodGroup || "",
          kmccPosition: userData.profile?.kmccPosition || "",
          address: userData.profile?.address || "",
        });

        if (userData.profileImage) {
          setProfileImagePreview(
            `data:image/jpeg;base64,${userData.profileImage}`
          );
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setToastMessage(
          error.response?.data?.message || "Failed to fetch user data"
        );
        setShowToast(true);
        navigate("/users");
      } finally {
        setFetching(false);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phoneNumber", formData.phoneNumber);
    formDataToSend.append("isAdmin", formData.isAdmin);
    formDataToSend.append("isSuperAdmin", formData.isSuperAdmin);
    formDataToSend.append("occupation", formData.occupation);
    formDataToSend.append("employer", formData.employer);
    formDataToSend.append("place", formData.place);
    formDataToSend.append("dateOfBirth", formData.dateOfBirth);
    formDataToSend.append("bloodGroup", formData.bloodGroup);
    formDataToSend.append("kmccPosition", formData.kmccPosition);
    formDataToSend.append("address", formData.address);

    if (e.target.profileImage.files[0]) {
      formDataToSend.append("profileImage", e.target.profileImage.files[0]);
    }

    try {
      await axiosInstance.put(
        `/admin/users-with-profile/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setToastMessage("User and profile updated successfully!");
      setShowToast(true);
      setTimeout(() => navigate(`/users/${id}`), 1500);
    } catch (error) {
      console.error("Error updating user:", error);
      setToastMessage(error.response?.data?.message || "Failed to update user");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  if (fetching) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="Edit User"
        breadcrumbItems={[
          { label: "Users", path: "/users" },
          { label: `User #${id}`, path: `/users/${id}` },
          { label: "Edit", active: true },
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
        <Col md={8}>
          <Card>
            <Card.Body>
              <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl
                        type="file"
                        name="profileImage"
                        onChange={handleImageChange}
                        accept="image/*"
                      />
                      {profileImagePreview && (
                        <div className="mt-2">
                          <img
                            src={profileImagePreview}
                            alt="Profile Preview"
                            className="img-thumbnail"
                            style={{ maxWidth: "200px" }}
                          />
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                </Row>

                <h5 className="mt-4">Basic Information</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Name*</FormLabel>
                      <FormControl
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Email</FormLabel>
                      <FormControl
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <h5 className="mt-4">Professional Information</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Occupation</FormLabel>
                      <FormControl
                        type="text"
                        name="occupation"
                        value={formData.occupation}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Employer</FormLabel>
                      <FormControl
                        type="text"
                        name="employer"
                        value={formData.employer}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>KMCC Position</FormLabel>
                      <FormControl
                        type="text"
                        name="kmccPosition"
                        value={formData.kmccPosition}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Blood Group</FormLabel>
                      <FormControl
                        type="text"
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <h5 className="mt-4">Address Information</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Place</FormLabel>
                      <FormControl
                        type="text"
                        name="place"
                        value={formData.place}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <FormLabel>Address</FormLabel>
                      <FormControl
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <h5 className="mt-4">Admin Settings</h5>
                <Row>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Is Admin"
                        name="isAdmin"
                        checked={formData.isAdmin}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="mb-3">
                      <Form.Check
                        type="checkbox"
                        label="Is Super Admin"
                        name="isSuperAdmin"
                        checked={formData.isSuperAdmin}
                        onChange={handleChange}
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <div className="d-flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    onClick={() => navigate(`/users/${id}`)}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? (
                      <Spinner size="sm" animation="border" />
                    ) : (
                      <>
                        <IconifyIcon
                          icon="mdi:content-save-outline"
                          className="me-1"
                        />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default UserEdit;
