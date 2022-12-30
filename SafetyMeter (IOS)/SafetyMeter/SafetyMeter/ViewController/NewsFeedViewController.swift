//
//  NewsFeedViewController.swift
//  SafetyMeter
//
//  Created by Yi Ryoung Kim on 11/28/22.
//

import UIKit
import SafariServices

class NewsFeedViewController: UIViewController , UITableViewDelegate, UITableViewDataSource, UISearchBarDelegate{
    private var articles = [Article]()
    private let searchVC = UISearchController(searchResultsController: nil)
    private var viewModels = [NewsTableViewCellViewModel]()
    private let tableView: UITableView = {
        let table = UITableView()
        table.register(NewsFeedTableViewCell.self, forCellReuseIdentifier:NewsFeedTableViewCell.identifier)
        return table
    }()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        let barBtn = UIBarButtonItem(title: "Refresh", style: .done, target: self, action: #selector(clickedBarBtn))
        self.navigationItem.rightBarButtonItem  = barBtn
        
        createSearchBar()
        // Do any additional setup after loading the view.
        title = "Crime News"
        
        view.addSubview(tableView)
        tableView.delegate = self
        tableView.dataSource = self
        view.backgroundColor = .systemMint
        
        fetchNews()
        
    }
    @objc func clickedBarBtn() {
        fetchNews()
    }
    
    
    private func fetchNews(){
        APICaller.shared.getTopStories{ [weak self] result in
            switch result {
            case .success(let articles):
                self?.articles = articles
                self?.viewModels = articles.compactMap({
                    NewsTableViewCellViewModel(
                        title: $0.title,
                        subtitle: $0.description ?? "No Description",
                        imageURL: URL(string: $0.urlToImage ?? "")
                    )
                })
                DispatchQueue.main.async {
                    self?.tableView.reloadData()
                }

            case .failure(let error):
                print(error)
            }
        }
    }
    private func createSearchBar() {
        navigationItem.searchController = searchVC
        navigationItem.hidesSearchBarWhenScrolling = false

        searchVC.searchBar.delegate = self
        
        
        
    }
    // Table
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()
        tableView.frame = view.bounds
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: NewsFeedTableViewCell.identifier, for:indexPath) as? NewsFeedTableViewCell else {
            fatalError()
        }
        cell.configure(with: viewModels[indexPath.row])
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
//        let viewModel = viewModels[indexPath.row]
        let article = articles[indexPath.row]
        guard let url = URL(string: article.url ?? "") else { return }
        let vc = SFSafariViewController(url: url)
        present(vc, animated: true)
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return viewModels.count 
    }

    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 150 
    }
    
    // search
    func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
        guard let text = searchBar.text, !text.isEmpty else { return}
        print(text)
        APICaller.shared.search(with: text){ [weak self] result in
            switch result {
            case .success(let articles):
                self?.articles = articles
                self?.viewModels = articles.compactMap({
                    NewsTableViewCellViewModel(
                        title: $0.title,
                        subtitle: $0.description ?? "No Description",
                        imageURL: URL(string: $0.urlToImage ?? "")
                    )
                })
                DispatchQueue.main.async {
                    self?.tableView.reloadData()
                    self?.searchVC.dismiss(animated: true, completion: nil)
                }

            case .failure(let error):
                print(error)
            }
        }
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destination.
        // Pass the selected object to the new view controller.
    }
    */

}
