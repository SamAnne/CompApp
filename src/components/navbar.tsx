import { Button, Container, Navbar, Nav } from 'react-bootstrap'
import FilterModal, { FilterModalProps } from '../components/filters';
import { type Dispatch } from 'react';
import { type SetStateAction } from 'react';

interface NavBarInputs {
    FilterModalProps?:  FilterModalProps,
    activeFilters?: string[],
    setShowFilters?: Dispatch<SetStateAction<boolean>>
}

export default function TopNav (inputs: NavBarInputs)
    { 
        return (
            <Navbar expand="lg">
                <Container>
                    <Navbar.Brand href="/">Nutraware</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="about">About</Nav.Link>
                    </Nav>
                    { inputs.activeFilters && inputs.setShowFilters ? 
                    <Button variant="outline-dark" onClick={() => inputs.setShowFilters?.(true)}>
                        Filters {inputs.activeFilters?.length > 0 && `(${inputs.activeFilters?.length})`}
                    </Button>
                    : null }
                    
                    { inputs.FilterModalProps ? <FilterModal {...inputs.FilterModalProps}/> : null }
                </Container>
            </Navbar>
)}