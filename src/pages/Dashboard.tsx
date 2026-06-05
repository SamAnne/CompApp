import { Button, Form, InputGroup, Container, Navbar, Nav } from 'react-bootstrap';
import TopNav from '../components/navbar';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    return (
        <>
            <TopNav/>
            <Container className='d-flex justify-content-center align-items-center center-page w-100 ms-auto' style={{
                flexDirection: 'row',
                textAlign: 'left'}}>
                <div className='' style={{display: 'flex', flexDirection: 'column'}}>
                    <h1>Find the perfect recipes <span style={{color: '#CFB98C'}}>for you</span></h1>
                    <p className=''>From adding your preferred diets, to adding a dietary restriction, this website has you covered! Start comparing recipes now by adding your personal preferences to hit your goals.</p>
                    <Button className='styledBtn align-self-center p-3' onClick={()=> navigate('/')}>Get Started</Button>
                    <div style={{display: 'flex', flexDirection: 'row', fontSize: '1.5rem', margin: '0 auto', gap: '35px', paddingTop: '1rem', textAlign: 'center'}}>
                        <span><span style={{color: '#CFB98C'}}>10+</span><br/> Different Diets</span>
                        <span>Compare up to <br/><span style={{ color: '323F27'}}>4</span><br/> recipes</span>
                        <span><span style={{ color: '#546B41'}}>Any</span><br/> Combination</span>
                    </div>
                </div>
                <img src='apple.png' alt="ex" style={{width: '50%'}}/>
                
            </Container>
        </>
    )

}

export default Dashboard