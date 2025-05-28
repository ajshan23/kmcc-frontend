import {
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  CardBody,
} from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../../globalFetch/api";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const MemberForm = ({ subWingId, onSuccess, onCancel, member }) => {
  const [name, setName] = useState(member?.name || "");
  const [position, setPosition] = useState(member?.position || "");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const cropperRef = useRef(null);

  useEffect(() => {
    if (member) {
      setName(member.name);
      setPosition(member.position);
      if (member.image) {
        setImageSrc(member.image);
        setCroppedImage(member.image);
      }
    }
  }, [member]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!name || !position) {
      alert("Name and position are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);
    if (croppedImage && (!member || croppedImage !== member.image)) {
      formData.append("image", croppedImage, "member.jpg");
    }

    try {
      const url = member
        ? `/sub-wing/${subWingId}/members/${member.id}`
        : `/sub-wing/${subWingId}/members`;

      const method = member ? "put" : "post";

      const response = await axiosInstance[method](url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === (member ? 200 : 201)) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error("Error saving member:", error);
      alert(`Failed to ${member ? "update" : "add"} member`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Name</Form.Label>
            <FormControl
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Position</Form.Label>
            <FormControl
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Enter position"
              required
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Image (163x231 recommended)</Form.Label>
            <FormControl
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Form.Group>

          {imageSrc && (
            <Card className="mb-3">
              <CardBody>
                <Cropper
                  src={imageSrc}
                  style={{ height: 400, width: "100%" }}
                  initialAspectRatio={163 / 231}
                  aspectRatio={163 / 231}
                  guides={false}
                  crop={onCrop}
                  ref={cropperRef}
                />
              </CardBody>
            </Card>
          )}

          {croppedImage && (
            <div className="mb-3">
              <h6>Cropped Preview:</h6>
              <img
                src={
                  typeof croppedImage === "string"
                    ? croppedImage
                    : URL.createObjectURL(croppedImage)
                }
                alt="Cropped preview"
                style={{ maxHeight: "200px" }}
              />
            </div>
          )}
        </Col>
      </Row>

      <div className="d-flex justify-content-end">
        <Button variant="secondary" className="me-2" onClick={onCancel}>
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
              {member ? "Updating..." : "Adding..."}
            </>
          ) : member ? (
            "Update Member"
          ) : (
            "Add Member"
          )}
        </Button>
      </div>
    </Form>
  );
};

export default MemberForm;
