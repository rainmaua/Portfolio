# API examples
IDs are all UUIDs. <br>
GET requests will return the result and a 200 response if successful. <br>
POST requests will return the newly created object and return a 201 response if successful. <br>
PUT requests will return the updated entry and return a 200 response if successful. <br>
DELETE requests will not have a response body and return a 204 response if successful. <br>
Endpoints are alphabetized. <br>
This document will be removed once the Swagger API documentation is available. <br>

## /book
### POST
Pass JSON with new book details. <br>
Owner and course are determined by ID. <br>
Endpoint: http://localhost:3000/api/book <br>
Passes (example):
```
{
    "title": "A New China - An Intermediate Reader of Modern Chinese",
    "isbn": "978-0-691-14836-6",
    "ownerId": "f89930a2-f9ba-4622-8e07-dcc0d42d460f",
    "courseId": "6b4db8a5-18d1-429d-9614-4d88c95ab485",
    "price": 10.5
}
```
Returns (example):
```
{
    "id": "2aad8e94-b4d7-4a07-a1bb-daad4b63764f",
    "title": "A New China - An Intermediate Reader of Modern Chinese",
    "isbn": "978-0-691-14836-6",
    "ownerId": "f89930a2-f9ba-4622-8e07-dcc0d42d460f",
    "courseId": "6b4db8a5-18d1-429d-9614-4d88c95ab485",
    "price": 10.5
}
```
### PUT
Pass id by URL. Pass JSON with data you want to update. You can leave out data you wish to be unchanged. <br>
Endpoint: http://localhost:3000/api/book?id={id} <br>
Endpoint (example): http://localhost:3000/api/book?id=2aad8e94-b4d7-4a07-a1bb-daad4b63764f <br>
Pass (example):
```
{
    "pirce": 20
}
```
Returns (example):
```
{
    "id": "2aad8e94-b4d7-4a07-a1bb-daad4b63764f",
    "title": "A New China - An Intermediate Reader of Modern Chinese",
    "isbn": "978-0-691-14836-6",
    "ownerId": "f89930a2-f9ba-4622-8e07-dcc0d42d460f",
    "courseId": "6b4db8a5-18d1-429d-9614-4d88c95ab485",
    "price": 20
}
```
### DELETE
Pass id by URL. Does not return a body. <br>
Endpoint: http://localhost:3000/api/book?id={id} <br>
Endpoint (example): http://localhost:3000/api/book?id=2aad8e94-b4d7-4a07-a1bb-daad4b63764f <br>

## /book/all
### GET
Returns all books. Does not require any values to be passed. <br>
Endpoint: http://localhost:3000/api/book/all
Returns (example):
```
[
    {
        "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
        "title": "A New China - An Intermediate Reader of Modern Chinese",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T19:32:17.397Z",
        "date_updated": "2023-02-19T19:32:17.397Z",
        "price": 0,
        "sold": false
    },
    {
        "id": "6ff794e0-59b4-4427-9714-e353fc66521b",
        "title": "Allegories",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T23:29:32.689Z",
        "date_updated": "2023-02-19T23:29:32.689Z",
        "price": 0,
        "sold": false
    }
]
```

## /book/by-course
### GET 
Pass course UUID in URL. Remember to format it correctly. Returns a list.<br>
Endpoint: http://localhost:3000/api/book/by-course?courseid={courseid}
Endpoint (example): http://localhost:3000/api/book/by-courseid?courseid=a
Returns (example):
```
[
    {
        "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
        "title": "A New China - An Intermediate Reader of Modern Chinese",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T19:32:17.397Z",
        "date_updated": "2023-02-19T19:32:17.397Z",
        "price": 0
    }
]
```



## /book/by-id
### GET
Pass id by URL.<br>
Endpoint: http://localhost:3000/api/book?id={id} <br>
Endpoint (example): http://localhost:3000/api/book?id=2aad8e94-b4d7-4a07-a1bb-daad4b63764f <br>
Returns (example):
```
{
    "id": "2aad8e94-b4d7-4a07-a1bb-daad4b63764f",
    "title": "A New China - An Intermediate Reader of Modern Chinese",
    "isbn": "978-0-691-14836-6",
    "ownerId": "f89930a2-f9ba-4622-8e07-dcc0d42d460f",
    "courseId": "6b4db8a5-18d1-429d-9614-4d88c95ab485",
    "price": 10.5
}
```

## /book/by-isbn
### GET 
Pass ISBN in URL. Remember to format it correctly. Returns a list.<br>
Endpoint: http://localhost:3000/api/book/by-title?isbn={isbn}
Endpoint (example): http://localhost:3000/api/book/by-isbn?isbn=a
Returns (example):
```
[
    {
        "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
        "title": "A New China - An Intermediate Reader of Modern Chinese",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T19:32:17.397Z",
        "date_updated": "2023-02-19T19:32:17.397Z",
        "price": 0
    }
]
```

## /book/by-title
### GET 
Pass ISBN in URL. Remember to format it correctly. Returns a list.<br>
Endpoint: http://localhost:3000/api/book/by-title?title={title}
Endpoint (example): http://localhost:3000/api/book/by-title?title=a
Returns (example):
```
[
    {
        "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
        "title": "A New China - An Intermediate Reader of Modern Chinese",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T19:32:17.397Z",
        "date_updated": "2023-02-19T19:32:17.397Z",
        "price": 0
    },
    {
        "id": "6ff794e0-59b4-4427-9714-e353fc66521b",
        "title": "Allegories",
        "isbn": "978-0-691-14836-6",
        "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
        "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "date_created": "2023-02-19T23:29:32.689Z",
        "date_updated": "2023-02-19T23:29:32.689Z",
        "price": 0
    }
]
```

## /cart
### GET
Gets the entire cart of a specific user. User ID is taken from the JWT token.
Endpoint: http://localhost:3000/api/cart
Returns (example):
```
[
    {
        "book": {
            "id": "6ff794e0-59b4-4427-9714-e353fc66521b",
            "title": "Allegories",
            "isbn": "978-0-691-14836-6",
            "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
            "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
            "date_created": "2023-02-19T23:29:32.689Z",
            "date_updated": "2023-02-19T23:29:32.689Z",
            "price": 0,
            "sold": false
        }
    },
    {
        "book": {
            "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
            "title": "A New China - An Intermediate Reader of Modern Chinese",
            "isbn": "978-0-691-14836-6",
            "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
            "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
            "date_created": "2023-02-19T19:32:17.397Z",
            "date_updated": "2023-02-19T19:32:17.397Z",
            "price": 0,
            "sold": false
        }
    }
]
```

### UPDATE
Adds the book to the cart of the user in the JWT token. Returns the new cart.
Endpoint: http://localhost:3000/api/cart
Pass (example):
```
{
    "bookId": "aa925654-854f-43a1-a415-df5d6e8bb1b7"
}
```
Returns (example):
```
[
    {
        "book": {
            "id": "6ff794e0-59b4-4427-9714-e353fc66521b",
            "title": "Allegories",
            "isbn": "978-0-691-14836-6",
            "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
            "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
            "date_created": "2023-02-19T23:29:32.689Z",
            "date_updated": "2023-02-19T23:29:32.689Z",
            "price": 0,
            "sold": false
        }
    },
    {
        "book": {
            "id": "aa925654-854f-43a1-a415-df5d6e8bb1b7",
            "title": "A New China - An Intermediate Reader of Modern Chinese",
            "isbn": "978-0-691-14836-6",
            "ownerId": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
            "courseId": "95a8233e-1839-4927-bae3-d0c58de0d487",
            "date_created": "2023-02-19T19:32:17.397Z",
            "date_updated": "2023-02-19T19:32:17.397Z",
            "price": 0,
            "sold": false
        }
    }
]
```

### DELETE
Removes the book from the cart. Takes book ID from URL.
Endpoint: http://localhost:3000/api/cart?bookId={bookId}
Endpoint (example): http://localhost:3000/api/cart?bookId=aa925654-854f-43a1-a415-df5d6e8bb1b7

## /course
### GET
Pass id by URL. <br>
Endpoint: http://localhost:3000/api/course?id={id} <br>
Endpoint (example): http://localhost:3000/api/course?id=3f22c02d-8753-4822-b353-427f1c7ac000 <br>
Returns (example):
```
{
    "id": "3f22c02d-8753-4822-b353-427f1c7ac000",
    "name": "CSE 247 Data Structures and Algorithms",
    "university": "Washington University in St. Louis"
}
```
### POST
Pass JSON with new course details. <br>
Endpoint: http://localhost:3000/api/course <br>
Passes (example):
```
{
    "name": "CSE 247 Data Structures and Algorithms",
    "university": "Washington University at St. Louis"
}
```
Returns (example):
```
{
    "id": "3f22c02d-8753-4822-b353-427f1c7ac000",
    "name": "CSE 247 Data Structures and Algorithms",
    "university": "University of Maryland College Park"
}
```
### PUT
Pass id by URL. Pass JSON with data you want to update. You can leave out data you wish to be unchanged. <br>
Endpoint: http://localhost:3000/api/course?id={id} <br>
Endpoint (example): http://localhost:3000/api/course?id=3f22c02d-8753-4822-b353-427f1c7ac000 <br>
Pass (example):
```
{
    "university": "University of Maryland College Park"
}
```
Returns (example):
```
{
    "id": "3f22c02d-8753-4822-b353-427f1c7ac000",
    "name": "CSE 247 Data Structures and Algorithms",
    "university": "University of Maryland College Park"
}
```
### DELETE
Pass id by URL. Does not return a body. <br>
Endpoint: http://localhost:3000/api/course?id={id} <br>
Endpoint (example): http://localhost:3000/api/course?id=3f22c02d-8753-4822-b353-427f1c7ac000 <br>

## /course/all
### GET
Returns every course in the database. Does not require any values to be passed.
Endpoint: http://localhost:3000/api/course/all
Returns (example):
```
[
    {
        "id": "95a8233e-1839-4927-bae3-d0c58de0d487",
        "name": "Chinese 207 Intermediate Chinese for Heritage Speakers",
        "university": "Washington University in St. Louis",
        "date_created": "2023-02-19T19:31:58.375Z",
        "date_updated": "2023-02-19T19:31:58.375Z"
    }
]
```

## /user
### GET
Pass id by URL.<br>
Endpoint: http://localhost:3000/api/user?id={id} <br>
Endpoint (example): http://localhost:3000/api/user?id=07e2d111-8342-4f18-9d79-7dcdca752c18 <br>
Returns (example):
```
{
    "id": "868405dd-0f15-45be-bd2a-2eaab3d665d9",
    "username": "alice-anderson",
    "password": "secret_password",
    "email": "alice.anderson@gmail.com",
    "first_name": "Alice",
    "last_name": "Anderson",
    "phone_num": "123-456-7890"
}
```
### PUT
Pass id by URL. Pass JSON with data you want to update. You can leave out data you wish to be unchanged. <br>
Endpoint: http://localhost:3000/api/user?id={id} <br>
Endpoint (example): http://localhost:3000/api/user?id=868405dd-0f15-45be-bd2a-2eaab3d665d9 <br>
Pass (example):
```
{
    "phone_num": "321-456-7890"
}
```
Returns (example):
```
{
    "id": "868405dd-0f15-45be-bd2a-2eaab3d665d9",
    "email": "alice.anderson@gmail.com",
    "username": "alice-anderson",
    "password": "secret_password",
    "first_name": "Alice",
    "last_name": "Anderson",
    "phone_num": "321-456-7890"
}
```
### DELETE
Pass id by URL. Does not return a body. <br>
Endpoint: http://localhost:3000/api/user?id={id} <br>
Endpoint (example): http://localhost:3000/api/user?id=868405dd-0f15-45be-bd2a-2eaab3d665d9 <br>

## /user/authenticate
### POST
Pass username and password as json. Will return a jwt token, which needs to be saved as a session variable and used for each protected api endpoint. <br>
Endpoint: http://localhost:3000/api/user/authenticate <br>
Pass (example): <br>
```
{
    "username": "alice-anderson2",
    "password": "secret_password"
}
Returns (example):
```
```
{
    "id": "8f2ec23f-4ef4-458b-b650-b83b53fc9852",
    "username": "alice-anderson2",
    "firstName": "Alice",
    "lastName": "Anderson",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZjJlYzIzZi00ZWY0LTQ1OGItYjY1MC1iODNiNTNmYzk4NTIiLCJpYXQiOjE2NzcxMjYyOTQsImV4cCI6MTY3NzczMTA5NH0.4bAvpLseay-jlI6J-TmfHD_pP-zuS9L7yy9bTGXGzGc"
}
```

## /user/by-email
### GET
Pass email by URL. This can be used for logins. Since emails contain special characters, make sure to URI encode the email address.<br>
Endpoint: http://localhost:3000/api/user-by-email?email={email}} <br>
Endpoint (example): http://localhost:3000/api/user-by-email?email=alice.anderson%40gmail.com <br>
Returns (example):
```
{
    "id": "868405dd-0f15-45be-bd2a-2eaab3d665d9",
    "email": "alice.anderson@gmail.com",
    "first_name": "Alice",
    "last_name": "Anderson",
    "phone_num": "123-456-7890"
}
```


## /user/register
### POST
Pass json with the required data.
Endpoint: http://localhost:3000/api/user/register
Pass (example):
```
{
    "username": "alice-anderson2",
    "password": "secret_password",
    "email": "alice.anderson2@gmail.com",
    "first_name": "Alice",
    "last_name": "Anderson",
    "phone_num": "321-456-7890"
}
```
Returns (example):
```
{
    "username": "alice-anderson2",
    "password": "secret_password",
    "email": "alice.anderson2@gmail.com",
    "first_name": "Alice",
    "last_name": "Anderson",
    "phone_num": "321-456-7890"
}
```


