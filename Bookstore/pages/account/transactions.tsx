import { Inter } from "@next/font/google";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useState } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function Notifications() {

    const router = useRouter();

    const [soldBooks, setSoldBooks] = useState([]);
    const [boughtBooks, setBoughtBooks] = useState([]);
    const [token, setToken] = useState("");

    const [doneSold, setSold] = useState({});
    const [doneBought, setBought] = useState({});

    const getToken = async() => {
        try {
            const testUser = sessionStorage.getItem("user");
            const userObj =  JSON.parse(testUser);
            return userObj.token;
        } catch {
            router.push("/account/login");
        }
    }
    
    useEffect(() => {
        getToken().then((response) => {
            setToken(response);
            fetch("/api/user/get-sold-books", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response}`},
            })
            .then((soldBooks) => {
                if (!soldBooks.ok) {
                    return Promise.reject(soldBooks);
                }
                return soldBooks.json();
            }).then((soldBooks) => {
                setSoldBooks(soldBooks);
            },
            (error) => {
                console.log(error);
            })
            setSold(true)

            fetch("/api/user/get-bought-books", {
                method: "GET",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${response}`},
            })
            .then((boughtBooks) => {
                if (!boughtBooks.ok) {
                    return Promise.reject(boughtBooks);
                }
                return boughtBooks.json();
            }).then((boughtBooks) => {
                setBoughtBooks(boughtBooks);
            },
            (error) => {
                console.log(error);
            })
            setBought(true)
        });   
    },[]);

    return (doneSold) ? (
        <div className="text-center">
            <h1 className="font-semibold text-2xl my-4">My Books</h1>
            <div className="flex flex-row w-4/5 items-start justify-between mx-auto px-8"> 
                <div className="w-2/5 h-[44rem] flex flex-col items-center">
                    <h2 className="font-semibold text-xl ml-auto mr-auto my-4">Sold</h2>
                    <div className="w-full h-full border-white border-2 rounded-md overflow-y-auto">
                        { soldBooks.length > 0 ? (
                            <div>
                                {soldBooks.map((sold) => {
                                    return (                                
                                        <div key={sold.book.dateCreated} className="flex flex-col items-center py-4 border-white border-b">
                                            <div>
                                            <p className="w-fit mx-auto"> {sold.book.title}</p>
                                            <p className="w-fit mx-auto"> Price: ${sold.book.price}</p>
                                            <p className="w-fit mx-auto"> Date Sold: {sold.dateCompleted.substring(0,10)}</p>
                                            <img src={sold.book.imageLink}></img>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (<p className="my-2">No Books Found</p>)}     
                    </div>      
                </div>
                <div className="w-2/5 h-[44rem] flex flex-col items-center">
                    <h2 className="font-semibold text-xl ml-auto mr-auto my-4">Bought</h2>
                    <div className="w-full h-full border-white border-2 rounded-md overflow-y-auto">
                        { boughtBooks.length > 0 ? (
                            <div>
                                {boughtBooks.map((bought) => {
                                    return (                                
                                        <div key={bought.book.dateCreated} className="flex flex-col items-center py-4 border-white border-b">
                                            <div>
                                            <p className="w-fit mx-auto"> {bought.book.title}</p>
                                            <p className="w-fit mx-auto"> Price: ${bought.book.price}</p>
                                            <p className="w-fit mx-auto"> Date Bought: {bought.dateCompleted.substring(0,10)}</p>
                                            <img src={bought.book.imageLink}></img>
                                            </div>
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