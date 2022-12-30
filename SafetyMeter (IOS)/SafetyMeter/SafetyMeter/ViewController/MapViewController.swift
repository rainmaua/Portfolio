//
//  File: MapViewController.swift
//  Package: SafetyMeter
//  Project: SafetyMeter
//
//  Created by Yong Cheng on 11/11/22 at 15:42.
//


import UIKit
import Foundation
import MapKit
import CoreLocation
import FirebaseFirestore

class MyPointAnnotation : MKPointAnnotation {
    var level: String?
    var time: String?
}

class MapViewController: UIViewController, CLLocationManagerDelegate, MKMapViewDelegate, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet var score: UILabel!
    @IBOutlet var searchBar: UITextField!
    @IBOutlet var time: UILabel!
    @IBOutlet var mapView: MKMapView!
    @IBOutlet var theSwitch: UISwitch!
    @IBOutlet weak var liveLocation: UISwitch!
    @IBOutlet weak var likeButton: UIButton!
    
    struct APIResults:Decodable {
        let rows: [Crime]
    }
    
    struct Crime:Decodable {
        let id: Int
        let date: String
        let time: String
        let description: String
        let lon: Double?
        let lat: Double?
    }
    
    var crimes: [Crime]?
    var favLocations: [GeoPoint]?
    
    let locationManager = CLLocationManager()
    let regionRadius: Double = 1000
    var mylocation = CLLocation(latitude: 38.64801, longitude: -90.24142)
    
    var slideUpContainer = UIView()
    var slideUpView = UITableView()
    let slideUpViewHeight: CGFloat = 300
    
    // Create timer for updating location
    var locationUpdateTimer = Timer()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        self.hideKeyboardWhenTappedAround()
        // locationManager configuration
        locationManager.delegate = self
        locationManager.requestWhenInUseAuthorization()
        locationManager.startUpdatingLocation()
        
        // mapView configuration
        mapView.showsUserLocation = true
        mapView.delegate = self
        score.layer.cornerRadius = 20
        score.layer.masksToBounds = true
        fetchData()
        
        centerMap("")
        
        slideUpView.register(UITableViewCell.self, forCellReuseIdentifier: "cell")
        slideUpView.delegate = self
        slideUpView.dataSource = self
        slideUpView.isScrollEnabled = true
        
    }
    
    // Fetch data on the background
    func fetchData() {
        DispatchQueue.global(qos: .userInitiated).async {
            var temp:[Crime] = []
            var url = URL(string:"https://api.stldata.org/crime/detailed?start=2020-1-1&end=2021-1-1&category=Robbery")
            var data = try? Data(contentsOf: url!)
            if let data = data {
                let crimes = try? JSONDecoder().decode([Crime].self, from: data)
                temp += crimes ?? []
            }
            
            url = URL(string:"https://api.stldata.org/crime/detailed?start=2020-1-1&end=2021-1-1&category=Homicide")
            data = try? Data(contentsOf: url!)
            if let data = data {
                let crimes = try? JSONDecoder().decode([Crime].self, from: data)
                temp += crimes ?? []
            }
            
            url = URL(string:"https://api.stldata.org/crime/detailed?start=2020-1-1&end=2021-1-1&category=Aggravated%20Assault")
            data = try? Data(contentsOf: url!)
            if let data = data {
                let crimes = try? JSONDecoder().decode([Crime].self, from: data)
                temp += crimes ?? []
            }
            if temp.count == 0 {
                return
            }
            self.crimes = temp
            self.crimes?.removeAll(where: {$0.lon == nil})
            print(self.crimes!.count)
            DispatchQueue.main.async {
                guard let coor = self.locationManager.location else {return}
                self.updateLocationHelper(coor)
            }
            
        }
    }
    
    // TableView setup for list of fav locations
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return favLocations?.count ?? 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let point = favLocations?[indexPath.row]
        let cell = self.slideUpView.dequeueReusableCell(withIdentifier: "cell")! as UITableViewCell
        let lat = round(point!.latitude * 100000000) / 100000000.0
        let long = round(point!.longitude * 100000000) / 100000000.0
        cell.textLabel?.text = String(describing: (lat, long))
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let newPoint = favLocations?[indexPath.row]
        if let pt = newPoint {
            let lat = pt.latitude
            let long = pt.longitude
            centerMapOnUserLocation(CLLocationCoordinate2D(latitude: lat, longitude: long))
        }
        hideList()
    }
    
    override func viewDidDisappear(_ animated: Bool) {
        self.locationUpdateTimer.invalidate()
    }
    
    @IBAction func changeMap(_ sender: Any) {
        if(theSwitch.isOn) {
            mapView.mapType = .satellite
        } else {
            mapView.mapType = .standard
        }
    }
    
    @IBAction func searchPlace(_ sender: Any) {
        guard let place = searchBar.text else { return }
        if place == "" {
            centerMapOnUserLocation(mylocation.coordinate)
            updateLocationHelper(mylocation)
            return
        }
        print(place)
        let dist = 50000
        let point = mylocation.coordinate
        let region = CLCircularRegion(center: point,
                                      radius: CLLocationDistance(dist),
                                      identifier: "Hint Region")
        let geocoder = CLGeocoder()
        geocoder.geocodeAddressString(place, in: region){placemarks, error in
            if error != nil {
                NSLog("Geocode failed with error: \(error!)")
                print("error")
                return
                
            }
            
            //NSLog(@"Received placemarks: %@", placemarks);
            print(type(of:placemarks![0]))
            print(placemarks![0].location!)
            if let location = placemarks![0].location {
                let lat = location.coordinate.latitude
                let lon = location.coordinate.longitude
                let queryLocation = CLLocation(latitude: lat, longitude: lon)
                // update crimes
                self.updateLocationHelper(queryLocation)
                // add query location annotation
                let annontation = MKPointAnnotation()
                annontation.coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
                self.mapView.addAnnotation(annontation)
                // center to the query location
                self.centerMapOnUserLocation(annontation.coordinate)
            }
            
        }
    }
    
    @IBAction func likeLocation(_ sender: Any) {
        guard currentUser?.uid != nil else {
            let alert = UIAlertController(title: "Alert", message: "Not logged in", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        var dg: DispatchGroup? = DispatchGroup()
        DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
            dg = nil // after time out group is removed asynchronously
        }
        
        DispatchQueue.global(qos: .background).async {
            dg?.enter()
            let uid = currentUser?.uid
            let ref = db.collection("users").document(uid!)
            
            // Location
            let lat = self.mapView.centerCoordinate.latitude
            let long = self.mapView.centerCoordinate.longitude
            
            // Upload timestamp and location
            
            let geopt = GeoPoint(latitude: lat, longitude: long)
            
            ref.getDocument() { (document, error) in
                if let document = document {
                    let favLoc = document.get("favLocation")
                    if favLoc != nil {
                        var new = favLoc as? [GeoPoint]
                        new!.append(geopt)
                        
                        ref.updateData([
                            "favLocation": new!
                        ])
                        self.favLocations = new!
                    } else {
                        ref.updateData([
                            "favLocation": []
                        ])
                        self.favLocations = []
                    }
                    
                } else {
                    print("Document does not exist in cache")
                }
                
            }
            
            dg?.leave()
            dg?.notify(queue: .global()) {
                // run code here on completion
                print("upload complete")
            }
        }
    }
    
    @IBAction func centerMap(_ sender: Any) {
        if let myLocation = self.locationManager.location {
            centerMapOnUserLocation(myLocation.coordinate)
            mylocation = myLocation
            updateLocationHelper(myLocation)
            self.searchBar.text = ""
        } else {
            return
        }
    }
    
    @IBAction func liveLocOn(_ sender: Any) {
        if liveLocation.isOn {
            print(currentUser?.uid ?? "No uid set")
            guard currentUser?.uid != nil else {
                let alert = UIAlertController(title: "Alert", message: "Not logged in", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default))
                self.present(alert, animated: true, completion: nil)
                self.liveLocation.isOn = false
                return
            }
            
            self.locationUpdateTimer = Timer.scheduledTimer(withTimeInterval: 5, repeats: true, block: { _ in self.uploadLocation() })
        } else {
            self.locationUpdateTimer.invalidate()
        }
        
    }
    
    @IBAction func listFav(_ sender: Any) {
        guard currentUser?.uid != nil else {
            let alert = UIAlertController(title: "Alert", message: "Not logged in", preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            self.present(alert, animated: true, completion: nil)
            return
        }
        
        requestFavLoc()
        
        slideUpView.reloadData()
        
        self.slideUpContainer.backgroundColor = UIColor.black.withAlphaComponent(0.9)
        self.slideUpContainer.frame = self.view.frame
        
        self.view.addSubview(slideUpContainer)
        
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(hideList))
        self.slideUpContainer.addGestureRecognizer(tapGesture)
        
        let screenSize = UIScreen.main.bounds.size
        slideUpView.frame = CGRect(x: 0, y: screenSize.height, width: screenSize.width, height: slideUpViewHeight)
        slideUpView.separatorStyle = .none
        self.view.addSubview(slideUpView)
        
        self.slideUpContainer.alpha = 0
        UIView.animate(withDuration: 0.5,
                       delay: 0, usingSpringWithDamping: 1.0,
                       initialSpringVelocity: 1.0,
                       options: .curveEaseInOut, animations: {
            self.slideUpContainer.alpha = 0.8
            self.slideUpView.frame = CGRect(x: 0, y: screenSize.height - self.slideUpViewHeight, width: screenSize.width, height: self.slideUpViewHeight)
        }, completion: nil)
                
    }
    
    // Display the time information about the crime when selected
    func mapView(_ mapView: MKMapView, didSelect view: MKAnnotationView) {
        if let annotationTitle = view.annotation?.title  {
            if annotationTitle == nil { return }
            print("User tapped on annotation with title: \(annotationTitle!)")
        }
        if let annotation = view.annotation as? MyPointAnnotation, let at = annotation.time {
            time.text = at
        }
    }
    
    // Clear the time text when deselected
    func mapView(_ mapView: MKMapView, didDeselect view: MKAnnotationView) {
        time.text = ""
    }
    
    // Handle customized annotation
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        guard let annotation = annotation as? MyPointAnnotation else {
            return nil
        }
        
        let annotationView = MKMarkerAnnotationView(annotation: annotation, reuseIdentifier: "something")
        if annotation.level == "severe" {
            annotationView.markerTintColor = .red
        } else {
            annotationView.markerTintColor = .yellow
        }
        
        annotationView.glyphImage = UIImage.init(systemName: "exclamationmark.triangle.fill")
        return annotationView
    }
    
    // Center the user on the map
    func centerMapOnUserLocation(_ coordinate: CLLocationCoordinate2D?) {
        var coor = locationManager.location?.coordinate
        if coordinate != nil {
            coor = coordinate
        }
        if coor == nil { return }
        let coordinateRegion = MKCoordinateRegion(center: coor!, latitudinalMeters: regionRadius, longitudinalMeters: regionRadius)
        mapView.setRegion(coordinateRegion, animated: true)
    }
    
    // Update surrounding crime cases while moving
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        // test around 38.64801, -90.24142
        let myLocation = locations[0]
        let dis = myLocation.distance(from: mylocation)
        print("how far = ", dis)
        if (dis < 15) {
            print("returned")
            return
        }
        
    }
    
    // For easy reuse
    func updateLocationHelper(_ myLocation: CLLocation) {
        guard let crimes = crimes else {
            return
        }
        
        mapView.removeAnnotations(mapView.annotations)
        // We judge an area' dangerous degree by adding the score of the crime. Homecide has a weight of 3 while other crimes have a weight of 1.
        var dangerIdx = 0
        for row in crimes {
            if let lon = row.lon, let lat = row.lat,
               myLocation.coordinate.longitude - 0.004 < lon && lon < myLocation.coordinate.longitude + 0.004 && myLocation.coordinate.latitude - 0.004 < lat && lat < myLocation.coordinate.latitude + 0.004
            {
                dangerIdx += 1
                let annontation = MyPointAnnotation()
                annontation.coordinate = CLLocationCoordinate2D(latitude: lat, longitude: lon)
                if row.description.contains("HOMICIDE") {
                    annontation.level = "severe"
                    annontation.title = "Homicide"
                    dangerIdx += 2
                } else if row.description.contains("ROBBERY"){
                    annontation.level = "high"
                    annontation.title = "Robbery"
                } else {
                    annontation.level = "high"
                    annontation.title = "Aggravated Assault"
                }
                
                annontation.time = row.date + " " + row.time
                
                mapView.addAnnotation(annontation)
            }
        }
        score.text = String(dangerIdx)
        if dangerIdx > 40 {
            // Do something because here is dangerous
            let alert = UIAlertController(title: "Alert", message: "Message", preferredStyle: UIAlertController.Style.alert)
            alert.message = "This area is dangerous"
            alert.addAction(UIAlertAction(title: "ok", style: .default))
            present(alert,animated: true)
        }
    }
    
    func requestFavLoc() {
        var dg: DispatchGroup? = DispatchGroup()
        DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
            dg = nil // after time out group is removed asynchronously
        }
        
        DispatchQueue.global(qos: .background).async {
            dg?.enter()
            let uid = currentUser?.uid
            let ref = db.collection("users").document(uid!)
            
            ref.getDocument() { (document, error) in
                if let document = document {
                    let favLoc = document.get("favLocation")
                    if favLoc != nil {
                        self.favLocations = favLoc as? [GeoPoint]
                    } else {
                        ref.updateData([
                            "favLocation": []
                        ])
                        self.favLocations = []
                    }
                    
                } else {
                    print("Document does not exist in cache")
                }
                
            }
            
            dg?.leave()
            dg?.notify(queue: .global()) {
                // run code here on completion
                print("request complete")
            }
        }
    }
    
    @objc func uploadLocation() {
        print("Uploading user location")
        if !liveLocation.isOn {
            self.locationUpdateTimer.invalidate()
            return
        }
        
        var dg: DispatchGroup? = DispatchGroup()
        DispatchQueue.main.asyncAfter(deadline: .now() + 10) {
            dg = nil // after time out group is removed asynchronously
        }
        
        DispatchQueue.global(qos: .background).async {
            dg?.enter()
            let uid = currentUser?.uid
            let ref = db.collection("users").document(uid!)
            
            // Timestamp
            let timeStamp = Timestamp()
            let timeFormatter = DateFormatter()
            timeFormatter.dateFormat = "MM/dd/yy"
            let date = timeFormatter.string(from: timeStamp.dateValue())
            timeFormatter.dateFormat = "hh:mm a"
            let exactTime = timeFormatter.string(from: timeStamp.dateValue())
            let time = date + " " + exactTime
            
            // Location
            let lat = self.locationManager.location?.coordinate.latitude
            let long = self.locationManager.location?.coordinate.longitude
            
            // Upload timestamp and location
            
            let geopt = GeoPoint(latitude: lat!, longitude: long!)
            ref.updateData([
                "location": geopt,
                "lastUpdate": timeStamp
            ]) { err in
                if let err = err {
                    print("Error updating document: \(err)")
                } else {
                    print("Document successfully updated")
                }
            }
            
            print("Uploaded location \(geopt) at time \(time).")
            
            dg?.leave()
            dg?.notify(queue: .global()) {
                // run code here on completion
                print("upload complete")
            }
        }
        
    }
    
    @objc func hideList() {
        let screenSize = UIScreen.main.bounds.size
        UIView.animate(withDuration: 0.5,
                       delay: 0, usingSpringWithDamping: 1.0,
                       initialSpringVelocity: 1.0,
                       options: .curveEaseInOut, animations: {
            self.slideUpContainer.alpha = 0
            self.slideUpView.frame = CGRect(x: 0, y: screenSize.height, width: screenSize.width, height: self.slideUpViewHeight)
        }, completion: nil)
    }
}

extension UIViewController {
    func hideKeyboardWhenTappedAround() {
        let tap = UITapGestureRecognizer(target: self, action: #selector(UIViewController.dismissKeyboard))
        tap.cancelsTouchesInView = false
        view.addGestureRecognizer(tap)
    }
    
    @objc func dismissKeyboard() {
        view.endEditing(true)
    }
}
