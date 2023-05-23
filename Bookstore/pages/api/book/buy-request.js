import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    post: buy,
});

/**
 *  @swagger
 *  /api/books/buy-request:
 *  post:
 *      summary: Send a buy request for a book
 *      description: Send a buy request for a book. This should be called by the buyer
 *      tags:
 *          - Books
 *      parameters:
 *          - in: body
 *            name: book
 *            type: string
 *            description: The UUID for the book
 *      responses:
 *          200:
 *              description: Success. Returns an empty json.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Empty'
 *          403:
 *              description: Buy request failed. JSON contains a reason for why.
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
 * 
 */
async function buy(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    console.log("User " + userId + " is buying book " + req.body["bookId"])

    // gets the book
    const book = await prisma.book.findUniqueOrThrow({
        where: {
            id: req.body["bookId"]
        }
    })

    // checks
    if (book.ownerId == userId) {
        return res.status(403).json({"message": "Cannot buy book from self"})
    }

    if (book.sold == true) {
        return res.status(403).json({"message": "Book has been sold."})
    }

    if (book.deleted == true) {
        return res.status(404).json({"message": "Book not found"})
    }

    // get sender info
    const user = await prisma.user.findUniqueOrThrow({
        where: {
            id: userId
        }
    })

    if (user.suspended == true) {
        return res.status(403).json({"message": "This account has been suspended."})
    }

    if (user.verified != true) {
        return res.status(403).json({"message": "Please verify your email."})
    }
    
    // updates the user with the buy request
    const buyReq = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            buying: {
                create: {
                    sellerId: book.ownerId,
                    bookId: req.body["bookId"],
                    content: "A user wants to buy your book!"
                }
            }
        }
    })
    
    console.log("Buy request sent.")

    return res.status(200).json({})
}