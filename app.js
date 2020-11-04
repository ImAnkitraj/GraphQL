const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const  bodyParser = require('body-parser');
const mongoose = require("mongoose");
const cors = require('cors');

const graphQlSchema = require('./graphql/schema/index')
const graphQlResolvers = require('./graphql/resolvers/index')
const isAuth  = require('./middleware/isAuth');

const app = express();

app.use(bodyParser.json());
// app.use(cors());

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200);
    }
    next();
})
app.use(isAuth);

app.use('/graphql',graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
}));

mongoose.connect(`mongodb+srv://imankitraj:imankitraj@aimusic.gn7ym.mongodb.net/graphql?retryWrites=true&w=majority`)
.then(()=>{
    console.log('Db connected')
    app.listen(8000, function(){
        console.log('Server started')
    });
    
}).
catch(err => {
    console.log(err);
    console.log("Not connected")
})




