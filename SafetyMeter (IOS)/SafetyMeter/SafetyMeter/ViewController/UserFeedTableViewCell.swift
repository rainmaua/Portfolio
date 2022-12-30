//
//  UserFeedTableViewCell.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 12/3/22.
//

import UIKit

class UserFeedTableViewCell: UITableViewCell {
    @IBOutlet weak var emailLabel: UILabel!
    @IBOutlet weak var timestampLabel: UILabel!
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    
    static let identifier = "UserFeedTableViewCell"

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func configure(with posts: Post){
//        print("postEmail: \(String(describing: posts.postUserEmail))")
//        print("postResults: \(String(describing: posts.postTitle)) ")
//        print("cell posts: \(posts)")
//        print(posts.postTimestamp)
        // the date you want to format
        let exampleDate = Date(timeIntervalSince1970: Double(posts.postTimestamp) ?? 0.0)
        // ask for the full relative date
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .full
        // get exampleDate relative to the current date
        let relativeDate = formatter.localizedString(for: exampleDate, relativeTo: Date.now)
        
        
        titleLabel.text = posts.postTitle
        descriptionLabel.text = posts.postDescription
        timestampLabel.text = String(relativeDate)
        emailLabel.text = posts.postUserEmail
        
    }

}
