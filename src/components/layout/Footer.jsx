import { currentYear, developedBy } from '@/context/constants'
import { Col, Container, Row } from 'react-bootstrap'
const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col xs={12} className="text-center">
            {currentYear} © Techmin - Theme by <b>{developedBy}</b>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}
export default Footer
