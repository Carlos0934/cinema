<h1 align="center">Dominican Republic Cinema Api</h1>


## Description

This is an initiative of a non-profit API to unify the information of all the movies released in theaters in the Dominican Republic, using scrapping techniques to collect this information.

We seek to minimize the impact on the official pages and ensure that all information collected is public. 


## Official websites:
* Caribbean Cinema (https://caribbeancinemas.com)

## Setup the project
* Install deno (https://deno.land/manual/getting_started/installation)
* Clone the project:
```
git clone https://github.com/Carlos0934/cinema.git
```
* Set the environment variables:
```
PUPPETEER_PRODUCT=chrome or PUPPETEER_PRODUCT=firefox
```
* Run the setup task:
```
deno task setup
```


## Start the project
```
deno task start
```

##  Scraping
```
deno task scrap
```

## Tests
```
deno test
```


## Schemas 
```ts
 Movie {
  id: number;
  title: string;
  releaseDate: string | null;
  genders: string[];
  classification: string | null;
  duration: number | null;
  synopsis: string | null;
  directors: string[];
  writers: string[];
  protagonists: string[];
}
```
## Endpoints
* */api/movies -> Movies[]*
* */api/movies/:id -> Movie | null*


## Contributing
* Fork the project
* Create a new branch
* Make your changes
* Create a pull request

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Authors
[Carlos Olivo](personal-website-dj45ss36e-carlos0934.vercel.app)
