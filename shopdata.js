//intializing dom elements
const tbody = document.getElementById("tbody");
const form = document.getElementById("form");
const saveBtn = document.getElementById("saveBtn");
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
      <td><img src="${data.images}" alt="${data.name}" width="50px" hight="50px"></td>
      <td><button class="editBtn btn btn-success" class="btn btn-primary" data-toggle="modal" data-target="#shopEditModal"> Edit</button></td>
      <td><button class="deleteBtn btn btn-danger">Delete</button></td>
    </tr>`;
  tbody.innerHTML = html;
}
const deleteShop = (id) => {
  const shopsData = document.querySelectorAll("tr");
  shopsData.forEach((shop) => {
    if (shop.getAttribute("data-id") === id) {
      shop.remove();
    }
  });
};
const editShop = (data, id) => {
  console.log(data);
  const user = document.querySelectorAll("tr");
  user.forEach((shop) => {
    if (shop.getAttribute("data-id") === id) {
      shop.children[0].innerHTML = data.name;
      shop.children[1].innerHTML = data.address;
      shop.children[2].innerHTML = data.description;
      shop.children[3].innerHTML = data.email;
      shop.children[4].innerHTML = data.phone;
      shop.children[5].innerHTML = data.latitude;
      shop.children[6].innerHTML = data.longitude;
      shop.children[7].children[0].setAttribute("src", `${data.images}`);
    } else {
      return;
    }
  });
};
db.collection("shops").onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const doc = change.doc;
    if (change.type === "added") {
      showData(doc.data(), doc.id);
    } else if (change.type === "removed") {
      deleteShop(doc.id);
    } else if (change.type === "modified") {
      editShop(doc.data(), doc.id);
    }
  });
});
tbody.addEventListener("click", (e) => {
  if (e.target.classList.contains("deleteBtn")) {
    if (confirm("Are you sure you want to delete this shop?")) {
      const id = e.target.parentElement.parentElement.getAttribute("data-id");
      const imgURL =
        e.target.parentElement.parentElement.getAttribute("data-img");
      db.collection("shops")
        .doc(id)
        .delete()
        .then((s) => {
          firebase
            .storage()
            .refFromURL(imgURL)
            .delete()
            .then(function () {
              // Delete the file
              console.log("File deleted successfully");
            })
            .catch(function (error) {
              console.log("Uh-oh, an error occurred!");
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else if (e.target.classList.contains("editBtn")) {
    const targetedid = e.target.parentElement.parentElement;
    const id = targetedid.dataset.id;
    shopInputName.value = targetedid.children[0].innerText;
    shopInputAddress.value = targetedid.children[1].innerText;
    description.value = targetedid.children[2].innerText;
    shopInputEmail.value = targetedid.children[3].innerText;
    shopInputPhone.value = targetedid.children[4].innerText;
    shopLat.value = targetedid.children[5].innerText;
    shopLong.value = targetedid.children[6].innerText;
    saveBtn.addEventListener("click", async (e) => {
      await db
        .collection("shops")
        .doc(id)
        .update({
          name: shopInputName.value,
          address: shopInputAddress.value,
          description: description.value,
          email: shopInputEmail.value,
          phone: shopInputPhone.value,
          latitude: shopLat.value,
          longitude: shopLong.value,
        })
        .then((doc) => {
          if (shopInputFile !== null) {
            const oldUrl =
              targetedid.children[7].children[0].getAttribute("src");
            const storageRef = firebase.storage().refFromURL(oldUrl);
            storageRef
              .delete()
              .then(function () {
                // File deleted successfully
                console.log("File deleted successfully");
                const storageRef = firebase.storage().ref();
                const file = shopFile.files[0];
                const name = file.name;
                const task = storageRef.child(`images/${name}`).put(file);
                task.on(
                  "state_changed",
                  (snapshot) => {
                    const progress =
                      (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    changeProg(progress);
                  },
                  (error) => {
                    console.log(error);
                  },
                  () => {
                    task.snapshot.ref.getDownloadURL().then((url) => {
                      db.collection("shops")
                        .doc(id)
                        .update({
                          images: url,
                        })
                        .then(() => {
                          targetedid.children[7].children[0].setAttribute(
                            "src",
                            url
                          );
                        });
                    });
                  }
                );
              })
              .catch(function (error) {
                console.log("Uh-oh, an error occurred!");
              });
          }
          saveBtn.setAttribute("data-dismiss", "modal");
          progressBar.style.width = "0%";
        });
    });
  }
});
function changeProg(percent) {
  progressBar.style.width = `${percent}%`;
}
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
