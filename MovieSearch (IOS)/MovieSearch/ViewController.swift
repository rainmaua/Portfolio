//
//  ViewController.swift
//  MovieSearch
//
//

import UIKit

class ViewController: UIViewController, UICollectionViewDataSource, UICollectionViewDelegate, UISearchBarDelegate {
    @IBOutlet weak var searchBar: UISearchBar!
    @IBOutlet weak var searchBtn: UIButton!
    @IBOutlet weak var collectionView: UICollectionView!
    @IBOutlet weak var spinner: UIActivityIndicatorView!
    var numItemsPerRow: Int = 3
    var searchTextInput: String = ""
    var lastScheduledSearch: Timer?
    var  favorites_history = [Int]()
    var userDefaults = UserDefaults.standard
    let apiKey = "a3b6b3347eb3997379e53e654b235550"
    // declare array that will hold favorite movies empty and update it as the value is added or deleted.
    // otherwise the favorites list won't be updated after adding objects since this global variable won't get updated. So I update userArray everytime user load this viewController, which is done in viewWillAppear()
    var userArray: [[String:String]] = []

    
    
    // create a container to hold fetched data
    var theMovieData: [Movie] = []
    var theImageCache: [UIImage] = []
    
    
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        let currentIndex = indexPath.row // i.e. row*3 + col
        
        var highResolutionImage: UIImage?

        guard let emptyImage = UIImage(named:"empty_image") else{
            return;
        }
        // upload high resolution image for detailed view
        if let imageName = theMovieData[currentIndex].poster_path {
            guard let url = URL(string: "https://image.tmdb.org/t/p/original"+imageName) else{
                return;
            }
            if let data = try? Data(contentsOf:url){
                highResolutionImage = UIImage(data: data) ?? emptyImage
            }
        }
        else {
            // if poster doesn't exist, append empty image.
            highResolutionImage = emptyImage
        }
        
        let detailedVC = self.storyboard?.instantiateViewController(withIdentifier: "DetailedViewController") as! DetailedViewController
        detailedVC.movieImage = highResolutionImage
        detailedVC.movieImageURL = theMovieData[currentIndex].poster_path
        detailedVC.movieName = theMovieData[currentIndex].title
        detailedVC.movieReleased = theMovieData[currentIndex].release_date
        detailedVC.movieVoteAverage = theMovieData[currentIndex].vote_average
        detailedVC.movieOverview = theMovieData[currentIndex].overview
        detailedVC.movieId = theMovieData[currentIndex].id
        self.navigationController?.pushViewController(detailedVC, animated: true)
    }
    
    // ViewDidLOAD()
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view.
        setupCollectionView()
        searchBar.delegate = self
//        self.fetchDataForCollectionView()
//        self.cacheImages()
        
        spinner.hidesWhenStopped = true
        userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()
    }
     
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated);
        userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()

    }
    
//    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
//            return images.count
//        }
//
    // COLLECTION VIEW SETTING
//    func numberOfSections(in collectionView: UICollectionView) -> Int {
//        return 1//theMovieData.count//numItemsPerRow  // modifie it to be the count of data / number of items per row.
//    }
    // number of items per row
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return theMovieData.count //numItemsPerRow // data.count
    }
   
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let currentIndex = indexPath.row //indexPath.section * 3 + indexPath.row // i.e. row*3 + col
        print("indexPath.section \(indexPath.section), indexPath.row \(indexPath.row)")
        // what should I place in each cell
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "myCollectionCell", for: indexPath)
        //print("imageArrayLength: \(theMovieData.count)")
        // create image area for each cell
        let imageFrame = CGRect(x: 0, y: 0, width: cell.frame.width, height: cell.frame.height)
        let imageView = UIImageView()
        imageView.frame = imageFrame
        print("currentIndex: \(currentIndex)")
        var movie: Movie?
        var image: UIImage?
        movie = theMovieData[currentIndex]
        if movie != nil {
            if theImageCache.count > currentIndex{
                image = theImageCache[currentIndex]

            }
                
            
        }
       
      
        
        // collection view cell layout
        let label = UILabel(frame: CGRect(x: 0, y: cell.frame.height-40, width: cell.frame.width, height: 40))
        label.text = theMovieData[currentIndex].title
        label.font = UIFont(name:"HelveticaNeue-Bold", size: 14.0)
        label.textAlignment = .center
        label.textColor = UIColor.white
        label.backgroundColor = UIColor.black.withAlphaComponent(0.4)
        label.numberOfLines = 2
        imageView.image = image
        cell.addSubview(imageView)
        cell.addSubview(label)
        
        return cell
    }
    // Context Menu
    func collectionView(_ collectionView: UICollectionView, contextMenuConfigurationForItemAt indexPath: IndexPath, point: CGPoint) -> UIContextMenuConfiguration? {
        let config = UIContextMenuConfiguration(identifier: nil, previewProvider: nil
        ){[weak self] _ in
            let favorites = UIAction(
                title: (self?.userArray.contains(where: {$0["title"] == self?.theMovieData[indexPath.row].title}) == true) ? "Remove Favorite": "Favorite",
                image: UIImage(systemName: "star.fill"),
                identifier: nil,
                discoverabilityTitle: nil,
                //attributes: .disabled, <= comment out make contextMenu unclikable
                state: .off
            ){ [self] _ in
            
//                if ((self?.userArray.firstIndex(where: {$0["title"] == self?.theMovieData[indexPath.row].title})) == nil){
                if ((self?.userArray.contains(where: {$0["title"] == self?.theMovieData[indexPath.row].title})) == false){
                    self?.userDefaults.set(self?.userArray, forKey:"favorites")
                    print("initial array before contect menu addition: ")
                    if let keys = UserDefaults.standard.array(forKey: "favorites") as? [[String:String]] {
                    for  key in keys {
                        print("fav list \(String(describing: key["title"]))")
                      }
                    }
                    let myDict: [String: String] =
                    ["id": String((self?.theMovieData[indexPath.row].id) ?? 0),
                     "poster_path": self?.theMovieData[indexPath.row].poster_path ?? "",
                     "release_date": self?.theMovieData[indexPath.row].release_date ?? "",
                     "vote_average": String(self?.theMovieData[indexPath.row].vote_average ?? 0),
                     "overview":self?.theMovieData[indexPath.row].overview ?? "",
                     "title": self?.theMovieData[indexPath.row].title ?? "N/A"
                     ]

                    self?.userArray.append(myDict)
                    self?.userDefaults.set(self?.userArray, forKey:"favorites")
                    
                    // store image
                    if let temp = self?.theMovieData[indexPath.row].poster_path {
                        if temp != "" {
                            var movieImageURL = temp
                            
                            movieImageURL.remove(at:movieImageURL.startIndex)
                            let index = movieImageURL.firstIndex(of:".")!
                            let formatted_url_key = String(movieImageURL.prefix(upTo:index))
                            print("stored formatted key: \(formatted_url_key)")
                            self?.store(image: self?.theImageCache[indexPath.row] ?? UIImage(named:"empty_image")!, forKey: formatted_url_key)
                        }
                        
                    }
                    
                    //
                    
                    if let keys = self?.userDefaults.array(forKey: "favorites") as? [[String:String]] {
                    for  key in keys {
                        print("fav list \(String(describing: key["title"]))")
                      }
                    }
                    
                    print("added movie to your favorites list!")

                }
                
                else {
                   
                    if self?.userArray.count ?? 0 >= indexPath.row {
                        self?.userArray.removeAll(where: {$0["title"] == self?.theMovieData[indexPath.row].title})
                    }
                    self?.userDefaults.set(self?.userArray, forKey:"favorites")
                    if let keys = self?.userDefaults.array(forKey: "favorites") as? [[String:String]] {
                    for  key in keys {
                        print("fav list \(String(describing: key["title"]))")
                      }
                    }
                    print("Removed from favorites")
                }
                
            }
//            let details = UIAction(
//                title:"Details",
//                image: UIImage(systemName: "list.bullet.circle"),
//                identifier: nil,
//                discoverabilityTitle: nil,
//                //attributes: .disabled, <= comment out to make contextMenu unclikable
//                state: .off
//            ){ _ in
//                print("Open movie detail page")
//            }
            return UIMenu(
                title: (self?.theMovieData[indexPath.row].title)!,
                image: nil,
                identifier: nil,
                options: UIMenu.Options.displayInline,
                children: [favorites]//, details]
            )
                
        }
        return config
    }
    

    
    // FETCH DATA
    func setupCollectionView(){
        collectionView.dataSource = self
        collectionView.delegate = self
        collectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "myCollectionViewCell")
        let width = (view.frame.size.width-30)/3
        let layout = UICollectionViewFlowLayout()
        layout.itemSize = CGSize(width: width, height: width*1.5)
        layout.minimumInteritemSpacing = 5
        layout.minimumLineSpacing = 5
        collectionView.collectionViewLayout = layout
    }
    func fetchDataForCollectionView(searchWord: String){
        // use optional for lab4
        let encodedSearchTerm = searchWord.replacingOccurrences(of: " ", with: "%20")
        guard let url = URL(string:"https://api.themoviedb.org/3/search/movie?api_key=\(apiKey)&query=\(encodedSearchTerm )")
        else{return}
        
        if let data = try? Data(contentsOf: url){
            print("data is \(data)")
            if let apiResultsJson = try? JSONDecoder().decode(APIResults.self, from:data){
                print("json is \(apiResultsJson.results)")
                for one_movie in apiResultsJson.results {
                    theMovieData.append(one_movie)
                    print("Movie is \(one_movie)")
                }
            }
            
        }
    }
    func cacheImages(){
        for movie in theMovieData{
            if let imageName = movie.poster_path {
                let url = URL(string: "https://image.tmdb.org/t/p/w92"+imageName)
                if let data = try? Data(contentsOf:url!){
                    let image = UIImage(data: data) ?? UIImage(named:"empty_image")!
                    theImageCache.append(image)
                }
            }
            else {
                // if poster doesn't exist, append empty image.
                theImageCache.append(UIImage(named:"empty_image")!)
            }
            
           
        }
    }
    @IBAction func clickedSearchBtn(_ sender: Any) {
        theImageCache = []
        theMovieData = []
        collectionView.reloadData()
//        searchBar.resignFirstResponder()

        spinner.stopAnimating()
        if (searchTextInput != ""){
            spinner.startAnimating()
            DispatchQueue.global(qos: .userInitiated).async{
                do{
                    print("fetching image")
                    
                    self.fetchDataForCollectionView(searchWord: self.searchTextInput)
                    self.cacheImages()
                    // once it's done, message back to main queue
                    DispatchQueue.main.async {
                        self.collectionView.reloadData()
                        self.spinner.stopAnimating()
                        self.spinner.isHidden = true
                    }
                }
//                catch {
//                    print("some error")
//                }
                
                
            }
        }
        else{
            print("cleaned data")
            theMovieData = []
            theImageCache = []
            self.collectionView.reloadData()
            spinner.stopAnimating()
        }
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String){
        // to remove keyboard of the field
        searchTextInput = searchText
    }
    
    // - Image local storage reference: https://programmingwithswift.com/save-images-locally-with-swift-5/
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
            
}
