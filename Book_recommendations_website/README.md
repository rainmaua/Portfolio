# Book Recommendations Website

How to run the project:
- yiryoungkim@Yis-MacBook-Pro bookRecWebsite % cd backend
- yiryoungkim@Yis-MacBook-Pro backend % npm install
- yiryoungkim@Yis-MacBook-Pro backend % nodemon server.js
- yiryoungkim@Yis-MacBook-Pro backend % cd .. 
- yiryoungkim@Yis-MacBook-Pro bookRecWebsite % npm install 
- yiryoungkim@Yis-MacBook-Pro bookRecWebsite % npm start 

Notes to self: 
- MongoDB Account: id: rainmaua pass: Yk8IhcqXR9uxeEUT

Error Solution:
- Error: listen EADDRINUSE: address already in use :::5000
yiryoungkim@Yis-MacBook-Pro backend % sudo lsof -i :5000      
yiryoungkim@Yis-MacBook-Pro backend % kill -9 {PID}

- Webpack 5 error: 
https://alchemy.com/blog/how-to-polyfill-node-core-modules-in-webpack-5

Videos Watched & useful sources: 
- Login, JWT Token:
https://www.youtube.com/watch?v=Ejg7es3ba2k

- React: 
https://www.youtube.com/watch?v=w7ejDZ8SWv8&list=PL7uyq-JgKnDVmg1PECtpUkESZurryrdXp&index=4

- Mern Stack Overview:
https://www.youtube.com/watch?v=7CqJlxBYj-M

- Calculating time for node-schedule
https://crontab.guru/daily

- User Story #11: The #quote-box wrapper element should be horizontally centered. Please run tests with browser 
https://console.cloud.google.com/apis/credentials?project=book-rec-2


API: 

- Google Books API: https://developers.google.com/books/
- New York Times API:  https://developer.nytimes.com/docs/books-product/1/overview 
- Quotable API: https://github.com/lukePeavey/quotable 



