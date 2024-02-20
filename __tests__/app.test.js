const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const app = require('../app/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const endpointFile = require('../endpoints.json')

beforeEach(()=>seed(testData))
afterAll(()=>db.end)

describe('GET /api/topics', () => {
    it('should respond with an array of topic objects, with properties "slug" and "description"', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response)=>{
            const topics = response.body.topics.rows
            expect(topics).toHaveLength(3)
            topics.forEach((topic)=> {
                expect(topic).toHaveProperty('slug')
                expect(topic).toHaveProperty('description');
            });            
        })
    });
});

describe('GET /api', () => {
    it('should respond with all other endpoints and their description', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response)=>{
            const {endpoints} = response.body
            expect(endpoints).toEqual(endpointFile)
        })
        
    });
});

describe('GET /api/articles/:article_id', () => {
    it('should respond with the article specified by the parameter', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response)=>{
            const {article} = response.body
            expect(article).toHaveProperty('article_id', 1)
        })
    });
    it('should respond with 404 if there is no article with the given id', () => {
        return request(app)
        .get('/api/articles/100')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('article not found')
        })
    });
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
        .get('/api/articles/lawnmower')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('bad request')
        })
    });
});

describe('GET /api/articles', () => {
    it('should serve an array of all articles without the body property, but with a comment count property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response)=>{
            const articles = response.body.articles.rows
            expect(articles).toHaveLength(13)
            articles.forEach((article)=>{
                expect(article).not.toHaveProperty("body")           
                expect(article).toHaveProperty("article_id")           
                expect(article).toHaveProperty("title")           
                expect(article).toHaveProperty("topic")           
                expect(article).toHaveProperty("author")           
                expect(article).toHaveProperty("created_at")           
                expect(article).toHaveProperty("votes")           
                expect(article).toHaveProperty("comment_count")           
            })
        })
    });
    it('articles should be sorted by date in descending order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response)=>{
            const articles = response.body.articles.rows
            expect(articles).toBeSortedBy('created_at', {descending: false})
        })
    });
});

