const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const app = require('../app/app')
const request = require('supertest')
const seed = require('../db/seeds/seed')
const endpointFile = require('../endpoints.json')
const { expect } = require('@jest/globals')

beforeEach(() => seed(testData))
afterAll(() => db.end)

describe('GET /api/topics', () => {
    it('should respond with an array of topic objects, with properties "slug" and "description"', () => {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const topics = response.body.topics.rows
                expect(topics).toHaveLength(3)
                topics.forEach((topic) => {
                    expect(topic).toHaveProperty('slug')
                    expect(topic).toHaveProperty('description')
                })
            })
    })
})

describe('GET /api', () => {
    it('should respond with all other endpoints and their description', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then((response) => {
                const { endpoints } = response.body
                expect(endpoints).toEqual(endpointFile)
            })
    })
})

describe('GET /api/articles/:article_id', () => {
    it('should respond with the article specified by the parameter', () => {
        return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const { article } = response.body
                expect(article).toHaveProperty('article_id', 1)
                expect(article).toHaveProperty('title')
                expect(article).toHaveProperty('topic')
                expect(article).toHaveProperty('author')
                expect(article).toHaveProperty('body')
                expect(article).toHaveProperty('created_at')
                expect(article).toHaveProperty('votes')
                expect(article).toHaveProperty('comment_count', 11)

            })
    })
    it('should respond with 404 if there is no article with the given id', () => {
        return request(app)
            .get('/api/articles/100')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article not found')
            })
    })
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
            .get('/api/articles/lawnmower')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    })
})

describe('GET /api/articles', () => {
    it('should serve an array of all articles without the body property, but with a comment count property', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const {articles} = response.body
                expect(articles).toHaveLength(13)
                articles.forEach((article) => {
                    expect(article).not.toHaveProperty('body')
                    expect(article).toHaveProperty('article_id')
                    expect(article).toHaveProperty('title')
                    expect(article).toHaveProperty('topic')
                    expect(article).toHaveProperty('author')
                    expect(article).toHaveProperty('created_at')
                    expect(article).toHaveProperty('votes')
                    expect(article).toHaveProperty('comment_count')
                })
            })
    })
    it('articles should be sorted by date in descending order', () => {
        return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const {articles} = response.body
                expect(articles).toBeSortedBy('created_at', { descending: false })
            })
    })
    it('should accept a topic query which filters the articles by the given topic', () => {
        return request(app)
        .get('/api/articles?topic=cats')
        .expect(200)
        .then((response)=>{
            const {articles} = response.body
            expect(articles).toHaveLength(1)
        })
    });
    it('should respond with 404 if the topic does not exist in the database', () => {
        return request(app)
        .get('/api/articles?topic=uhhhhhh')
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('topic not found')
        })
    });
    it('should still respond with an empty array if no topics are found with a valid topic', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((response)=>{
            const {articles} = response.body
            expect(articles).toHaveLength(0)
        })
    });
    it('should also accept a sort_by query that sorts by any valid column (defaults to date)', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then((response)=>{
            const {articles} = response.body
            expect(articles).toBeSortedBy('article_id')
        })
    });
    it('should respond with 400 if the sort query is invalid', () => {
        return request(app)
        .get('/api/articles?sort_by=password')
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('password is not a valid sort query')
        })
    });
    xit('should accept an order query that can be set to asc or desc', () => {
        return request(app)
        .get('/api/articles?order=desc')
        .expect(200)
        .then((response)=>{
            const {articles} = response.body
            expect(articles).toBeSortedBy('article_id', {descending: true})
        })
    });
})

describe('GET /api/articles/:article_id/comments', () => {
    it('should respond with an array of comments for the given article id', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response)=>{
            const {comments} = response.body
            expect(comments).toHaveLength(11)
                comments.forEach((comment) => {
                    expect(comment).toHaveProperty('comment_id')
                    expect(comment).toHaveProperty('votes')
                    expect(comment).toHaveProperty('created_at')
                    expect(comment).toHaveProperty('author')
                    expect(comment).toHaveProperty('body')
                    expect(comment).toHaveProperty('article_id', 1)
                })
        })
    })
    it('should order the comments by date', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response)=>{
            const {comments} = response.body
            expect(comments).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('should still send 200 if there are no comments and an empty array is returned', () => {
        return request(app)
        .get('/api/articles/4/comments')
        .expect(200)
        .then((response)=>{
            const {comments} = response.body
            expect(comments).toHaveLength(0)
        })
    });
    it('should 404 if an article is not found', () => {
        return request(app)
            .get('/api/articles/1000/comments')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article not found')
            })
    });
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
            .get('/api/articles/lawnmower/comments')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    })
})

describe('POST /api/articles/:article_id/comments', () => {
    it('should add a comment to an article and respond with the posted comment', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({
            username: 'butter_bridge',
            body: 'comment body test'
        })
        .expect(201)
        .then((response)=>{
            const comment = response.body.comment
            expect(comment).toHaveProperty('comment_id')
            expect(comment).toHaveProperty('votes')
            expect(comment).toHaveProperty('created_at')
            expect(comment).toHaveProperty('author')
            expect(comment).toHaveProperty('body', 'comment body test')
            expect(comment).toHaveProperty('article_id', 3)
        })
    });
    it('should respond with 404 if there is no article with the given id', () => {
        return request(app)
            .post('/api/articles/100/comments')
            .send({
                username: 'butter_bridge',
                body: 'comment body test'
            })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article not found')
            })
    })
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
            .post('/api/articles/lawnmower/comments')
            .send({
                username: 'butter_bridge',
                body: 'comment body test'
            })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    })
    it('should 404 if the user is not found', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({
            username: 'nonexistant_guy',
            body: 'comment body test'
        })
        .expect(404)
        .then((response)=>{
            expect(response.body.msg).toBe('user not found')
        })
    });
    it('should 400 if user property is missing', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({
            body: 'lonesome comment'
        })
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('missing property')
        })
    });
    it('should 400 if comment body property is missing', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({
            username: 'butter_bridge'
        })
        .expect(400)
        .then((response)=>{
            expect(response.body.msg).toBe('missing property')
        })
    });
    it('should ignore any extra properties', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({
            username: 'butter_bridge',
            body: 'comment body test',
            extremely_evil_property: 'hack the database >:)'
        })
        .expect(201)
    });

});

describe('PATCH /api/articles/:article_id', () => {
    it('should update the given articles vote count using the sent object, then return the article', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 1 })
        .expect(200)
        .then((response)=>{
            const {article} = response.body
            expect(article).toHaveProperty('article_id')
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('topic')
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('created_at')
            expect(article).toHaveProperty('votes', 101)
        })
    });
    it('should respond with 404 if there is no article with the given id', () => {
        return request(app)
            .patch('/api/articles/100')
            .send({ inc_votes: 1 })
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('article not found')
            })
    })
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
            .patch('/api/articles/lawnmower')
            .send({ inc_votes: 1 })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    })
    it('should not accept votes that are not an integer', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1.25 })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    });
    it('should 400 if there is no inc_votes property', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ votes: 2 })
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('missing property')
            })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('should delete the given comment by comment id and respond with 204', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    it('should respond with 404 if there is no comment with the given id', () => {
        return request(app)
            .delete('/api/comments/10000')
            .expect(404)
            .then((response) => {
                expect(response.body.msg).toBe('comment not found')
            })
    })
    it('should respond with 400 if the given param is not a valid argument', () => {
        return request(app)
            .delete('/api/comments/lawnmower')
            .expect(400)
            .then((response) => {
                expect(response.body.msg).toBe('bad request')
            })
    })
});

describe('GET /api/users', () => {
    it('should respond with an array of all users', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then((response) => {
                const {users} = response.body
                    expect(users).toHaveLength(4)
                    users.forEach((user)=>{
                        expect(user).toHaveProperty('username')
                        expect(user).toHaveProperty('name')
                        expect(user).toHaveProperty('avatar_url')
                    })
            })
    });
});

