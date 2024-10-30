import axios from "axios";
import { useState, useEffect } from "react";
import { LinkIcon } from "./IconComponent";

export function HomePage() {
  const [tripsData, setTripsData] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [notification, setNotification] = useState("");

  const fetchdata = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/trips?keywords=${keywords.join(" ")}`
      );
      setTripsData(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    const trimmedKeywords = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setKeywords(trimmedKeywords);
  };

  const handleTagClick = (tag) => {
    setKeywords((prevKeywords) => {
      if (prevKeywords.includes(tag)) {
        return prevKeywords.filter((t) => t !== tag);
      } else {
        return [...prevKeywords, tag];
      }
    });
  };

  const handleCopyToClipboard = (url) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setNotification(`คัดลอก URL สำเร็จ: ${url}`);
        setTimeout(() => setNotification(""), 3000);
      })
      .catch((err) => {
        console.error("ไม่สามารถคัดลอกได้: ", err);
      });
  };

  useEffect(() => {
    fetchdata();
  }, [keywords]);

  return (
    <>
      <header className="flex flex-col items-center">
        <h1 className="text-cyan-500 text-4xl mt-20 text-center">
          เที่ยวไหนดี
        </h1>
        <div className="flex flex-col items-start mt-4 max-w-[60rem] w-full">
          <p>ค้นหาที่เที่ยว</p>
          <input
            onChange={handleSearchChange}
            placeholder="ค้นหาที่เที่ยวแล้วไปกัน ..."
            type="text"
            value={keywords.join(" ")}
            className="focus:outline-none border-b text-center w-full px-3 py-2"
          />
        </div>
      </header>

      <main className="flex justify-center mt-20">
        <div className="flex flex-col items-start">
          {tripsData.map((trip) => (
            <div className="flex mt-7  justify-center" key={trip.eid}>
              <img
                className="h-[20rem] w-[30rem] object-cover rounded-xl shadow-lg mx-4 mb-8"
                src={trip.photos[0]}
                alt={trip.title}
              />
              <div className="ml-4 max-w-[45rem] max-h-[20rem]">
                <h3 className="text-2xl">{trip.title}</h3>
                <h4>
                  {trip.description.length > 100
                    ? trip.description.slice(0, 100) + "..."
                    : trip.description}
                </h4>
                <button
                  onClick={() => window.open(trip.url, "_blank")}
                  className="underline text-cyan-400"
                >
                  อ่านต่อ
                </button>

                <div className="flex gap-4">
                  <p>หมวดหมู่</p>
                  {trip.tags.map((tag) => (
                    <button
                      key={tag}
                      className={`underline ${
                        keywords.includes(tag) ? "text-red-500" : ""
                      }`}
                      onClick={() => handleTagClick(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="flex flex-row gap-4 mt-24">
                  {trip.photos.slice(1).map((photo, indexPhoto) => (
                    <img
                      key={indexPhoto}
                      className="w-[10rem] h-[7.5rem] rounded-xl"
                      src={photo}
                      alt={`Photo ${indexPhoto + 2}`}
                    />
                  ))}
                  <button
                    onClick={() => handleCopyToClipboard(trip.url)}
                    className="ml-20 mt-20 text-cyan-400 "
                  >
                    <LinkIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {notification && (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white p-3 rounded shadow-lg">
          {notification}
        </div>
      )}
    </>
  );
}
