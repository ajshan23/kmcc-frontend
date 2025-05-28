import {
  Form,
  FormControl,
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import axiosInstance from "../../../globalFetch/api";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

const MemberForm = ({ committeeId, onSuccess, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || "");
  const [position, setPosition] = useState(initialData?.position || "");
  const [imageSrc, setImageSrc] = useState(initialData?.image || null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const cropperRef = useRef(null);
  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (initialData?.image) {
      setImageSrc(initialData.image);
    }
  }, [initialData]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, etc.)");
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
    };
    reader.onerror = () => {
      setError("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.getCroppedCanvas().toBlob(
        (blob) => {
          setCroppedImage(blob);
        },
        "image/jpeg",
        0.8
      ); // 80% quality
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!name || !position) {
      setError("Name and position are required");
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("position", position);

    // Only append image if it's new or changed
    if (
      croppedImage &&
      (!initialData?.image ||
        (initialData.image && typeof initialData.image === "string"))
    ) {
      formData.append("image", croppedImage, "member.jpg");
    }

    try {
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(
          `/constitution-committees/members/${initialData.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        response = await axiosInstance.post(
          `/constitution-committees/${committeeId}/members`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        onSuccess(response.data.data);
      }
    } catch (error) {
      console.error("Error saving member:", error);
      setError(
        error.response?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} member`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Member Name *</Form.Label>
            <FormControl
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter member name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Position *</Form.Label>
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
                src={URL.createObjectURL(croppedImage)}
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
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
              {isEditMode ? "Updating..." : "Adding..."}
            </>
          ) : isEditMode ? (
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
