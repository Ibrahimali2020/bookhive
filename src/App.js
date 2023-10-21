import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import './index.css';
import Spinner from './Spinner';

const KEY = 'eAfkn7M4CldoIVGAURoKLtaUR3b1pGKu'

export default function App() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('hardcover-fiction')
  const [searchInput, setSearchInput] = useState('')
  const [filteredBooks, setFilteredBooks] = useState([]);



  useEffect(() => {
    const controller = new AbortController();

    async function getBooks(query) {
      setIsLoading(true);
      setError('');

      try {

        const res = await fetch(`https://api.nytimes.com/svc/books/v3/lists/current/${query}.json?api-key=${KEY}`, { signal: controller.signal });

        if (res.status === 429) {
          setError('Too many requests. Please try again later.');
        } else {
          const data = await res.json();
          setBooks(data.results.books);
          setError('');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    getBooks(query);

    return function () {
      controller.abort();
    }
  }, [query]);



  function handleCategorySelect(category) {
    if (category === 'Hardcover Fiction') setQuery('hardcover-fiction')
    if (category === 'Paperback Nonfiction') setQuery('paperback-nonfiction')
    if (category === 'E-Book Fiction') setQuery('e-book-fiction')
    if (category === 'E-Book Nonfiction') setQuery('e-book-nonfiction')

    setSearchInput('');
    setFilteredBooks([]);
  };


  function handleSearchInput(e) {
    const searchText = e.target.value.toLowerCase();
    setSearchInput(e.target.value);

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(searchText)
    );

    setFilteredBooks(filteredBooks);
  }

  return (
    <div className="App">
      <Header>
        <Logo />
        <SearchBar searchInput={searchInput} onSearch={handleSearchInput} />
        <UserActions />
      </Header>
      <Category
        onCategorySelect={handleCategorySelect}
        query={query}
      />
      <Main query={query}>
        {isLoading && <Spinner />}
        {!isLoading && !error && <Books books={filteredBooks.length ? filteredBooks : books} />}
        {error && <Error message={error} />}
      </Main>

      <Footer />
    </div>
  );
}

function Header({ children }) {
  return <header>{children}</header>
}

function Logo() {
  return <div className="logo">
    <span className="book">Book</span>
    <span className="hive">Hive</span>
  </div>
}

function SearchBar({ searchInput, onSearch }) {
  return <div className="search-bar">
    <input
      type="text"
      placeholder="Search for books"
      value={searchInput}
      onChange={(e) => onSearch(e)}
    />
    <button type="submit"><FontAwesomeIcon icon={faSearch} /></button>
  </div>
}

function UserActions() {
  return <div className="user-actions">
    <a href="#" className="login">Login</a>
    <div className="cart">
      <FontAwesomeIcon icon={faShoppingCart} />
      Cart
    </div>
  </div>
}


function Category({ onCategorySelect }) {
  const categories = [
    'Hardcover Fiction',
    'Paperback Nonfiction',
    'E-Book Fiction',
    'E-Book Nonfiction',
  ];

  const [selectedCategory, setSelectedCategory] = useState('Hardcover Fiction');

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <div className="category">
      <h2>Categories</h2>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>
            <button
              className={`category-button ${selectedCategory === category ? 'selected' : ''}`}
              onClick={() => handleCategoryClick(category)}
            >
              {category}
            </button>
          </li>
        ))}
      </ul>
      <button className='btn-authors'>Authors</button>
    </div>
  );
}



function Main({ children, query }) {
  return <main>
    <h2 className="section-title">This Week's Best Selling {query === 'hardcover-fiction' && 'Hardcover Fiction'}
      {query === 'paperback-nonfiction' && 'Paperback Nonfiction'}
      {query === 'e-book-fiction' && 'E-Book Fiction'}
      {query === 'e-book-nonfiction' && 'E-Book Nonfiction'} Books</h2>
    {children}
  </main>
}

function Books({ books }) {
  return <div className='books-container'>
    {books.map(book => <Book book={book} key={book.title} />)}
  </div>
}

function Book({ book }) {
  return <div className='book'>
    <img
      src={book.book_image}
      alt=""
      style={{
        width: book.book_image_width,
        height: book.book_image_height,
      }} />
    <h3>{book.title}</h3>
    <p>{book.description}</p>
    <button className="add-to-cart-button">View</button>
  </div>
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Books</a></li>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>Email: contact@bookhive.com</p>
          <p>Phone: +123-456-7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2023 BookHive. All rights reserved.</p>
      </div>
    </footer>
  );
}


function Error({ message }) {
  return (
    <div className="error">
      <p className="error-message">{message}</p>
    </div>
  );
}





