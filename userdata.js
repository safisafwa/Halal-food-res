//intializing dom elements
const tbody = document.getElementById("tbody");
const userStatus = document.getElementById("userStatus");
const search = document.getElementById("search");
//firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBL-QKpyBIHqN0-7JPnWIh299YMNPS_nTQ",
  authDomain: "halal-foods-209c9.firebaseapp.com",
  projectId: "halal-foods-209c9",
  storageBucket: "halal-foods-209c9.appspot.com",
  messagingSenderId: "930621012969",
  appId: "1:930621012969:web:a36f1d4e203e8dfbff2978",
};
let html = "";
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = app.firestore();

function showData(data, id) {
  html += `<tr data-id="${id}">
      <td><img src="${data.userImage}" width="50px" height="50px" alt="${data.fullName}" class="rounded-circle"/></td>
      <td>${data.fullName}</td>
      <td>${data.userEmail}</td>
      <td >${data.userStatus}</td>
      <td><button class="approved btn btn-success">Approved</button></td>
      <td><button class="unapproved btn btn-danger">Block</button></td>
    </tr>`;
  tbody.innerHTML = html;
}
const editUser = (data, id) => {
  const user = document.querySelectorAll("tr");
  user.forEach((user) => {
    if (user.getAttribute("data-id") === id) {
      user.children[1].innerHTML = data.fullName;
      user.children[2].innerHTML = data.userEmail;
      user.children[3].innerHTML = data.userStatus;
    }
  });
};
db.collection("userCollection").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;
    if (change.type === "added") {
      showData(doc.data(), doc.id);
    } else if (change.type === "modified") {
      editUser(doc.data(), doc.id);
    }
  });
  // approved function
  tbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("approved")) {
      if (confirm("Are you sure you want to approve this user?")) {
        const id = e.target.parentElement.parentElement.getAttribute("data-id");
        db.collection("userCollection").doc(id).update({
          isapprove: true,
          userStatus: "Approved",
        });
      }
    } else if (e.target.classList.contains("unapproved")) {
      if (confirm("Are you sure you want to block this user?")) {
        const id = e.target.parentElement.parentElement.getAttribute("data-id");
        db.collection("userCollection").doc(id).update({
          isapprove: false,
          userStatus: "Blocked",
        });
      }
    }
  });
});
const filterUsers = (term) => {
  //fillter todos
  let trlist = document.querySelectorAll("#tbody tr");
  trlist.forEach((tr) => {
    let td = tr.querySelectorAll("td");
    if (td[1].innerText.toLowerCase().indexOf(term) > -1) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
    }
  });
};

search.addEventListener("keyup", () => {
  const term = search.value.trim();
  filterUsers(term);
});
