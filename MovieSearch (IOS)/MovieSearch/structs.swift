//
//  structs.swift
//  MovieSearch
//
//  Created by Yi Ryoung Kim on 10/31/22.
//

import Foundation

//class Global {
//
//    //creates the instance and guarantees that it's unique
//    static let instance = Global()
//
//    private init() {
//    }
//
//    //creates the global variable
//    var userArray = UserDefaults.standard.array(forKey:"favorites") as? [[String:String]] ??  [[String:String]]()
//
//}

struct APIResults:Decodable {
    let page: Int
    let total_results: Int
    let total_pages: Int
    let results: [Movie]
}



struct Movie: Decodable {
    let id: Int!
    let poster_path: String?
    let title: String
    let release_date: String?
    let vote_average: Double
    let overview: String
    //let vote_count:Int!
}

struct VideoResults:Decodable {
    let id: Int
    let results: [Video]
}

struct Video: Decodable {
    let name: String? // video title
    let key: String? // url key for youtube
    let site: String? // youtube
    let type: String?
    let official: Bool?
    let id: String?
    
}
