import { useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap'

interface Filter {
  id: string;
  label: string;
}

export interface FilterOptions {
  minProtein: number;
  maxCarbs: number;
  maxCalories: number;
  maxGI: number
}

export interface FilterModalProps {
  show: boolean;
  onHide: () => void;
  activeFilters: string[];
  onToggleFilter: (id: string) => void;
  onClearFilters: () => void;
  filterOptions: FilterOptions;
  onFilterOptionsChange: (options: FilterOptions) => void;
}

const filters: Filter[] = [
  { id: 'highProtein', label: 'High Protein' },
  { id: 'lowCarb', label: 'Low Carb' },
  { id: 'lowCalorie', label: 'Low Calorie' },
  { id: 'glutenFree', label: 'Gluten Free' },
  { id: 'dairyFree', label: 'Dairy Free' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'lowFodmap', label: 'Low FODMAP' },
  { id: 'lowGI', label: 'Low GI'},
  { id: 'keto', label: 'Keto' },
];

export default function FilterModal({ 
  show, 
  onHide, 
  activeFilters, 
  onToggleFilter, 
  onClearFilters,
  filterOptions,
  onFilterOptionsChange
}: FilterModalProps) {
  const [filterSearch, setFilterSearch] = useState('');

  const filteredOptions = filters.filter(f =>
    f.label.toLowerCase().includes(filterSearch.toLowerCase())
  );

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Filter Recipes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="text"
          placeholder="Search filters..."
          value={filterSearch}
          onChange={(e) => setFilterSearch(e.target.value)}
          className="mb-3"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {filteredOptions.map(filter => (
            <Button
              key={filter.id}
              size="sm"
              variant={activeFilters.includes(filter.id) ? 'dark' : 'outline-dark'}
              onClick={() => onToggleFilter(filter.id)}
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* High Protein slider */}
        {activeFilters.includes('highProtein') && (
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <Form.Label>Minimum protein per serving: <strong>{filterOptions.minProtein}g</strong></Form.Label>
            <Form.Range
              min={0}
              max={100}
              value={filterOptions.minProtein}
              onChange={(e) => onFilterOptionsChange({ ...filterOptions, minProtein: Number(e.target.value) })}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <span>0g</span>
              <span>100g</span>
            </div>
          </div>
        )}

        {/* Low Carb slider */}
        {activeFilters.includes('lowCarb') && (
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <Form.Label>Maximum carbs per serving: <strong>{filterOptions.maxCarbs}g</strong></Form.Label>
            <Form.Range
              min={0}
              max={200}
              value={filterOptions.maxCarbs}
              onChange={(e) => onFilterOptionsChange({ ...filterOptions, maxCarbs: Number(e.target.value) })}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <span>0g</span>
              <span>200g</span>
            </div>
          </div>
        )}

        {/* Low Calorie slider */}
        {activeFilters.includes('lowCalorie') && (
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <Form.Label>Maximum calories per serving: <strong>{filterOptions.maxCalories}</strong></Form.Label>
            <Form.Range
              min={0}
              max={1500}
              value={filterOptions.maxCalories}
              onChange={(e) => onFilterOptionsChange({ ...filterOptions, maxCalories: Number(e.target.value) })}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <span>0</span>
              <span>1500</span>
            </div>
          </div>
        )}

        {/* GI slider */}
        {activeFilters.includes('lowGI') && (
          <div className="mt-3 p-3" style={{ background: '#f8f9fa', borderRadius: '8px' }}>
            <Form.Label>Minimum GI: <strong>{filterOptions.maxGI}</strong></Form.Label>
            <Form.Range
              min={0}
              max={55}
              value={filterOptions.maxGI}
              onChange={(e) => onFilterOptionsChange({ ...filterOptions, maxGI: Number(e.target.value) })}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: '0.8rem', color: '#6c757d' }}>
              <span>0</span>
              <span>55</span>
            </div>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="link" onClick={onClearFilters}>Clear all</Button>
        <Button className='styledBtn' onClick={onHide}>Done</Button>
      </Modal.Footer>
    </Modal>
  );
}