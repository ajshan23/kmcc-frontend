import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  Button,
  Row,
  Col,
  Spinner,
  Tab,
  Nav,
  Toast,
  Badge,
  ListGroup,
} from "react-bootstrap";
import axiosInstance from "../../../globalFetch/api";
import PageTitle from "../../../components/PageTitle";
import IconifyIcon from "@/components/wrappers/IconifyIcon";

const ProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/admin/users/${id}`);
        const data = response.data.data || response.data;

        if (!data) {
          throw new Error("Profile data not found");
        }

        setUserData({
          id: data.id,
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber,
          memberId: data.memberId,
          iqamaNumber: data.iqamaNumber,
          isAdmin: data.isAdmin,
          isSuperAdmin: data.isSuperAdmin,
          profileImage: data.profileImage
            ? `data:image/png;base64,${data.profileImage}`
            : null,
          createdAt: new Date(data.createdAt).toLocaleDateString(),
        });

        setProfileData({
          occupation: data.profile?.occupation || "Not specified",
          employer: data.profile?.employer || "Not specified",
          place: data.profile?.place || "Not specified",
          dateOfBirth: data.profile?.dateOfBirth
            ? new Date(data.profile.dateOfBirth).toLocaleDateString()
            : "Not specified",
          bloodGroup: data.profile?.bloodGroup || "Not specified",
          kmccPosition: data.profile?.kmccPosition || "Not specified",
          address: data.profile?.address || "Not specified",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setToastMessage(
          error.response?.data?.message || "Failed to load profile"
        );
        setShowToast(true);
        navigate("/users");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!userData || !profileData) {
    return (
      <div className="d-flex justify-content-center p-5">
        <h4>Profile not found</h4>
      </div>
    );
  }

  return (
    <>
      <PageTitle
        title="User Profile"
        breadcrumbItems={[
          { label: "Users", path: "/users" },
          { label: `User #${id}`, active: true },
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
        <Col lg={4}>
          <Card>
            <Card.Body className="text-center">
              {userData.profileImage ? (
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  className="rounded-circle mb-3"
                  width="150"
                  height="150"
                />
              ) : (
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mb-3"
                  style={{ width: 150, height: 150 }}
                >
                  <IconifyIcon
                    icon="mdi:account"
                    className="text-muted"
                    width={60}
                  />
                </div>
              )}

              <h4>{userData.name}</h4>
              <p className="text-muted mb-1">{profileData.kmccPosition}</p>

              <div className="d-flex justify-content-center gap-2 mt-3">
                <Badge
                  bg={
                    userData.isSuperAdmin
                      ? "danger"
                      : userData.isAdmin
                      ? "primary"
                      : "secondary"
                  }
                >
                  {userData.isSuperAdmin
                    ? "Super Admin"
                    : userData.isAdmin
                    ? "Admin"
                    : "Member"}
                </Badge>
                <Badge bg="info">Member since: {userData.createdAt}</Badge>
              </div>

              <hr className="my-4" />

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Member ID:</span>
                    <strong>{userData.memberId}</strong>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Iqama Number:</span>
                    <strong>{userData.iqamaNumber}</strong>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Phone:</span>
                    <strong>{userData.phoneNumber}</strong>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-flex justify-content-between">
                    <span>Email:</span>
                    <strong>{userData.email || "Not specified"}</strong>
                  </div>
                </ListGroup.Item>
              </ListGroup>

              <Button
                variant="primary"
                className="mt-3"
                onClick={() => navigate(`/users/${id}/edit`)}
              >
                <IconifyIcon icon="mdi:pencil" className="me-1" />
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card>
            <Card.Body>
              <Nav variant="tabs" activeKey={activeTab} onSelect={setActiveTab}>
                <Nav.Item>
                  <Nav.Link eventKey="basic">Basic Information</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="professional">
                    Professional Details
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="contact">Contact Information</Nav.Link>
                </Nav.Item>
              </Nav>

              <Tab.Content className="p-3">
                <Tab.Pane eventKey="basic" active={activeTab === "basic"}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Full Name</h6>
                        <p className="fs-5">{userData.name}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Date of Birth</h6>
                        <p className="fs-5">{profileData.dateOfBirth}</p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Blood Group</h6>
                        <p className="fs-5">{profileData.bloodGroup}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Member Since</h6>
                        <p className="fs-5">{userData.createdAt}</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane
                  eventKey="professional"
                  active={activeTab === "professional"}
                >
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Occupation</h6>
                        <p className="fs-5">{profileData.occupation}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Employer</h6>
                        <p className="fs-5">{profileData.employer}</p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">KMCC Position</h6>
                        <p className="fs-5">{profileData.kmccPosition}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Place</h6>
                        <p className="fs-5">{profileData.place}</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>

                <Tab.Pane eventKey="contact" active={activeTab === "contact"}>
                  <Row>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Phone Number</h6>
                        <p className="fs-5">{userData.phoneNumber}</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="mb-4">
                        <h6 className="text-muted">Email Address</h6>
                        <p className="fs-5">
                          {userData.email || "Not specified"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <div className="mb-4">
                        <h6 className="text-muted">Full Address</h6>
                        <p className="fs-5">{profileData.address}</p>
                      </div>
                    </Col>
                  </Row>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ProfileView;
