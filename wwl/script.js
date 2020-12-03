function toSrc3(){
	var scr = document.querySelector('#scr3');
	scr.scrollIntoView({behavior: "smooth"});
}
function toMenu(e) {
	var m1 = document.querySelector('#m1');
	var m2 = document.querySelector('#m2');
	var m3 = document.querySelector('#m3');
	if (e==1) {
		m1.scrollIntoView({behavior: "smooth"});
	}
	if (e==2) {
		m2.scrollIntoView({behavior: "smooth"});
	}
	if (e==3) {
		m3.scrollIntoView({behavior: "smooth"});
	}
}
function toTop() {
	var top = document.querySelector('h1');
	top.scrollIntoView({behavior: "smooth"});
}
var animEl= document.querySelector(".to-top");

document.addEventListener("scroll",()=>{
    if(scrollY>=200){
        animEl.classList.add("visible")
    } else{
        animEl.classList.remove("visible")
    }
})
