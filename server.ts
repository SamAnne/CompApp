import 'dotenv/config';
import express, { Express, Request, Response, NextFunction, response } from 'express';
import cors from 'cors';
import * as cheerio from 'cheerio';
import { parseIngredient } from 'parse-ingredient';
import pg from 'pg';

// notes
// conversions not found in usda database are taken from https://www.allrecipes.com/article/cup-to-gram-conversions/


const { Pool } = pg
const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function decodeIngred(string: string){
  return string
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
}

function cleanIngred(string: string){
  const decoded = decodeIngred(string)
  const weightMatch = decoded.match(/\(([^)]+(?:g|oz|lb|kg|ounce|gram|pound|mL|ml))[^)]*\)/i)
  const weight = weightMatch ? weightMatch[1] : null

  const cleaned = decoded
    .replace(/\(.*?\)/g, '')   // now remove parentheses
    .replace(/\band\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim()

  return { cleaned, weight }
}

async function parseRecipeUrl(url: string){
  console.log('fetching');
  return await fetch(url)
    .then(response => response.text())
    .then(html => {
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
      const ingredients = ingredParser(recipe.recipeIngredient);
      convertToG(ingredients[0].amount as number, ingredients[0].unit as string, ingredients[0].name);
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

function ingredParser(ingredients: string[]){
  let formatted = [];
  for (const ingred in ingredients){
    const { cleaned, weight } = cleanIngred(ingredients[ingred]); // use weight for g calc later
    const parsed = parseIngredient(cleaned)[0];
    console.log(parsed);
    const p = {
      amount: parsed.quantity,
      unit: parsed.unitOfMeasure,
      name: parsed.description
    }
    formatted.push(p);
  }
  return formatted;
}

async function convertToG(amount:number, unit:string, ingred:string){
  // if ingred = eggs, then unit is egg
  // oil is in mililiters, add cup conversion
  // ignore water, salt
  // or descriptions take the first ingredient
  
  switch(unit){
    case 'cups':
    case 'cup':
      const result = await pool.query(`SELECT elem->>'amount' as amount, elem->>'grams' as grams FROM food_with_portions, json_array_elements(portions) as elem WHERE to_tsvector('english', description) @@ websearch_to_tsquery('english', '${ingred}') AND elem->>'unit' = 'cup';`);
      //console.log(result);
      console.log(`${amount} cup/s is ${(result.rows[0].grams * amount) / result.rows[0].amount} in grams`);
      break;
    
  }
}

function convertIngredients(ingredients: string[]){
  let formatted = [];
  for (const ingred in ingredients){
    // 3 cases
    // special characters like ⅔
    // fractions like 1/2
    // regular numbers
    const amountMatch = ingredients[ingred].match(/^([^ ]+)/);
    //console.log(amountMatch);
    let amount = 'unknown';
    if (amountMatch){
      amount = amountMatch[0];
    }
    let unitMatch = ingredients[ingred].match(/(?:^|\s)([^ ]+)\s+([a-zA-Z]+)/);
    let unit = 'unknown';
    if (unitMatch){
      unit = unitMatch[2];
    }
    let nameMatch = ingredients[ingred].match(/(?:^|\s)([^ ]+)\s+\w+\s+((?:\w+\s*){5})(?:\s*\(.*\))?/);
    let name = 'unknown';
    if (nameMatch){
      name = nameMatch[2];
    }
    let obj = {
      name: name,
      amount: amount,
      unit: unit
    }
    formatted.push(obj);
  }
  return formatted;
}


const app: Express = express();
app.use(cors());

app.get('/api/extract', async (req, res) => {
  const { url } = req.query;
  
  // const response = await fetch(
  //   `https://api.spoonacular.com/recipes/extract?url=${encodeURIComponent(url as string)}&includeNutrition=true&apiKey=${process.env.SPOONACULAR_KEY}`
  // );
  //console.log(url);
  const response = await parseRecipeUrl(url as string);
  // console.log('response 2 is ');
  // console.log(response);
  // const data = await response.json();
  res.json(response);
});

app.listen(3001, () => console.log('Server running on port 3001'));