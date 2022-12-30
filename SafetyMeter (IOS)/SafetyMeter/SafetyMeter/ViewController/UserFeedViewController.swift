//
//  UserFeedViewController.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 12/3/22.
//
import Firebase
import FirebaseFirestore
import UIKit


class UserFeedViewController: UIViewController,UITableViewDelegate, UITableViewDataSource, UISearchBarDelegate {
    
    @IBOutlet weak var tableView: UITableView!

    
    
    private var articles = [Article]()
    var inputText :String?
    var storeIDs = [String]()
    var searchIDs = [String]()
    var filteredUsers = [User]()
    var postResults = [Post]()

    var myDict = [String: String]()
//    class Post: NSObject{
//        var postTitle: String?
//        var postDescription: String?
//        var postUserEmail: String?
//        var postTimestamp: Int?
//    }
    
    
  
   
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let barBtn = UIBarButtonItem(title: "Post", style: .done, target: self, action: #selector(clickedBarBtn))
        self.navigationItem.rightBarButtonItem  = barBtn
        
     
        // Do any additional setup after loading the view.
        title = "Neighbor News"
        
        tableView.register(NewsFeedTableViewCell.self, forCellReuseIdentifier:NewsFeedTableViewCell.identifier)
        tableView.delegate = self
        tableView.dataSource = self
   
//        view.backgroundColor = .systemMint
//        fetchUser()
        fetchPosts()
        
        
    }
    @objc func clickedBarBtn() {
        let userPostVC = storyboard?.instantiateViewController(withIdentifier: "UserPostViewController") as! UserPostViewController
        navigationController?.pushViewController(userPostVC, animated: true)
    }
    
    
   

    
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return postResults.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: UserFeedTableViewCell.identifier, for:indexPath) as? UserFeedTableViewCell else {
            fatalError()
        }
        
        cell.configure(with: postResults[indexPath.row])
        
        return cell
    }
    

    func fetchPosts(){
        Firestore.firestore().collection("posts").getDocuments() { [self] (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {

                
                for document in querySnapshot!.documents {
                    print("\(document.documentID) => \(document.data())")
                    let dictionary = document.data()
                    
                    print(dictionary["postTitle"] ?? "")
                    let postTitle = dictionary["postTitle"]  as? String ?? ""
                    let postDescription = dictionary["postDescription"] as? String ?? ""
                    let postUserEmail = dictionary["postUserEmail"] as? String ?? ""
                    let postTimestamp = dictionary["postTimestamp"] as? String ?? ""
//                    post.postTimestamp  = (postTimestamp as! Int)
                    print(dictionary["postTimestamp"] ?? "")
                    
                    
//                    self.postResults.append(post)
                    print("title: \(postTitle)")
//                    print("post: \(post)")
                    
                    let onePost = Post(postTitle: postTitle, postDescription: postDescription, postUserEmail: postUserEmail, postTimestamp: postTimestamp)
                    postResults.append(onePost)
                }
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
                print(postResults)
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
