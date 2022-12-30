//
//  SavedDetailViewController.swift
//  MovieSearch
//
//

import UIKit


class SavedDetailViewController: UIViewController {

    @IBOutlet weak var releasedLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    @IBOutlet weak var overviewLabel: UILabel!
    
    @IBOutlet weak var posterView: UIImageView!
    @IBOutlet weak var navBarLabel: UINavigationItem!
    var movieInfo = [String:String]()
    var movieImage : UIImage!
    override func viewDidLoad() {
        super.viewDidLoad()
        print("movieInfo: \(movieInfo)")
        if movieInfo.count != 0 {
            navBarLabel.title = movieInfo["title"] ?? "N/A"
            releasedLabel.text = "Released: "+(movieInfo["release_date"] ?? "N/A")
            overviewLabel.text = "\(movieInfo["overview"] ?? "")"
            if let vote_average = movieInfo["vote_average"]{
                scoreLabel.text = "Score: \(vote_average)/10"
            }
            else{
                scoreLabel.text = "Score: N/A"
            }
            
         
            var movieImageURL = movieInfo["poster_path"] ?? ""
            // string formatting
            movieImageURL.remove(at:movieImageURL.startIndex)
            if let index = movieImageURL.firstIndex(of:".") {
                let formatted_url_key = String(movieImageURL.prefix(upTo:index))
                //
                    //
                let retrievedImage : UIImage = retrieveImage(forKey: formatted_url_key) ?? UIImage(named: "empty_image")!
                print("poster final: \(retrievedImage)")
                posterView.image = retrievedImage
            }
            
        }
 
    }
    private func filePath(forKey key: String) -> URL? {
        let fileManager = FileManager.default
        guard let documentURL = fileManager.urls(for: .documentDirectory,
            in: FileManager.SearchPathDomainMask.userDomainMask).first else { return nil }
        
        return documentURL.appendingPathComponent(key + ".jpg")
    }

    private func retrieveImage(forKey key: String) -> UIImage? {
        if let filePath = self.filePath(forKey: key),
            let fileData = FileManager.default.contents(atPath: filePath.path),
            let image = UIImage(data: fileData) {
            return image
        }
        
        return nil
    }
    
    private func deleteImage(forKey key: String){
        if let filePath = self.filePath(forKey:key){
            do{
                try FileManager.default.removeItem(at: filePath)
            } catch {
                print(error.localizedDescription)
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


