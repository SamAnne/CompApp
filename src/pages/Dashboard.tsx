import { Button, Card, Container, CardGroup, Col, Row, ListGroup, Stack, Image } from 'react-bootstrap';
import TopNav from '../components/navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    return (
        <>
            <TopNav/>
            <div className='w-100 pt-3'>
                <Container fluid className='vh-100 primary-content d-flex flex-row justify-content-center align-items-center center-page ms-auto text-left'>
                    <Row className="align-items-center justify-content-center">
                        <Col xs={12} md={4}>
                            <Image src='basket.png' alt='basket' fluid/>
                        </Col>
                        <Col className='d-flex flex-column w-25 m-5' xs={6} md={6}>
                            <h1 className='headerTxt'>Find the perfect recipes <span className='text-decoration-underline'>for you</span></h1>
                            <p className='descriptionTxt'>From adding your preferred diets, to adding a dietary restriction, this website has you covered! Start comparing recipes now by adding your personal preferences to reach your goals.</p>
                            <Button className='styledBtn align-self-center p-3' onClick={()=> navigate('/')}>Get Started</Button>
                            
                        </Col>
                    
                    </Row>
                </Container>
                    <Row className='g-0 text-center p-5'>
                        <Col xs={12} md={4}>
                            <Card className='p-5 border-0 h-100 '>
                                <Card.Title><img src='diffDiets.png' width="40" height="40" alt='filterIcon'/></Card.Title>
                                <Card.Text className='text-muted descriptionTxt'>
                                    <span className='secondary-text'>10+</span> <strong>Different Diets</strong><br/>
                                    Ranging from sensitivities to medical diets, we include many different kinds of diets.
                                </Card.Text>
                            </Card>
                        </Col>
                        
                        
                        <Col xs={12} md={4}>
                            <Card className='p-5 border-0 h-100'>
                                <Card.Title><img src='recipe.png' width="40" height="40" alt='recipeIcon'/></Card.Title>
                                <Card.Text className='text-muted descriptionTxt'>
                                    <strong>Compare up to </strong><span className='secondary-text'>4</span><strong> recipes</strong><br/>
                                    Add one or up to 4 recipes, and based on selected filters/restrictions, the best option will be highlighted.
                                </Card.Text>
                            </Card>
                        </Col>
                        
                        <Col xs={12} md={4}>
                            <Card className='p-5 border-0 h-100'>
                                <Card.Title><img src='combinations.png' width="40" height="40" alt='combinationsIcon'/></Card.Title>
                                <Card.Text className='text-muted descriptionTxt'>
                                    <strong><span className='secondary-text'>Any</span> Combination</strong><br/>
                                    Select as many filters/restrictions as needed!
                                </Card.Text>
                            </Card>
                        </Col>
                    </Row>
                
                <Stack  className='d-flex justify-content-center align-items-center center-page ms-auto w-100 p-5 secondary-content'>
                    <Stack direction="horizontal" gap={3} className="justify-content-center">
                        <h2 className='px-5 text-center headerTxt'>
                            How to get started
                        </h2>
                        
                        <div className='w-50 rounded shadow-lg bg-white descriptionTxt'>

                            <ListGroup as="ol">
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start p-5"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Getting Started</div>
                                        Press the <strong role="button" className='rounded text-decoration-underline primary-text' onClick={()=> navigate('/')}>Get Started</strong> button to go to the recipe page.
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start p-5"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Filters</div>
                                        In the top right of the screen, there is a Filters button that will show all the available filter options. Select one to start analysis or comparing!
                                    </div>
                                </ListGroup.Item>
                                <ListGroup.Item
                                    as="li"
                                    className="d-flex justify-content-between align-items-start p-5"
                                >
                                    <div className="ms-2 me-auto">
                                        <div className="fw-bold">Recipes</div>
                                        Copy and paste a recipe's URL into the textbox to get the recipe's nutritional information for comparison or just analysis.
                                    </div>
                                </ListGroup.Item>
                            </ListGroup>
                        </div>
                    </Stack>
                    <Stack gap={0} className='d-flex justify-content-center align-items-center center-page mt-auto w-100 p-3 pt-5 text-white descriptionTxt'>
                        <p className='mb-0'>Contact: ansamaalsharif@gmail.com</p>
                        <p className='mb-0'>Report a bug <a href='https://github.com/SamAnne/CompApp/issues/new?labels=bug&template=bug-report---.md'>here</a></p>
                    </Stack>
                </Stack>
                
            </div>
        </>
    )

}

export default Dashboard