import { useEffect, useRef, useState } from 'react';
import StarRating from './StarRating';

const average = (arr) =>
	arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

//This is the key for the API
const KEY = '6e6f5a06';

export default function App() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);
	//Creating a state variable for a loading state (whenever it takes a while for the fetchMovies to load, this will pop up)
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedId, setSelectedId] = useState(null);
	// const [watched, setWatched] = useState([]);
	const [watched, setWatched] = useState(() => {
		try {
			const storedValue = localStorage.getItem('watched');
			return storedValue ? JSON.parse(storedValue) : [];
		} catch {
			return [];
		}
	});

	function handleSelectMovie(id) {
		setSelectedId((selectedId) => (id === selectedId ? null : id));
	}

	function handleCloseMovie() {
		setSelectedId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);

		// localStorage.setItem('watched', JSON.stringify([...watched, movie]));
	}

	function handleDeleteWatched(id) {
		setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
	}

	useEffect(
		function () {
			localStorage.setItem('watched', JSON.stringify(watched));
		},
		[watched]
	);

	//useEffect Hook. The point of useEffect hooks is to give us a place to safely write side effects.
	//If you passed in the setMovies or setWatched state, It would create am infinite loop.
	//Note, the useEffect needs to be imported at the top w/ useState.
	//We dont store useEffect anywhere instead we just pass in a function and that function is then called our effect,
	//And it contains the code that we want to register as a side effect to be executed at a certain time.
	//The [] is needed because it specifies that it will only run on mount. So it will only run when the App component renders for the very first time.
	// useEffect(function () {
	// 	fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=Fury`)
	// 		.then((res) => res.json())
	// 		.then((data) => setMovies(data.Search));
	// }, []);

	//Using an ASYNC function:
	//We dont use .then(), we assign response to await the fetch and then assign data to .json the response.
	//Notice we have to call fetchMovies after we declared it so that it can work and run.
	//Notice if you try to console.log(movies) from the movies state up above, it will be an empty array still.
	//Setting state is asynchronous so as you know console.log()'s will execute before anything else.
	useEffect(
		function () {
			const controller = new AbortController();

			async function fetchMovies() {
				//This will indicate to our UI that loading is happening and that you can render that indicator.

				try {
					//Notice when we put query as our search results into the API, we gave to at the bottom include query or else this wont work.
					setIsLoading(true);
					setError('');
					const res = await fetch(
						`https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
						{ signal: controller.signal }
					);

					//Handling Errors:
					if (!res.ok) throw new Error('Something went wrong...');

					const data = await res.json();
					if (data.Response === 'False') throw new Error('Movie not found');

					setMovies(data.Search);
					setError('');
				} catch (err) {
					//err.message is the string "Something went wrong..."
					if (err.name !== 'AbortError') {
						setError(err.message);
					}
				} finally {
					//We are returning isLoading back to false when everything above is finished and ready to load to the screen.
					//The finally makes sure that this code will run
					setIsLoading(false);
				}
			}

			if (!query.length) {
				setMovies([]);
				setError('');
				return;
			}

			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return (
		<>
			<NavBar>
				<Search query={query} setQuery={setQuery} />
				<NumResults movies={movies} />
			</NavBar>

			<Main>
				{/* <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box> */}
				{isLoading && <Loader />}
				{!isLoading && !error && (
					<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
				)}
				{error && <ErrorMessage message={error} />}

				<Box>
					{selectedId ? (
						<MovieDetails
							selectedId={selectedId}
							onCloseMovie={handleCloseMovie}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedMoviesList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
				</Box>
			</Main>
		</>
	);
}

function ErrorMessage({ message }) {
	return <p className="error">{message}</p>;
}
function Loader() {
	return <p className="loader">Loading...</p>;
}

function NavBar({ children }) {
	return (
		<nav className="nav-bar">
			<Logo />
			{children}
		</nav>
	);
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>Screenly</h1>
		</div>
	);
}

function Search({ query, setQuery }) {
	const inputElement = useRef(null);

	useEffect(function () {
		inputElement.current.focus();
	}, []);

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={(e) => setQuery(e.target.value)}
			ref={inputElement}
		/>
	);
}

function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

function MovieList({ movies, onSelectMovie }) {
	return (
		<ul className="list list-movies">
			{movies?.map((movie) => (
				<Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
			))}
		</ul>
	);
}

function Movie({ movie, onSelectMovie }) {
	return (
		<li onClick={() => onSelectMovie(movie.imdbID)}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
	const watchedUserRating = watched.find(
		(movie) => movie.imdbID === selectedId
	)?.userRating;

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ').at(0)),
			userRating,
		};

		onAddWatched(newWatchedMovie);
		onCloseMovie();
	}

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);
				const res = await fetch(
					`https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
				);
				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			getMovieDetails();
		},
		[selectedId]
	);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return function () {
				document.title = 'Screenly';
			};
		},
		[title]
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovie}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie} movie`}></img>
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐️</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>

					<section>
						<div className="rating">
							{!isWatched ? (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button className="btn-add" onClick={handleAdd}>
											+ Add to list
										</button>
									)}{' '}
								</>
							) : (
								<p>You rated this movie {watchedUserRating}/10 ⭐️</p>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched.map((movie) => movie.userRating));
	const avgRuntime = average(watched.map((movie) => movie.runtime));

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating.toFixed(2)}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(2)} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
	return (
		<ul className="list">
			{watched.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>

				<button
					className="btn-delete"
					onClick={() => onDeleteWatched(movie.imdbID)}
				>
					X
				</button>
			</div>
		</li>
	);
}
