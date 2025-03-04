import Cropper from "react-cropper";
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
import { useRef, useState } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "cropperjs/dist/cropper.css";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const JobCreate = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false); // State to control Toast visibility
  const [toastMessage, setToastMessage] = useState(""); // State for toast message
  const [imageSrc, setImageSrc] = useState(null); // State for uploaded image
  const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
  const [companyName, setCompanyName] = useState(""); // State for company name
  const [position, setPosition] = useState(""); // State for position
  const [jobmode, setJobmode] = useState(""); // State for job mode
  const [salary, setSalary] = useState(""); // State for salary
  const [place, setPlace] = useState(""); // State for place
  const [jobDescription, setJobDescription] = useState(""); // State for job description
  const [keyResponsibilities, setKeyResponsibilities] = useState([""]); // State for key responsibilities
  const [requirements, setRequirements] = useState([""]); // State for requirements
  const [benefits, setBenefits] = useState([{ heading: "", description: "" }]); // State for benefits
  const [isLoading, setIsLoading] = useState(false); // State for loading state

  const cropperRef = useRef(null);

  // Fixed aspect ratio for job image (200x200)
  const bannerAspectRatio = 200 / 200;

  // Handle image upload
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

  // Handle crop event
  const onCrop = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      // Get the cropped image as a blob
      cropper.getCroppedCanvas().toBlob((blob) => {
        setCroppedImage(blob);
      });
    }
  };

  // Handle adding a new key responsibility field
  const addKeyResponsibilitiesField = () => {
    setKeyResponsibilities([...keyResponsibilities, ""]);
  };

  // Handle removing a key responsibility field
  const removeKeyResponsibilitiesField = (index) => {
    const updatedKeyResponsibilities = keyResponsibilities.filter(
      (_, i) => i !== index
    );
    setKeyResponsibilities(updatedKeyResponsibilities);
  };

  // Handle updating a key responsibility field
  const updateKeyResponsibilitiesField = (index, value) => {
    const updatedKeyResponsibilities = [...keyResponsibilities];
    updatedKeyResponsibilities[index] = value;
    setKeyResponsibilities(updatedKeyResponsibilities);
  };

  // Handle adding a new requirement field
  const addRequirementsField = () => {
    setRequirements([...requirements, ""]);
  };

  // Handle removing a requirement field
  const removeRequirementsField = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
  };

  // Handle updating a requirement field
  const updateRequirementsField = (index, value) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  // Handle adding a new benefit field
  const addBenefitsField = () => {
    setBenefits([...benefits, { heading: "", description: "" }]);
  };

  // Handle removing a benefit field
  const removeBenefitsField = (index) => {
    const updatedBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(updatedBenefits);
  };

  // Handle updating a benefit field
  const updateBenefitsField = (index, field, value) => {
    const updatedBenefits = [...benefits];
    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };
    setBenefits(updatedBenefits);
  };

  // Handle upload to backend
  const handleUpload = async () => {
    if (!croppedImage) {
      setToastMessage("Please crop the image first.");
      setShowToast(true);
      return;
    }

    // Validate required fields
    if (
      !companyName ||
      !position ||
      !jobmode ||
      !salary ||
      !place ||
      !jobDescription ||
      keyResponsibilities.length === 0 ||
      requirements.length === 0 ||
      benefits.length === 0
    ) {
      setToastMessage("Please fill all required fields.");
      setShowToast(true);
      return;
    }

    setIsLoading(true); // Set loading state

    // Create FormData and append the file with the key 'logo'
    const formData = new FormData();
    formData.append("logo", croppedImage, "job-logo.png"); // Append the cropped image as a file
    formData.append("companyName", companyName);
    formData.append("position", position);
    formData.append("jobMode", jobmode);
    formData.append("salary", salary);
    formData.append("place", place);
    formData.append("jobDescription", jobDescription);
    formData.append(
      "keyResponsibilities",
      JSON.stringify(keyResponsibilities.filter((k) => k.trim() !== ""))
    );
    formData.append(
      "requirements",
      JSON.stringify(requirements.filter((r) => r.trim() !== ""))
    );
    formData.append(
      "benefits",
      JSON.stringify(
        benefits.filter(
          (b) => b.heading.trim() !== "" || b.description.trim() !== ""
        )
      )
    );

    try {
      // Use Axios for the POST request
      const response = await axiosInstance.post("/jobs/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setToastMessage("Job created successfully!");
        setShowToast(true); // Show success toast
        setTimeout(() => {
          navigate("/job"); // Redirect to /job after 2 seconds
        }, 2000);
      } else {
        setToastMessage("Failed to create job.");
        setShowToast(true); // Show error toast
      }
    } catch (error) {
      console.error("Error creating job:", error);
      setToastMessage("Failed to create job. Please try again.");
      setShowToast(true); // Show error toast
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <>
      <PageTitle title="New Job" />

      {/* Toast Notification */}
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
                <Col lg={9}>
                  {/* Image Upload */}
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Job Logo (200x200)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

                  {/* Cropper */}
                  {imageSrc && (
                    <>
                      <div className="img-container">
                        <Cropper
                          src={imageSrc}
                          style={{ height: 400, width: "100%" }}
                          initialAspectRatio={bannerAspectRatio}
                          aspectRatio={bannerAspectRatio}
                          guides={false}
                          crop={onCrop}
                          ref={cropperRef}
                          rotatable
                          scalable
                          zoomable
                        />
                      </div>

                      <Card>
                        <CardBody>
                          <div className="d-flex gap-2 flex-wrap">
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.zoom(0.1)
                              }
                            >
                              <IconifyIcon icon="mdi:magnify-plus-outline" />{" "}
                              Zoom In
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.zoom(-0.1)
                              }
                            >
                              <IconifyIcon icon="mdi:magnify-minus-outline" />{" "}
                              Zoom Out
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.rotate(-45)
                              }
                            >
                              <IconifyIcon icon="mdi:rotate-left" /> Rotate Left
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.rotate(45)
                              }
                            >
                              <IconifyIcon icon="mdi:rotate-right" /> Rotate
                              Right
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.reset()
                              }
                            >
                              <IconifyIcon icon="mdi:sync" /> Reset
                            </Button>
                            <Button
                              onClick={() =>
                                cropperRef.current?.cropper.clear()
                              }
                            >
                              <IconifyIcon icon="mdi:close" /> Clear
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </>
                  )}
                </Col>

                <Col lg={3}>
                  {/* Company Name Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </Form.Group>

                  {/* Position Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Enter position"
                    />
                  </Form.Group>

                  {/* Job Mode Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Job Mode</Form.Label>
                    <Form.Control
                      as="select"
                      value={jobmode}
                      onChange={(e) => setJobmode(e.target.value)}
                    >
                      <option value="">Select job mode</option>
                      <option value="Full-Time">Full Time</option>
                      <option value="Part-Time">Part Time</option>
                      <option value="Freelance">Freelance</option>
                      <option value="Internship">Internship</option>
                      <option value="other">Other</option>
                    </Form.Control>
                  </Form.Group>

                  {/* Salary Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="Enter salary"
                    />
                  </Form.Group>

                  {/* Place Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Place</Form.Label>
                    <Form.Control
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="Enter place"
                    />
                  </Form.Group>

                  {/* Job Description Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Job Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="Enter job description"
                    />
                  </Form.Group>

                  {/* Key Responsibilities Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Key Responsibilities</Form.Label>
                    {keyResponsibilities.map((responsibility, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <Form.Control
                          type="text"
                          value={responsibility}
                          onChange={(e) =>
                            updateKeyResponsibilitiesField(
                              index,
                              e.target.value
                            )
                          }
                          placeholder={`Responsibility ${index + 1}`}
                        />
                        <Button
                          variant="danger"
                          className="ms-2"
                          onClick={() => removeKeyResponsibilitiesField(index)}
                        >
                          <IconifyIcon icon="mdi:delete" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={addKeyResponsibilitiesField}
                    >
                      <IconifyIcon icon="mdi:plus" /> Add Responsibility
                    </Button>
                  </Form.Group>

                  {/* Requirements Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Requirements</Form.Label>
                    {requirements.map((requirement, index) => (
                      <div
                        key={index}
                        className="d-flex align-items-center mb-2"
                      >
                        <Form.Control
                          type="text"
                          value={requirement}
                          onChange={(e) =>
                            updateRequirementsField(index, e.target.value)
                          }
                          placeholder={`Requirement ${index + 1}`}
                        />
                        <Button
                          variant="danger"
                          className="ms-2"
                          onClick={() => removeRequirementsField(index)}
                        >
                          <IconifyIcon icon="mdi:delete" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      className="w-100"
                      onClick={addRequirementsField}
                    >
                      <IconifyIcon icon="mdi:plus" /> Add Requirement
                    </Button>
                  </Form.Group>

                  {/* Benefits Field */}
                  <Form.Group className="mb-3">
                    <Form.Label>Benefits</Form.Label>
                    {benefits.map((benefit, index) => (
                      <div key={index} className="mb-2 p-2 border rounded">
                        <Form.Control
                          type="text"
                          value={benefit.heading}
                          onChange={(e) =>
                            updateBenefitsField(
                              index,
                              "heading",
                              e.target.value
                            )
                          }
                          placeholder="Benefit Heading"
                          className="mb-2"
                        />
                        <Form.Control
                          type="text"
                          value={benefit.description}
                          onChange={(e) =>
                            updateBenefitsField(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Benefit Description"
                          className="mb-2"
                        />
                        <div className="d-flex justify-content-center">
                          <Button
                            variant="danger"
                            onClick={() => removeBenefitsField(index)}
                            disabled={benefits.length === 1} // Prevent removing last one
                          >
                            <IconifyIcon icon="mdi:delete" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="secondary"
                      className="w-100 mt-2"
                      onClick={addBenefitsField}
                    >
                      <IconifyIcon icon="mdi:plus" /> Add Benefit
                    </Button>
                  </Form.Group>

                  {/* Upload Button */}
                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleUpload}
                    disabled={!croppedImage || isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Job"}
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

export default JobCreate;
