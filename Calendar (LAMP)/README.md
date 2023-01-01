# Calendar

Calendar page URL: 
http://ec2-18-224-15-37.us-east-2.compute.amazonaws.com/~rainmaua/calendar/calendar.php

Notes: 
- Login information: 
Username: rainmaua
Password: 1234
- Error described below is due to data request forgery not a coding issue:
e.g. js_event_save.js:130 SyntaxError: Unexpected non-whitespace character after JSON at position 55
When you check the inspect->Network->Fetch/XHR->click the php file causing the error, the error will show up. 
Creative portion:
- Added category for events. Different colors were assigned for each category. 
The categories can be edited. 
- Events can be shared with a different user. To do so, a user should click 'share event'->type in the username of the user to share event with. 
Users can decide not to share events. 
When a user deletes a shared event, it gets deleted and the 'shared with' setting of the other user change to null. When a user updates an event, it also gets updated on the other user's calendar. 
Incorrect usernames are unacceptable since it's connected to database to check for usernames using async fetch method. 

Resources:
- https://jshint.com/
- Naming convention: hyphen for class, underscore for id. e.g. class="add-btn", id="add_btn"
- https://www.digitalocean.com/community/tutorials/submitting-ajax-forms-with-jquery


