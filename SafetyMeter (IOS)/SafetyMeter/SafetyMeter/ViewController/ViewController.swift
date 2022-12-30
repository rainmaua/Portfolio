//
//  ViewController.swift
//  SafetyMeter
//
//  Created by HowardWu on 10/24/22.
//

import UIKit

import AuthenticationServices
import Security
import FirebaseAuth
import Firebase
import FirebaseFirestore

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate{
    
    
    var cell_names : [String] = ["Report Incident","Alert Police", "Neighbor News", "History"]
    var cell_images : [UIImage] = [ UIImage(named:"report_incident_icon")!, UIImage(named:"alert_police_icon")!, UIImage(named:"latest_news_icon")!, UIImage(named:"history_icon")!]
    
    
    var cur_usr_name: String = ""
    
    var handle: AuthStateDidChangeListenerHandle?
    
    var buttonState: Int = 0
    
    var user_id :Int = 0
    
    private var articles = [Article]()
    // floating btn ref: https://www.youtube.com/watch?v=oobm2y-d17E
    private let floatingBtn: UIButton = {
        let button = UIButton(frame: CGRect(x: 0, y: 0, width: 60, height: 60))
        button.layer.cornerRadius = 30  // make btn circular
        button.layer.shadowRadius = 10
        button.layer.shadowOpacity = 0.3
        button.backgroundColor = .systemBlue
        let image = UIImage(systemName: "plus", withConfiguration: UIImage.SymbolConfiguration(pointSize: 32, weight: .light))
        button.setImage(image, for: .normal)
        button.tintColor = .white
        button.setTitleColor(.white, for: .normal)
        
        return button
    }()
    
    
    var inputText :String?
    var storeIDs = [String]()
    var searchIDs = [String]()
    var filteredUsers = [User]()
    var postResults = [Post]()

    var myDict = [String: String]()
    @IBOutlet weak var tableView: UITableView!
    
    
    @IBAction func login(_ sender: Any) {
        switch (buttonState)
            {
              case 0:
                login()
                break;
              case 1:
                logout()
                break;
              default:
                break;
          }
        
    }
    
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        handle = Auth.auth().addStateDidChangeListener { auth, user in
        }
        fetchPosts()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
            // [START remove_auth_listener]
        Auth.auth().removeStateDidChangeListener(handle!)
    }
    
   
    override func viewDidLoad() {
        
        super.viewDidLoad()
        view.addSubview(floatingBtn)
        floatingBtn.addTarget(self, action: #selector(clickedPostBtn), for: .touchUpInside)
        
        self.tableView.delegate = self
        self.tableView.dataSource = self
//        self.tableView.rowHeight = tableView.frame.width/CGFloat(cell_names.count)
        if buttonState == 0{
            if Auth.auth().currentUser != nil{
                logout()
                
            }
                
        }
//        let barBtn = UIBarButtonItem(title: "Post", style: .done, target: self, action: #selector(clickedBarBtn))
//        self.navigationItem.rightBarButtonItem  = barBtn
//
     
        // Do any additional setup after loading the view.
//        title = "Neighbor News"
        
        tableView.register(NewsFeedTableViewCell.self, forCellReuseIdentifier:NewsFeedTableViewCell.identifier)
        
//        fetchPosts()
        
        // Do any additional setup after loading the view.
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        floatingBtn.frame = CGRect(x: view.frame.size.width - 80,
                                   y: view.frame.size.height - 160,
                                   width: 63,
                                   height: 63)
    }
    
    @IBOutlet weak var bar: UINavigationItem!
    
    func rename(){
        if(cur_usr_name == ""){
            bar.title = "Home"
        }
            
        else{
            bar.title = cur_usr_name
        }
            
    }
    
    
    @IBOutlet weak var log_button: UIBarButtonItem!
    
    
    func change_to_logout(){
        log_button.title = "Log out"
        buttonState = 1
//        user = nil
        telNumber = nil
    }
    
    func change_to_login(){
        log_button.title = "Log in"
        buttonState = 0
        
    }
    
    
    func login(){
        let storyBoard = UIStoryboard(name:"Main",bundle: Bundle.main)
        let LoginView = storyBoard.instantiateViewController(withIdentifier: "LoginViewController") as? LoginViewController
        
      
        LoginView?.View = self
        navigationController?.pushViewController(LoginView!, animated: true)
    }
    
    func logout(){
        cur_usr_name = ""
        rename()
        let firebaseAuth = Auth.auth()
            do {
              try firebaseAuth.signOut()
            } catch let signOutError as NSError {
              print("Error signing out: %@", signOutError)
            }
        change_to_login()
    }
    
    
   
    
    @objc func clickedPostBtn() {
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
        
//        let cell = tableView.dequeueReusableCell(withIdentifier: UserFeedTableViewCell.identifier) as! UserFeedTableViewCell
//
//        cell.iconLabel?.text = cell_names[indexPath.item]
//        cell.iconImageView?.image = cell_images[indexPath.row]
        return cell
    }
    
 
    func fetchPosts(){
        postResults.removeAll()
        let postsRef = Firestore.firestore().collection("posts")
//        postsRef.order(by: "postTimestamp", descending: true)
        
        postsRef.order(by: "postTimestamp", descending: true).getDocuments() { [self] (querySnapshot, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                
                
                for document in querySnapshot!.documents {
                    // print("\(document.documentID) => \(document.data())")
                    let dictionary = document.data()
                    
                    let postTitle = dictionary["postTitle"]  as? String ?? ""
                    let postDescription = dictionary["postDescription"] as? String ?? ""
                    let postUserEmail = dictionary["postUserEmail"] as? String ?? ""
                    let postTimestamp = dictionary["postTimestamp"] as? String ?? ""

                    
                    let onePost = Post(postTitle: postTitle, postDescription: postDescription, postUserEmail: postUserEmail, postTimestamp: postTimestamp)
                    postResults.append(onePost)
                }
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            }
        }

    }

}
