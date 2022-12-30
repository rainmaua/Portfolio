//
//  EmergencyViewController.swift
//  SafetyMeter
//
//  Created by Jiayu Long on 11/10/22.
//

import UIKit

class EmergencyViewController: UIViewController, UITableViewDataSource, UITableViewDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBAction func addEC(_ sender: Any) {
        
        guard currentUser?.uid != nil else {
            let alert = UIAlertController(title: "Alert", message: "Not logged in", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true, completion: nil)
            
            return
        }
        
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let linkingVC = storyboard.instantiateViewController(withIdentifier: "AddECViewController")
        
        self.navigationController?.pushViewController(linkingVC, animated: true)
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        var count = 0
        if let list = currentUser?.ECList {
            count = list.count
        }
        return count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let myCell = tableView.dequeueReusableCell(withIdentifier: "ContactCell")! as UITableViewCell
        myCell.textLabel!.text = currentUser?.ECList?[indexPath.row]
        return myCell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let number = String(describing: currentUser!.ECNumList![indexPath.row])
        guard let url = URL(string: "telprompt://\(number)"),
                UIApplication.shared.canOpenURL(url) else {
                return
            }
            UIApplication.shared.open(url, options: [:], completionHandler: nil)
    }

    func tableView(_ tableView: UITableView, commit editingStyle: UITableViewCell.EditingStyle, forRowAt indexPath: IndexPath) {
        if editingStyle == .delete {
            // Delete the cell from datasource
            currentUser!.ECList!.remove(at: indexPath.row)
            currentUser!.ECNumList!.remove(at: indexPath.row)
            
            // Delete the EC from server
            db.collection("users").document(currentUser!.uid).updateData([
                "ECList": currentUser!.ECList!,
                "ECNumList": currentUser!.ECNumList!,
            ]) { err in
                if let err = err {
                    print("Error writing document: \(err)")
                } else {
                    print("Document successfully written!")
                }
            }
            
        }
        tableView.reloadData()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.register(UITableViewCell.self, forCellReuseIdentifier: "ContactCell")
        tableView.dataSource = self
        tableView.delegate = self
        
        // Do any additional setup after loading the view.

    }
    
    override func viewWillAppear(_ animated: Bool) {
        if currentUser?.ECList != nil {
            self.tableView.reloadData()
        }
    }

}
