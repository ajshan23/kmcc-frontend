import ComponentContainerCard from '@/components/ComponentContainerCard'
import IconifyIcon from '@/components/wrappers/IconifyIcon'
import { useState } from 'react'
import { Step, Steps, Wizard } from 'react-albus'
import { Button, Col, Form, FormControl, FormGroup, FormLabel, ProgressBar, Row } from 'react-bootstrap'
const BasicWizard = () => {
  return (
    <ComponentContainerCard title="Basic Wizard">
      <Wizard
        render={() => (
          <Steps>
            <Step
              id="account"
              render={({ next }) => (
                <Form>
                  <Row>
                    <Col>
                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="userName">
                          User name
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="text" id="userName" name="userName" defaultValue="Velonic" />
                        </Col>
                      </FormGroup>
                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="password">
                          Password
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="password" id="password" name="password" defaultValue="123456789" />
                        </Col>
                      </FormGroup>
                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="confirm">
                          Re Password
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="password" id="confirm" name="confirm" defaultValue="123456789" />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>

                  <ul className="list-inline wizard mb-0">
                    <li className="next list-inline-item float-end">
                      <Button variant="info" onClick={next}>
                        Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                      </Button>
                    </li>
                  </ul>
                </Form>
              )}
            />

            <Step
              id="profile"
              render={({ next, previous }) => (
                <Form>
                  <Row>
                    <Col>
                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="name">
                          First name
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="text" id="name" name="name" defaultValue="Francis" />
                        </Col>
                      </FormGroup>
                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="surname">
                          Last name
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="text" id="surname" name="surname" defaultValue="Brinkman" />
                        </Col>
                      </FormGroup>

                      <FormGroup as={Row} className="mb-3">
                        <FormLabel column md={3} htmlFor="email">
                          Email
                        </FormLabel>
                        <Col md={9}>
                          <FormControl type="email" id="email" name="email" defaultValue="cory1979@hotmail.com" />
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>

                  <ul className="pager wizard mb-0 list-inline">
                    <li className="previous list-inline-item">
                      <Button variant="light" onClick={previous}>
                        <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Account
                      </Button>
                    </li>
                    <li className="next list-inline-item float-end">
                      <Button variant="info" onClick={next}>
                        Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                      </Button>
                    </li>
                  </ul>
                </Form>
              )}
            />

            <Step
              id="finish"
              render={({ previous }) => (
                <Form>
                  <Row>
                    <Col>
                      <div className="text-center">
                        <h2 className="mt-0">
                          <IconifyIcon icon="ri:check-double-line" />
                        </h2>
                        <h3 className="mt-0">Thank you !</h3>

                        <p className="w-75 mb-2 mx-auto">
                          Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui. Aliquam
                          mattis dictum aliquet.
                        </p>

                        <div className="mb-3">
                          <div className="d-inline-block">
                            <Form.Check type="checkbox" id="customCheck1" label="I agree with the Terms and Conditions" />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <ul className="pager wizard mb-0 list-inline mt-1">
                    <li className="previous list-inline-item">
                      <Button variant="light" onClick={previous}>
                        <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Profile
                      </Button>
                    </li>
                    <li className="next list-inline-item float-end">
                      <Button variant="info">Submit</Button>
                    </li>
                  </ul>
                </Form>
              )}
            />
          </Steps>
        )}
      />
    </ComponentContainerCard>
  )
}
const ButtonWizard = () => {
  return (
    <ComponentContainerCard title="Button Wizard">
      <Wizard>
        <Steps>
          <Step
            id="account"
            render={({ next, replace }) => (
              <Form>
                <Row>
                  <Col>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="userName">
                        User name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="userName2" name="userName" defaultValue="Velonic" />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="password">
                        Password
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="password" id="password2" name="password" defaultValue="123456789" />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="confirm">
                        Re Password
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="password" id="confirm2" name="confirm" defaultValue="123456789" />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="float-end d-flex flex-wrap gap-1">
                  <input type="button" className="btn btn-info button-next" name="next" value="Next" onClick={next} />
                  <input type="button" className="btn btn-info button-last" name="last" value="Last" onClick={() => replace('profile')} />
                </div>
              </Form>
            )}
          />

          <Step
            id="profile"
            render={({ next, previous, replace }) => (
              <Form>
                <Row>
                  <Col>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="name">
                        First name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="name2" name="name" defaultValue="Francis" />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="surname">
                        Last name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="surname2" name="surname" defaultValue="Brinkman" />
                      </Col>
                    </FormGroup>

                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="email">
                        Email
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="email" id="email" name="email" defaultValue="cory1979@hotmail.com" />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <div className="float-end d-flex flex-wrap gap-1">
                  <input type="button" className="btn btn-info button-next" name="next" value="Next" onClick={next} />
                  <input type="button" className="btn btn-info button-last" name="last" value="Last" onClick={() => replace('finish')} />
                </div>
                <div className="float-start d-flex flex-wrap gap-1">
                  <input type="button" className="btn btn-info button-first" name="first" value="First" onClick={() => replace('account')} />
                  <input type="button" className="btn btn-info button-previous" name="previous" value="Previous" onClick={previous} />
                </div>
              </Form>
            )}
          />

          <Step
            id="finish"
            render={({ previous, replace }) => (
              <Form>
                <Row>
                  <Col>
                    <div className="text-center">
                      <h2 className="mt-0">
                        <IconifyIcon icon="ri:check-double-line" />
                      </h2>
                      <h3 className="mt-0">Thank you !</h3>

                      <p className="w-75 mb-2 mx-auto">
                        Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui. Aliquam
                        mattis dictum aliquet.
                      </p>

                      <div className="mb-3">
                        <div className="d-inline-block">
                          <Form.Check type="checkbox" id="customCheck2" label="I agree with the Terms and Conditions" />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className="float-start d-flex flex-wrap gap-1">
                  <input type="button" className="btn btn-info button-first" name="first" value="First" onClick={() => replace('account')} />
                  <input type="button" className="btn btn-info button-previous" name="previous" value="Previous" onClick={previous} />
                </div>
              </Form>
            )}
          />
        </Steps>
      </Wizard>
    </ComponentContainerCard>
  )
}
const ProgressBarWizard = () => {
  return (
    <ComponentContainerCard title="Wizard With Progress Bar">
      <Wizard
        render={({ step, steps }) => (
          <>
            <ProgressBar animated striped variant="success" now={((steps.indexOf(step) + 1) / steps.length) * 100} className="mb-3 progress-sm" />

            <Steps>
              <Step
                id="account"
                render={({ next }) => (
                  <Form>
                    <Row>
                      <Col>
                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="userName">
                            User name
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="text" id="userName3" name="userName" defaultValue="Velonic" />
                          </Col>
                        </FormGroup>
                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="password">
                            Password
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="password" id="password3" name="password" defaultValue="123456789" />
                          </Col>
                        </FormGroup>
                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="confirm">
                            Re Password
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="password" id="confirm3" name="confirm" defaultValue="123456789" />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <ul className="list-inline wizard mb-0">
                      <li className="next list-inline-item float-end">
                        <Button variant="info" onClick={next}>
                          Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                        </Button>
                      </li>
                    </ul>
                  </Form>
                )}
              />

              <Step
                id="profile"
                render={({ next, previous }) => (
                  <Form>
                    <Row>
                      <Col>
                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="name">
                            First name
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="text" id="name3" name="name" defaultValue="Francis" />
                          </Col>
                        </FormGroup>
                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="surname3">
                            Last name
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="text" id="surname" name="surname" defaultValue="Brinkman" />
                          </Col>
                        </FormGroup>

                        <FormGroup as={Row} className="mb-3">
                          <FormLabel column md={3} htmlFor="email">
                            Email
                          </FormLabel>
                          <Col md={9}>
                            <FormControl type="email" id="email" name="email" defaultValue="cory1979@hotmail.com" />
                          </Col>
                        </FormGroup>
                      </Col>
                    </Row>

                    <ul className="pager wizard mb-0 list-inline">
                      <li className="previous list-inline-item">
                        <Button variant="light" onClick={previous}>
                          <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Account
                        </Button>
                      </li>
                      <li className="next list-inline-item float-end">
                        <Button variant="info" onClick={next}>
                          Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                        </Button>
                      </li>
                    </ul>
                  </Form>
                )}
              />

              <Step
                id="finish"
                render={({ previous }) => (
                  <Form>
                    <Row>
                      <Col>
                        <div className="text-center">
                          <h2 className="mt-0">
                            <IconifyIcon icon="ri:check-double-line" />
                          </h2>
                          <h3 className="mt-0">Thank you !</h3>

                          <p className="w-75 mb-2 mx-auto">
                            Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui. Aliquam
                            mattis dictum aliquet.
                          </p>

                          <div className="mb-3">
                            <div className="d-inline-block">
                              <Form.Check type="checkbox" id="customCheck3" label="I agree with the Terms and Conditions" />
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>

                    <ul className="pager wizard mb-0 list-inline mt-1">
                      <li className="previous list-inline-item">
                        <Button variant="light" onClick={previous}>
                          <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Profile
                        </Button>
                      </li>
                      <li className="next list-inline-item float-end">
                        <Button variant="info">Submit</Button>
                      </li>
                    </ul>
                  </Form>
                )}
              />
            </Steps>
          </>
        )}
      />
    </ComponentContainerCard>
  )
}
const WizardWithFormValidation = () => {
  const [validated, setValidated] = useState(false)
  const handleSubmit = (event, next) => {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
      event.preventDefault()
      event.stopPropagation()
    }
    setValidated(true)
    if (form.checkValidity() === true) next()
  }
  return (
    <ComponentContainerCard title="Wizard With Form Validation">
      <Wizard>
        <Steps>
          <Step
            id="account"
            render={({ next }) => (
              <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, next)}>
                <Row>
                  <Col>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="userName">
                        User name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="userName4" name="username" required />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="password">
                        Password
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="password" id="password4" name="password" required />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="confirm">
                        Re Password
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="password" id="confirm4" name="confirm" required />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <ul className="list-inline wizard mb-0">
                  <li className="next list-inline-item float-end">
                    <Button variant="info" type="submit">
                      Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                    </Button>
                  </li>
                </ul>
              </Form>
            )}
          />

          <Step
            id="profile"
            render={({ next, previous }) => (
              <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e, next)}>
                <Row>
                  <Col>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="name">
                        First name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="name4" name="name" required />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="surname">
                        Last name
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="text" id="surname4" name="surname" required />
                      </Col>
                    </FormGroup>
                    <FormGroup as={Row} className="mb-3">
                      <FormLabel column md={3} htmlFor="email">
                        Email
                      </FormLabel>
                      <Col md={9}>
                        <FormControl type="email" id="email4" name="email" required />
                      </Col>
                    </FormGroup>
                  </Col>
                </Row>

                <ul className="pager wizard mb-0 list-inline">
                  <li className="previous list-inline-item">
                    <Button variant="light" onClick={previous}>
                      <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Account
                    </Button>
                  </li>
                  <li className="next list-inline-item float-end">
                    <Button variant="info" onClick={next}>
                      Add More Info <IconifyIcon icon="ri:arrow-right-line" className="ms-1" />
                    </Button>
                  </li>
                </ul>
              </Form>
            )}
          />

          <Step
            id="finish"
            render={({ previous }) => (
              <>
                <Row>
                  <Col>
                    <div className="text-center">
                      <h2 className="mt-0">
                        <IconifyIcon icon="ri:check-double-line" />
                      </h2>
                      <h3 className="mt-0">Thank you !</h3>
                      <p className="w-75 mb-2 mx-auto">
                        Quisque nec turpis at urna dictum luctus. Suspendisse convallis dignissim eros at volutpat. In egestas mattis dui. Aliquam
                        mattis dictum aliquet.
                      </p>
                      <div className="mb-3">
                        <div className="d-inline-block">
                          <Form.Check type="checkbox" id="customCheck4" label="I agree with the Terms and Conditions" />
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>

                <ul className="pager wizard mb-0 list-inline mt-1">
                  <li className="previous list-inline-item">
                    <Button variant="light" onClick={previous}>
                      <IconifyIcon icon="ri:arrow-left-line" className="me-1" /> Back to Profile
                    </Button>
                  </li>
                  <li className="next list-inline-item float-end">
                    <Button variant="info">Submit</Button>
                  </li>
                </ul>
              </>
            )}
          />
        </Steps>
      </Wizard>
    </ComponentContainerCard>
  )
}
const AllWizard = () => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <BasicWizard />
        </Col>
        <Col xs={12}>
          <ButtonWizard />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ProgressBarWizard />
        </Col>
        <Col xs={12}>
          <WizardWithFormValidation />
        </Col>
      </Row>
    </>
  )
}
export default AllWizard
