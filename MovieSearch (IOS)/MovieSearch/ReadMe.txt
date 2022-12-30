Collection View Resource:
https://www.youtube.com/watch?v=dMc0m0o8ZBU
https://www.youtube.com/watch?v=eWGu3hcL3ww

Creative Portion:
- Added scrollView and video player to the detailed movie info page.
The video was added using google's youtube_ios_player_helper.
I designed the system to pick the official trailer as a youtube video.
If the video doesn't exist, video player also disappears.
- Added Share button in the detailed movie info page.
Implemented using UIActivityViewController. It allows users to copy movie url from tmdb
and store movie poseter in their photo library.
- Information of favorite movies is stored in local storage.
Image in the fileSystem and string data in UserDefaults.
Click movie name in the favorites list to access locally stored movie info.
Stored image gets deleted with other movie details when user deletes it from favorites list.


Extra Credit:
- Added favorites function in Context Menu
- Studio 3

Notes:
- It takes a while to completely delete userDefaults value. Wait 10 seconds after you delete
a movie from favorites list.

References:
- Passing data to a new view controller:
https://www.youtube.com/watch?v=0fk82nXC2F0
- Embeded in swift files.



