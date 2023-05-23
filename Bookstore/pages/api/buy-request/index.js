import jwtDecode from 'jwt-decode';
import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';
import { checkUser } from '../../../helpers/api/check-user';

export default apiHandler({
    put: update,
    delete: _delete
});

/**
 *  @swagger
 *  /api/buy-request:
 *  put:
 *      summary: Update a buy request
 *      description: Updates a buy request. Updating can only be done by the seller.
 *      tags:
 *          - Buy Request
 *      requestBody:
 *          description: descript
 *          content: 
 *              application/json: 
 *                  schema: 
 *                      type: object
 *                      properties:
 *                          buyerId:
 *                              title: buyerId
 *                              type: string
 *                          bookId:
 *                              title: bookId
 *                              type: string
 *                          read:
 *                              title: read
 *                              type: boolean
 *                          approved:
 *                              title: approved
 *                              type: boolean
 *                          denied:
 *                              title: denied
 *                              type: boolean
 *                          completed:
 *                              title: completed
 *                              type: boolean
 *      responses:
 *          200:
 *              description: Success. Returns the updated buy request.
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/BuyRequest'
 *          500:
 *              description: Invalid token.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Message'
 * 
 */
async function update(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub

    if (await checkUser(userId)) {
        return res.status(403).json({"message": "This account has been suspended."})
    }

    // there is no need to check whether the sender is indeed the seller,
    // since the query will not match the "right" buy request
    console.log("Updating buy request from buyer " + req.body["buyerId"] + " for book " + req.body["bookId"] + " from seller " + userId)
    var updated_request = await prisma.BuyRequest.update({
        where: {
            sellerId_buyerId_bookId: {
                sellerId: userId,
                buyerId: req.body["buyerId"],
                bookId: req.body["bookId"]
            }
        },
        data: {
            read: req.body["read"],
            approved: req.body["approved"],
            denied: req.body["denied"]
        }
    })
    console.log("Buy request updated")

    return res.status(200).json(updated_request)
}

/**
 *  @swagger
 *  /api/buy-request?sellerId={sellerId}&bookId={bookId}:
 *  delete:
 *      summary: Deleted a buy request
 *      description: Deletes a buy request. Deleting can only be done by the buyer.
 *      tags:
 *          - Buy Request
 *      parameters:
 *          - in: query
 *            name: sellerId
 *            type: string
 *            description: The UUID of the seller
 *          - in: query
 *            name: bookId
 *            type: string
 *            description: The UUID of the book
 *      responses:
 *          200:
 *              description: Success. Returns an empty json.
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
 */
async function _delete(req, res) {
    const userId = jwtDecode(req.headers["authorization"]).sub
    // there is no need to check whether the sender is indeed the seller,
    // since the query will not match the "right" buy request
    console.log("Deleting buy request from buyer " + req.body["buyerId"] + " for book " + req.body["bookId"] + " from seller " + userId)
    const updated_request = await prisma.BuyRequest.delete({
        where: {
            sellerId_buyerId_bookId: {
                sellerId: req.query["sellerId"],
                buyerId: userId,
                bookId: req.query["bookId"]
            }
        }
    })
    console.log("Buy request deleted")
    return res.status(204).json()
}