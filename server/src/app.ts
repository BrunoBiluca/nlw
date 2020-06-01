import express from 'express'

const app = express()

app.get('/hello', (request: express.Request, response: express.Response) => {
    console.log("hello world")

    response.send("Hello World")
})

app.listen(3333)