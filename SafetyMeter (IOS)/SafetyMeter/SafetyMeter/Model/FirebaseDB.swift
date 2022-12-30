//
//  FirebaseDB.swift
//  SafetyMeter
//
//  Created by HowardWu on 11/12/22.
//
//  This file stores database information and the current logged in user.
//  All database inquiry can use the db variable.

import Foundation
import Firebase
import FirebaseFirestore

var db = Firestore.firestore()
var currentUser: CurrentUser? // Global variable of current user
var telNumber: String? // Global variable for ease of writing telNumber

var user = Auth.auth().currentUser {
    didSet {
        // Construct currentUser global variable (more convenient to use) if authentication passes.
        let uid = user?.uid
        
        if uid != nil { // UID exists
            let name = user!.displayName
            let email = user!.email
            let number = telNumber
            
            currentUser = CurrentUser(uid!)
            currentUser!.displayName = name
            currentUser!.email = email
            currentUser!.phoneNumber = number
            currentUser!.ECList = ["Police", "WUPD"]
            currentUser!.ECNumList = [911, 3149355555]
            
            DispatchQueue.global(qos: .background).async {
                let ref = db.collection("users")
                
                ref.getDocuments() { (querySnapshot, err) in
                    if let err = err {
                        print("Error getting documents: \(err)")
                    } else {
                        var hasUser = false
                        for document in querySnapshot!.documents {
                            if document.documentID == uid! {
                                hasUser = true
                                // Store user's email, phone number in database under his/her uid. Stores empty location and current timestamp.
                                let timeStamp = Timestamp()
                                let coord = currentUser!.usrlocation
                                let geopt = GeoPoint(latitude: coord.coord.coordinate.latitude, longitude: coord.coord.coordinate.longitude)
                                
                                // Update location and login time
                                ref.document(uid!).updateData([
                                    "email": email ?? "@",
                                    "name": name ?? "",
                                    "location": geopt,
                                    "lastUpdate": timeStamp,
                                ]) { err in
                                    if let err = err {
                                        print("Error writing document: \(err)")
                                    } else {
                                        print("Document successfully written!")
                                    }
                                }
                                
                                // Get user's number from server (not saved with User object)
                                ref.document(uid!).getDocument(source: .cache) { (document, error) in
                                    if let document = document {
                                        let phoneNum = document.get("number")
                                        if phoneNum != nil {
                                            currentUser?.phoneNumber  = phoneNum as? String
                                        }
                                    } else {
                                        print("Document does not exist in cache")
                                    }
                                }
                                
                                // Get EC List to populate on EMCall page
                                ref.document(uid!).getDocument(source: .cache) { (document, error) in
                                    if let document = document {
                                        let list = document.get("ECList")
                                        let numList = document.get("ECNumList")
                                        if list != nil {
                                            currentUser?.ECList = list as! [String]?
                                            currentUser?.ECNumList = numList as! [Int]?
                                        } else {
                                            ref.document(uid!).updateData(["ECList": ["Police", "WUPD"], "ECNumList": [911, 3149355555]])
                                        }
                                    } else {
                                        print("Document does not exist in cache")
                                    }
                                }
                            }
                        }
                        if !hasUser {
                            // Store user's email, phone number in database under his/her uid. Stores empty location and current timestamp.
                            let timeStamp = Timestamp()
                            let coord = currentUser!.usrlocation
                            let geopt = GeoPoint(latitude: coord.coord.coordinate.latitude, longitude: coord.coord.coordinate.longitude)
                            
                            ref.document(uid!).setData([
                                "email": email ?? "@",
                                "name": name ?? "",
                                "number": number ?? "0",
                                "location": geopt,
                                "lastUpdate": timeStamp,
                                "ECList": ["Police", "WUPD"],
                                "ECNumList": [911, 3149355555],
                                "favLocation": []
                            ]) { err in
                                if let err = err {
                                    print("Error writing document: \(err)")
                                } else {
                                    print("Document successfully written!")
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    }
}
