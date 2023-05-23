import { prisma } from '../../../db'

/**
 * @swagger
 * /api/user/by-email:
 *  get:
 *      summary: Gets user by email
 *      description: Gets a user's info by email.
 *      tags:
 *          - Users
 *      responses:
 *          200:
 *              description: Success. Returns user info.
 *              content: 
 *                  application/json:
 *                      schema: 
 *                          $ref: '#/components/schemas/User'
 * 
 */
export default async function handle(req, res) {
    if (req.method === "GET") {
        try {
            console.log("Getting user by id: " + decodeURI(req.query["email"]))
            const user = await prisma.user.findUniqueOrThrow({
                where: {
                    email: decodeURI(req.query["email"])
                }
            })
            console.log("User found:")
            console.log(user)
            res.status(200).json(user)
        }
        catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === "P2025") { // Could not find user with this email
                    console.log("User cannot be found by this email.")
                    res.status(404).json({"error": "User cannot be found by this email."})
                }
                else {
                    console.log("Other error")
                    res.status(500).json({"error": e})
                }
            }
            else {
                console.log("Other error")
                res.status(500).json({"error": e})
            }
        }
	}
    else {
        res.status(404).json({"error": "This type of HTTP request is not supported."})
    }
}