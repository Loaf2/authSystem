import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
export default function Dashboard() {
  const { state } = useLocation();
  const [data, setData] = useState();

  useEffect(() => {
    const parsedData = JSON.parse(JSON.stringify(state));
    console.log(parsedData);
    setData(parsedData);
    console.log(data);
  }, [state]);

  return (
    <div className="flex justify-center gap-5">
      <span className="text-3xl">Welcome</span>{" "}
      {data !== undefined ? (
        <span className="text-3xl">{data.username}</span>
      ) : null}
    </div>
  );
}
