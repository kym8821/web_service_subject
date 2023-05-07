const button = document.getElementById("test");
const form = document.getElementById("search-form");

form.addEventListener("submit", (e) =>{
  e.preventDefault();
  const name = document.getElementById("name").value;
  alert(name);
  fetch(`http://127.0.0.1:3000/search?name=${name}`)
  .then(response => response.json())
  .then((datas) => {
    const ul = document.getElementById("list");
    ul.innerHTML = "";
    if(datas.length>0){
      console.log(datas);
      datas.forEach(element => {
      var li = document.createElement("li");
      li.innerHTML = element.name;
      ul.appendChild(li);
      });
    } else{
      var li = document.createElement("li");
      li.innerHTML = "요청한 데이터가 없습니다."
      ul.appendChild(span);
    }
  });
});

button.addEventListener("click",(e) =>{
  e.preventDefault();
  alert("Hello World");
});