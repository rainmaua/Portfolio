import { Inter } from "@next/font/google";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Head from "../../components/Head";
import ProductList from "../../components/ProductList";
import ProductItem from "../../components/ProductItem";
const inter = Inter({ subsets: ["latin"] });


export default function Notifications() {

    const router = useRouter();

    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [token, setToken] = useState("");

    const [doneSeller, setDoneSeller] = useState(false);
    const [doneBuyer, setDoneBuyer] = useState(false);


    const [sellerEmails, setSellerEmails] = useState({});
    const [buyerEmails, setBuyerEmails] = useState({});

    function confirmDelete(request) {
        confirmAlert({
            title: '',
            message: 'Are you sure you want do delete this request?',
            buttons: [
              {
                label: 'Confirm',
                onClick: () => deleteRequest(request)
              },
              {
                label: 'Cancel',
              }
            ]
        });
    };

    function confirmReject(request) {
        confirmAlert({
            title: '',
            message: 'Are you sure you want do reject this request?',
            buttons: [
              {
                label: 'Confirm',
                onClick: () => rejectRequest(request)
              },
              {
                label: 'Cancel',
              }
            ]
        });
    };
    
    


    const getToken = async() => {
        try {
            const testUser = sessionStorage.getItem("user");
            const userObj =  JSON.parse(testUser);
            return userObj.token;
        } catch {
            router.push("/account/login");
        }
    }


    function deleteRequest(deleteReq) {
        fetch(`/api/buy-request?sellerId=${deleteReq.sellerId}&bookId=${deleteReq.bookId}`,{
            method: "delete",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
        }).then((response) => {
            setSent(sent.filter(entry => entry != deleteReq))
        })
    }

    function acceptRequest(acceptReq) {
        fetch("/api/buy-request",{
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({bookId: acceptReq.bookId, buyerId: acceptReq.buyerId, approved: true, denied: false, read: true}),
        }).then((response) => response.json())
        .then((data) => {
            router.reload();
            setSent(sent.splice(sent.indexOf(acceptReq), 1, data))
        })
    }

    function rejectRequest(rejectReq) {
        fetch("/api/buy-request",{
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({bookId: rejectReq.bookId, buyerId: rejectReq.buyerId, approved: false, denied: true, read: true}),
        }).then((response) => response.json())
        .then((data) => {
            router.reload();
        })
    }

    function readRequest(readReq) {
        fetch("/api/buy-request",{
            method: "PUT",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({bookId: readReq.bookId, buyerId: readReq.buyerId, approved: false, denied: false, read: true}),
        })
    }

    function confirmSale(request) {
        fetch("/api/buy-request/confirm-sale",{
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
            body: JSON.stringify({
                bookId: request.bookId, 
                buyerId: request.buyerId
            }),
        }).then((response) => response.json())
        .then((data) => {
            router.reload();
        })
    }
    

    useEffect(() => {
        getToken().then((response) => {
            if(response) {
                setToken(response);
            } else {
                router.push("/account/login");
                return
            }     
            fetch("/api/buy-request/get-received", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response}`},
            })
            .then((userReceived) => {
                if (!userReceived.ok) {
                    return Promise.reject(userReceived);
                  }
                  return userReceived.json();
            }).then((userReceived) => {
                setReceived(userReceived);
                // console.log("Received requests: ", userReceived);
                if (userReceived.length > 0) {
                    userReceived.forEach(async (receivedRequest) => {
                        if(receivedRequest.approved) {
                            fetch(`/api/user?id=${receivedRequest.buyerId}`, {
                                method: "GET",
                                headers: { 
                                    "Content-Type": "application/json",
                                    Authorization: `Bearer ${response}`},
                            })
                            .then((userInfo) => {
                                if (!userInfo.ok) {
                                    return Promise.reject(userInfo);
                                }
                                return userInfo.json();
                            }).then((userInfo) => {
                                const buyerObj = {};
                                buyerObj[userInfo.id] = userInfo.email
                                setBuyerEmails({...buyerEmails, ...buyerObj})
                                },
                                (error) => {
                                    console.error(error);
                                }
                            );
                        }
                        
                    });
                    setDoneBuyer(true);
                } else {
                    setDoneBuyer(true);
                }
            },
            (error) => {
                console.log(error);
            }
            ).then(() => {
                fetch("/api/buy-request/get-sent", {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${response}`},
                })
                .then((userSent) => {
                    if (!userSent.ok) {
                        return Promise.reject(userSent);
                    }
                    return userSent.json();
                }).then((userSent) => {
                    setSent(userSent);
                    if (userSent.length > 0) {
                        userSent.forEach(async (sentRequest) => {            
                            if(sentRequest.approved) {
                                return fetch(`/api/user?id=${sentRequest.sellerId}`, {
                                    method: "GET",
                                    headers: { 
                                        "Content-Type": "application/json",
                                        Authorization: `Bearer ${response}`},
                                })
                                .then((userInfo) => {
                                    if (!userInfo.ok) {
                                        return Promise.reject(userInfo);
                                    }
                                    return userInfo.json();
                                }).then((userInfo) => {
                                    const sellerObj = {}
                                    sellerObj[userInfo.id] = userInfo.email
                                    setSellerEmails({...sellerEmails, ...sellerObj})
                                },
                                (error) => {
                                        console.error(error);
                                }
                                );
                            }
                            
                        });
                        setDoneSeller(true)
                    }
                    else {
                        setDoneSeller(true)
                    }
                },
                (error) => {
                    console.log(error);
                });
            });
        });   
    },[]);

    return (doneSeller && doneBuyer) ? (
        <div className="text-center">
            <h1 className="font-semibold text-2xl my-4">Requests</h1>
            <div className="flex flex-col items-center xl:flex-row xl:items-start justify-center gap-x-12 mx-auto sm:px-20"> 
                <div className="min-w-fit w-full lg:w-3/5 xl:w-2/5 h-[44rem] flex flex-col items-center">
                    <h2 className="font-semibold underline text-xl ml-auto mr-auto my-4">Sent</h2>
                    <div className="w-full h-full border-black dark:border-white border-2 rounded-md">
                        { sent.length > 0 ? (
                            <div className="overflow-scroll">
                                {sent.map((request) => {
                                    const book = request.book;
                                    return (
                                        <div key={request.dateCreated} className="flex flex-col items-center min-w-fit p-4 border-black dark:border-white border-b">
                                            <p className="w-fit"> {book.title} | ${book.price}</p>
                                            {request.approved ? (  
                                                <div>      
                                                    <p className="mx-auto w-fit">Request Approved!</p>
                                                    <p className="mx-auto w-fit">Seller's email: {sellerEmails[request.sellerId]}</p>
                                                </div>   
                                            ) : (
                                                <div className="mx-auto w-fit">
                                                    {request.denied ? (
                                                        <p>Request Denied | 
                                                            <button className="bg-transparent hover:bg-red-600 text-red-600 font-semibold ml-2 hover:text-white px-1 border border-red-600 hover:border-transparent rounded" 
                                                                onClick={() => confirmDelete(request)}>Delete
                                                                </button>
                                                        </p>
                                                    ) : (
                                                        <div>
                                                            <p className="mx-auto w-fit">Seller: {request.seller.username} |  
                                                                <button className="bg-transparent hover:bg-red-600 text-red-600 font-semibold ml-2 hover:text-white px-1 border border-red-600 hover:border-transparent rounded" 
                                                                onClick={() => confirmDelete(request)}>Delete
                                                                </button>
                                                            </p>
                                                            <p className="w-fit">Request Pending | Read: {request.read ? "Yes" : "No"}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (<p className="my-2">No Requests Sent</p>)}
                    </div>
                </div>
                <div className="min-w-fit w-full lg:w-3/5 xl:w-2/5 h-[44rem] flex flex-col items-center">     
                    <h2 className="font-semibold underline text-xl ml-auto mr-auto my-4">Received</h2>
                    <div className="w-full h-full border-black dark:border-white border-2 rounded-md">
                        { received.length > 0 ? (
                            <div className="overflow-y-scroll">
                                {received.map((request) => {
                                    if(request.denied) {
                                        return
                                    }
                                    if(!request.approved && !request.read) {
                                        console.log("not read")
                                        readRequest(request)
                                    }
                                    const book = request.book;
                                    //console.log(buyerEmails[request.buyerId])
                                    return (                                
                                        <div key={request.dateCreated} className="flex flex-col items-center py-4 border-black dark:border-white border-b">
                                            <div>
                                            <p className="w-fit mx-auto"> {book.title} | ${book.price}</p>
                                                {request.approved ? (
                                                    // <p className="mx-auto w-fit">test</p>
                                                    <div>
                                                            <p className="mx-auto w-fit">Request Approved!</p>
                                                            <p className="mx-auto w-fit"> Buyer's email is {buyerEmails[request.buyerId]}</p>
                                                            {request.completed ? (
                                                                <p className="w-fit mx-auto">Book has been confirmed sold.</p>
                                                            ) : (
                                                                <p> 
                                                                    <button className="bg-transparent hover:bg-yellow-700 text-yellow-700 font-semibold ml-2 hover:text-white px-1 border border-yellow-700 hover:border-transparent rounded" 
                                                                        onClick={() => confirmSale(request)}>Confirm Sale
                                                                    </button>
                                                                </p>
                                                            )}
                                                    </div>
                                                ) : (
                                                    <div>                                                                                                  
                                                            <p className="mx-auto w-fit text-center"> Buy request from {request.buyer.username} </p>
                                                            <div className="mx-auto w-fit text-center"> 
                                                                <button 
                                                                    className="bg-transparent hover:bg-green-500 text-green-700 font-semibold ml-2 hover:text-white px-1 border border-green-500 hover:border-transparent rounded" 
                                                                    onClick={() => acceptRequest(request)}> Accept
                                                                </button> 
                                                                <button 
                                                                    className="bg-transparent hover:bg-red-600 text-red-600 font-semibold ml-2 hover:text-white px-1 border border-red-600 hover:border-transparent rounded" 
                                                                    onClick={() => confirmReject(request)}> Reject
                                                                </button>                                                   
                                                            </div>
                                                    </div>
                                                    
                                                ) }
                                                
                                            </div>
                                        </div>
                                    );
                                    //if(!request.read)
                                })}
                            </div>
                        ) : (<p className="my-2">No Requests Received</p>)}     
                    </div>      
                </div> 
            </div>
        </div>
    ) : (
        <div>loading...</div>
    )

}