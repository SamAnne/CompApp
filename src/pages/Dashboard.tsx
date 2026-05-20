import { Button, Form, InputGroup, Container, Navbar, Nav } from 'react-bootstrap'

function Dashboard() {

    return (
        <>
            <Navbar>
                <Container>
                    <Button href="#home" className='ms-auto navBtn'>Log In</Button>
                </Container>
            </Navbar>
            <Container className='d-flex justify-content-center align-items-center center-page w-100' style={{
                margin: '2rem',
                flexDirection: 'row',
                textAlign: 'left',
                width: '100%',
                height: '100vh'}}>
                <div className='flex-grow-1' style={{display: 'flex', flexDirection: 'column'}}>
                    <h1 className='header-text'>Find the perfect recipes <span style={{color: '#323F27'}}>for you</span></h1>
                    <p>From adding your preferred diets, to adding a dietary restriction,this website has you covered! Start comparing recipes now by\nadding your personal preferences to hit your goals.</p>
                    <Button className='styledBtn'>Get Started</Button>
                    <div style={{display: 'flex', flexDirection: 'row', width: '50%'}}>
                        <span>10+ Different Diets</span>
                        <span>Compare up to 4 recipes</span>
                        <span>Any Combination</span>
                    </div>
                </div>
                <img src='' alt="ex" style={{width: '50%'}}/>
                
            </Container>
        </>
    )

}

export default Dashboard