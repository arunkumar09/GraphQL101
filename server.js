const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const {
    GraphQLSchema,
    GraphQLObjectType, GraphQLString, GraphQLList, GraphQLInt, GraphQLNonNull
} = require('graphql')
const app = express()

//instead of using a database, we are using these test values

const authors = [
    { id: 1, name: 'J.K. Rowling' },
    { id: 2, name: 'J.R.R Tolkein' },
    { id: 3, name: 'George R. R. Martin'}
]

const books = [
    { id: 1, name: 'Harry Potter 1', authorId: 1 },
    { id: 2, name: 'Harry Potter 2', authorId: 1 },
    { id: 3, name: 'Harry Potter 3', authorId: 1 },
    { id: 4, name: 'LOTR 1', authorId: 2 },
    { id: 5, name: 'LOTR 2', authorId: 2 },
    { id: 6, name: 'LOTR 3', authorId: 2 },
    { id: 7, name: 'GOT 1', authorId: 3 },
    {id:8, name: 'GOT 2', authorId:3},
    {id:9, name: 'GOT 3', authorId:3}
    
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represents a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: { type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }
    },
    })
})

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: { type: GraphQLList(BookType),
            resolve: (author) => {
                return books.filter(book => book.authorId === author.id)
            }
    },
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        book: {
            type: BookType,
            description: 'A single Book',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
            },
            books: {
                type: new GraphQLList(BookType),
                description: 'List of All Books',
                resolve: () => books
        },
        author: {
            type: AuthorType,
            description: 'Single Author',
            args: {
                id: {type: GraphQLInt}
            },
            resolve: (parent, args) => authors.find(author => author.id === args.id)
    },
        authors: {
            type: new GraphQLList(AuthorType),
            description: 'List of All Authors',
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a Book',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLNonNull(GraphQLInt) },
            },
            resolve: (parent, args) => {
                const book = {
                   id: books.length +1, name: args.name, authorId: args.authorId 
                }
                books.push(book)
                return book
            }
        },
        addAuthor: {
            type: AuthorType,
            description: 'Add a Author',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: (parent, args) => {
                const author = {
                   id: authors.length +1, name: args.name 
                }
                books.push(author)
                return author
            }
        }   
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))
app.listen(5000., () => console.log('server running'))