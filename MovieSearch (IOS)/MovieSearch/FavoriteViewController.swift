//
//  FavoriteViewController.swift
//  MovieSearch
//
//

import UIKit

class FavoriteViewController: UIViewController, UITableViewDataSource, UITableViewDelegate{
    @IBOutlet weak var poster_image: UIImageView!
    
    @IBOutlet weak var theTableView: UITableView!

    var userDefaults = UserDefaults.standard
    var array : Array<String> = []
    var userArray: [[String:String]] = []
    func sendDataBack(value: [[String:String]]) {
        print("sendDataBack value: \(value)")
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        theTableView.register(UITableViewCell.self, forCellReuseIdentifier: "theTableViewCell")
        theTableView.dataSource = self // protocol of tableview's datasource is self
        theTableView.delegate = self
        
        DispatchQueue.global().async { [self] in
            self.userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()
            DispatchQueue.main.async {
                self.theTableView.reloadData()
            }
        }
        
    }
    // to refresh the data to show updated userDefaults table
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated);
        DispatchQueue.global().async {
            self.userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()
            DispatchQueue.main.async {
                self.theTableView.reloadData()
            }
        }
        userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()
        
    }
    
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        print("currentIndexPath: \(indexPath.row)")
        print("clicked dictionary: \(userArray[indexPath.row])")
//        let savedDetailVC = SavedDetailViewController()
//        present(savedDetailVC, animated:true)
//        self.performSegue(withIdentifier: "TableViewToDetail", sender: self)
        let savedDetailVC = self.storyboard?.instantiateViewController(withIdentifier: "SavedDetailViewController") as! SavedDetailViewController
        savedDetailVC.movieInfo = userArray[indexPath.row]
//        savedDetailVC.modalPresentationStyle = .fullScreen
        present(savedDetailVC, animated: true, completion:nil)
       
           
    }
//    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
//        guard let savedDetailVC = segue.destination as? SavedDetailViewController else {return}
////        savedDetailVC.movieInfo = userArray[indexPath.row]
//    }
   
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return userArray.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let myTableViewCell = theTableView.dequeueReusableCell(withIdentifier: "theTableViewCell")! as UITableViewCell 
        //if let value = UDM.shared.defaults?.value(forKey:"item1") as? String {
        myTableViewCell.textLabel?.text = userArray[indexPath.row]["title"]
        
        
        return myTableViewCell
    }
// Referemce @ https://www.youtube.com/watch?v=F6dgdJCFS1Q

    func tableView(_ tableView: UITableView, editingStyleForRowAt indexPath: IndexPath) -> UITableViewCell.EditingStyle {
        return .delete
    }
    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath){
        if editingStyle == .delete{
            print("Before: indexPath.section \(indexPath.section), indexPath.row \(indexPath.row)")
            theTableView.beginUpdates()
            // remove array element first
            if userArray.count >= indexPath.row {
                userArray.remove(at: indexPath.row)
                UserDefaults.standard.set(userArray, forKey:"favorites")
                // delete image file in local storage
                // string formatting
                if indexPath.row > 0 && indexPath.row < userArray.count {
                    if let temp = userArray[indexPath.row]["poster_path"]{
                        if temp != ""{
                            var movieImageURL = temp
                            movieImageURL.remove(at:movieImageURL.startIndex)
                            let index = movieImageURL.firstIndex(of:".")!
                            let formatted_url_key = String(movieImageURL.prefix(upTo:index))
                            //
                            deleteImage(forKey: formatted_url_key)
                        }
                        
                        
                    }
                }
                
                
            }
            
            if let keys = userDefaults.array(forKey: "favorites") as? [[String:String]] {
            for  key in keys {
                print("fav list \(String(describing: key["title"]))")
              }
            }
            
            // and then delete the cell
            theTableView.deleteRows(at: [indexPath], with: .fade)
            
            
            print("After: indexPath.section \(indexPath.section), indexPath.row \(indexPath.row)")
            
            theTableView.reloadData()
            theTableView.endUpdates()
          
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
  
//    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
//        let height: CGFloat = CGFloat(indexPath.row*10+50)
//        return height
//    }

   

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
