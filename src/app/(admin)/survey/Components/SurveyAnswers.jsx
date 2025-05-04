import PageTitle from "../../../../components/PageTitle";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../../../../globalFetch/api";
import {
  Button,
  Col,
  Row,
  Modal,
  Toast,
  ToastHeader,
  ToastBody,
  Container,
  Table,
  Card,
  Accordion,
  Badge,
} from "react-bootstrap";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import smLogo from "@/assets/images/logo-sm.png";

const SurveyAnswers = () => {
  const { surveyId } = useParams();
  const [answersByUser, setAnswersByUser] = useState({});
  const [questionStats, setQuestionStats] = useState([]);
  const [survey, setSurvey] = useState(null);
  const [totalRespondents, setTotalRespondents] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  useEffect(() => {
    if (surveyId) {
      fetchSurveyAnswers();
    }
  }, [surveyId]);

  const fetchSurveyAnswers = async () => {
    try {
      const response = await axiosInstance.get(`/survey/answers/${surveyId}`);
      if (response.status === 200) {
        const data = response.data.data;
        setSurvey(data.survey);
        setAnswersByUser(data.answers);
        setQuestionStats(data.statistics);
        setTotalRespondents(data.totalRespondents);
      }
    } catch (error) {
      console.error("Error fetching survey answers:", error);
      setToastMessage("Failed to fetch survey answers");
      setShowToast(true);
    }
  };

  const toggleAccordion = (userId) => {
    setActiveAccordion(activeAccordion === userId ? null : userId);
  };

  return (
    <Container className="p-4">
      <PageTitle title="Survey Answers" />

      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={5000}
        autohide
        style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}
      >
        <ToastHeader>
          <img src={smLogo} alt="brand-logo" height="16" className="me-1" />
          <strong className="me-auto">TECHMIN</strong>
        </ToastHeader>
        <ToastBody>{toastMessage}</ToastBody>
      </Toast>

      {survey && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{survey.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {survey.description}
            </Card.Subtitle>
            <div className="d-flex justify-content-between mt-3">
              <div>
                <Badge bg="primary" className="me-2">
                  Questions: {survey.questions.length}
                </Badge>
                <Badge bg="success">Respondents: {totalRespondents}</Badge>
              </div>
              <Button
                variant="outline-primary"
                as={Link}
                to={`/survey/answers/${surveyId}/export`}
              >
                Export Answers
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col xs={12} md={6}>
          <h4 className="mb-3">Individual Responses</h4>
          <Accordion activeKey={activeAccordion}>
            {Object.entries(answersByUser).map(([userId, userData]) => (
              <Accordion.Item eventKey={userId} key={userId}>
                <Accordion.Header onClick={() => toggleAccordion(userId)}>
                  {userData.user.name} ({userData.user.memberId})
                </Accordion.Header>
                <Accordion.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Question</th>
                        <th>Answer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {survey?.questions.map((question) => (
                        <tr key={question.id}>
                          <td>{question.text}</td>
                          <td>
                            {userData.answers[question.id] || "Not answered"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>

        <Col xs={12} md={6}>
          <h4 className="mb-3">Question Statistics</h4>
          {questionStats.map((stat) => (
            <Card key={stat.questionId} className="mb-3">
              <Card.Body>
                <Card.Title>{stat.questionText}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Total answers: {stat.totalAnswers}
                </Card.Subtitle>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Option</th>
                      <th>Count</th>
                      <th>Percentage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stat.options.map((option, idx) => (
                      <tr key={idx}>
                        <td>{option.option}</td>
                        <td>{option.count}</td>
                        <td>{option.percentage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default SurveyAnswers;
