//
//  ChatViewController.swift
//  SafetyMeter
//
//  Created by Jiayu Long on 11/22/22.
//

import UIKit
import Firebase
import MessageKit
import InputBarAccessoryView
import FirebaseFirestore
import CoreMIDI
import CoreAudio




struct sender: SenderType{
    var senderId: String
    
    var displayName: String
    
    
}

struct Message{
    var senderID: String
    var msgId: String
    var date: Timestamp!
    
    var content: String
    
    var toId: String
    
    var dictionary: [String: Any] {
        return [
            "senderID": senderID,
            "toID":toId,
            "date": date as Any,
            "messageId": msgId,
            "content": content
        ]
    }
}


class ChatViewController: MessagesViewController, MessagesDataSource,MessagesDisplayDelegate, MessagesLayoutDelegate, InputBarAccessoryViewDelegate {
    
    
    
    var secondUserID = ""
    var messages = [Message]()
    private var reference : CollectionReference?
    
    private var senderID:sender?{
        
        guard let userID = Auth.auth().currentUser?.uid else {
            return nil
            
        }
        return sender(senderId: userID, displayName: Auth.auth().currentUser?.displayName ?? "")
    }
    
    
    func currentSender() -> SenderType {
        if let sender = senderID {
            return sender
        }
        fatalError("Self Sender is nil")
    }
    
    func messageForItem(at indexPath: IndexPath, in messagesCollectionView: MessagesCollectionView) -> MessageType {
        return messages[indexPath.section]
    }
    
    func numberOfSections(in messagesCollectionView: MessagesCollectionView) -> Int {
        return messages.count
    }
    
    
    
    var curID : String = ""
    
    
    private func uploadContent(_ message: Message){
        let data: [String: Any] = [
            "senderID": message.senderID,
            "messageId": message.msgId,
            "date": message.date as Any,
            "content": message.content,
            "toID": message.toId
        ]
        Firestore.firestore().collection("chats").document(Auth.auth().currentUser!.uid).collection(secondUserID).addDocument(data: data){ _ in Firestore.firestore().collection("chats").document(self.secondUserID).collection(Auth.auth().currentUser!.uid).addDocument(data: data)
        }
    }
    
    
    
    func inputBar(_ inputBar: InputBarAccessoryView, didPressSendButtonWith text: String) {
        inputBar.inputTextView.text = nil
        
        let message = Message(senderID: Auth.auth().currentUser!.uid, msgId: UUID().uuidString,  date: Timestamp(), content: text,toId: secondUserID)
        
        uploadContent(message)
        
        
        
    }
    
    
    private func loadChat(){
        
        if Auth.auth().currentUser != nil {
            
            let query = db.collection("chats").document(	 Auth.auth().currentUser!.uid).collection(secondUserID).order(by: "date")
            
            query.addSnapshotListener{(snapshot, error) in
                if let error = error {
                    print("Error: \(error)")
                    return
                }
                else{
                    snapshot!.documentChanges.forEach({change in
                        if change.type == .added {
                            let dictionary = change.document.data()
                            guard let msg = Message(dictionary: dictionary) else{
                                return
                            }
                            self.messages.append(msg)
                            
                        }
                        
                    })
                    
                    self.messagesCollectionView.reloadData()
                    self.messagesCollectionView.scrollToLastItem(at: .bottom, animated: true)
                }
            }
            
        }
        
        
        
        
    }
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        self.navigationItem.title = "Message"
        view.backgroundColor = UIColor.white
        
        // Do any additional setup after loading the view.
        
        
        
        messagesCollectionView.messagesDataSource = self
        messagesCollectionView.messagesLayoutDelegate = self
        messagesCollectionView.messagesDisplayDelegate = self
        messageInputBar.delegate = self
        
        if let layout = messagesCollectionView.collectionViewLayout as? MessagesCollectionViewFlowLayout {
            layout.textMessageSizeCalculator.outgoingAvatarSize = .zero
            layout.textMessageSizeCalculator.incomingAvatarSize = .zero
        }
        
        loadChat()
    }
    
}

extension Message: MessageType {
    
    var sender: SenderType {
        return SafetyMeter.sender(senderId: senderID, displayName: Auth.auth().currentUser?.displayName ?? "")
    }
    
    var messageId: String{
        return msgId
    }
    
    
    var sentDate: Date {
        return date.dateValue()
    }
    var kind: MessageKind{
        return .text(content)
    }
}

extension Message{
    
    init?(dictionary:[String: Any]){
        
        
        guard let msgId = dictionary["messageId"] as? String,
              let date = dictionary["date"] as? Timestamp,
              let content = dictionary["content"] as? String,
              let senderID = dictionary["senderID"] as? String,
              let toId = dictionary["toID"] as? String
        else{
            return nil
        }
        self.init(senderID: senderID, msgId: msgId, date: date, content: content, toId: toId)
    }
}
