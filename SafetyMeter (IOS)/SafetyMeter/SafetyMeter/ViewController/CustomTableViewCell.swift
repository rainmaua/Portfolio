//
//  CustomTableViewCell.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 11/13/22.
//

import UIKit

class CustomTableViewCell: UITableViewCell {


    @IBOutlet weak var iconLabel: UILabel!
    @IBOutlet weak var iconImageView: UIImageView!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
