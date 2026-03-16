let currentUser = "";

function signup() {
  fetch("/signup", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  }).then(()=>alert("Signup successful"));
}

function login() {
  fetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  })
  .then(res=>res.json())
  .then(data=>{
    if(!data){
      alert("User not found");
      return;
    }
    currentUser = data.username;
    loadPosts();
  })
}

function upload() {
  if(!currentUser){
    alert("Login first!");
    return;
  }

  const formData = new FormData();
  formData.append("image", image.files[0]);
  formData.append("username", currentUser);

  fetch("/post", {method: "POST", body: formData})
  .then(()=>loadPosts());
}

function loadPosts() {
  fetch("/posts")
  .then(res=>res.json())
  .then(posts=>{
    feed.innerHTML = "";
    posts.forEach(p=>{
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${p.username}</h3>
        <img src="/uploads/${p.image}" width="300">
        <p>❤️ ${p.likes}</p>
        <button onclick="like('${p._id}')">Like</button>
      `;
      feed.appendChild(div);
    });
  })
}

function like(id) {
  fetch("/like/"+id, {method:"POST"}).then(loadPosts);
}
