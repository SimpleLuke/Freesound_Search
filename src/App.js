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
          Authorization: "Token a7KqVhv7qs1eY1xYWR1MQvT1tkngKuZOTPfHBR3H",
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
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <Fragment>
      <form onSubmit={formSubmitHandler}>
        <input type="text" ref={inputRef} disabled={isLoading} />
      </form>
      <section>{content}</section>
    </Fragment>
  );
}

export default App;
