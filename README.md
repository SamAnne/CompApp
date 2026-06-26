<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="public/apple.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Friendly Kitchen</h3>

  <p align="center">
    A recipe analyser that checks for custom filters to show if it fits your goals.
    <br />
    <a href="https://github.com/SamAnne/CompApp"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/SamAnne/CompApp">View Demo</a>
    &middot;
    <a href="https://github.com/SamAnne/CompApp/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/SamAnne/CompApp/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-friendly-kitchen">About Friendly Kitchen</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#known-limitations">Known Limitations</a></li>
  </ol>
</details>


# About Friendly Kitchen

A full stack nutrition analysis app that extracts ingredients from any recipe URL and calculates per-serving macronutrient totals using a custom-built food database seeded from USDA FoodData Central. With the calculations, it defines the best option for the restrictions/filters selected with alternatives so anyone can enjoy a recipe regardless of restrictions.

## Built With

- [![React][React.js]][React-url]
- [![Bootstrap][Bootstrap.com]][Bootstrap-url]
- [![Vite][Vite.dev]][Vite-url]
- [![SASS][SASS.scss]][SASS-url]
- [![Node][Node.js]][Node-url]
- [![Express][Express.js]][Express-url]
- [![Typescript][Typescript.ts]][Typescript-url] 
- [![Postgres][PostgreSQL.sql]][PostgreSQL-url]
<!-- - **Scraping**  Cheerio for HTML parsing and JSON-LD extraction
- **Parsing**  OpenAI API (eventually will use SpacY) -->

## Getting Started

There are 3 parts that need to run in order to run the web app.


### Prerequisites

Node.js and Docker need to be installed

Node.js
```bash
# For Ubuntu
sudo apt update && sudo apt install nodejs npm

# For Windows
winget install OpenJS.NodeJS
```

Docker
```bash
# For Ubuntu
sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io

# For Windows
winget install Docker.DockerDesktop
```


### Installation

```bash
# Install dependencies
npm install
 
# Copy environment variables
cp .env.example .env
 
# Start front end server
npm run dev

# Start server
npm run server

# Start PostgreSQL container
docker run --name nutrition-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=nutrition \
  -e POSTGRES_USER=postgres \
  -p 5432:5432 \
  -v nutrition_data:/var/lib/postgresql \
  -d postgres
 

```
 
**.env**
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/nutrition"
SPOONACULAR_KEY=
<!-- add openai api -->
```

## Roadmap

- [x] **Color-coded recipe filtering** users can add filters/restrictions and green/red indicators show whether a recipe meets the user's dietary preferences
- [x] **Recipe URL parsing**  extracts structured ingredient data from JSON-LD embedded in recipe pages
- [x] **Ingredient parsing pipeline**  utilize OpenAI API for parsing ingredient string into proper JSON format.
- [x] **Custom food database**  seeded from USDA FoodData Central (foundation foods + FNDDS survey foods), deduplicated, and manually enriched with missing gram conversions for common pantry staples
- [x] **Nutrition calculation**  calculates per-ingredient and per-serving macros using USDA's per-100g nutrient values scaled to actual serving sizes
- [ ] **Unit-to-gram conversion**  custom density lookup system using USDA's food portion data, supplemented with manual entries for ingredients USDA doesn't cover
- [ ] **Alternatives** add alternative options in a drop down menu for ingredients that do not fit the filters/restrictions selected


### Known Limitations

- USDA foundation foods dataset has incomplete nutrient profiles for some entries — missing values are calculated using the Atwater formula where possible
- Ingredient matching accuracy depends on parsing quality — complex or non-standard ingredient strings may not match correctly
- Gram conversions for foods without USDA portion data are found from other sources that might not be as accurate — users can enter weight manually
- Recipe sites that block scraping or don't use JSON-LD structured data are not supported





[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Vite.dev]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=9135FF
[Vite-url]: https://vite.dev/
[Node.js]: https://img.shields.io/badge/Node.js-5FA04E?style=for-the-badge&logo=nodedotjs&logoColor=ffffff
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=ffffff
[Express-url]: https://expressjs.com/
[Typescript.ts]: https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=ffffff
[Typescript-url]: https://www.typescriptlang.org/
[PostgreSQL.sql]: https://img.shields.io/badge/PostgreSQL-eeeeee?style=for-the-badge&logo=postgresql&logoColor=4169E1
[PostgreSQL-url]: https://www.postgresql.org/
[SASS.scss]: https://img.shields.io/badge/SASS-CC6699?style=for-the-badge&logo=sass&logoColor=ffffff
[SASS-url]: https://sass-lang.com/