import React, { useEffect, useRef, useState } from "react";
import "./home.css";

const Home = () => {
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songActived, setSongActived] = useState([]);
  const songSelect = useRef(null);

  const getSongs = () => {
    const URL = `https://playground.4geeks.com/sound/songs`;
    fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSongs(data.songs))
      .catch((err) => console.log(err));
  };

  const handleClick = (id) => {
    if (songSelect.current) {
      setSongActived(id);
      songSelect.current.src = `https://playground.4geeks.com${
        songs[id - 1].url
      }`;
      songSelect.current.play();
    }
  };

  const handleNext = () => {
    songs.forEach((item, index) => {
      if (item.id === songActived) {
        if (index + 1 < songs.length) {
          songSelect.current.src = `https://playground.4geeks.com${
            songs[index + 1].url
          }`;
          songSelect.current.play();
          setSongActived(songs[index + 1].id);
        } else {
          console.log("This is the last song");
        }
      }
    });
  };

  const handlePrev = () => {
    songs.forEach((item, index) => {
      if (item.id === songActived) {
        if (index > 0) {
          songSelect.current.src = `https://playground.4geeks.com${
            songs[index - 1].url
          }`;
          songSelect.current.play();
          setSongActived(songs[index - 1].id);
        } else {
          console.log("This is the first song");
        }
      }
    });
  };

  const handlePlayOrPause = () => {
    if (songSelect.current) {
      if (songSelect.current.paused) {
        songSelect.current.play();
      } else {
        songSelect.current.pause();
      }
    }
  };

  useEffect(() => {
    getSongs();

    if (songSelect.current) {
      songSelect.current.addEventListener("play", () => setIsPlaying(true));
      songSelect.current.addEventListener("pause", () => setIsPlaying(false));
      return () => {
        songSelect.current.removeEventListener("play", () =>
          setIsPlaying(true)
        );
        songSelect.current.removeEventListener("pause", () =>
          setIsPlaying(false)
        );
      };
    }
  }, []);

  return (
    <main
      className="d-flex text-white pt-4 flex-column justify-content-center align-items-center"
      style={{ background: "#010409", paddingBottom: "100px" }}
    >
      <h1 className="text-center">Reproductor de audio</h1>
      <div
        className="w-75 fs-4 rounded-3 p-4 my-4"
        style={{
          background: "#151b23",
          border: "0.25rem solid",
          maxWidth: "700px",
        }}
      >
        <ul className="list-group">
          {songs.map((item, index) => (
            <li
              className="d-flex justify-content-beetween align-items-center gap-4 text-white"
              style={{ background: "#151b23", cursor: "pointer" }}
              onClick={() => handleClick(item.id)}
              key={item.id}
              id={`https://playground.4geeks.com${item.url}`}
            >
              <span>&nbsp;&nbsp;{index + 1}&nbsp;{item.name}</span>
            </li>
          ))}
        </ul>
        <audio ref={songSelect} preload="auto" />
      </div>
      <div className="controls">
        <button onClick={() => handlePrev()}>
          <i className="bx bxs-skip-previous-circle"></i>
        </button>
        <button onClick={() => handlePlayOrPause()} className="play-pause">
          {isPlaying ? (
            <i className="bx bx-pause-circle"></i>
          ) : (
            <i className="bx bx-play-circle"></i>
          )}
        </button>
        <button onClick={() => handleNext()}>
          <i className="bx bxs-skip-next-circle"></i>
        </button>
      </div>
    </main>
  );
};

export default Home;