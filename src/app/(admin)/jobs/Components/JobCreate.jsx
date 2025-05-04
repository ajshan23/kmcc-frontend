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
import { useRef, useState, useEffect } from "react";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import "cropperjs/dist/cropper.css";
import axiosInstance from "../../../../globalFetch/api";
import { useNavigate, useParams } from "react-router-dom";
import PageTitle from "../../../../components/PageTitle";
import smLogo from "@/assets/images/logo-sm.png";

const JobForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [jobmode, setJobmode] = useState("");
  const [salary, setSalary] = useState("");
  const [place, setPlace] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [keyResponsibilities, setKeyResponsibilities] = useState([""]);
  const [requirements, setRequirements] = useState([""]);
  const [benefits, setBenefits] = useState([{ heading: "", description: "" }]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const predefinedHeadings = [
    "Medical",
    "Time Off",
    "Flexible Hours",
    "Remote Work",
    "Bonuses",
  ];
  const [availableHeadings, setAvailableHeadings] =
    useState(predefinedHeadings);

  const cropperRef = useRef(null);
  const bannerAspectRatio = 200 / 200;

  useEffect(() => {
    if (isEditMode) {
      const fetchJob = async () => {
        try {
          const response = await axiosInstance.get(`/jobs/${id}`);
          if (response.status === 200) {
            const job = response.data.data || response.data; // Handle both response structures

            setCompanyName(job.companyName || "");
            setPosition(job.position || "");
            setJobmode(job.jobMode || "");
            setSalary(job.salary ? job.salary.toString() : "");
            setPlace(job.place || "");
            setJobDescription(job.jobDescription || "");
            setKeyResponsibilities(job.keyResponsibilities || [""]);
            setRequirements(job.requirements || [""]);
            setBenefits(job.benefits || [{ heading: "", description: "" }]);
            setIsClosed(job.isClosed || false);

            if (job.logo) {
              setImageSrc(job.logo);
              setCroppedImage(job.logo);
            }

            const usedHeadings = job.benefits?.map((b) => b.heading) || [];
            setAvailableHeadings(
              predefinedHeadings.filter((h) => !usedHeadings.includes(h))
            );
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          setToastMessage("Failed to load job data.");
          setShowToast(true);
        }
      };
      fetchJob();
    }
  }, [id, isEditMode]);

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

  const addKeyResponsibilitiesField = () => {
    setKeyResponsibilities([...keyResponsibilities, ""]);
  };

  const removeKeyResponsibilitiesField = (index) => {
    const updatedKeyResponsibilities = keyResponsibilities.filter(
      (_, i) => i !== index
    );
    setKeyResponsibilities(updatedKeyResponsibilities);
  };

  const updateKeyResponsibilitiesField = (index, value) => {
    const updatedKeyResponsibilities = [...keyResponsibilities];
    updatedKeyResponsibilities[index] = value;
    setKeyResponsibilities(updatedKeyResponsibilities);
  };

  const addRequirementsField = () => {
    setRequirements([...requirements, ""]);
  };

  const removeRequirementsField = (index) => {
    const updatedRequirements = requirements.filter((_, i) => i !== index);
    setRequirements(updatedRequirements);
  };

  const updateRequirementsField = (index, value) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const addBenefitsField = () => {
    setBenefits([...benefits, { heading: "", description: "" }]);
  };

  const removeBenefitsField = (index) => {
    const removedBenefit = benefits[index];
    setBenefits(benefits.filter((_, i) => i !== index));

    if (predefinedHeadings.includes(removedBenefit.heading)) {
      setAvailableHeadings([...availableHeadings, removedBenefit.heading]);
    }
  };

  const updateBenefitsField = (index, field, value) => {
    const updatedBenefits = [...benefits];
    const previousHeading = updatedBenefits[index].heading;

    updatedBenefits[index] = { ...updatedBenefits[index], [field]: value };

    if (field === "heading") {
      if (predefinedHeadings.includes(previousHeading)) {
        setAvailableHeadings([...availableHeadings, previousHeading]);
      }
      if (predefinedHeadings.includes(value)) {
        setAvailableHeadings(availableHeadings.filter((h) => h !== value));
      }
    }

    setBenefits(updatedBenefits);
  };

  const handleSubmit = async () => {
    if (!croppedImage && !isEditMode) {
      setToastMessage("Please upload and crop the image first.");
      setShowToast(true);
      return;
    }

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

    setIsLoading(true);

    const formData = new FormData();
    if (croppedImage && typeof croppedImage !== "string") {
      formData.append("logo", croppedImage, "job-logo.png");
    }
    formData.append("companyName", companyName);
    formData.append("position", position);
    formData.append("jobMode", jobmode);
    formData.append("salary", salary);
    formData.append("place", place);
    formData.append("jobDescription", jobDescription);
    formData.append("isClosed", isClosed.toString());
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
      let response;
      if (isEditMode) {
        response = await axiosInstance.put(`/jobs/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        response = await axiosInstance.post("/jobs/create", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      if (response.status === (isEditMode ? 200 : 201)) {
        setToastMessage(
          `Job ${isEditMode ? "updated" : "created"} successfully!`
        );
        setShowToast(true);
        setTimeout(() => {
          navigate("/job");
        }, 2000);
      } else {
        setToastMessage(`Failed to ${isEditMode ? "update" : "create"} job.`);
        setShowToast(true);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} job:`,
        error
      );
      setToastMessage(
        `Failed to ${isEditMode ? "update" : "create"} job. Please try again.`
      );
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageTitle title={isEditMode ? "Edit Job" : "New Job"} />

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
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Job Logo (200x200)</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </Form.Group>

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
                  <Form.Group className="mb-3">
                    <Form.Label>Company Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter company name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Position</Form.Label>
                    <Form.Control
                      type="text"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                      placeholder="Enter position"
                    />
                  </Form.Group>

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

                  <Form.Group className="mb-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                      type="text"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      placeholder="Enter salary"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Place</Form.Label>
                    <Form.Control
                      type="text"
                      value={place}
                      onChange={(e) => setPlace(e.target.value)}
                      placeholder="Enter place"
                    />
                  </Form.Group>

                  {isEditMode && (
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="job-status-switch"
                        label={isClosed ? "Job is Closed" : "Job is Open"}
                        checked={isClosed}
                        onChange={(e) => setIsClosed(e.target.checked)}
                        disabled={isLoading}
                      />
                    </Form.Group>
                  )}

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
                          disabled={keyResponsibilities.length === 1}
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
                          disabled={requirements.length === 1}
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

                  <Form.Group className="mb-3">
                    <Form.Label>Benefits</Form.Label>
                    {benefits.map((benefit, index) => (
                      <div key={index} className="mb-2 p-2 border rounded">
                        <Form.Control
                          as="select"
                          value={benefit.heading}
                          onChange={(e) =>
                            updateBenefitsField(
                              index,
                              "heading",
                              e.target.value
                            )
                          }
                          className="mb-2"
                        >
                          <option value="">Select a benefit</option>
                          {availableHeadings.map((heading) => (
                            <option key={heading} value={heading}>
                              {heading}
                            </option>
                          ))}
                          <option value="Other">Other</option>
                        </Form.Control>
                        {benefit.heading === "Other" && (
                          <Form.Control
                            type="text"
                            value={benefit.description}
                            onChange={(e) =>
                              updateBenefitsField(
                                index,
                                "heading",
                                e.target.value
                              )
                            }
                            placeholder="Enter custom benefit name"
                            className="mb-2"
                          />
                        )}
                        <Form.Control
                          as="textarea"
                          rows={2}
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
                            disabled={benefits.length === 1}
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

                  <Button
                    variant="primary"
                    className="w-100 mt-3"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading
                      ? isEditMode
                        ? "Updating..."
                        : "Creating..."
                      : isEditMode
                      ? "Update Job"
                      : "Create Job"}
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

export default JobForm;
