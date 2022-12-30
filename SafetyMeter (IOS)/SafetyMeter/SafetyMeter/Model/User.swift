//
//  User.swift
//  SafetyMeter
//
//  Created by HowardWu on 11/12/22.
//

import Foundation
import Firebase

class CurrentUser {
    var user: User?
    var uid: String
    var displayName: String?
    var email: String?
    var phoneNumber: String?
    var usrlocation: UserLocation
    var ECList: [String]?
    var ECNumList: [Int]?
    var loggedIn = false
    
    init(_ id: String) {
        self.uid = id
        self.usrlocation = UserLocation()
        loggedIn = true
    }
    
    func logout() {
        loggedIn = false
    }
}
