import Cropper from 'react-cropper';
import { Card, CardBody, Col, FormControl, Row, Form, Button, Toast, ToastHeader, ToastBody } from 'react-bootstrap';
import { useRef, useState } from 'react';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import 'cropperjs/dist/cropper.css';
import axiosInstance from '../../../../globalFetch/api';
import { useNavigate, useParams } from 'react-router-dom';
import PageTitle from '../../../../components/PageTitle';
import smLogo from '@/assets/images/logo-sm.png';

const AddQuestions = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    if (!id) {
        navigate('/survey')
    }
    const [showToast, setShowToast] = useState(false); // State to control Toast visibility
    const [imageSrc, setImageSrc] = useState(null); // State for uploaded image
    const [cropData, setCropData] = useState({
        cropX: 0,
        cropY: 0,
        imageWidth: 0,
        imageHeight: 0,
        imageRotate: 0,
        scaleX: 0,
        scaleY: 0,
    });
    const [croppedImage, setCroppedImage] = useState(null); // State for cropped image
    const [text, setText] = useState(''); // State for event title

    const [type, setType] = useState('text'); // State for event type

    const [options, setOptions] = useState(['']); // State for highlights (array of strings)
    const cropperRef = useRef(null);

    // Fixed aspect ratio for event (362x472)
    const bannerAspectRatio = 400 / 400;

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
            const data = cropper.getData();
            const imageData = cropper.getImageData();
            setCropData({
                cropX: Math.ceil(data.x),
                cropY: Math.ceil(data.y),
                imageWidth: Math.ceil(imageData.width),
                imageHeight: Math.ceil(imageData.height),
                imageRotate: Math.ceil(imageData.rotate),
                scaleX: Math.ceil(imageData.scaleX),
                scaleY: Math.ceil(imageData.scaleY),
            });

            // Get the cropped image as a blob
            cropper.getCroppedCanvas().toBlob((blob) => {
                setCroppedImage(blob);
            });
        }
    };

    // Handle adding a new highlight field
    const addOptionsField = () => {
        setOptions([...options, '']); // Add an empty string to the highlights array
    };

    // Handle removing a highlight field
    const removeOptionsField = (index) => {
        const updatedOptions = options.filter((_, i) => i !== index); // Remove the highlight at the specified index
        setOptions(updatedOptions);
    };

    // Handle updating a highlight field
    const updateOptionsField = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value; // Update the highlight at the specified index
        setOptions(updatedOptions);
    };

    // Handle upload to backend
    const handleUpload = async () => {
        if (!croppedImage) {
            alert('Please crop the image first.');
            return;
        }

        // Convert the cropped image to a File object
        const file = new File([croppedImage], 'banner-image.png', {
            type: 'image/png',
        });


        // Create FormData and append the file with the key 'image'
        const formData = new FormData();
        formData.append('surveyId',id);
        formData.append('image', file); // Use 'image' as the key
        formData.append('text', text);
        formData.append('type', type);
    
       if(type==='multiple_choice'){
        formData.append('options', JSON.stringify(options.filter((h) => h.trim() !== '')));
       }

        
        for (let pair of formData.entries()) {
            console.log(pair[0], pair[1]);
        }
        try {
            // Use Axios for the POST request
            const response = await axiosInstance.post('/survey/question', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Let Axios set the boundary
                },
            });
            console.log(response);

            if (response.status === 200) {
                setShowToast(true); // Show Toast on success
                setTimeout(() => {
                    navigate(`/questions/${id}`); // Redirect to /event after 2 seconds
                }, 2000);
            } else {
                alert('Failed to upload banner.');
                console.error('Upload failed:', response.data);
            }
        } catch (error) {
            console.error('Error uploading banner:', error);
            alert('Failed to upload banner.');
        }
    };

    return (
        <>
            <PageTitle title="New Questions" />

            {/* Toast Notification */}
            <Toast
                onClose={() => setShowToast(false)}
                show={showToast}
                delay={2000}
                autohide
                style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}
            >
                <ToastHeader>
                    <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
                    <strong className="me-auto">TECHMIN</strong>
                </ToastHeader>
                <ToastBody>Question created successfully.</ToastBody>
            </Toast>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardBody>
                            <Row>
                                <Col lg={9}>
                                    {/* Image Upload */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Upload Event Image (400x400)</Form.Label>
                                        <Form.Control type="file" accept="image/*" onChange={handleImageUpload} />
                                    </Form.Group>

                                    {/* Cropper */}
                                    {imageSrc && (
                                        <>
                                            <div className="img-container">
                                                <Cropper
                                                    src={imageSrc}
                                                    style={{ height: 400, width: '100%' }}
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
                                                        <Button onClick={() => cropperRef.current?.cropper.zoom(0.1)}>
                                                            <IconifyIcon icon="mdi:magnify-plus-outline" /> Zoom In
                                                        </Button>
                                                        <Button onClick={() => cropperRef.current?.cropper.zoom(-0.1)}>
                                                            <IconifyIcon icon="mdi:magnify-minus-outline" /> Zoom Out
                                                        </Button>
                                                        <Button onClick={() => cropperRef.current?.cropper.rotate(-45)}>
                                                            <IconifyIcon icon="mdi:rotate-left" /> Rotate Left
                                                        </Button>
                                                        <Button onClick={() => cropperRef.current?.cropper.rotate(45)}>
                                                            <IconifyIcon icon="mdi:rotate-right" /> Rotate Right
                                                        </Button>
                                                        <Button onClick={() => cropperRef.current?.cropper.reset()}>
                                                            <IconifyIcon icon="mdi:sync" /> Reset
                                                        </Button>
                                                        <Button onClick={() => cropperRef.current?.cropper.clear()}>
                                                            <IconifyIcon icon="mdi:close" /> Clear
                                                        </Button>
                                                    </div>
                                                </CardBody>
                                            </Card>
                                        </>
                                    )}
                                </Col>

                                <Col lg={3}>
                                    {/* Text Field */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Question Text</Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={text}
                                            onChange={(e) => setText(e.target.value)}
                                            placeholder="Enter question"
                                        />
                                    </Form.Group>



                                    {/*  Type Field */}
                                    <Form.Group className="mb-3">
                                        <Form.Label>Question Type</Form.Label>
                                        <Form.Control
                                            as="select"
                                            value={type}
                                            onChange={(e) => setType(e.target.value)}
                                        >
                                        <option value="">Select Question Type</option> 
                                            <option value="text">Text</option>
                                            <option value="multiple_choice">Multiple Choice</option>

                                        </Form.Control>
                                    </Form.Group>






                                    {/* Options Field */}
                                  { type ==='multiple_choice' && <Form.Group className="mb-3">
                                        <Form.Label>Options</Form.Label>
                                        {options.map((option, index) => (
                                            <div key={index} className="d-flex align-items-center mb-2">
                                                <Form.Control
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOptionsField(index, e.target.value)}
                                                    placeholder={`Option ${index + 1}`}
                                                />
                                                <Button
                                                    variant="danger"
                                                    className="ms-2"
                                                    onClick={() => removeOptionsField(index)}
                                                >
                                                    <IconifyIcon icon="mdi:delete" />
                                                </Button>
                                            </div>
                                        ))}
                                        <Button
                                            variant="secondary"
                                            className="w-100"
                                            onClick={addOptionsField}
                                            disabled={options.length ===4}
                                        >
                                            <IconifyIcon icon="mdi:plus" /> Add Options
                                        </Button>
                                    </Form.Group>}

                                    {/* Upload Button */}
                                    <Button
                                        variant="primary"
                                        className="w-100 mt-3"
                                        onClick={handleUpload}
                                        disabled={!croppedImage}
                                    >
                                        <IconifyIcon icon="mdi:upload" /> Create Question
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

export default AddQuestions;
