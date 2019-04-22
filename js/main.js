$(document).ready(() => {
  $('#search-form').on('submit', (e) => {
    let search_text = $('#search-text').val();/*search-text로 지정했다가 에러남 : 주의하기*/
    get_movies(search_text);
    e.preventDefault(); /*reload 현상 막기*/
  });
}); /*모든 html 페이지가 화면에 뿌려지고 나서 ready안에 서술된 이벤트들이 동작 준비를 한다.

순수 자바스크립트로는 다음으로 대체 가능

document.addEventListener("DOMContentLoaded", function(){
  // Handler when the DOM is fully loaded
});
*/

function get_movies(search_text){
  axios.get(`http://www.omdbapi.com?i=tt3896198&apikey={apiKey}&s=${search_text}`).then((response) => {
      console.log(response);
      let movies = response.data.Search;
      let output = '';
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}"
              <h5>${movie.Title}</h5>
              <a onclick="movieSelected('${movie.imdbID}')" class="btn btn-primary" href="#">Movie Details</a>
            </div>
          </div>
        `;/*위 정보들은 모두 서버의 object에서 가져오고 있다.*/
      });
      $('#movies').html(output);
    }).catch((error) => {
      console.log(error);
    }); /* host가 아닌 html 파일로부터 요청을 보내면 origin 'null' has been blocked by CORS policy라는 에러와 함께 block 된다. 서버가 있는 환경에서 확인하자.
    환경  : npm install -g live-server
    live-server
     */
}
/* axios 모듈을 통한 http 통신 > ajax */

function movieSelected(id){
  sessionStorage.setItem('movieId', id);
  window.location = 'movie.html';
  return false;
}

function get_movie(){
  let movieId = sessionStorage.getItem('movieId');
  axios.get(`http://www.omdbapi.com?i=${movieId}&apikey={apiKey}`).then((response) => {
      console.log(response);/* 위에선 api와 함께 발급받은 movieId를 함께 입력하지 않으면 거부됨. 하지만 여기선 검색할 movieId를 입력해야함. */
      let movie = response.data;

      let output =`
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Genre:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Released:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Rated:</strong> ${movie.Rated}</li>
              <li class="list-group-item"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item"><strong>Director:</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>Writer:</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Actors:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Plot</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">View IMDB</a>
            <a href="index.html" class="btn btn-default">Go Back To Search</a>
          </div>
        </div>
      `;

      $('#movie').html(output);
    })
    .catch((err) => {
      console.log(err);
    });
}