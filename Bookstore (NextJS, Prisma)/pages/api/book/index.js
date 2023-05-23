import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';
import { checkUser } from '../../../helpers/api/check-user';
import { checkUserVerified } from '../../../helpers/api/check-user-verified';

export default apiHandler({
    post: add,
    put: update,
    delete: _delete
});

/**
 * @swagger
 * /api/book:
 *  post:
 *      summary: Posts a new book for sale.
 *      description: Posts a new book for sale. Uses the jwt token to identify the seller.
 *      tags:
 *          - Books
 *      requestBody:
 *          description: descript
 *          required: true
 *          content: 
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          isbn:
 *                              title: isbn
 *                              type: string
 *                          courseId:
 *                              title: courseId
 *                              type: string
 *                          price:
 *                              title: price
 *                              type: number
 *                              format: float
 *      responses:
 *          201:
 *              description: Success. Returns the newly created book.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Book'
 *          403:
 *              description: Invalid ISBN
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Message'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 */
async function add(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }
    if (!(await checkUserVerified(userId))) {
        return res.status(403).json({"message": "Please verify your email."})
    }

    // check isbn length

    var imageLink = ""
    var bookTitle = ""
    const response = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=" 
        + req.body["isbn"] 
        + "&maxResults=1",
        { method: "GET" }
    ).then((response) => {
        return response.json()
    }).then((responseData) => {
        if (responseData.totalItems == 0) {
            console.log("Invalid ISBN.")
            res.status(403).json({"message": "Invalid ISBN."})
        }
        // sets title
        if (
            responseData.items[0].volumeInfo == undefined ||
            responseData.items[0].volumeInfo.title == undefined
        ) {   
        }
        else {
            bookTitle = responseData.items[0].volumeInfo.title
        }

        // sets image link
        if (
            responseData.items[0].volumeInfo === undefined ||
            responseData.items[0].volumeInfo.imageLinks === undefined ||
            responseData.items[0].volumeInfo.imageLinks.thumbnail === undefined
        ) {   
        }
        else {
            imageLink = responseData.items[0].volumeInfo.imageLinks.thumbnail
        }
    })

    if (req.body["price"] <= 0) {
        res.status(403).json({"message": "Price must be greater than 0."})
    }

    console.log("Creating new book...")
    console.log(req.body)
    const new_book = await prisma.book.create({
        data: {
            title: bookTitle,
            isbn: req.body["isbn"],
            ownerId: userId,
            courseId: req.body["courseId"],
            price: req.body["price"],
            description: req.body["description"],
            imageLink: imageLink
        }
    })
    console.log("New book created: ")
    console.log(new_book)
    res.status(201).json(new_book)
}

/**
 * @swagger
 * /api/book:
 *  put:
 *      summary: Updates a book.
 *      description: Updates a book with new data, using the book's UUID to identify the book.
 *      tags:
 *          - Books
 *      requestBody:
 *          description: descript
 *          content: 
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          title:
 *                              title: title
 *                              type: string
 *                          isbn:
 *                              title: isbn
 *                              type: string
 *                          courseId:
 *                              title: courseId
 *                              type: string
 *                          price:
 *                              title: price
 *                              type: number
 *                              format: float
 *      responses:
 *          200:
 *              description: Success. Returns the updated book.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Book'
 *          403:
 *              description: Book update failed. The user ID in the jwt token does not match the book's owner.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 */
async function update(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }
    
    const book = await prisma.book.findUniqueOrThrow({
        where: {
            id: req.query["id"].toString()
        }
    })

    if (book.ownerId != userId && !user.admin) {
        return res.status(403).json({"message": "Sender is not the owner of the book."})
    }

    if (book.sold == true) {
        return res.status(403).json({"message": "Cannot update a sold book."})
    }

    var imageLink = ""
    var bookTitle = ""

    const response = await fetch(
        "https://www.googleapis.com/books/v1/volumes?q=" 
        + book.isbn
        + "&maxResults=1",
        { method: "GET" }
    ).then((response) => {
        return response.json()
    }).then((responseData) => {
        // sets title
        if (
            responseData.items[0].volumeInfo === undefined ||
            responseData.items[0].volumeInfo.title === undefined
        ) {   
        }
        else {
            bookTitle = responseData.items[0].volumeInfo.title
        }

        // sets image link
        if (
            responseData.items[0].volumeInfo === undefined ||
            responseData.items[0].volumeInfo.imageLinks === undefined ||
            responseData.items[0].volumeInfo.imageLinks.thumbnail === undefined
        ) {   
        }
        else {
            imageLink = responseData.items[0].volumeInfo.imageLinks.thumbnail
        }
    })
    // gets current time
    const event = new Date
    console.log("Updating book with id " + req.query["id"].toString())
    const updated_book = await prisma.book.update({
        where: {
            id: req.query["id"].toString()
        },
        data: {
            title: bookTitle,
            isbn: req.body["isbn"],
            ownerId: req.body["ownerId"],
            courseId: req.body["courseId"],
            price: req.body["price"],
            description: req.body["description"],
            imageLink: imageLink,
            dateUpdated: event.toISOString()
        }
    })
    console.log("Book updated: ")
    console.log(updated_book)
    res.status(200).json(updated_book)
}

/**
 * @swagger
 * /api/book?id={bookId}:
 *  delete:
 *      summary: Deletes a book.
 *      description: Deletes a book, using the book's UUID to identify the book.
 *      tags:
 *          - Books
 *      responses:
 *          204:
 *              description: Success. Returns an empty json.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/Empty'
 *          403:
 *              description: Book deleted failed. The user ID in the jwt token does not match the book's owner.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 */
async function _delete(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }

    const book = await prisma.book.findUniqueOrThrow({
        where: {
            id: req.query["id"].toString()
        }
    })

    if (book.ownerId != userId) {
        return res.status(403).json({"message": "Sender is not the owner of the book."})
    }
    console.log("Deleting book with id " + req.query["id"].toString())
    const deleted_book = await prisma.book.update({
        where: {
            id: req.query["id"].toString()
        },
        data: {
            deleted: true
        }
    })
    console.log("Book deleted: ")
    console.log(deleted_book)
    res.status(204).json({})
}