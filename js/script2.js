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
}

function makeButton(buttonTypeClass, eventListener) {
    const tombol = document.createElement("button");
    tombol.classList.add(buttonTypeClass);
    tombol.addEventListener("click", function(event) {
        eventListener(event);
    });
    return tombol;
}

function addBookDone(elemenBuku) {
    const bookTitle = elemenBuku.querySelector(".title_book").innerText;
    const bookAuthor = elemenBuku.querySelector(".author_book").innerText;
    const bookYear= elemenBuku.querySelector(".year_book").innerText;

    const newBook = makeReadingList(bookTitle, bookAuthor, bookYear, true);
    const listDone = document.getElementById(LIST_DONE);
    const book = findBook(elemenBuku[ID_BOOK]);
    book.isCompleted = true;
    newBook[ID_BOOK] = book.id;
    listDone.append(newBook);
    elemenBuku.remove();
    updateDataToStorage();
}

function createDoneButton() {
    return makeButton("checklist", function(event) {
        const parent = event.target.parentElement;
        addBookDone(parent.parentElement);
    });
}

function deleteBookDone(elemenBuku) {
    const posisiBuku = findBookIndex(elemenBuku[ID_BOOK]);
    bookshelfData.splice(posisiBuku, 1);
    elemenBuku.remove();
    updateDataToStorage();
}

function createDeleteButton() {
    return makeButton("trash", function(event) {
        const parent = event.target.parentElement;
        deleteBookDone(parent.parentElement);
    });
}

function createUnreadButton() {
    return makeButton("undo", function(event) {
        const parent = event.target.parentElement;
        undoBookDone(parent.parentElement);
    });
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
