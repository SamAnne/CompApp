import { useState, useRef } from 'react'
import { Button, Form, InputGroup, Container, Navbar, Nav, Card, ListGroup, Accordion, CloseButton } from 'react-bootstrap'
import FilterModal, { type FilterOptions, FilterModalProps } from '../components/filters';
import TopNav from '../components/navbar';

interface Nutrient {
  name: string;
  amount: number;
  unit: string;
}

interface Serving {
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
    weightPerServing: Serving;
  };
  diets: string[];
  image: string;
  sourceUrl: string;
  lowFodmap: boolean;
  extendedIngredients: Nutrient[];
  servings: number
}


function Home() {
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

  function closeRecipe(event: React.MouseEvent<HTMLButtonElement>, recipe: Recipe){
    setRecipes(prevItems => prevItems.filter(item => item.sourceUrl !== recipe.sourceUrl));
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
    display.push({key: display.length, html: <Card.Title style={{ fontSize: '1.2rem' }}>{recipe.title}</Card.Title>});
    display.push({key: display.length, html: <p className="text-secondary">Total Servings: {recipe.servings}<br/>Serving Size: {recipe.nutrition.weightPerServing.amount}{recipe.nutrition.weightPerServing.unit}</p>});
    display.push({key: display.length, html: <Card.Header>Filtered Options</Card.Header>})
    let specsList = [];
    if (activeFilters.includes('highProtein'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.minProtein < getNutrient(recipe, 'Protein') ? 'text-bg-success' : 'text-bg-danger'}>Protein: {getNutrient(recipe, 'Protein')}g</ListGroup.Item>});
    if (activeFilters.includes('lowCarb'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.maxCarbs > getNutrient(recipe, 'Carbohydrates') ? 'text-bg-success' : 'text-bg-danger'}>Carbs: {getNutrient(recipe, 'Carbohydrates')}g</ListGroup.Item>});
    if (activeFilters.includes('lowCalorie'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.maxCalories > getNutrient(recipe, 'Calories') ? 'text-bg-success' : 'text-bg-danger'}>Calories: {getNutrient(recipe, 'Calories')}</ListGroup.Item>});
    if (activeFilters.includes('glutenFree'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.glutenFree ? 'text-bg-success' : 'text-bg-danger'}>Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</ListGroup.Item>});
    if (activeFilters.includes('dairyFree'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.dairyFree ? 'text-bg-success' : 'text-bg-danger'}>Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</ListGroup.Item>});
    if (activeFilters.includes('vegan'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.vegan ? 'text-bg-success' : 'text-bg-danger'}>Vegan: {recipe.vegan ? 'Yes' : 'No'}</ListGroup.Item>});
    if (activeFilters.includes('keto'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.diets.includes('ketogenic') ? 'text-bg-success' : 'text-bg-danger'}>Keto: {recipe.diets.includes('ketogenic') ? 'Yes' : 'No'}</ListGroup.Item>});
    if (activeFilters.includes('lowFodmap'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.lowFodmap ? 'text-bg-success' : 'text-bg-danger'}>Low Fodmap: {recipe.lowFodmap ? 'Yes' : 'No'}</ListGroup.Item>});
    if (activeFilters.includes('lowGI'))
      specsList.push({key: specsList.length, html: <ListGroup.Item className={getProperties(recipe, 'Glycemic Index') <= filterOptions.maxGI ? 'text-bg-success' : 'text-bg-danger'}>Low GI: {getProperties(recipe, 'Glycemic Index')}</ListGroup.Item>});

    if (specsList.length === 0){
      display.push({key: display.length, html: <p className='text-secondary'>No filters selected</p>});
    }
    else {
      display.push({key: display.length, html: <ListGroup variant="flush">{specsList.map((html) => html.html)}</ListGroup>});
    }

    display.push({key: display.length, html: <Accordion defaultActiveKey="0"><Accordion.Item eventKey="0"><Accordion.Header>Ingredients</Accordion.Header><Accordion.Body><ul>{recipe.extendedIngredients.map((ingred) => <li>{ingred.amount} {ingred.unit} {ingred.name}</li>)}</ul></Accordion.Body></Accordion.Item></Accordion>});
    return <div style={{}}>
      <CloseButton
          onClick={(e) => closeRecipe(e, recipe)}
          variant="white"
          className="position-absolute top-0 end-0 m-3" 
          aria-label="Close"
        />
      <Card.Img src={recipe.image} alt={recipe.title} variant='top' style={{}}/>
      <Card.Body>{display.map((display) => display.html)}</Card.Body></div>
  }

  return (
    <>
      <TopNav 
        FilterModalProps={{
          show: showFilters,
          onHide: () => setShowFilters(false),
          activeFilters: activeFilters,
          onToggleFilter: toggleFilter,
          onClearFilters: () => setActiveFilters([]),
          filterOptions: filterOptions,
          onFilterOptionsChange: setFilterOptions
        }}
        activeFilters={activeFilters}
        setShowFilters={setShowFilters}
      />

      <div
        className="d-flex flex-column align-items-center"
        style={{ padding: '1rem' }}
      >
        <h1 style={{padding: '1.5rem'}}>Check Recipe</h1>
        <p>Add one recipe to check if it fits your goals or up to 4 recipes to compare.</p>
        <div style={{ width: '500px' }}>
          <InputGroup>
            <Form.Control
              type="url"
              placeholder="https://example.com"
              ref={url}
            />
            <Button className='styledBtn' onClick={parseURL}>Add</Button>
          </InputGroup>
        </div>

        <div className="d-flex gap-3 mt-4 flex-wrap">
          {recipes.length > 0 ? recipes.map((recipe, index) => (
            <Card key={index} style={{
              border: '1px solid #dee2e6',
              height: 'auto',
              borderRadius: '8px',
              width: '300px',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              textAlign: 'left',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}>
              {displayInfo(recipe)}
            </Card>
          )): (
            displayCards()
          )}
        </div>
      </div>
    </>
  )
}

export default Home