//
//  AddECViewController.swift
//  SafetyMeter
//
//  Created by HowardWu on 11/27/22.
//

import UIKit

class AddECViewController: UIViewController {
    
    @IBOutlet weak var firstName: UITextField!
    @IBOutlet weak var lastName: UITextField!
    @IBOutlet weak var phoneNumber: UITextField!

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(dismissKeyboard))
        self.view.addGestureRecognizer(tapGesture)
        
    }
        
    @IBAction func addEC(_ sender: Any) {
        
        if phoneNumber.text == "" || firstName.text == "" {
            let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
            alert.message = "Please fill out first name and phone number"
            alert.addAction(UIAlertAction(title: "ok", style: .default))
            self.present(alert,animated: true)
            return
        }
        
        var userExist = false

        // Check if user exists in ECList
        let number = Int(phoneNumber.text ?? "")
        if let num = number {
            if let exists = currentUser?.ECNumList?.contains(num) {
                userExist = exists
                print("exists: \(exists)")
                if userExist {
                    let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
                    alert.message = "The phone number already exists in the contacts. Enter a different phone number."
                    alert.addAction(UIAlertAction(title: "ok", style: .default))
                    self.present(alert,animated: true)
                    return
                }
                
            }
            print("num: \(num)")
        }
        
        print("userExist: \(userExist)")
       
        // Add user to ECList and ECNumlist
        if !userExist {
            currentUser?.ECList?.append((firstName.text ?? "First Name") + " " + (lastName.text ?? "Last Name"))
            currentUser?.ECNumList?.append(number!)
        }
        
        // Upload user to server
        if let currentUserECList = currentUser?.ECList,
           let currentUserECNumList = currentUser?.ECNumList{
            db.collection("users").document(currentUser!.uid).updateData([
                "ECList": currentUserECList,
                "ECNumList": currentUserECNumList
            ]) { error in
                if let error = error {
                        print("Error in ECList updating: \(error)")
                    } else {
                        print("New contact is submitted.")
                    }
            }

            _ = navigationController?.popViewController(animated: true)
        }
        
        _ = navigationController?.popViewController(animated: true)
       
       

        
//        // Try to fetch user
//        DispatchQueue.main.async {
//            let ref = db.collection("users")
//
//            ref.getDocuments() { (querySnapshot, err) in
//                if let err = err {
//                    print("Error getting documents: \(err)")
//                } else {
//
//
//                    // Find the user based on email, if exists
//                    db.collection("users").whereField("email", isEqualTo: self.email.text ?? "")
//                        .getDocuments() { (querySnapshot, err) in
//                            if let err = err {
//                                print("Error getting documents: \(err)")
//                            } else {
//                                for doc in querySnapshot!.documents {
//                                    userExist = true
//                                    let phone = doc.get("number") as! Int
//                                    let name = doc.get("name") as! String
//
//                                    var newList = currentUser!.ECList!
//                                    var newNumList = currentUser!.ECNumList!
//
//                                    newList.append(name)
//                                    newNumList.append(phone)
//
//                                    ref.document(currentUser!.uid).updateData([
//                                        "ECList": newList,
//                                        "ECNumList": newNumList
//                                    ])
//
//                                    break
//                                }
//                            }
//                        }
//
//                    }
//                }
//
//            if !userExist {
//                // Create new Alert
//                let alert = UIAlertController(title: "Alert", message: "User does not exist!", preferredStyle: .alert)
//                alert.addAction(UIAlertAction(title: "OK", style: .default))
//                self.present(alert, animated: true, completion: nil)
//
//                return
//                // Howard: how we implement this can be discussed. i.e. if the emergency contact does not have an account, what do we want to do? Allow the user to add him/her and able to just make calls from the app, or we don't allow the user to add the contact?
//                //  P.S. We can easily have the user tap on someone in the emergency contact list and just call them, if we have the phone number. We implement the chat function using the server so if the 2nd user doesn't have an account on our server we can't chat.
////                var dialogMessage = UIAlertController(title: "Error", message: "User does not exist. Do you want to create a user without chat function?", preferredStyle: .alert)
////
////                // Create OK button with action handler
////                let ok = UIAlertAction(title: "OK", style: .default, handler: { (action) -> Void in
////                    print("Ok button tapped")
////                 })
////
////                //Add OK button to a dialog message
////                dialogMessage.addAction(ok)
////
////                // Present Alert to
////                self.present(dialogMessage, animated: true, completion: nil)
////                print("User not found") // Having some issues with dispatch queue and UI update
//            }
////            self.hideSpinner()
//        }
        
    }
    
    
    
}
