import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from 'axios';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
function Poster(props) {
  return (
    <img 
    className="poster"
    src={props.src}
    alt="new"
    />
  );
}

function Button(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

async function getMovies() {
  var movie_data = []

  var page_num = Math.floor(Math.random() * 50)

  for (let i = page_num; i <= page_num; i++) {
    var poster_response = await axios.get("https://api.themoviedb.org/3/discover/movie?api_key=b2b545d1cf651d50f3a842fea2a3add6&vote_count.gte=3000&sort_by=popularity.desc&page=" + i)
    
    for (let j = 0; j < poster_response.data.results.length; j++) {
      var omdb_response = await axios.get("https://www.omdbapi.com/?t=" + poster_response.data.results[j].original_title + "&apikey=59401cd")

      if(omdb_response.data.imdbRating === undefined) continue

      var curr = {
          'title': poster_response.data.results[j].original_title,
          'poster': "https://image.tmdb.org/t/p/original" + poster_response.data.results[j].poster_path,
          'release_date': omdb_response.data.Released,
          'box_office': omdb_response.data.BoxOffice,
          'imdb_rating': omdb_response.data.imdbRating
        }
      
      movie_data.push(curr)
    }
  }
  
  return movie_data
}

function getRandom(arr, n) {
  var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movie_data: [
        {
          'title': 'foo',
          'poster': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif',
          'release_date': 'foo',
          'box_office': 'bar',
          'imdb_rating': -1
        },
        {
          'title': 'foo',
          'poster': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Loading_icon.gif',
          'release_date': 'foo',
          'box_office': 'bar',
          'imdb_rating': -1
        }
      ],
      movies: [],
      streak: 0,
      high_score: 0,
      i: -1
    };
  }

  async componentDidMount() {
    this.setState({
      movie_data: await getMovies()
    })
  }

  renderPoster(src) {
    return (
      <Poster
        src={src}
      />
    );
  }

  handleClick(val, movies) {
    var is_correct = (val === "Higher") ? (movies[0].imdb_rating <= movies[1].imdb_rating) : (movies[0].imdb_rating >= movies[1].imdb_rating)

    console.log(is_correct)

    if(is_correct) {
      var movie_data = this.state.movie_data.slice()
      var index = movie_data.map(function (movie) { return movie.poster; }).indexOf(movies[0].poster)
      movie_data.splice(index, 1)

      index = movie_data.map(function (movie) { return movie.poster; }).indexOf(movies[1].poster)
      var new_movie = getRandom(movie_data, 1)
      movies = [movie_data[index]].concat(new_movie)

      this.setState({
        movie_data: movie_data,
        movies: movies,
        streak: this.state.streak + 1,
        high_score: Math.max(this.state.high_score, this.state.streak + 1),
        i: index
      })

      console.log("Streak: " + (this.state.streak + 1))
    }
    else {
      this.setState({
        movies: getRandom(this.state.movie_data, 2),
        streak: 0,
        high_score: Math.max(this.state.high_score, this.state.streak),
        i: -1
      })
    }
  }

  renderButton(val, movies) {
    return (
      <Button
        value={val}
        onClick={() => this.handleClick(val, movies)}
      />
    );
  }

  render() {

    var movie_data = this.state.movie_data.slice()
    var movies = this.state.movies.slice()
    
    if(movies.length === 0) movies = getRandom(movie_data, 2)

    console.log(movie_data)
    console.log(movies)

    return (
      <div>
        <table>
          <th>
            {movies[0].title}
          </th>
          <th>
            {movies[1].title}
          </th>
          <th>
            High Score: {(this.state.high_score)}
          </th>
          <th>
            Streak: {(this.state.streak)}
          </th>
          <tr>
            <td>
              {this.renderPoster(movies[0].poster)}
            </td>
            <td>
              {this.renderPoster(movies[1].poster)}
            </td>
          </tr>
          <tr>
            <td>
              {movies[0].title} is rated {movies[0].imdb_rating} on IMDB
            </td>
            <td>
              {movies[1].title} is rated {this.renderButton("Higher", movies)} or {this.renderButton("Lower", movies)} than {movies[0].title}
            </td>
          </tr>
        </table>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
