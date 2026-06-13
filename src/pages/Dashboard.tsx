import { Button, Card, Container, CardGroup } from 'react-bootstrap';
import TopNav from '../components/navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    return (
        <>
            <TopNav/>
            <div className='w-100 min-vh-100' style={{backgroundColor: '#546B41'}}>
                <Container className='d-flex justify-content-center align-items-center center-page w-50 p-5 ms-auto' style={{
                    flexDirection: 'column',
                    color: 'white',
                    textAlign: 'center'}}>
                    
                    
                    <div className='' style={{display: 'flex', flexDirection: 'column'}}>
                        <h1>Find the perfect recipes <span style={{textDecoration: 'underline'}}>for you</span></h1>
                        <p className=''>From adding your preferred diets, to adding a dietary restriction, this website has you covered! Start comparing recipes now by adding your personal preferences to hit your goals.</p>
                        <Button className='styledBtn align-self-center p-3' onClick={()=> navigate('/')}>Get Started</Button>
                        
                    </div>
                    
                    
                </Container>
                <CardGroup style={{display: 'flex', flexDirection: 'row', gap: '35px', paddingTop: '1rem', textAlign: 'center'}} className='ms-auto p-5'>
                        <Card className='p-2 rounded shadow'>
                            <Card.Title><span style={{color: '#CFB98C'}}>10+</span> Different Diets</Card.Title>
                            <Card.Text className='text-muted'>
                                Ranging from sensitivities to medical diets, we include many different kinds of diets.
                            </Card.Text>
                        </Card>
                        <Card>
                            <Card.Title>Compare up to <br/><span style={{ color: '#323F27'}}>4</span><br/> recipes</Card.Title>
                        </Card>
                        <Card>
                            <Card.Title><span style={{ color: '#546B41'}}>Any</span><br/> Combination</Card.Title>
                        </Card>
                </CardGroup>
            </div>
        </>
    )

}

export default Dashboard