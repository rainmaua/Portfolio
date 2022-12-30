//
//  DetailedViewController.swift
//  MovieSearch
//
//
import YoutubePlayer_in_WKWebView
import youtube_ios_player_helper
import UIKit


class DetailedViewController: UIViewController{
    
    @IBOutlet var playerView: WKYTPlayerView!
    @IBOutlet weak var scrollView: UIScrollView!
    @IBOutlet weak var movieImageFrame: UIImageView!
    @IBOutlet weak var trailerLabel: UILabel!
    @IBOutlet weak var releasedLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    @IBOutlet weak var overviewLabel: UILabel!
    @IBOutlet weak var favoriteBtn: UIButton!
    
    @IBOutlet weak var shareBtn: UIButton!
    //    var myNewDictArray: [Dictionary<String, String>] = []
    var userDefaults = UserDefaults.standard  // initialize usserDefaults.
    var movieImage: UIImage!
    var movieImageURL: String!
    var movieName: String!
    var movieReleased: String!
    var movieVoteAverage: Double!
    var movieOverview:String!
    var movieId: Int! 
    let apiKey = "a3b6b3347eb3997379e53e654b235550"
    
    var theVideoData: [Video] = []
    var userArray: [[String:String]] = []

    
    public var completionHandler: ((String?) -> Void)?
    
    override func viewWillAppear(_ animated: Bool) {
//        print("This is the value of the global variable: \(userArray)")
//        print("This is the value of Userdefaults directly: \(UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]())")
        userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()


    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()

        // button to share movie info
        shareBtn.addTarget(self, action: #selector(presentShareSheet(_:)), for: .touchUpInside)
        // load video for this specific movie
      
        fetchDataForVideo()
        let videoKey = pickOneVideoKey()
        print("picked video key: \(pickOneVideoKey())")
        if videoKey != "nil" {
            playerView.load(withVideoId: videoKey)
        }
        else {
            trailerLabel.isHidden = true
            playerView.isHidden = true
        }
        
        if let movieImage = movieImage, let movieName = movieName,
           let movieReleased = movieReleased, let movieVoteAverage = movieVoteAverage,
           let movieOverview = movieOverview{
            self.title = movieName
            print("release date: \( movieReleased)")
            
            movieImageFrame.image = movieImage
            releasedLabel.text = "Released: \(movieReleased)"
            scoreLabel.text = "Score: \(String(describing: movieVoteAverage))/10"
            overviewLabel.text = "\(String(describing: movieOverview))"
        }
        
    }
  
    @IBAction func clickedAddBtn(_ sender: Any) {
//        UDM.shared.defaults?.setValue( movieName, forKey: "item1")
        if let movieName = movieName, let movieId = movieId {
            let movieObject = Movie(id: movieId, poster_path: movieImageURL, title: movieName, release_date: movieReleased, vote_average: movieVoteAverage, overview: movieOverview)
            print("obj test: \(movieObject.title)")
            
            let myDict: [String: String] =
            ["id": String(movieId),
            "poster_path": movieImageURL ?? "",
            "release_date": movieReleased ?? "",
             "vote_average": String(movieVoteAverage ?? 0),
            "overview":movieOverview ?? "",
            "title": movieName]
//            print("myDict test: \(String(describing: myDict.keys.first(where: { $0.contains("title") })))")
            

            if ((userArray.firstIndex(where: {$0["title"] == myDict["title"]})) == nil){
                userArray.append(myDict)
                userDefaults.set(userArray, forKey:"favorites")

                if let keys = userDefaults.array(forKey: "favorites") as? [[String:String]] {
                for  key in keys {
                    print("fav list \(String(describing: key["title"]))")
                  }
                }
                
                // store its image in local fileSystem
                // to remove '/'
                // string formatting
                if movieImageURL != nil {
                    movieImageURL.remove(at:movieImageURL.startIndex)
                    if let index = movieImageURL.firstIndex(of:"."){
                        let formatted_url_key = String(movieImageURL.prefix(upTo:index))
                        print("stored formatted key: \(formatted_url_key)")
                        store(image: movieImage, forKey: formatted_url_key)
                    }
                }
            
                
                print("added movie to your favorites list!")

            }
            else {
                print("The movie already exists in the favorites list. ")
            }

        }

    }
    
    
    
    
    func fetchDataForVideo(){
        // use optional for lab4
        guard let movieId = movieId else{ return }
        guard let url = URL(string:"https://api.themoviedb.org/3/movie/\(movieId)/videos?api_key=\(apiKey)&language=en-US") else {return}
        if let data = try? Data(contentsOf: url){
            print("data is \(data)")
            let apiResultsJson = try! JSONDecoder().decode(VideoResults.self, from:data)
            print("json is \(apiResultsJson.results)")
            for one_video in apiResultsJson.results {
                theVideoData.append(one_video)
                print("Movie is \(one_video)")
            }
        }
    }
    func pickOneVideoKey() -> String {
        if theVideoData.count == 1 && theVideoData[0].site == "YouTube"{
            return theVideoData[0].key ?? "nil"
        }
        for video in theVideoData {  //[webresult, isEqualToString:cmp]
            if let official = video.official, let site = video.site, let type = video.type, let key = video.key {
                if official == true && site == "YouTube" && type=="Trailer" {
                    return key
                }
            }
           
        }
        return "nil"
        
    }
    // Reference: https://www.youtube.com/watch?v=jxhq1_7HkJg
    @objc private func presentShareSheet(_ sender: UIButton){
        guard let movieId = movieId else { return}
        guard let image = movieImage, let url = URL(string:"https://www.themoviedb.org/movie/\(movieId)") else {
            return
        }
        let shareSheetVC = UIActivityViewController(
            activityItems: [
                image,
                url
            ],
            applicationActivities: nil
        )
        shareSheetVC.popoverPresentationController?.sourceView = sender
        shareSheetVC.popoverPresentationController?.sourceRect = sender.frame
        present(shareSheetVC, animated: true)
    }
    
    private func filePath(forKey key: String) -> URL? {
        let fileManager = FileManager.default
        guard let documentURL = fileManager.urls(for: .documentDirectory,
                                                in: FileManager.SearchPathDomainMask.userDomainMask).first else { return nil }
        
        return documentURL.appendingPathComponent(key + ".jpg")
    }
    
    private func store(image: UIImage, forKey key: String) {
        if let pngRepresentation = image.pngData() {
            if let filePath = filePath(forKey: key) {
                do  {
                    try pngRepresentation.write(to: filePath,
                                                options: .atomic)
                } catch let err {
                    print("Saving file resulted in error: ", err)
                }
            }
        }
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
