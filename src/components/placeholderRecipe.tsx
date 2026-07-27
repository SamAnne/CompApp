import { Card, CloseButton, Placeholder, Accordion, ListGroup } from 'react-bootstrap';


export default function PlaceholderRecipe ()
    {
        return (
            <Card key='placeholder' className={'descriptionTxt recipe-card d-flex align-items-center flex-column text-start h-auto'}>
                <CloseButton variant="white" className="position-absolute top-0 end-0 m-2 bg-white p-2 rounded-4" aria-label="Close"/>
                <Card.Img src='recipeBackground.jpg' alt='Place Holder' variant='top'/>
                <Card.Body className='w-100'>
                    <Placeholder as={Card.Title} animation="glow">
                        <Placeholder xs={11} md={7} />
                    </Placeholder>
                    <Placeholder as='p' animation="glow">
                        <Placeholder xs={7} bg='secondary'/>{' '}
                        <Placeholder xs={6} bg='secondary'/>
                    </Placeholder>
                    <Placeholder as={Card.Header} animation='glow'>
                        <Placeholder xs={10}/>
                    </Placeholder>
                    <ListGroup>
                        <Placeholder as='p' animation='glow'>
                            <Placeholder xs={6} bg='secondary'/>    
                        </Placeholder> 
                    </ListGroup>
                    <Accordion>
                        <Accordion.Item  eventKey="0">
                            <Placeholder as={Accordion.Header} animation="glow">
                                <Placeholder xs={10} />
                            </Placeholder>
                        </Accordion.Item>
                    </Accordion>
                </Card.Body>
            </Card>
        )
    }