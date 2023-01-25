import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./App.css";

import reactImg from "./assets/react.png";
import htmlImg from "./assets/html.png";

export default function Dashboard() {
  const { state } = useLocation();
  const [data, setData] = useState();
  const [credentials, setCredentials] = useState();
  const [storeItems, setStoreItems] = useState();

  useEffect(() => {
    const parsedData = JSON.parse(JSON.stringify(state[0]));
    setData(parsedData);
    setCredentials(state[1]);
  }, [state]);

  useEffect(() => {
    fetch("/items")
      .then((res) => res.json())
      .then((data) => {
        data.map((item) => {
          for (item of Object.values(item)) {
            console.log(item);
            setStoreItems(...storeItems, item);
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
    console.log(storeItems);
  }, []);

  function handleBuyREACT() {}

  function handleBuyHTML() {}

  return (
    <div className="flex flex-col gap-5">
      <div className="w-screen h-[8rem] bg-sky-400 flex justify-center items-center">
        <span className="text-5xl text-white h-[-30px]">Courses Store</span>
      </div>
      <div className="courses ml-10 mt-5 flex gap-5">
        <div className="course flex flex-col items-center bg-[#e9ecef] w-fit px-2">
          <img src={reactImg} alt="" className="w-[150px]" />
          <div className="flex justify-between items-center bg-[#adb5bd] w-[calc(100%+8px)] px-2">
            <span className="text-3xl text-[#495057]">
              {storeItems?.map((item) => {
                if (item.name === "React") {
                  return item.name;
                }
              })}
            </span>
            <span className="text-2xl text-[#4d9f4a]">$100</span>
          </div>
          <button
            className="w-[calc(100%+8px)] px-2 bg-[#6fe540] hover:text-white duration-[200ms] ease-in-out"
            onClick={handleBuyREACT}
          >
            Buy Now
          </button>
        </div>
        <div className="course flex flex-col items-center bg-[#e9ecef] w-fit px-2">
          <img src={htmlImg} alt="" className="w-[150px]" />
          <div className="flex justify-between items-center bg-[#adb5bd] w-[calc(100%+8px)] px-2">
            <span className="text-3xl text-[#495057]">HTML</span>
            <span className="text-2xl text-[#4d9f4a]">$50</span>
          </div>
          <button
            className="w-[calc(100%+8px)] px-2 bg-[#6fe540] hover:text-white duration-[200ms] ease-in-out"
            onClick={handleBuyHTML}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* <span className="text-3xl">Welcome</span>{" "}
      {data !== undefined ? (
        <span className="text-3xl">{data.username}</span>
      ) : null} */}
    </div>
  );
}
