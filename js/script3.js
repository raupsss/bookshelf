document.addEventListener("DOMContentLoaded", function() {

    const submitBook = document.getElementById("submit");
    submitBook.addEventListener("click", function(event) {
        event.preventDefault();
        addBook();
        deleteForm();
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