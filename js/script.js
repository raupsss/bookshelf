const STORAGE_KEY = "BOOKSHELF_DATA";

let bookshelfData = [];

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Sorry, your browser does not support local storage");
        return false
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(bookshelfData);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event("ondatasaved"));
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null)
        bookshelfData = data;
    document.dispatchEvent(new Event("ondataloaded"));
}

function updateDataToStorage() {
    if (isStorageExist())
        saveData();
}

function createBookObject(title, author, year, isCompleted) {
    return {
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    };
}

function findBook(bookId) {
    for (book of bookshelfData) {
        if (book.id === bookId) return book;
    }
    return null;
}

function findBookIndex(bookId) {
    let index = 0
    for (book of bookshelfData) {
        if (book.id === bookId)
            return index;

        index++;
    }

    return -1;
}

function refreshData() {
    const findTitle = document.getElementById("findBookTitle").value;
    const listUnread = document.getElementById(LIST_UNREAD);
    const listDone = document.getElementById(LIST_DONE);
    listUnread.innerHTML = '';
    listDone.innerHTML = '';
    for (book of bookshelfData) {
        if (findTitle != '' && book.title != findTitle) {
            continue;
        }
        const newBook = makeReadingList(book.title, book.author, book.year, book.isCompleted);
        newBook[ID_BOOK] = book.id;

        if (book.isCompleted) {
            listDone.append(newBook);
        } else {
            listUnread.append(newBook);
        }
    }
}


const LIST_UNREAD = "listUnread";
const LIST_DONE = "listDone";
const ID_BOOK = "idBook";

function makeReadingList(title, author, year, isCompleted) {
    const bookTitle = document.createElement("h2");
    const titleText = document.createElement("span");
    titleText.classList.add("title_book");
    titleText.innerText = title;
    bookTitle.append(titleText);

    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = "Author : ";
    const authorText = document.createElement("span");
    authorText.classList.add("author_book");
    authorText.innerText = author;
    bookAuthor.append(authorText);

    const bookYear = document.createElement("p");
    bookYear.innerText = "Year : ";
    const yearText = document.createElement("span");
    yearText.classList.add("year_book");
    yearText.innerText = year;
    bookYear.append(yearText);

    const textContainer = document.createElement("div");
    textContainer.classList.add("content");
    textContainer.append(bookTitle, bookAuthor, bookYear);

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textContainer);

    if (isCompleted) {
        container.append(createUnreadButton(), createDeleteButton());
    } else {
        container.append(createDoneButton(), createDeleteButton());
    }
    return container;
}

function addBook() {
    const listUnread = document.getElementById(LIST_UNREAD);
    const listDone = document.getElementById(LIST_DONE);
    const checkType = document.getElementById("inputCheckbox");

    const title = document.getElementById("inputTitle").value;
    const author = document.getElementById("inputAuthor").value;
    const year = document.getElementById("inputYear").value;

    if (!checkType.checked) {
        const listBaca = makeReadingList(title, author, year, false);
        const objekBuku = createBookObject(title, author, year, false);
        listBaca[ID_BOOK] = objekBuku.id;
        bookshelfData.push(objekBuku);
        listUnread.append(listBaca);
    } else {
        const listBaca = makeReadingList(title, author, year, true);
        const objekBuku = createBookObject(title, author, year, true);
        listBaca[ID_BOOK] = objekBuku.id;
        bookshelfData.push(objekBuku);
        listDone.append(listBaca);
    }
    updateDataToStorage();
}

function deleteForm() {
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputAuthor").value = "";
    document.getElementById("inputYear").value = "";
    document.getElementById("inputCheckbox").checked = false;
    document.querySelector(".status").innerHTML = "<strong> Unread</strong>";
}

function makeButton(buttonTypeClass, eventListener) {
    const tombol = document.createElement("button");
    tombol.innerHTML = `<img src="img/${buttonTypeClass}.svg" alt="${buttonTypeClass}">`
    tombol.addEventListener("click", function (event) {
        eventListener(event);
    });
    return tombol;
}

function addBookDone(elemenBuku) {
    const bookTitle = elemenBuku.querySelector(".title_book").innerText;
    const bookAuthor = elemenBuku.querySelector(".author_book").innerText;
    const bookYear = elemenBuku.querySelector(".year_book").innerText;

    const newBook = makeReadingList(bookTitle, bookAuthor, bookYear, true);
    const listDone = document.getElementById(LIST_DONE);
    const book = findBook(elemenBuku[ID_BOOK]);

    book.isCompleted = true;
    newBook[ID_BOOK] = book.id;
    listDone.append(newBook);

    elemenBuku.remove();

    updateDataToStorage();
}

function undoBookDone(elemenBuku) {
    const bookTitle = elemenBuku.querySelector(".title_book").innerText;
    const bookAuthor = elemenBuku.querySelector(".author_book").innerText;
    const bookYear = elemenBuku.querySelector(".year_book").innerText;

    const newBook = makeReadingList(bookTitle, bookAuthor, bookYear, false);
    const listUnread = document.getElementById(LIST_UNREAD);

    const book = findBook(elemenBuku[ID_BOOK]);
    book.isCompleted = false;
    newBook[ID_BOOK] = book.id;
    listUnread.append(newBook);

    elemenBuku.remove();

    updateDataToStorage();
}

function createDoneButton() {
    return makeButton("checked", function (event) {
        const parent = event.target.parentElement;
        addBookDone(parent.parentElement);
    });
}

function deleteBookDone(elemenBuku) {

    const dialog = confirm("DO YOU WANT TO REMOVE FROM THE LIST ?");
    if (dialog) {
        const posisiBuku = findBookIndex(elemenBuku[ID_BOOK]);
        bookshelfData.splice(posisiBuku, 1);
        elemenBuku.remove();
        updateDataToStorage();
    }
    else {
        updateDataToStorage();
    }
}

function createDeleteButton() {
    return makeButton("trash", function (event) {
        const parent = event.target.parentElement;
        deleteBookDone(parent.parentElement);
    });
}

function createUnreadButton() {
    return makeButton("restart", function (event) {
        const parent = event.target.parentElement;
        undoBookDone(parent.parentElement);
    });
}

function searchBook() {
    const searchBook = document.getElementById("findBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll(".book_item");
    for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            bookItem[i].style.display = "";
        } else {
            bookItem[i].style.display = "none";
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {

    const submitBook = document.getElementById("submit");
    submitBook.addEventListener("click", function (event) {
        event.preventDefault();
        addBook();
        deleteForm();
    });

    const inputSearchBook = document.getElementById("findBook");
    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
      });
    
      inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
      });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener("ondatasaved", () => {
    console.log("Data saved successfully");
});
document.addEventListener("ondataloaded", () => {
    refreshData();
});

const checkType = document.getElementById("inputCheckbox");
checkType.addEventListener("click", () => {
    if (checkType.checked) {
        document.querySelector(".status").innerHTML = "<strong> Done</strong>";

    } else {
        document.querySelector(".status").innerHTML = "<strong> Unread</strong>";

    }
});