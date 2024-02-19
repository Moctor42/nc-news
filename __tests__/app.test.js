const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const app = require('../app/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const fs = require('fs/promises')

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
            return fs.readFile('./endpoints.json', 'utf8')
            .then((fileData)=>{
                expect(endpoints).toEqual(JSON.parse(fileData))
            })
            
        })
        
    });
});