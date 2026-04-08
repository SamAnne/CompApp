import { useState, useRef } from 'react'
import './App.css'
import { Button, Form, InputGroup, Container, Navbar, Nav } from 'react-bootstrap'
import FilterModal, { type FilterOptions } from './components/filters';

// ✅ moved outside component
interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  title: string;
  glutenFree: boolean;
  dairyFree: boolean;
  vegan: boolean;
  nutrition: {
    nutrients: Nutrient[];
  }
}

function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minProtein: 20,
    maxCarbs: 50,
    maxCalories: 500,
  });

  const url = useRef<HTMLInputElement>(null);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getNutrient = (recipe: Recipe, name: string) =>
    recipe.nutrition.nutrients.find(n => n.name === name)?.amount ?? 0;

  const parseURL = async () => {
    const urlValue = url.current?.value;
    if (!urlValue) return;

    const response = await fetch(
      `http://localhost:3001/api/extract?url=${encodeURIComponent(urlValue)}`
    );
    const data: Recipe = await response.json();
    setRecipes(prev => [...prev, data]); // ✅ actually adds recipe to state
  }

  const getFilteredRecipes = () => {
    let result = [...recipes];

    if (activeFilters.includes('highProtein'))
      result = result.filter(r => getNutrient(r, 'Protein') >= filterOptions.minProtein);
    if (activeFilters.includes('lowCarb'))
      result = result.filter(r => getNutrient(r, 'Carbohydrates') <= filterOptions.maxCarbs);
    if (activeFilters.includes('lowCalorie'))
      result = result.filter(r => getNutrient(r, 'Calories') <= filterOptions.maxCalories);
    if (activeFilters.includes('glutenFree'))
      result = result.filter(r => r.glutenFree);
    if (activeFilters.includes('dairyFree'))
      result = result.filter(r => r.dairyFree);
    if (activeFilters.includes('vegan'))
      result = result.filter(r => r.vegan);

    return result;
  };

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Brand</Navbar.Brand>
          <Button variant="outline-light" onClick={() => setShowFilters(true)}>
            Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Button>
          <FilterModal
            show={showFilters}
            onHide={() => setShowFilters(false)}
            activeFilters={activeFilters}
            onToggleFilter={toggleFilter}
            onClearFilters={() => setActiveFilters([])}
            filterOptions={filterOptions}
            onFilterOptionsChange={setFilterOptions}
          />
        </Container>
      </Navbar>

      <div
        className="d-flex flex-column align-items-center"
        style={{ height: 'calc(100vh - 56px)' }}
      >
        <h1>Compare Recipes!</h1>
        <div style={{ width: '500px' }}>
          <InputGroup>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              ref={url}
            />
            <Button variant="primary" onClick={parseURL}>Add</Button>
          </InputGroup>
        </div>

        {/* ✅ use getFilteredRecipes instead of recipes directly */}
        <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center">
          {getFilteredRecipes().map((recipe, index) => (
            <div key={index} style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '16px',
              width: '300px'
            }}>
              <h2 style={{ fontSize: '1.2rem' }}>{recipe.title}</h2>
              <p>Protein: {getNutrient(recipe, 'Protein')}g</p>
              <p>Carbs: {getNutrient(recipe, 'Carbohydrates')}g</p>
              <p>Calories: {getNutrient(recipe, 'Calories')}</p>
              <p>Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</p>
              <p>Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</p>
              <p>Vegan: {recipe.vegan ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default App