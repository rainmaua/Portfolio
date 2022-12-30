//
//  UserPostViewController.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 12/3/22.
//
import Firebase
import FirebaseFirestore
import UIKit

class UserPostViewController: UIViewController {
    @IBOutlet var titleField: UITextField!
    @IBOutlet var noteField: UITextView!
    var placeholderLabel : UILabel!
    

    let db = Firestore.firestore()
    public var completion: ((String, String) -> Void)?
    override func viewDidLoad() {
        super.viewDidLoad()
        titleField.becomeFirstResponder()
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Post", style: .done, target: self, action: #selector(tappedPost))
        titleField.attributedPlaceholder = NSAttributedString(string: "Title")
        noteField.delegate = self
        placeholderLabel = UILabel()
        placeholderLabel.text = "Describe the incident..."
        placeholderLabel.sizeToFit()
        noteField.addSubview(placeholderLabel)
        placeholderLabel.frame.origin = CGPoint(x: 5, y: (noteField.font?.pointSize)! / 2)
        placeholderLabel.textColor = .tertiaryLabel
        placeholderLabel.isHidden = !noteField.text.isEmpty
    }
    
    func formatTextView(){
        
    }
    @objc func tappedPost(){
        print("tapped post")
        // check user
        print(currentUser?.uid ?? "No uid set")
        guard currentUser?.uid != nil else {
            let alert = UIAlertController(title: "Alert", message: "Not logged in", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        
        let timestamp = String(Date().timeIntervalSince1970)

        let postRef = db.collection("posts").document(timestamp)
        
            
        let postObject = [
            "postTitle": titleField.text ?? "Incident",
            "postDescription": noteField.text ?? "Incident Description",
            "postTimestamp": timestamp,
            "postUserEmail": currentUser?.email ?? ""
        ] as [String:Any]
        
        
        postRef.setData(postObject) {
            err in
            if let err = err {
                print("Error writing document: \(err)")
            } else {
                print("Document successfully written!")
            }
            
        }
        // return to home viewController
        _ = navigationController?.popViewController(animated: true)
        
    }
//        if let text = titleField.text, !text.isEmpty, !noteField.text.isEmpty {
//            completion?(text, noteField.text)
//
//        }
    
    }
    

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */



extension Date {
    func toMillis() -> Int64! {
        return Int64(self.timeIntervalSince1970 * 1000)
    }
}
extension UserPostViewController : UITextViewDelegate {
    func textViewDidChange(_ textView: UITextView) {
        placeholderLabel.isHidden = !textView.text.isEmpty
    }
}
