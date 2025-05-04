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
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useRef } from "react";

const ExclusiveMemberForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = useRef(null);
  const aspectRatio = 1; // Square image for members

  useEffect(() => {
    if (isEditMode) {
      const fetchMember = async () => {
        try {
          const response = await axiosInstance.get(`/exclusive-members/${id}`);
          if (response.status === 200) {
            const member = response.data.data || response.data;
            setName(member.name);
            setPosition(member.position);
            if (member.image) {
              setImageSrc(member.image);
              setCroppedImage(member.image);
            }
          }
        } catch (error) {
          console.error("Error fetching member:", error);
          setToastMessage("Failed to load member data.");
          setToastVariant("danger");
          setShowToast(true);
        }
      };
      fetchMember();
    }
  }, [id, isEditMode]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => setCroppedImage(blob));
    }
  };

  const handleSubmit = async () => {
    if (!name || !position) {
      setToastMessage("Please fill all required fields.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    if (!isEditMode && !croppedImage) {
      setToastMessage("Please crop the image first.");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    if (croppedImage && typeof croppedImage !== "string") {
      formData.append("image", croppedImage, "member-image.png");
    }
    formData.append("name", name);
    formData.append("position", position);

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(
          `/exclusive-members/${id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        response = await axiosInstance.post("/exclusive-members", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `Member ${isEditMode ? "updated" : "created"} successfully!`
        );
        setToastVariant("success");
        setShowToast(true);
        setTimeout(() => {
          navigate("/exclusive-members");
        }, 2000);
      } else {
        throw new Error(
          `Failed to ${isEditMode ? "update" : "create"} member.`
        );
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} member:`,
        error
      );
      setToastMessage(
        `Failed to ${
          isEditMode ? "update" : "create"
        } member. Please try again.`
      );
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Member" : "New Member"} />
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={2000}
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
              <Row>
                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Member Image (Square)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

                  {imageSrc && (
                    <Cropper
                      src={imageSrc}
                      style={{ height: 400, width: "100%" }}
                      initialAspectRatio={aspectRatio}
                      aspectRatio={aspectRatio}
                      guides={false}
                      crop={onCrop}
                      ref={cropperRef}
                    />
                  )}
                </Col>

                <Col lg={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter member name"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Enter member position"
                      required
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={isLoading || (!isEditMode && !croppedImage)}
                  >
                    {isLoading ? (
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
                          icon={isEditMode ? "mdi:pencil" : "mdi:upload"}
                        />
                        {isEditMode ? " Update Member" : " Create Member"}
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ExclusiveMemberForm;
