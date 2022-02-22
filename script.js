//intializing dom elements
const form = document.getElementById("form");
const addShopBtn = document.getElementById("addShopBtn");
const shopInputFile = document.getElementById("shopInputFile");
const shopInputName = document.getElementById("shopInputName");
const shopInputAddress = document.getElementById("shopInputAddress");
const shopInputPhone = document.getElementById("shopInputPhoneNumber");
const shopInputEmail = document.getElementById("shopInputEmail");
const uploadBtn = document.getElementById("uploadBtn");
const description = document.getElementById("description");
const shopLat = document.getElementById("shopLat");
const shopLong = document.getElementById("shopLong");
const progressBar = document.getElementById("progressBar");
// const saveBtn = document.getElementById("saveBtn");
// Initialize Firebase
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
// preventDefault behavior of form
form.addEventListener("submit", (e) => {
  e.preventDefault();
});
// add new Shop
let imgName, imgUrl;
addShopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const shop = {
    name: shopInputName.value,
    address: shopInputAddress.value,
    phone: shopInputPhone.value,
    email: shopInputEmail.value,
    description: description.value,
    longitude: shopLong.value,
    latitude: shopLat.value,
    images: imgUrl,
    isFavorite: false,
  };
  if (
    shop.name === "" ||
    shop.address === "" ||
    shop.phone === "" ||
    shop.email === "" ||
    shop.description === "" ||
    shop.longitude === "" ||
    shop.latitude === "" ||
    imgUrl === undefined
  ) {
    alert("Please fill all the fields");
  } else {
    db.collection("shops")
      .add(shop)
      .then((doc) => {
        console.log("Document written with ID: ", doc.id);
        shop.shopId = doc.id;
        db.collection("shops")
          .doc(doc.id)
          .update({
            shopId: doc.id,
          })
          .then(() => {
            console.log("Document updated with ID: ", doc.id);
          })
          .catch((err) => {
            console.log("Error updating document: ", err);
          });
        window.location.reload();
      })
      .catch((err) => {
        console.log("Error adding document: ", err);
      });
  }
});
function uploadImg() {
  const file = shopInputFile.files[0];
  if (!file) {
    alert("Please select an image");
  } else {
    const storageRef = firebase.storage().ref().child(`images/${file.name}`);
    const task = storageRef.put(file);
    task.on(
      "state_changed",
      function progress(snapshot) {
        var percentage =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        changeProg(percentage);
      },
      function error(err) {
        console.log(err);
      },
      function complete() {
        storageRef.getDownloadURL().then(function (url) {
          console.log(url);
          imgUrl = url;
          imgName = file.name;
        });
      }
    );
  }
}
function changeProg(percent) {
  progressBar.style.width = `${percent}%`;
}

// addBtn.addEventListener("click", addData);
// function addData() {
//   const emailRegex =
//     /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/;
//  // const nameRegex = /^[a-z]([-']?[a-z]+)*( [a-z]([-']?[a-z]+)*)+$/;
//   if (nameRegex.test(fullName.value)) {
//     db.collection("admin").add({
//       fullName: fullName.value,
//       email: email.value,
//     });
//     fullName.value = "";
//     email.value = "";
//     console.log("added");
//   } else {
//     alert("Invalid Email or Name");
//   }
// }
//   } else if (!nameRegex.test(fullName.value) || !emailRegex.test(email.value)) {
//     if (!nameRegex.test(fullName.value)) {
//       fullName.classList.add("is-invalid");
//     }
//   } else if (!emailRegex.test(email.value)) {
//     email.classList.toggle("is-invalid");
//   }

// function showData(data, id) {
//   html += `<tr data-id="${id}">
//   <td>${data.fullName}</td>
//   <td>${data.email}</td>
//   <td><button class="deleteBtn btn btn-danger">Delete</button></td>
//   <td><button class="editBtn btn btn-success">Edit</button></td>
// </tr>`;
//   tbody.innerHTML = html;
// }
// const deleteUser = (id) => {
//   const user = document.querySelectorAll("tr");
//   user.forEach((user) => {
//     if (user.getAttribute("data-id") === id) {
//       user.remove();
//     }
//   });
// };
// const editUser = (data, id) => {
//   console.log(data);
//   const user = document.querySelectorAll("tr");
//   user.forEach((user) => {
//     if (user.getAttribute("data-id") === id) {
//       user.children[0].innerHTML = data.username;
//       user.children[1].innerHTML = data.password;
//     }
//   });
// };

// db.collection("users").onSnapshot((snapshot) => {
//   snapshot.docChanges().forEach((change) => {
//     const doc = change.doc;
//     if (change.type === "added") {
//       showData(doc.data(), doc.id);
//     } else if (change.type === "removed") {
//       deleteUser(doc.id);
//     } else if (change.type === "modified") {
//       editUser(doc.data(), doc.id);
//     }
//   });
// });

//delete data
// tbody.addEventListener("click", (e) => {
//   if (e.target.classList.contains("deleteBtn")) {
//     const id = e.target.parentElement.parentElement.dataset.id;
//     db.collection("users")
//       .doc(id)
//       .delete()
//       .then(function () {
//         console.log("Document successfully deleted!");
//       });
//   } else if (e.target.classList.contains("editBtn")) {
//     const targetedid = e.target.parentElement.parentElement;
//     const id = targetedid.dataset.id;
//     email.value = targetedid.children[0].innerText;
//     name.value = targetedid.children[1].innerText;
//     saveBtn.classList.remove("d-none");
//     addBtn.classList.add("d-none");
//     saveBtn.addEventListener("click", (e) => {
//       db.collection("users")
//         .doc(id)
//         .update({
//           username: email.value,
//           name: name.value,
//         })
//         .then(function () {
//           saveBtn.classList.add("d-none");
//           addBtn.classList.remove("d-none");
//           // window.location.reload();
//           email.value = "";
//           name.value = "";
//         });
//     });
//   }
// });
