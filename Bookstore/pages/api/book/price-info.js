import { prisma } from '../../../db'
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
    get: priceInfo
});

/**
 * @swagger
 * /api/book/price-info?isbn={isbn}:
 *  get:
 *      summary: Returns the average, min, and max price of a book
 *      description: Returns the average, minimum, and maximum price of a book, identified by isbn.
 *      tags:
 *          - Books
 *      responses:
 *          200:
 *              description: The average, minimum, and maximum price of the book
 *              content: 
 *                  application/json: 
 *                      schema: 
 *                          type: object
 *                          properties:
 *                              average:
 *                                  title: average
 *                                  type: number
 *                                  format: float
 *                              min:
 *                                  title: min
 *                                  type: number
 *                                  format: float
 *                              max:
 *                                  title: max
 *                                  type: number
 *                                  format: float
 *          
 */
async function priceInfo(req, res) {
    console.log("Getting average price of book with isbn " + req.query["isbn"])

    const aggregations = await prisma.Book.aggregate({
        _avg: {
            price: true,
        },
        _min: {
            price: true
        },
        _max: {
            price: true
        },
        where: {
            isbn: req.query["isbn"]
        }
    })

    console.log('Average price: ' + aggregations._avg.price)
    res.status(200).json({
        'average': aggregations._avg.price,
        'min': aggregations._min.price,
        'max': aggregations._max.price
    })
}