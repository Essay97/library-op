/* Model */

function Book(title, author, read) {
  this.title = title;
  this.author = author;
  this.read = read;
}

let myLibrary = JSON.parse(window.localStorage.getItem("library")) || [];
/* [
  new Book("The Hobbit", "JRR Tolkien", true),
  new Book("Harry Potter", "JK Rowling", false),
]; */

function addBookToLibrary(book) {
  if (!(book instanceof Book)) {
    throw new Error("Expected instance of Book, received " + typeof book);
  }
  myLibrary.push(book);
}

function deleteBookFromLibrary(book) {
  if (!(book instanceof Book)) {
    throw new Error("Expected instance of Book, received " + typeof book);
  }
  myLibrary = myLibrary.filter((b) => b !== book);
}

/* DOM Operations */

const booksList = document.querySelector(".books-list");
const newBookModal = document.querySelector("#modal--new-book");
const savedModal = document.querySelector("#modal--saved");
const form = document.querySelector(".form");

const cols = [1250, 1000, 760, 570];

let columnsNumber = getColumnsNumber(window.innerWidth);
window.addEventListener("resize", () => {
  columnsNumber = getColumnsNumber(window.innerWidth);
  renderLibrary();
  console.log(columnsNumber);
});

function getColumnsNumber(width) {
  for (let i = 0; i < cols.length; i++) {
    if (width >= cols[i]) {
      return 5 - i;
    }
  }

  return 1;
}

function renderBook(book) {
  const item = document.createElement("li");
  item.className = "book-card";

  const title = document.createElement("h2");
  title.className = "book-card__title";
  title.innerHTML = book.title;

  const author = document.createElement("h3");
  author.className = "book-card__author";
  author.innerHTML = book.author;

  const readToggle = document.createElement("button");
  readToggle.className = `btn ${
    book.read ? "btn--active" : "btn--inactive"
  } btn--flex-center -u-spacing-v`;
  readToggle.innerHTML = `${book.read ? "Read" : "Not read"}`;
  readToggle.addEventListener("click", () => {
    if (readToggle.classList.contains("btn--active")) {
      readToggle.classList.remove("btn--active");
      readToggle.classList.add("btn--inactive");
      readToggle.innerHTML = "Not read";
      book.read = false;
    } else {
      readToggle.classList.remove("btn--inactive");
      readToggle.classList.add("btn--active");
      readToggle.innerHTML = "Read";
      book.read = true;
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn--flex-center";
  deleteBtn.addEventListener("click", () => {
    deleteBookFromLibrary(book);
    renderLibrary();
  });
  deleteBtn.innerHTML = "Delete";

  item.appendChild(title);
  item.appendChild(author);
  item.appendChild(readToggle);
  item.appendChild(deleteBtn);

  return item;
}

function renderLibrary() {
  booksList.innerHTML = "";
  myLibrary.forEach((book) => {
    booksList.appendChild(renderBook(book));
  });

  let dummy;

  while (booksList.childElementCount % columnsNumber !== 0) {
    dummy = document.createElement("li");
    dummy.className = "book-card";
    booksList.appendChild(dummy);
  }
}

function toggleNewBookModal() {
  newBookModal.classList.toggle("-u-invisible");
}

function toggleSavedModal() {
  savedModal.classList.toggle("-u-invisible");
}

function handleSubmit(event) {
  event.preventDefault();
  const values = {};
  for (let elem of form.childNodes) {
    if (elem.nodeName === "INPUT") {
      values[elem.name] = elem.value;
    } else if (elem.nodeName === "LABEL") {
      values[elem.firstChild.name] = elem.firstChild.checked;
    }
  }
  toggleNewBookModal();

  if (values.acquisition === "true") {
    const { title, author, read } = values;
    const book = new Book(title, author, read);
    addBookToLibrary(book);
    renderLibrary();
  }

  /* Geneeral reset values */
  for (let elem of form.childNodes) {
    if (elem.nodeName === "INPUT") {
      elem.value = "";
    } else if (elem.nodeName === "LABEL") {
      elem.firstChild.checked = false;
    }
  }
  /* Reset hidden input */
  document.querySelector("#acquisition").value = false;
}

function setNewBookAcquisition() {
  const setAcquisition = document.querySelector("#acquisition");
  setAcquisition.value = true;
}

function debug() {
  console.log(myLibrary.map((b) => b.read));
}

function saveToLocalStorage() {
  window.localStorage.setItem("library", JSON.stringify(myLibrary));
  toggleSavedModal();
}

/* MAIN */

renderLibrary();
