import axios from "axios";
import { useState, useEffect } from "react";

export function HomePage() {
  const [tripsData, setTripsData] = useState([]);
  const [keyword, setKeyword] = useState("");

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${keyword}`
      );
      setTripsData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setKeyword(value);
  };

  useEffect(() => {
    fetchdata();
  }, [keyword]);

  return (
    <>
      <header>
        <h1 className=" text-cyan-500 text-4xl mt-20 ml-[38rem]">
          เที่ยวไหนดี
        </h1>
        <div className="flex flex-col item ml-[14rem] ">
          <p>ค้นหาที่เที่ยว</p>
          <input
            onChange={handleSearchChange}
            placeholder="ค้นหาที่เที่ยวแล้วไปกัน ..."
            type="text"
            className=" focus:outline-none border-b text-center max-w-[60rem] px-3 py-2"
          />
        </div>
      </header>
      <main className="m-24">
        {tripsData.map((trip) => (
          <div className="flex mt-7" key={trip.eid}>
            <img
              className="h-60 w-96 object-cover rounded-xl shadow-lg mx-4 mb-8"
              src={trip.photos[0]}
              alt={trip.title}
            />
            <div className="ml-4">
              <h3 className="text-2xl">{trip.title}</h3>
              <h4>
                {trip.description.length > 100
                  ? trip.description.slice(0, 100) + "..."
                  : trip.description}
              </h4>
              <button
                onClick={() => window.open(`${trip.url}`, "_blank")}
                className="underline text-cyan-400"
              >
                อ่านต่อ
              </button>

              <div className="flex gap-4">
                <p>หมวดหมู่</p>
                {trip.tags.map((tag) => (
                  <p className="underline" key={tag}>
                    {tag}
                  </p>
                ))}
              </div>
              <div className="flex flex-row gap-4 mt-6">
                {trip.photos.slice(1).map((photo, indexPhoto) => (
                  <img
                    key={indexPhoto}
                    className="w-20 h-20 rounded-xl"
                    src={photo}
                    alt={`Photo ${indexPhoto + 2}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </main>
    </>
  );
}
