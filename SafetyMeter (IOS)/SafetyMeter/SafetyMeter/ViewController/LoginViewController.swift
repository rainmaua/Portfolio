//
//  LoginViewController.swift
//  SafetyMeter
//
//  Created by 杨星辰 on 2022/11/9.
//

import UIKit
import AuthenticationServices
import FirebaseAuth

class LoginViewController: UIViewController, UITextFieldDelegate {
    
    override func viewDidLoad() {
        super.viewDidLoad()
        f1.delegate = self
        f2.delegate = self
        // Do any additional setup after loading the view.
        
    }
    @IBOutlet weak var f1: UITextField!
    
    @IBOutlet weak var f2: UITextField!
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {

        textField.resignFirstResponder()

        return true

    }
    var email: String = ""
    var password: String = ""
    
    @IBOutlet weak var reminder: UILabel!
    
    var View: ViewController? = nil
    @IBAction func get_name(_ sender: UITextField) {
        email = sender.text ?? ""
    }
   
    @IBAction func get_password(_ sender: UITextField) {
        password = sender.text ?? ""
    }
    
    
    
    @IBAction func log(_ sender: Any) {
        
        
        Auth.auth().signIn(withEmail: email, password: password) { [self] authResult, error in
            if error == nil {
                View?.cur_usr_name = self.email
                View?.rename()
                View?.change_to_logout()
                _ = navigationController?.popViewController(animated: true)
                reminder.isHidden = true
                
                user = Auth.auth().currentUser
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
    

    @IBAction func register(_ sender: Any) {
        let storyBoard = UIStoryboard(name:"Main",bundle: Bundle.main)
        
        let RegisterView = storyBoard.instantiateViewController(withIdentifier: "RegisterViewControllor") as? RegisterViewController
        
        RegisterView?.View = View
        reminder.isHidden = true
        navigationController?.pushViewController(RegisterView!, animated: true)
    }
    
    override func viewWillAppear(_ animated: Bool) {
        reminder.isHidden = true
    }
    
    @IBAction func Reset(_ sender: Any) {
        
        
        let storyBoard = UIStoryboard(name:"Main",bundle: Bundle.main)
        
        let ResetView = storyBoard.instantiateViewController(withIdentifier: "ResetViewControllor") as? ResetViewController
        reminder.isHidden = true
        navigationController?.pushViewController(ResetView!, animated: true)
        
        
    }
    
    
    func check_user()->Bool{
        return true
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
