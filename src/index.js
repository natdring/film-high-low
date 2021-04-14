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

  for (let i = page_num; i <= page_num+5; i++) {
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

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movie_data: [{
        'title': 'foo',
        'poster': 'bar',
        'release_date': 'foo',
        'box_office': 'bar',
        'imdb_rating': -1
      }],
      rands: [Math.random(), Math.random()],
      streak: 0
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

  handleClick(val, rands) {
    var movie_one = this.state.movie_data[Math.floor(rands[0] * this.state.movie_data.length)]
    var movie_two = this.state.movie_data[Math.floor(rands[1] * this.state.movie_data.length)]
    
    console.log(movie_one.imdb_rating)
    console.log(movie_two.imdb_rating)

    var is_correct = (val === "Higher") ? (movie_one.imdb_rating <= movie_two.imdb_rating) : (movie_one.imdb_rating >= movie_two.imdb_rating)

    console.log(is_correct)

    if(is_correct) {
      const movie_data = this.state.movie_data.slice()
      movie_data.splice(Math.floor(rands[0] * this.state.movie_data.length), 1)

      this.setState({
        movie_data: movie_data,
        rands:[rands[1], Math.random()],
        streak: this.state.streak + 1
      })

      console.log("Streak: " + (this.state.streak + 1))
    }
    else {
      this.setState({
        rands: [Math.random(), Math.random()],
        streak: 0
      })
    }
  }

  renderButton(val, rands) {
    return (
      <Button
        value={val}
        onClick={() => this.handleClick(val, rands)}
      />
    );
  }

  render() {
    var rands = this.state.rands

    var movie_one = this.state.movie_data[Math.floor(rands[0] * this.state.movie_data.length)]
    var movie_two = this.state.movie_data[Math.floor(rands[1] * this.state.movie_data.length)]

    return (
      <div>
        <table>
          <th>
            {movie_one.title}
          </th>
          <th>
            {movie_two.title}
          </th>
          <th>
            Streak: {(this.state.streak)}
          </th>
          <tr>
            <td>
              {this.renderPoster(movie_one.poster)}
            </td>
            <td>
              {this.renderPoster(movie_two.poster)}
            </td>
          </tr>
          <tr>
            <td>
              {movie_one.title} is rated {movie_one.imdb_rating} on IMDB
            </td>
            <td>
              {movie_two.title} is rated {this.renderButton("Higher", rands)} or {this.renderButton("Lower", rands)} than {movie_one.title}
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
