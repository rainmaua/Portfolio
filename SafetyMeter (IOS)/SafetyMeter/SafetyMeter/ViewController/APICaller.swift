//
//  APICaller.swift
//  NewsFeedFunction
//
//  Created by Yi Ryoung Kim on 11/19/22.
//
// Reference: https://www.youtube.com/watch?v=V2IfBdxjWs4&list=PL7uyq-JgKnDWp7nqugzR0eOQSe0ZHJOGd&index=16

import UIKit
import Foundation

final class APICaller {
    static let shared = APICaller()
    struct Constants {
        static let apiKey = "1eee710e640e4fe29e5ece415cbc4d7d"
        // Previous one: "74551275070f4b67bae9a707fa6b3cba"

        static let topHeadlinesURL = URL(string:
            "https://newsapi.org/v2/everything?q=crime&domains=ksdk.com,kmov.com,stltoday.com/&sortedBy=publishedAt&apiKey=\(apiKey)")
        //https://newsapi.org/v2/top-headlines?country=US&apiKey=\(apiKey)"
        static let searchUrlString = "https://newsapi.org/v2/everything?domains=ksdk.com,kmov.com,stltoday.com/sortedBy=publishedAt&apiKey=\(apiKey)&q=crime+"
        
        
    }
    private init() {}
    
    public func getTopStories(completion: @escaping(Result<[Article], Error>) -> Void) {
        guard let url = Constants.topHeadlinesURL else { return }
        let task = URLSession.shared.dataTask(with: url) {data, _, error in
            if let error = error {
                completion(.failure(error))
            }
            else if let data = data {
                do{
                    let result = try JSONDecoder().decode(APIResponse.self, from: data)
//                    print("Articles: \(result)")
                    completion(.success(result.articles))
                }
                catch {
                    completion(.failure(error))
                }
            }
        }
        task.resume()
    }
    
    public func search(with query: String, completion: @escaping(Result<[Article], Error>) -> Void) {
        
        guard !query.trimmingCharacters(in: .whitespaces).isEmpty else { return }
        let urlString = Constants.searchUrlString + query
        guard let url = URL(string: urlString) else { return }
        let task = URLSession.shared.dataTask(with: url) {data, _, error in
            if let error = error {
                completion(.failure(error))
            }
            else if let data = data {
                do{
                    let result = try JSONDecoder().decode(APIResponse.self, from: data)
//                    print("Articles: \(result)")
                    completion(.success(result.articles))
                }
                catch {
                    completion(.failure(error))
                }
            }
        }
        task.resume()
    }
}
// Models
struct APIResponse: Codable {
    let articles: [Article]
}



struct Article: Codable{
    let source: Source
    let title: String
    let description: String?
    let url: String?
    let urlToImage: String?
    let publishedAt: String
}

struct Source:Codable{
    let id:String?
    let name:String
}


