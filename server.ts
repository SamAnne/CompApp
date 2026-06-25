import 'dotenv/config';
import express, { Express, Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import { parseIngredient } from 'parse-ingredient';
import pg from 'pg';
import OpenAI from "openai";
import { parse } from 'dotenv';

// notes
// conversions not found in usda database are taken from https://www.allrecipes.com/article/cup-to-gram-conversions/
// https://www.kingarthurbaking.com/learn/ingredient-weight-chart 
const ignore = ["dried parsley", 'dried rosemary', 'dried thyme', 'garlic powder', 'black pepper', 'salt', 'boiling water', 'red pepper flakes', 'cold water', 'italian seasoning', 'paprika', 'kosher salt', 'sea salt'];
let error = 0;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
// for taking out brand names from beginning of ingredients
const brands = ['Red Star', 'Fleischmann\'s', 'Bob\'s Red Mill', 'King Arthur', 'Land O\'Lakes', 'Philadelphia', 'Kraft'];

interface ingredients {
    amount: number | null;
    unit: string | null;
    name: string;
};

async function parseRecipeUrl(url: string){
  console.log('fetching');
  return await fetch(url)
    .then(response => response.text())
    .then(async html => {
      console.log('parsing');
      const $ = cheerio.load(html)
  
      const scriptTag = $('script[type="application/ld+json"]').html()
      const data = JSON.parse(scriptTag as string)
      
      // Some sites nest it in a @graph array
      const recipe = data['@type'] === 'Recipe' 
        ? data 
        : data['@graph']?.find((item: { [x: string]: string; }) => item['@type'] === 'Recipe');

      console.log(recipe.recipeIngredient);
      //const ingredients = convertIngredients(recipe.recipeIngredient);
      const ingredients = await ingredParser(recipe.recipeIngredient);
      convertToG(ingredients);
      //convertToG(ingredients[0].amount as number, ingredients[0].unit as string, ingredients[0].name);
      const weightPerServing = { amount: recipe.recipeYield[1], unit: recipe.recipeYield[1]};
      const obj = {
        title:        recipe.name,
        nutrition:    { ingredients, weightPerServing }, 
        servings:     recipe.recipeYield[0],
        prepTime:     recipe.prepTime,
        cookTime:     recipe.cookTime
      };
      return obj;
    })
    .catch(function(error){
      //return error
      console.log(error);
    });
}

async function ingredParser(ingredients: string[]){
  const aiResponse = await openai.responses.create({
    model: "gpt-5.4-mini",
    temperature: 0.0,
    input: [
      {
        role: 'system',
        content: "Parse recipe ingredients into amount, unit, and name. Remove preparation words, keep identity/nutritional descriptors, ignore parenthetical notes, unless it's explicit weight or volume measurements then prioritize that for units and ignore alternatives (keep the first ingredient only), split combined ingredients and divide amounts evenly, normalize vague ingredients to common grocery-store forms, and use USDA-style units for countable foods. Return only JSON.\n",
      }, 
      {
        role: 'user',
        content: ingredients.toString(),
      }
    ], 
    store: true,
    
  });

  console.log(aiResponse);
  console.log("\n\nresult output\n");
  console.log(JSON.parse(aiResponse.output_text) as ingredients[]);
  return JSON.parse(aiResponse.output_text) as ingredients[];
}

function normalizeUnit(unit:string) {
  return unit.replace(/s$/i, '').replace(/[^a-zA-Z0-9\s]/g, "");
}

// create function that takes out ignorable ingredients from ingredients

async function convertToG(ingredients: ingredients[])
{
  // if ingred = eggs, then unit is egg
  // oil is in mililiters, add cup conversion
  // ignore water, salt, egg wash?, 
  // or descriptions take the first ingredient

  // if it is in pounds, 1 lb = 453.592g
  // 1 oz = 28.35 g
  let err = [];

  for (const ingred in ingredients){
    if (!ignore.some(substring => ingredients[ingred].name.toLowerCase().includes(substring))){

      let unit;
      if (ingredients[ingred].name === 'milk') ingredients[ingred].name = 'whole milk'; 
      if (ingredients[ingred].unit === null && ingredients[ingred].name.includes('garlic')) unit = 'clove';
      else if (ingredients[ingred].unit !== null) unit = normalizeUnit(ingredients[ingred].unit as string);
      else unit = 'unknown';
      if (unit === 'large' && ingredients[ingred].name.includes('egg')){
        unit = 'egg';
        if (ingredients[ingred].name.includes('white')) ingredients[ingred].name = 'egg white';
        else if (ingredients[ingred].name.includes('yolk')) ingredients[ingred].name = 'egg yolk';
        else ingredients[ingred].name = 'whole egg';
      }
    
      if (unit === 'lb' || unit === 'lbs' || unit === 'pound' || unit === 'pounds'){
        console.log(`${ingredients[ingred].amount} lb/s is ${453.592 * (ingredients[ingred].amount as number)} in grams`);
      }
      else if (unit === 'oz' || unit === 'ounce' || unit === 'ounces'){
        console.log(`${ingredients[ingred].amount} lb/s is ${28.35 * (ingredients[ingred].amount as number)} in grams`);
      }
      else {
        const result = await pool.query(`SELECT elem->>'amount' as amount, elem->>'grams' as grams FROM food_with_portions, json_array_elements(portions) as elem WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', '${ingredients[ingred].name}') AND elem->>'unit' = '${unit === 'unknown' ? ingredients[ingred].name : unit}' order by fdc_id asc;`);
        //console.log(result);
        if (result.rows.length !== 0){
          console.log(`${ingredients[ingred].amount} ${unit === 'unknown' ? ingredients[ingred].name : unit}/s is ${(result.rows[0].grams * (ingredients[ingred].amount as number)) / result.rows[0].amount} in grams`);
        }
        else {
          err.push({amount: ingredients[ingred].amount, unit: unit, name: ingredients[ingred].name});
          console.log(`could not find ${ingredients[ingred].amount} ${unit === 'unknown' ? ingredients[ingred].name : unit} ${ingredients[ingred].name}`);
        }
      }
    }
    else {
      console.log("ignoreable " + ingredients[ingred].name);
      continue;
    }
  }

  console.log(`${err.length} wrong out of ${ingredients.length}`);
  error = err.length;
  console.log(err);
}


const app: Express = express();
app.use(cors());

app.get('/api/extract', async (req, res) => {
  const { url } = req.query;
  
  //console.log(url);
  const response = await parseRecipeUrl(url as string);

  if (error = 0){
    res.json(response);
  }
  else {
    console.log("using API");
    const response = await fetch(
      `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url as string)}&includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`
    );
    const data = await response.json();
    res.json(data);
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));