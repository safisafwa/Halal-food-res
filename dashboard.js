const shopsCount = document.getElementById("shopsCount");
const usersCount = document.getElementById("usersCount");
const tbody = document.getElementById("tbody");
const search = document.getElementById("search");
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

db.collection("shops").onSnapshot((snapshot) => {
  let count = 0;
  snapshot.forEach((doc) => {
    count++;
  });
  shopsCount.innerHTML = count;
});
db.collection("userCollection").onSnapshot((snapshot) => {
  let count = 0;
  snapshot.forEach((doc) => {
    count++;
  });
  usersCount.innerHTML = count;
});
function showData(data, id) {
  html += `<tr data-id="${id}" data-img="${data.images}">
      <td>${data.name}</td>
      <td>${data.address}</td>
      <td style="white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 20ch;">${data.description}<a href="">see more</a></td>
      <td>${data.email}</td>
      <td>${data.phone}</td>
      <td>${data.latitude}</td>
      <td>${data.longitude}</td>
    </tr>`;
  tbody.innerHTML = html;
}
db.collection("shops").onSnapshot((snapshot) => {
  let count = 0;
  snapshot.forEach((doc) => {
    count++;
  });
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;
    if (change.type === "added" && count <= 5) {
      showData(doc.data(), doc.id);
    }
  });
});
const filterShops = (term) => {
  //fillter todos
  let trlist = document.querySelectorAll("#tbody tr");
  trlist.forEach((tr) => {
    let td = tr.querySelectorAll("td");
    if (td[0].innerText.toLowerCase().indexOf(term) > -1) {
      tr.style.display = "";
    } else {
      tr.style.display = "none";
    }
  });
};

search.addEventListener("keyup", () => {
  const term = search.value.trim();
  filterShops(term);
});
