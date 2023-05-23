import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: getCart,
    post: addToCart,
    delete: _delete
});

/**
 *  @swagger
 *  /api/cart:
 *  get:
 *      summary: Gets the cart of the user
 *      description: Gets the cart of user, identified by the jwt token.
 *      tags:
 *          - Cart
 *      responses:
 *          200:
 *              description: Success. Returns the list of books in the user's cart
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function getCart(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    console.log("Getting cart of user: " + userId)
    const cart = await prisma.cart.findMany({
        where: {
            userId: userId
        },
        select: {
            book: true
        }
    })
    
    console.log("Get cart by user succeeded.")
    return res.status(200).json(cart)
}

/**
 *  @swagger
 *  /api/cart:
 *  post:
 *      summary: Adds book to cart.
 *      description: Adds the book to the cart of the user, identified by the jwt token. Returns the new cart
 *      tags:
 *          - Cart
 *      parameters:
 *          - in: body
 *            name: bookId
 *            type: string
 *            description: The UUID for the book
 *      responses:
 *          200:
 *              description: Success. Returns the list of books in the user's cart
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Book'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function addToCart(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    console.log("Adding book " + req.body["bookId"] + " to cart of user " + userId)

    // updates cart
    const cartUpdate = await prisma.Cart.create({
        data: {
            user: {
                connect: {
                    id: userId
                }
            },
            book: {
                connect: {
                    id: req.body["bookId"]
                }
            }
        }
    })

    // queries the new cart
    const cart = await prisma.Cart.findMany({
        where: {
            userId: userId
        },
        select: {
            book: true
        }
    })

    res.status(200).json(cart)
}

/**
 *  @swagger
 *  /api/cart?bookId={bookId}:
 *  delete:
 *      summary: Deletes the book from cart.
 *      description: Deletes the book from the cart of the user, identified by the jwt token. Returns an empty Json
 *      tags:
 *          - Cart
 *      parameters:
 *          - in: query
 *            name: bookId
 *            type: string
 *            description: The UUID for the book
 *      responses:
 *          200:
 *              description: Success. Returns the list of books in the user's cart
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Empty'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 * 
 */
async function _delete (req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    console.log("Deleting book " + req.query["bookId"] + " to cart of user " + userId)

    const removedBook  = await prisma.cart.delete({
        where: {
            userId_bookId: {
                userId: userId,
                bookId: req.query["bookId"]
            }
        }
    })

    console.log("Deleting from cart succeeded")
    console.log(removedBook)
    res.status(204).json()
}