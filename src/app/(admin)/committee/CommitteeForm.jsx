import {
    Card,
    CardBody,
    Col,
    FormControl,
    Row,
    Form,
    Button,
    Toast,
    ToastHeader,
    ToastBody,
  } from "react-bootstrap";
  import { useState, useEffect } from "react";
  import axiosInstance from "../../../globalFetch/api";
  import { useNavigate, useParams } from "react-router-dom";
  import PageTitle from "../../../components/PageTitle";
  import smLogo from "@/assets/images/logo-sm.png";
  
  const CommitteeForm = () => {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      if (isEditMode) {
        const fetchCommittee = async () => {
          try {
            const response = await axiosInstance.get(`/constitution-committees/${id}`);
            if (response.status === 200) {
              const committee = response.data.data;
              setTitle(committee.title);
              setDescription(committee.description || "");
            }
          } catch (error) {
            console.error("Error fetching committee:", error);
            setToastMessage("Failed to load committee data");
            setShowToast(true);
          }
        };
        fetchCommittee();
      }
    }, [id, isEditMode]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
  
      if (!title) {
        setToastMessage("Committee title is required");
        setShowToast(true);
        setIsLoading(false);
        return;
      }
  
      try {
        let response;
        if (isEditMode) {
          response = await axiosInstance.put(`/constitution-committees/${id}`, {
            title,
            description,
          });
        } else {
          response = await axiosInstance.post("/constitution-committees", {
            title,
            description,
          });
        }
  
        if (response.status === (isEditMode ? 200 : 201)) {
          setToastMessage(
            `Committee ${isEditMode ? "updated" : "created"} successfully!`
          );
          setShowToast(true);
          setTimeout(() => {
            navigate("/constitution-committees");
          }, 1500);
        }
      } catch (error) {
        console.error(
          `Error ${isEditMode ? "updating" : "creating"} committee:`,
          error
        );
        setToastMessage(
          `Failed to ${isEditMode ? "update" : "create"} committee. Please try again.`
        );
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };
  
    return (
      <>
        <PageTitle title={isEditMode ? "Edit Committee" : "Create Committee"} />
  
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
        >
          <ToastHeader>
            <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
            <strong className="me-auto">KMCC</strong>
          </ToastHeader>
          <ToastBody>{toastMessage}</ToastBody>
        </Toast>
  
        <Row>
          <Col xs={12}>
            <Card>
              <CardBody>
                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title *</Form.Label>
                        <Form.Control
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Enter committee title"
                          required
                        />
                      </Form.Group>
  
                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter committee description"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
  
                  <div className="d-flex justify-content-end mt-4">
                    <Button
                      variant="secondary"
                      className="me-2"
                      onClick={() => navigate("/constitution-committees")}
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-1"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          {isEditMode ? "Updating..." : "Creating..."}
                        </>
                      ) : isEditMode ? (
                        "Update Committee"
                      ) : (
                        "Create Committee"
                      )}
                    </Button>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </>
    );
  };
  
  export default CommitteeForm;