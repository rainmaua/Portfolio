import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });


export default function Notifications() {

    const router = useRouter();

    const [userBooks, setUserBooks] = useState([]);
    const [token, setToken] = useState("");


    const [doneBooks, setDoneBooks] = useState({});

    const getToken = async() => {
        try {
            const testUser = sessionStorage.getItem("user");
            const userObj =  JSON.parse(testUser);
            return userObj.token;
        } catch {
            router.push("/account/login");
        }
    }

    function deleteBook(book) {
        fetch(`/api/book?id=${book.id}`,{
            method: "delete",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`},
        }).then((response) => {
            router.reload();
        })
    }
    
    useEffect(() => {
        getToken().then((response) => {
            setToken(response);
            fetch("/api/book/by-user", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response}`},
            })
            .then((userBooks) => {
                if (!userBooks.ok) {
                    return Promise.reject(userBooks);
                }
                return userBooks.json();
            }).then((userBooks) => {
                setUserBooks(userBooks);
            },
            (error) => {
                console.log(error);
            })
            setDoneBooks(true)
        });   
    },[]);

    return (doneBooks) ? (
        <div className="text-center">
            <h1 className="font-semibold text-2xl my-4">My Books</h1>
            <div className="flex flex-col max-w-6xl items-center justify-between mx-auto px-8"> 
                <div className="w-2/5 h-[44rem] flex flex-col items-center">     
                    <div className="w-full h-full border-black dark:border-white border-2 rounded-md overflow-y-auto">
                        { userBooks.length > 0 ? (
                            <div>
                                {userBooks.map((book) => {
                                    return (                                
                                        <div key={book.dateCreated} className="flex flex-col items-center py-4 border-black dark:border-white border-b">
                                            <p> {book.title}</p>
                                            <p> Price: ${book.price}</p>
                                            {book.sold ? (
                                                <p> Sold</p>
                                            ) : (
                                                <p> For Sale</p>
                                            )}
                                            <p> Date Posted: {book.dateCreated.substring(0,10)}</p>
                                            <img className="my-2 border border-black dark:border-white"src={book.imageLink}></img>
                                            {!book.sold ? (
                                                <p> 
                                                    <button className="text-red-700 hover:text-white hover:bg-red-700 font-semibold px-1 mt-2 border border-red-700 hover:border-transparent rounded" 
                                                        onClick={() => deleteBook(book)}>Delete
                                                    </button>
                                                </p>
                                            ) : (
                                                <p></p>
                                            )}
                                    </div>
                                    );
                                })}
                            </div>
                        ) : (<p className="my-2">No Books Found</p>)}     
                    </div>      
                </div> 
            </div>
        </div>
    ) : (
        <div>loading...</div>
    )

}