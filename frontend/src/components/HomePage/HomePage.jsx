import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./HomePage.css";
import axios from "axios";
import MovieCard from "./MovieCard";
import SearchIcon from "@mui/icons-material/Search";
import Skeleton from "@mui/material/Skeleton";

function HomePage() {
  const [movieData, setMovieData] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isloading, setIsloading] = useState(false);

  // hook to call the API on mount
  useEffect(() => {
    callApi();
  }, []);

  // hook to re-execute setMovieCards() when movieData received from API changes
  useEffect(() => {
    setMovieCards();
  }, [movieData]);

  // function that has a parameter of event (when user types in search bar) the searchInput's value gets set to new value
  const handleInputChange = (event) => {
    setSearchInput(event.target.value);
  };
  // function that calls the API with parameters set to user's searchInput and requests the list of movie objects
  const callSearchApi = () => {
    setIsloading(true);
    const options = {
      method: "GET",
      url: `https://moviesdatabase.p.rapidapi.com/titles/search/keyword/${searchInput}`,
      params: { limit: "20", page: "1" },
      headers: {
        "X-RapidAPI-Key": "e935a69b5emshaefbc5188846d64p1b0893jsnc85a3848b98a",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };
    axios
      .request(options)
      .then(function (response) {
        setMovieData(response.data); //once it gets the API's response, this line will change the movieData to the new movieData of the response
        setIsloading(false);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  //function that calls the API and sets the movieData

  const callApi = () => {
    setIsloading(true);
    const options = {
      method: "GET",
      url: "https://moviesdatabase.p.rapidapi.com/titles/x/upcoming",
      params: { limit: "30", page: "4", titleType: "movie" },
      headers: {
        "X-RapidAPI-Key": "e935a69b5emshaefbc5188846d64p1b0893jsnc85a3848b98a",
        "X-RapidAPI-Host": "moviesdatabase.p.rapidapi.com",
      },
    };
    axios.request(options).then((response) => {
      setMovieData(response.data);
      setIsloading(false);
    });
  };
  
      //function that maps each movie object's data to a component (movie card) with specific properties we wanted (key, image, title, etc) and then puts them all in movieList
    const setMovieCards = () => {
      if (!movieData || movieData.length === 0) return [];
      let list = movieData.results.map((movie) => {
        if (!movie.primaryImage) return null;
        return (
          <MovieCard
            key={movie.id}
            image={movie.primaryImage}
            title={movie.titleText}
            releaseDate={movie.releaseDate}
            rating={Math.floor(Math.random() * 5 + 1)}
          />
        );
      });

      setMovieList(list);
    };

  // renders the components of the HomePage to display to user
  return (
    <div>
      <NavBar />
      <div className="homepage-container">
        <span className="search-container">
          <input
            className="search-input"
            placeholder="Search for movies"
            type="text"
            onChange={handleInputChange}
          />
          <button className="search-btn" onClick={callSearchApi}>
            <SearchIcon />
          </button>
        </span>
        {isloading ? (
          <div
            className="movie-list"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <Skeleton
              style={{
                borderRadius: "10px",
                position: "relative",
                bottom: "4px",
              }}
              variant="rectangular"
              animation="wave"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "15px", bottom: "4px" }}
              variant="rectangular"
              animation="wave"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "15px", bottom: "4px" }}
              variant="rectangular"
              animation="wave"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "15px", bottom: "4px" }}
              variant="rectangular"
              animation="wave"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "30px", bottom: "4px" }}
              variant="rectangular"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "30px", bottom: "4px" }}
              variant="rectangular"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "30px", bottom: "4px" }}
              variant="rectangular"
              width={300}
              height={450}
            />
            <Skeleton
              style={{ borderRadius: "10px", marginTop: "30px", bottom: "4px" }}
              variant="rectangular"
              width={300}
              height={450}
            />
          </div>
        ) : (
          <div className="movie-list">{movieList}</div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
