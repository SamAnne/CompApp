
import { Figure, Card, Container, Col, Row, ListGroup, ListGroupItem } from 'react-bootstrap';
import TopNav from '../components/navbar';


const initSnippet = `import * as Sentry from "@sentry/node";
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
});`;


function Screenshot({ src, alt, caption } : {src: string, alt: string, caption: string}) {
  return (
    <Figure className="d-block text-center my-4 ">
      {src ? (
        <Figure.Image src={src} alt={alt} fluid rounded className="border" />
      ) : (
        <div
          className="border rounded bg-body-tertiary text-body-secondary d-flex align-items-center justify-content-center"
          style={{ minHeight: 200 }}
          role="img"
          aria-label={alt}
        >
          Screenshot: {caption}
        </div>
      )}
      <Figure.Caption className="mt-2 secondary-text">{caption}</Figure.Caption>
    </Figure>
  );
}

export default function SentryBlogPost() {
  return (
    <div>
        <TopNav/>

        <Container fluid as="article" style={{ paddingTop: '8rem' }} className="primary-content d-flex flex-row justify-content-center align-items-center center-page ms-auto w-100 primary-content">
      <Row className="justify-content-center">
        <Col lg={8} xl={7}>
          <header className="mb-4">
            <h1 className="display-5 fw-bold">Monitoring a Recipe Site with <span className='secondary-text'>Sentry</span></h1>
          </header>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Introduction</h2>
            <p>
              Sentry is a monitoring tool that focuses on errors and how errors are handled in a
              program. Whenever the program hits an error, it alerts the owner of the website. The
              metrics not only include errors, but also issues like uptime and performance
              monitoring. Specifically for this website, Sentry is perfect because it can capture any
              exceptions a user encounters with the full stack trace with the request that triggered
              it. Spoonacular is an API used to get the nutritional information on this site, but it
              is prone to errors leading to issues while displaying the needed data. This also
              allows the site to monitor the API responses and whether it has hit the limit of
              requests or not.
            </p>
          </section>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Why <span className='secondary-text'>Sentry</span>?</h2>
            <p>
              The reason for Sentry is the multitude of metrics it measures with one dashboard. It
              solves the issues of tracing errors, recording the health of the site, and recording
              errors depending on how frequent you decide to set it to. It can also alert you by
              sending emails to get realtime issues and have the opportunity to fix them in time.
              With the use of the Spoonacular API on this site, measuring the speed of the request
              along with failures is important because that is the core of the experience. Without
              the data from the API, there cannot be a comparison to the filters selected by the user
              making this a great addition and why this specific tool was chosen.
            </p>
            <p>
              Sentry can be very easy to start if you know how to code, with the lines you need to
              insert given and the location as well. The errors can be collapsed into one if there
              are duplicates making them easier to read and understand. The dashboard itself is not
              hosted on your site, but on the sentry.io site with your login after connecting with
              the given DSN. Though I haven’t used it for the frontend, it can be utilized for both
              the back and frontend. The alerts for a small website can be very useful, especially
              the monitor for health to check if the website is up or experiencing downtime.
            </p>
            <p>
              Some limitations for Sentry include no monitoring of CPU or memory and the success
              rate. The ratio of errors to success can’t be measured because it only measures
              failure. While it tells you that an error occurred, it is reactive not preventative. If
              you are alerted of an error, it depends on the user to react and fix it in a reasonable
              time. Another issue I encountered is the dashboard itself having many different
              sections that can be confusing when first looking at it. It took me a while to
              understand where I’m supposed to look and certain things I have to create a monitor for
              myself.
            </p>
          </section>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Installation and Configuration</h2>
            <p>
              The setup for Sentry is extremely simple with the first step being creating an
              account, then install Sentry depending on what framework you are using. I’m using
              Node.js so the install command for mine is <code>npm install @sentry/node</code>. Once
              your account is created, you receive a DSN and it goes into a file called{' '}
              <code>instrument.js/ts</code> where sentry is initialized. You get the option to pick
              what to monitor specifically, and based on that, you can add fields to the init
              function which is provided on the sentry website.
            </p>

            <Card className="my-4 bg-body-tertiary">
              <Card.Body>
                <pre className="mb-0 overflow-auto">
                  <code>{initSnippet}</code>
                </pre>
              </Card.Body>
            </Card>

            <p>
              To use sentry, import that file to where you want to monitor certain aspects in that
              file. For catching errors that come from exceptions, use{' '}
              <code>Sentry.captureException(error)</code> and for errors that do not, use{' '}
              <code>Sentry.captureMessage(message, msgType)</code> where message type is whatever
              you decide (ex. Warning, Error). No container is needed because you do not need to
              host it so navigate to sentry.io and log in to view your dashboard.
            </p>
          </section>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Implementation</h2>
            <p>
              I have created the <code>instrument.js</code>, adding my DSN, and adding certain points
              in the call to the Spoonacular API that sentry checks for errors. This has allowed me
              to check on my site in the dashboard for issues. This monitors exception errors,
              errors from Spoonacular, and the speed it takes to receive information. On the
              dashboard itself, I have also added a monitor for the health of the site to check
              uptime/downtime just by adding the link to the site with a trailing{' '}
              <code>/health</code>. All this information is being collected through the sentry
              account created.
            </p>
          </section>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Show It Working</h2>
            <p>The example below is the monitor for uptime on the server.</p>
            <Screenshot
              src="uptime.png"
              alt="Sentry uptime monitor for the server"
              caption="Sentry uptime monitor for the server"
            />

            <p>
              The alerts are automatic, but they can be set as well in the Monitors button on the
              sidebar. Here is an example of an error I created and got alerted for.
            </p>
            <Screenshot
              src="alert.png"
              alt="Sentry alert for a test error"
              caption="Alert for an error I created"
            />

            <p>Here is another example of the trace log where you can see the calls made in the server.</p>
            <Screenshot
              src="trace.png"
              alt="Sentry trace log showing server calls"
              caption="Trace log showing the calls made in the server"
            />
          </section>

          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Security Considerations</h2>
            <p>
              Though the DSN is not a secret, it can be used maliciously to send fake events or
              errors to your dashboard. I recommend putting the DSN in a <code>.env</code> file as a
              secret for that reason. If an issue does occur, the DSN can be regenerated so fake
              events are completely stopped. Another issue to consider is the requests themselves
              might contain sensitive information if you’re sending sensitive information and Sentry
              will record that data. In my case it is not sensitive information, but the data can be
              hidden with replace in the Sentry init function before the request is sent. For privacy
              reasons as well, data should be hidden and in the case of this website, information
              like medical issues should not be saved. There is also the issue of accounts, and
              security regarding someone accessing your account so 2FA is extremely important.
            </p>
          </section>
          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">Architecture Diagram with <span className='secondary-text'>Sentry</span></h2>
            <Screenshot
              src="recipeDiagram.png"
              alt="Diagram of site architecture"
              caption="This site's architecture"
            />
          </section>
          <section>
            <h2 className="h3 mt-5 pb-2 border-bottom">References</h2>
            <ul>
                <li>
                    Sentry. (n.d.-a). Data Source Name (DSN). Sentry Documentation. Retrieved October 20, 2026, from https://docs.sentry.io/concepts/key-terms/dsn-explainer/
                </li>
                <li>
                    Sentry. (n.d.-b). Express. Sentry Documentation. Retrieved October 20, 2026, from https://docs.sentry.io/platforms/javascript/guides/express/
                </li>
                <li>
                    Sentry. (n.d.-c). Node.js. Sentry Documentation. Retrieved October 20, 2026, from https://docs.sentry.io/platforms/javascript/guides/node/
                </li>
                <li>
                    Sentry. (n.d.-d). Set up tracing for Node.js. Sentry Documentation. Retrieved October 20, 2026, from https://docs.sentry.io/platforms/javascript/guides/node/tracing/
                </li>
            </ul>
          </section>
        </Col>
      </Row>
    </Container>
    </div>
  );
}