import { useState, useRef, act } from 'react'
import { Button, Form, InputGroup, Stack, Modal, Nav, Card, ListGroup, Accordion, CloseButton, CardGroup, Tab } from 'react-bootstrap'
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
  servings: number;
  rank: number;
  id: number;
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
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('apprec');

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

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

  const displayInfo = (recipe: Recipe) => {
    let display = [];
    let score = 0;
    display.push({key: display.length, html: <Card.Title className='card-header-text'>{recipe.title}</Card.Title>});
    display.push({key: display.length, html: <p className="text-secondary">Total Servings: {recipe.servings}<br/>Serving Size: {recipe.nutrition.weightPerServing.amount}{recipe.nutrition.weightPerServing.unit}</p>});
    display.push({key: display.length, html: <Card.Header>Filtered Options</Card.Header>})
    let specsList = [];
    if (activeFilters.includes('highProtein')){
      const protein = getNutrient(recipe, 'Protein');
      const currScore = (protein / filterOptions.minProtein) * (1/activeFilters.length);
      score += currScore;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.minProtein < protein ? 'text-bg-success' : 'text-bg-danger'}>Protein: {getNutrient(recipe, 'Protein')}g</ListGroup.Item>});
    }
    if (activeFilters.includes('lowCarb')) {
      const carbs = getNutrient(recipe, 'Carbohydrates');
      const currScore = ((filterOptions.maxCarbs - carbs) / filterOptions.maxCarbs) * (1/activeFilters.length);
      score += currScore;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.maxCarbs > getNutrient(recipe, 'Carbohydrates') ? 'text-bg-success' : 'text-bg-danger'}>Carbs: {getNutrient(recipe, 'Carbohydrates')}g</ListGroup.Item>});
    }
    if (activeFilters.includes('lowCalorie')){
      const calories = getNutrient(recipe, 'Calories');
      const currScore = ((filterOptions.maxCalories - calories) / filterOptions.maxCalories) * (1/activeFilters.length);
      score += currScore;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={filterOptions.maxCalories > calories ? 'text-bg-success' : 'text-bg-danger'}>Calories: {getNutrient(recipe, 'Calories')}</ListGroup.Item>});
    }
    if (activeFilters.includes('glutenFree')){
      if (recipe.glutenFree) score += 1/activeFilters.length;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.glutenFree ? 'text-bg-success' : 'text-bg-danger'}>Gluten Free: {recipe.glutenFree ? 'Yes' : 'No'}</ListGroup.Item>});
    }
    if (activeFilters.includes('dairyFree')){
      if (recipe.dairyFree) score += 1/activeFilters.length;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.dairyFree ? 'text-bg-success' : 'text-bg-danger'}>Dairy Free: {recipe.dairyFree ? 'Yes' : 'No'}</ListGroup.Item>});
    }
    if (activeFilters.includes('vegan')){
      if (recipe.vegan) score += 1/activeFilters.length;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.vegan ? 'text-bg-success' : 'text-bg-danger'}>Vegan: {recipe.vegan ? 'Yes' : 'No'}</ListGroup.Item>});
    }
    if (activeFilters.includes('keto')){
      if (recipe.diets.includes('ketogenic')) score += 1/activeFilters.length
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.diets.includes('ketogenic') ? 'text-bg-success' : 'text-bg-danger'}>Keto: {recipe.diets.includes('ketogenic') ? 'Yes' : 'No'}</ListGroup.Item>});
    }
    if (activeFilters.includes('lowFodmap')){
      if (recipe.lowFodmap) score += 1/activeFilters.length;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={recipe.lowFodmap ? 'text-bg-success' : 'text-bg-danger'}>Low Fodmap: {recipe.lowFodmap ? 'Yes' : 'No'}</ListGroup.Item>});
    }
    if (activeFilters.includes('lowGI')){
      const gi = getProperties(recipe, 'Glycemic Index');
      const currScore = ((filterOptions.maxGI - gi) / filterOptions.maxGI) * (1/activeFilters.length);
      score += currScore;
      specsList.push({key: specsList.length, html: <ListGroup.Item className={gi <= filterOptions.maxGI ? 'text-bg-success' : 'text-bg-danger'}>Low GI: {getProperties(recipe, 'Glycemic Index')}</ListGroup.Item>});
    }
    if (specsList.length === 0){
      display.push({key: display.length, html: <p className='text-secondary'>No filters selected</p>});
    }
    else {
      display.push({key: display.length, html: <ListGroup variant="flush">{specsList.map((html) => html.html)}</ListGroup>});
    }
    recipe.rank = score;
    console.log("score of recipe is " + recipe.rank);

    display.push({key: display.length, html: <Accordion defaultActiveKey="0"><Accordion.Item eventKey="0"><Accordion.Header>Ingredients</Accordion.Header><Accordion.Body><ul>{recipe.extendedIngredients.map((ingred) => <li>{ingred.amount} {ingred.unit} {ingred.name}</li>)}</ul></Accordion.Body></Accordion.Item></Accordion>});
    return <div>
      <CloseButton
          onClick={(e) => closeRecipe(e, recipe)}
          variant="white"
          className="position-absolute top-0 end-0 m-3" 
          aria-label="Close"
        />
      <Card.Img src={recipe.image} alt={recipe.title} variant='top'/>
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
        className="pt-5 d-flex flex-column align-items-center text-center" >
        <Stack className='w-100 ms-auto px-5 pb-5 primary-content descriptionTxt'>
          <h1 className='p-4 headerTxt'>Analyse Recipe</h1>
          <p>Add one recipe to check if it fits your goals or up to 4 recipes to compare.</p>
          <div className="mx-auto w-50">
            <InputGroup>
              <Form.Control
                type="url"
                placeholder="https://example.com"
                ref={url}
              />
              <Button className='styledBtn' onClick={parseURL}>Add</Button>
            </InputGroup>
          </div>
          <a role='button' className='mt-2 text-white' onClick={openModal}>Known Limitations</a>
          <Modal show={showModal} onHide={closeModal} centered>
            <Modal.Header className="position-relative justify-content-center" closeButton>
              <Modal.Title className='headerTxt'>Known Limitations</Modal.Title>
            </Modal.Header>
            <Modal.Body className='m-2 descriptionTxt'>
              This does not provide medical advice, it is simply for informational purposes only. The calculations are done automatically and the nutritional information is from the USDA's database, but the gram conversion information might contain errors.<br/><br/> Recipe websites that use JSON-LD format are prefered, but if that fails the program falls back on the Spoonacular API's free tier which is limited.<br/><br/> For processing ingredient text, OpenAI is utilized which is also prone to errors.
            </Modal.Body>
          </Modal>
        </Stack>
        <div className="d-flex gap-3 mt-4 mb-4 flex-wrap">
          {recipes.length === 0 && (
            <div className="d-flex justify-content-center align-items-center p-2 descriptionTxt">
              <Card className='d-flex text-start h-auto' style={{ width: '50%', minWidth: '320px' }}>
                <Card.Header><h3 className='headerTxt'>Usage</h3>
                  <Nav className='' variant="tabs" defaultActiveKey="#first" activeKey={activeTab} onSelect={(selectedKey) => setActiveTab(selectedKey as string)}>
                    <Nav.Item>
                      <Nav.Link eventKey="apprec">Showing Appreciation</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="working">Self Improvement</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="recipe">Recipes</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  {activeTab === 'apprec' && (
                  <div>
                    <Card.Title>Appreciation</Card.Title>
                    <Card.Text>
                      One way to use this application is to show appreciation by providing food that fits the needs of others! Whether it's a small get together or a party, this is a perfect way to find what fits for everyone.<br/><br/>
                      <h5>Some Examples</h5>
                      - Throwing a party for guests with certain restrictions<br/>
                      - Bringing food to a work get together<br/>
                    </Card.Text>
                  </div>
                  )}
                  {activeTab === 'working' && (
                    <div>
                      <Card.Title>Working on Yourself</Card.Title>
                      <Card.Text>
                        Making dietary goals for yourself is much easier to follow with this checker that analyzes each recipe for exactly what you need. From starting to work out to needing to lose a certain amount of weight, we cover it all<br/><br/>
                        <h5>Some Examples</h5>
                        - Adjusting your diet for health issues<br/>
                        - Reaching for a protein goal to hit the gym<br/>
                      </Card.Text>
                    </div>
                  )}
                  {activeTab === 'recipe' && (
                    <div>
                      <Card.Title>Where recipes might be found</Card.Title>
                      <Card.Text>
                        Recipe links can be found from multiple social medias and copied into this web app. Relying on searching for specific dietary restrictions can be tricky as sometimes the results are not 100% accurate. The analysis makes sure you are sure.<br/><br/>
                        <h5>Some Examples</h5>
                        - Pinterest recipe link<br/>
                        - Googling a new recipe<br/>
                      </Card.Text>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
          {[...recipes].sort((a, b) => b.rank - a.rank).map((recipe, index) => 
          (  
            <Card key={recipe.id} className={`descriptionTxt recipe-card d-flex align-items-center flex-column text-start h-auto ${index === 0 ? 'shadow-custom-green' : ''}`}>
              {displayInfo(recipe)}
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}

export default Home