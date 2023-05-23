import jwtDecode from "jwt-decode";
import { prisma } from "../../../db";
import { apiHandler } from "../../../helpers/api/api-handler";
import { checkUser } from '../../../helpers/api/check-user';

export default apiHandler({
  post: confirmSale,
});

/**
 *  @swagger
 *  /api/buy-request/confirm-sale:
 *  post:
 *      summary: Confirms sale of a book.
 *      description: Confirms sale of a book. Will deny all remaining buy requests as well and records a transaction record.
 *      tags:
 *          - Buy Request
 *      responses:
 *          200:
 *              description: Success. Returns an empty json.
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Empty'
 *          403:
 *              description: User's account has been suspended.
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

async function confirmSale(req, res) {
  const userId = jwtDecode(req.headers["authorization"]).sub;

  if (await checkUser(userId)) {
    return res
      .status(403)
      .json({ message: "This account has been suspended." });
  }

  const book = await prisma.book.findUniqueOrThrow({
    where: {
      id: req.body["bookId"].toString(),
    },
  });

  if (book.ownerId != userId) {
    return res
      .status(403)
      .json({ message: "Sender is not the owner of the book." });
  }

  if (book.sold == true) {
    return res.status(403).json({ message: "Book has already been sold." });
  }

  // deny all other buy requests; the book has been sold
  console.log("Denying all buy requests for book " + req.body["bookId"]);
  const denyRequests = await prisma.BuyRequest.updateMany({
    where: {
      bookId: req.body["bookId"],
    },
    data: {
      denied: true,
    },
  });

  // update the confirmed buy request
  console.log(
    "Confirming buy request from buyer " +
      req.body["buyerId"] +
      " for book " +
      req.body["bookId"] +
      " from seller " +
      userId
  );
  const confirmRequest = await prisma.BuyRequest.update({
    where: {
      sellerId_buyerId_bookId: {
        bookId: req.body["bookId"],
        sellerId: userId,
        buyerId: req.body["buyerId"],
      },
    },
    data: {
      denied: false,
      completed: true,
    },
  });

  // update the book to sold
  console.log("Confirming sale of book " + req.body["bookId"].toString());
  const updated_book = await prisma.book.update({
    where: {
      id: req.body["bookId"].toString(),
    },
    data: {
      sold: true,
    },
  });

  // record transaction
  console.log(
    "Recording transaction between buyer " +
      req.body["buyerId"] +
      " for book " +
      req.body["bookId"] +
      " from seller " +
      userId
  );
  const transaction = await prisma.Transaction.create({
    data: {
      buyerId: req.body["buyerId"],
      sellerId: book.ownerId,
      bookId: book.id,
      dateCompleted: req.body["dateCompleted"],
    },
  });

  return res.status(200).json({});
}
