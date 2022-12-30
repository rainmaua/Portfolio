//
//  structs.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 12/3/22.
//

import Foundation

class Post {
    let postTitle: String
    let postDescription: String
    let postUserEmail: String
    let postTimestamp: String
    init(postTitle:String, postDescription:String, postUserEmail:String, postTimestamp:String){
        self.postTitle = postTitle
        self.postDescription = postDescription
        self.postUserEmail = postUserEmail
        self.postTimestamp = postTimestamp
    }
}
//struct Post {
//    let postTitle: String?
//    let postDescription: String?
//    let postUserEmail: String?
//    let postTimestamp: Int?
//}
