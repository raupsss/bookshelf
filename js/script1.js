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
        if(findTitle != '' && book.title != findTitle) {
            continue;
        }
        const newBook  = makeReadingList(book.title, book.author, book.year, book.isCompleted);
        newBook[ID_BOOK] = book.id;
        
        if (book.isCompleted) {
            listDone.append(newBook);
        } else {
            listUnread.append(newBook);
        }
    }
}

