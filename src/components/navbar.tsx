import { Button, Container, Navbar, Nav } from 'react-bootstrap'
import FilterModal, { FilterModalProps } from '../components/filters';
import { type Dispatch } from 'react';
import { type SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

interface NavBarInputs {
    FilterModalProps?:  FilterModalProps,
    activeFilters?: string[],
    setShowFilters?: Dispatch<SetStateAction<boolean>>
}

export default function TopNav (inputs: NavBarInputs)
    {
        const navigate = useNavigate(); 
        return (
            <Navbar expand="lg" fixed="top" className='bg-white descriptionTxt'>
                <Container>
                    <Navbar.Brand onClick={()=> navigate('/')} role='button' className='headerTxt'>
                        <img
                        src="apple.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-2 shadow-lg"
                        alt="Nutraware logo"
                        />
                        Friendly Kitchen
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={()=> navigate('/dashboard')}>About</Nav.Link>
                    </Nav>
                    { inputs.activeFilters && inputs.setShowFilters ? 
                    <Button className='navBtn' variant="outline-dark" onClick={() => inputs.setShowFilters?.(true)}>
                        Filters {inputs.activeFilters?.length > 0 && `(${inputs.activeFilters?.length})`}
                    </Button>
                    : null }
                    
                    { inputs.FilterModalProps ? <FilterModal {...inputs.FilterModalProps}/> : null }
                </Container>
            </Navbar>
)}