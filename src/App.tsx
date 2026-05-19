import { useState, useRef } from 'react'
import './App.css'
import { Button, Form, InputGroup, Container, Navbar, Nav } from 'react-bootstrap'
import FilterModal, { type FilterOptions } from './components/filters';

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
    properties: Nutrient[];
  };
  diets: string[];
  image: string;
  sourceUrl: string;
  lowFodmap: boolean;
  extendedIngredients: Nutrient[]
}

function App() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minProtein: 20,
    maxCarbs: 50,
    maxCalories: 500,
    maxGI: 55
  });

  const url = useRef<HTMLInputElement>(null);

  const toggleFilter = (id: string) => {
    setActiveFilters(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getNutrient = (recipe: Recipe, name: string) =>
    recipe.nutrition.nutrients.find(n => n.name === name)?.amount ?? 0;

  const getProperties = (recipe: Recipe, name: string) =>
    recipe.nutrition.properties.find(n => n.name === name)?.amount ?? 0;

  const parseURL = async () => {
    const urlValue = url.current?.value;
    if (!urlValue) return;

    if (recipes.filter(r => r.sourceUrl === urlValue).length === 0){
      const response = await fetch(
        `http://localhost:3001/api/extract?url=${encodeURIComponent(urlValue)}`
      );
      const data: Recipe = await response.json();
      console.log(data);
      setRecipes(prev => [...prev, data]);
    }
    else{
      console.log("recipe already added");
    }
  }

  const displayCards = () => {
    if (recipes.length === 0){
      return null
    }
    else {
      return <div style={{color: 'red'}}>This recipe does not match the filters selected. Try another recipe that better fits your goals</div>
    }
  }

  const displayInfo = (recipe: Recipe) => {
    let display = [];
    display.push({key: display.length, html: <img src={recipe.image} alt={recipe.title} style={{width: '15rem', height: '15rem'}}/>});
    display.push({key: display.length, html: <h2 style={{ fontSize: '1.2rem' }}>{recipe.title}</h2>});
    if (activeFilters.includes('highProtein'))
      display.push({key: display.length, html: <p>Protein: {getNutrient(recipe, 'Protein')}g</p>});
    if (activeFilters.includes('lowCarb'))
      display.push({key: display.length, html: <p>Carbs: {getNutrient(recipe, 'Carbohydrates')}g</p>});
    if (activeFilters.includes('lowCalorie'))
      display.push({key: display.length, html: <p>Calories: {getNutrient(recipe, 'Calories')}</p>});
    if (activeFilters.includes('glutenFree'))
      display.push({key: display.length, html: <p>Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</p>});
    if (activeFilters.includes('dairyFree'))
      display.push({key: display.length, html: <p>Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</p>});
    if (activeFilters.includes('vegan'))
      display.push({key: display.length, html: <p>Vegan: {recipe.vegan ? 'Yes' : 'No'}</p>});
    if (activeFilters.includes('keto'))
      display.push({key: display.length, html: <p>Keto: {recipe.diets.includes('ketogenic') ? 'Yes' : 'No'}</p>});
    if (activeFilters.includes('lowFodmap'))
      display.push({key: display.length, html: <p>Low Fodmap: {recipe.lowFodmap ? 'Yes' : 'No'}</p>});
    if (activeFilters.includes('lowGI'))
      display.push({key: display.length, html: <p>Low GI: {getProperties(recipe, 'Glycemic Index')}</p>});

    display.push({key: display.length, html: <p>Ingredients</p>});
    display.push({key: display.length, html: recipe.extendedIngredients.map((ingred) => <li>{ingred.amount} {ingred.unit} {ingred.name}</li>)});

    return <div style={{}}>{display.map((display) => display.html)}</div>
  }

  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">RecipeMatch</Navbar.Brand>
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
        <h1 style={{padding: '1.5rem'}}>Compare Recipes!</h1>
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

        <div className="d-flex gap-3 mt-4 flex-wrap justify-content-center">
          {recipes.length > 0 ? recipes.map((recipe, index) => (
            <div key={index} style={{
              border: '1px solid #dee2e6',
              borderRadius: '8px',
              padding: '16px',
              width: '300px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'left'
            }}>
              {displayInfo(recipe)}
            </div>
          )): (
            displayCards()
          )}
        </div>
      </div>
    </>
  )
}

export default App