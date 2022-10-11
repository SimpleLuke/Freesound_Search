import { Fragment, useEffect, useState, useRef, useCallback } from "react";

import SoundsList from "./components/SoundsList";

function App() {
  const [sounds, setSounds] = useState([]);
  const [paginate, setPaginate] = useState(null);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const fetchSoundData = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const searchWord = inputRef.current.value;

      let url = `https://freesound.org/apiv2/search/text/?fields=id,name,previews&query=${searchWord}&page=${paginate}`;
      console.log(url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: process.env.REACT_APP_FREE_SOUND_TOKEN,
        },
      });
      const data = await response.json();

      const transformedSounds = data.results.map((soundData) => {
        return {
          id: soundData.id,
          title: soundData.name,
          previews: soundData.previews,
        };
      });
      setSounds(transformedSounds);
      setNext(data.next);
      setPrev(data.previous);
    } catch (error) {
      setError("Something went wrong!");
    }
    setIsLoading(false);
  }, [paginate]);

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    if (paginate !== 1) {
      setPaginate(1);
      return;
    }
    fetchSoundData();
  };

  const nextPageHandler = async () => {
    if (next) {
      setPaginate((prev) => {
        return prev + 1;
      });
    }
  };

  const prevPageHandler = () => {
    if (prev) {
      setPaginate((prev) => {
        return prev - 1;
      });
    }
  };

  useEffect(() => {
    if (paginate !== null) {
      fetchSoundData();
    }
  }, [paginate, fetchSoundData]);

  let content = "";

  if (sounds.length > 0) {
    content = (
      <SoundsList
        sounds={sounds}
        next={nextPageHandler}
        prev={prevPageHandler}
        isLoading={isLoading}
      />
    );
  }

  if (error) {
    content = <p className="mx-auto font-mono">{error}</p>;
  }

  if (isLoading) {
    content = <p className="mx-auto font-mono">Loading...</p>;
  }

  return (
    <div className="container mt-10 mx-auto">
      <h1 className="font-mono text-6xl text-gray-50 font-bold text-center ">
        Find Out Your Sound!
      </h1>
      <form
        className="flex mt-10 justify-center content-center flex-col font-mono"
        onSubmit={formSubmitHandler}
      >
        <input
          className="w-6/12 mx-auto text-center h-10"
          type="text"
          ref={inputRef}
          disabled={isLoading}
        />
        <input
          type="submit"
          className="w-6/12 mx-auto bg-sky-500/30 hover:pointer h-10 text-gray-50 hover:opacity-100 font-mono font-bold cursor-pointer "
          value={"Enter"}
        />
      </form>
      <section className="flex flex-col justify-center content-center  mt-20 text-gray-50 text-lg">
        {content}
      </section>
    </div>
  );
}

export default App;
