# Northcoders News API

### site hosted at:
> https://nc-news-8n39.onrender.com/api

---

### Installation

requires at least node **21.5.0** and psql **14.11**  
if you wish to run this locally clone this repo, then:  

`npm install`  
`npm run setup-dbs`  

>create two .env files inside /be-nc-news before seeding
>
>.env.test containing:  
>`PGDATABASE=nc_news_test`
>
>.env.development containing:  
>`PGDATABASE=nc_news`

`npm run seed`





