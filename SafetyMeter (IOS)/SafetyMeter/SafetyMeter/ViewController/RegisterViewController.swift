//
//  RegisterViewController.swift
//  SafetyMeter
//
//  Created by 杨星辰 on 2022/11/9.
//

import UIKit
import AuthenticationServices
import FirebaseAuth
class RegisterViewController: UIViewController,UITextFieldDelegate{
    
    override func viewDidLoad() {
        super.viewDidLoad()
        f1.delegate = self
        f2.delegate = self
        
        // Do any additional setup after loading the view.
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(self.dismissKeyboard (_:)))
        self.view.addGestureRecognizer(tapGesture)
    }
    
    var email: String = ""
    var password: String = ""
    var name: String = ""
    var phoneNumber: String = ""
    
    var View: ViewController? = nil
    
    @objc func dismissKeyboard (_ sender: UITapGestureRecognizer) {
        f3.resignFirstResponder()
        f4.resignFirstResponder()
    }
    
    @IBOutlet weak var f3: UITextField!
    
    @IBOutlet weak var f1: UITextField!
    
    @IBOutlet weak var f2: UITextField!
    
    @IBOutlet weak var f4: UITextField!
    
    @IBAction func get_name(_ sender: UITextField) {
        name = sender.text ?? ""
    }
    
    @IBAction func get_phoneNumber(_ sender: UITextField) {
        phoneNumber = sender.text ?? ""
    }
    
    @IBAction func get_email(_ sender: UITextField) {
        email = sender.text ?? ""
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {

        textField.resignFirstResponder()
        return true

    }
    
    @IBAction func get_password(_ sender: UITextField) {
        password = sender.text ?? ""
    }
    
    @IBOutlet weak var reminder: UILabel!
    
    @IBAction func register(_ sender: Any) {
        if name == "" || phoneNumber == ""{
            let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
            alert.message = "Please fill out all input fields!"
            alert.addAction(UIAlertAction(title: "ok", style: .default))
            self.present(alert,animated: true)
            reminder.text = "Please fill out all input fields!"
            reminder.isHidden = false
        }
        else{
            Auth.auth().createUser(withEmail: email, password: password) { [self] authResult, error in
                if error == nil{
                    View?.cur_usr_name = self.email
                    View?.rename()
                    View?.change_to_logout()
                    
                    telNumber = phoneNumber
                    
                    addName()
                    
                    reminder.isHidden = true
                    _ = navigationController?.popToRootViewController(animated: true)
                }
                else{
                    reminder.text = error!.localizedDescription
                    reminder.isHidden = false
                    let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
                    alert.message = error!.localizedDescription
                    alert.addAction(UIAlertAction(title: "ok", style: .default))
                    self.present(alert,animated: true)
                }
            }
        }
        
        
    }
    override func viewWillAppear(_ animated: Bool) {
        reminder.isHidden = true
    }
    func addName() {
        let changeRequest = Auth.auth().currentUser?.createProfileChangeRequest()
        changeRequest?.displayName = name
        
        changeRequest?.commitChanges() { error in
            if error != nil {
                print("Error changing displayName")
            } else {
                user = Auth.auth().currentUser
            }
        }
    }
}
