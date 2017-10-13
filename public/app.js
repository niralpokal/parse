(()=>{
const xhr = new XMLHttpRequest();
xhr.open('GET', '/month?month=Jan', true);
xhr.send();
xhr.onload = (e) =>{
    console.log(JSON.parse(xhr.responseText));
}
})()