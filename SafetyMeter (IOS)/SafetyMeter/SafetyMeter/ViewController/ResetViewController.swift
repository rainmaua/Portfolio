//
//  ResetViewController.swift
//  SafetyMeter
//
//  Created by 杨星辰 on 2022/11/26.
//

import UIKit
import AuthenticationServices
import Security
import FirebaseAuth

class ResetViewController: UIViewController,UITextFieldDelegate{

    override func viewDidLoad() {
        super.viewDidLoad()
        f1.delegate = self
        // Do any additional setup after loading the view.
    }
    
    @IBOutlet weak var f1: UITextField!
    var email: String = ""
    @IBOutlet weak var account: UITextField!
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {

        textField.resignFirstResponder()

        return true

    }
    @IBOutlet weak var reminder: UILabel!
    
    override func viewWillAppear(_ animated: Bool) {
        reminder.isHidden = true
    }
    
    @IBAction func Reset(_ sender: Any) {
        email = account.text ?? ""
        print(email)
        Auth.auth().sendPasswordReset(withEmail: email){
            error in
            if error == nil{
                _ = self.navigationController?.popToRootViewController(animated: true)
               
                
            }
            else{
                self.reminder.text = error!.localizedDescription
                self.reminder.isHidden = false
                let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
                alert.message = error!.localizedDescription
                alert.addAction(UIAlertAction(title: "ok", style: .default))
                self.present(alert,animated: true)
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
