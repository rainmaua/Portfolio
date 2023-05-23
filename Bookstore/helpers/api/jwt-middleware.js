var {expressjwt: jwt} = require('express-jwt');
var { unless } = require("express-unless");
const util = require('util');
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export { jwtMiddleware };

function jwtMiddleware(req, res) {
    console.log()
    const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless({
        path: [
            // public routes that don't require authentication
            '/api/book/all/',
            '/api/book/average-price/',
            '/api/book/by-course/',
            '/api/book/by-id/',
            '/api/book/by-isbn/',
            '/api/book/by-title/',
            "/api/book/by-user/",

            "/api/course/all/",
            "/api/course/by-id/",
            "/api/course/search/",
            "/api/course/search",

            '/api/user/register/',
            '/api/user/register',
            '/api/user/authenticate/',
            '/api/user/authenticate',

            '/api/user/verify-email/'
        ]
    });

    return util.promisify(middleware)(req, res);
}