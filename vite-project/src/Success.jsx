import React, {useEffect, useState} from 'react'
import {useSearchParams} from 'react-router-dom'

export default function Success() {
    let [searchParams, setSearchParams] = useSearchParams();
    const retrieveStripeInfo = () =>
        fetch("/retrieveStripeInfo", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stripeSessionId: searchParams.get("session_id") }),
        }).then((res) => res.json());

    const inputUserItems = async () => {
        const authData = await fetch("/isUserAuth", {
            headers: {
                "x-access-token": localStorage.getItem("token"),
            },
        }).then((res) => res.json());
        console.log(authData);
        if (!authData.auth) {
            console.log("Not Authenticated or token expired");
            return;
        }
        const token = localStorage.getItem("token");
        const items = await retrieveStripeInfo();
        console.log(items);

        const inputUserItems = await fetch("/inputUserItems", {
            method: "POST",
            headers: {
                "x-access-token": token,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemData: items }),
        }).then((res) => res.json());
        console.log(inputUserItems);
    };

    useEffect(() => {
        (async () => {
            await retrieveStripeInfo();
            await inputUserItems();
            console.log(searchParams.get("session_id"));
        })();
    }, []);

    return (
        <div className="flex flex-col gap-8 items-center">
            <span className="text-4xl">Items</span>
        </div>
    )
}
