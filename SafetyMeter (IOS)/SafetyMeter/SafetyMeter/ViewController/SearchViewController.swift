//
//  SearchViewController.swift
//  SafetyMeter
//
//  Created by Jiayu Long on 11/25/22.
//

import UIKit
import Firebase
import FirebaseDatabase
import SwiftUI
import CoreAudio




class SearchViewController: UIViewController,UITableViewDataSource, UITableViewDelegate, UISearchBarDelegate {
    
    
    class User: NSObject{
        var email: String?
        var name: String?
    }
    
    
    @IBOutlet weak var searchBar: UISearchBar!
    
    
    @IBOutlet weak var tableView: UITableView!
    
    
    
    
    
    private var results = [User]()
    var inputText :String?
    var storeIDs = [String]()
    var searchIDs = [String]()
    var filteredUsers = [User]()
    var myDict = [String: String]()
    
    private var inSearchMode : Bool{
        return !searchBar.text!.isEmpty
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return inSearchMode ? filteredUsers.count : myDict.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let myCell = tableView.dequeueReusableCell(withIdentifier: "Cell")! as UITableViewCell
        
        myCell.textLabel!.text = inSearchMode ? filteredUsers[indexPath.row].name : Array(myDict.keys)[indexPath.row]
        
        return myCell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath){
        
        let detailedVC = ChatViewController()
        detailedVC.secondUserID = inSearchMode ? searchIDs[indexPath.row] : Array(myDict.values)[indexPath.row]
        
        if Auth.auth().currentUser != nil {
            navigationController?.pushViewController(detailedVC, animated: true)
        }
        else{
            let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
            alert.message = "You need to register/ log in first!"
            alert.addAction(UIAlertAction(title: "ok", style: .default))
            self.present(alert,animated: true)
        }
    }
    
    func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
        
        
        inputText = searchText.lowercased()
        
        
        
        guard let searchBarText = inputText else{
            return
        }
        
        filteredUsers = results.filter({user -> Bool in
            
            return (user.name!.contains(searchBarText)||user.email!.contains(searchBarText))
        })
        self.tableView.reloadData()
        searchIDs.removeAll()
        for el in filteredUsers{
            
            searchIDs.append(myDict[el.name!]!)
            
        }
        
    }
    
    func fetchUser(){
        results.removeAll()
        
        db.collection("users").getDocuments() { (chatList, err) in
            if let err = err {
                print("Error getting documents: \(err)")
            } else {
                for document in chatList!.documents {
                    
                    let dictionary = document.data()
                    let user = User()
                    self.storeIDs.append(document.documentID)
                    
                    guard let Email = dictionary["email"] else{
                        break
                    }
                    user.email = (Email as! String)
                    
                    
                    guard let Name = dictionary["name"] else{
                        break
                    }
                    user.name = (Name as! String)
                    guard let userName = user.name else{
                        break
                    }
                    self.myDict[userName] = document.documentID
                    
                    
                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                    
                    self.results.append(user)
                    //print("fetchUser", self.results)
                    
                }
            }
        }
        
    }
    

    override func viewWillAppear(_ animated: Bool) {
            super.viewWillAppear(animated)
        
            fetchUser()
        }

    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "Cell")
        tableView.dataSource = self
        tableView.delegate = self
        searchBar.delegate = self
        // Do any additional setup after loading the view.

    }
    
}
