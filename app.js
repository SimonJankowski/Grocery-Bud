// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submmitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

const deleteBtn = document.querySelector(".delete-btn")

// edit option
let editElement;
let editFlag = false;
let editId = "";


// ****** FUNCTIONS **********
const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  if (!value) {
  }
  const id = new Date().getTime().toString();
  if (value && !editFlag) {
    createListItem(id,value);
    displayAlert("item added to the list", "success")
    container.classList.add("show-container")
    addToLocalStorage(id,value)
    setBackToDefault();
  } else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    setBackToDefault();
    editLocalStorage(editId, value);
  } else {
    displayAlert("please enter value", "danger");
  }
};

const deleteItem = (e) =>{
    const el = e.currentTarget.parentElement.parentElement;
    const id = el.dataset.id;
    list.removeChild(el);
    if(list.children.length == 0)
    container.classList.remove("show-container")
    displayAlert("iTEM REMOVED", "danger");
    setBackToDefault();
    removeFromLocalStorage(id);
}

const editItem = (e) =>{
    const el = e.currentTarget.parentElement.parentElement;
    editElement = e.currentTarget.parentElement.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag=true;
    editId=el.dataset.id;
    submmitBtn.textContent = "edit";
}

const setBackToDefault = () => {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submmitBtn.textContent = "submit";
}

const clearItems = () => {
    const items = document.querySelectorAll("grocery-item");
    if(items.length){
        items.forEach((item)=>{
            list.removeChild(item)
        })
    }
    container.classList.remove("show-container");
    displayAlert("List cleared", "success");
    setBackToDefault();
    localStorage.removeItem("list")
}

const displayAlert = (text, action) => {
  alert.textContent = text;
  alert.classList.add(`alert-${action}`);

  setTimeout(() => {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
  }, 2000);
};
// ****** SETUP ITEMS **********
const setupItems = () => {
    let items = getLocalStorage();
    if(items.length){
        items.forEach((item)=>{
            createListItem(item.id, item.value)
        })
        container.classList.add("show-container");
    }
}

const createListItem = (id,value) => {
    const element = document.createElement("article");
    element.classList.add("grocery-item");
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
    <div class="btn-container">
      <button type="button" class="edit-btn">
        <i class="fas fa-edit"></i>
      </button>
      <button type="button" class="delete-btn">
        <i class="fas fa-trash"></i>
      </button>
    </div>`
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    list.appendChild(element);
}

// ****** EVENT LISTENERS **********
form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);

// ****** LOCAL STORAGE **********
const addToLocalStorage = (id, value) => {
    const grocery = {id, value};
    const items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
}

const removeFromLocalStorage = (id) =>{
    let items = getLocalStorage();
    items = items.filter((item)=>{
        if(item.id !==id)
         return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}

const editLocalStorage = (id, value) => {
    items = getLocalStorage();
    items = items.map((item)=>{
        if(item.id === id)
            item.value = value;
        return item;
    })
    localStorage.setItem("list", JSON.stringify(items));
}

const getLocalStorage = () => {
    return localStorage.getItem("list") 
    ? JSON.parse(localStorage.getItem("list"))
    :[];
}
