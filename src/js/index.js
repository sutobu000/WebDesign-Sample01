// console.log("js start");
/* ========================================================================
 * User settings
 * ======================================================================== */
const userSet = {
	breakpoint: 768,
	anchorLink:{
		duration: .3
	},
	wrap:{
		wrapperClass: "wrapper",
	},
	globalNav:{
		isBtnOnly: true,
		class: "gnav",
		menuBtn: "menubtn",
		openState: "data-open"
	},
	pageTop:{
		class: "pageTop",
		currentState: "data-current",
		duration: .5
	},
	slide:{
		duration: .3, // デフォルトのduration。単位秒
		value: 0, // デフォルトのスライド方向の量。単位px
		delay: .7, // デフォルトの処理実施のDelay。単位秒
		stgDur: .15, // デフォルトのstaggerのduration。単位秒
		stgVal: 0, // デフォルトのstaggerのスライド方向の量。単位px
		stgDelay: .7, // デフォルトのstaggerのDelay。単位秒
		singleClass: "js-sliSL", // gsapによるtranslateのスライド処理を追加(-left,-right,-top,-bottomで方向を指定)
		multiClass: "js-stgSL", // gsapのstaggerによるchildrenのtranslateのスライド処理を追加(-left,-right,-top,-bottomで方向を指定)
		data:{
			sliDuration: "data-sliDur", // gsapのduration (default:.3)
			sliValue: "data-sliVal", // gsapのtranslateの量 (default:20)
			sliDelay: "data-sliDelay", // 遅延時間を指定 (default:.7)
			sliFrom: "data-sliFrom", // multiのみ 開始する箇所を指定 (default:start, 他指定値:{start, center, edges, random, end)
		}
	}
}


/* ========================================================================
 * init
 * ======================================================================== */
let $html = document.getElementsByTagName("html");
let $body = document.getElementsByTagName("body");

/* --- Common variable --- */
let $wrapper = document.querySelector("."+userSet.wrap.wrapperClass);
let ww = window.innerWidth;
let wh = window.innerHeight;
let w_breakPoint = userSet.breakpoint;

let _sTop = document.documentElement.scrollTop || document.body.scrollTop;
let mousewheelevent = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';

/* --- SPメニュー --- */
let $gnav;
let $menuBtn = document.querySelector("."+userSet.globalNav.menuBtn);
let menuBtnTop;
let is_gnav = false;
let is_open = false;

if(userSet.globalNav.isBtnOnly){
	$gnav = document.querySelector("."+userSet.globalNav.class);
}

// /*--- アンカーリンク処理 --- */
// let $ancLink = document.querySelectorAll("a[href^='#']")
// let ancTopArr = [];

/* --- pageTop --- */
let $pageTop = document.querySelector("."+userSet.pageTop.class);
let is_pageTop = false;

/* --- スマホ判定 --- */
let _SP = false;
if (ww > w_breakPoint) {
	_SP = false;
} else {
	_SP = true;
}

/* --- スライドフェードイン --- */
let $sliSL = document.querySelectorAll("."+userSet.slide.singleClass);
let sliSLArr = [];
let sliSLFlagArr = [];
let sliSLTopArr = [];
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	$sliSL[sliSLCount].style.opacity = 0;
}

let $stgSL = document.querySelectorAll("."+userSet.slide.multiClass);
let stgSLArr = [];
let stgSLFlagArr = [];
let stgSLTopArr = [];
for(let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
	let $stgSLChild = $stgSL[stgSLCount].children;
	for (let stgSLChildCount = 0; stgSLChildCount < $stgSLChild.length; stgSLChildCount++) {
			$stgSLChild[stgSLChildCount].style.opacity = 0;
	}
}

/* -----------------------------------------------
 * Ready
 * ----------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
	readyInit();
});

/* -- Ready init (Loadが終わったら) -- */
let readyInit = () => {
	// console.log("init start");

	// // アンカーリンク
	// for (let ancCount = 0; ancCount < $ancLink.length; ancCount++) {
	// 	if(!$ancLink[ancCount].hasAttribute("noscroll")){
	// 		let ancObj = document.getElementById($ancLink[ancCount].getAttribute("href").slice(1));
	// 		ancTopArr[ancCount] = _sTop + ancObj.getBoundingClientRect().top
	// 		$ancLink[ancCount].addEventListener("click", function(e) {
	// 			e.preventDefault();
	// 			let href = this.getAttribute("href");
	// 			scrollAnc(href, userSet.anchorLink.duration, ancTopArr[ancCount]);
	// 			if(is_open) {
	// 				var menuBtnEvent = document.createEvent("MouseEvents");
	// 				menuBtnEvent.initEvent("click", false, true);
	// 				$menuBtn.dispatchEvent(menuBtnEvent);
	// 			}
	// 		})
	// 	}
	// }

	/* sliSL と stgSL */
	let wscroll = _sTop + wh;
	for (let i = 0; i < sliSLTopArr.length; i++) {
		if (sliSLTopArr[i] <= wscroll) { sliSLFlagArr[i] = true; sliSLAnime(sliSLArr[i]); }
	}
	for (let i = 0; i < stgSLTopArr.length; i++) {
		if (stgSLTopArr[i] <= wscroll) { stgSLFlagArr[i] = true; stgSLInAnime(stgSLArr[i]); }
	}

}


// /* -----------------------------------------------
//  * アンカークリック
//  * ----------------------------------------------- */
// let scrollAnc = ($object, $speed, $scroll) => {
// 	let hash = $object;
// 	let $target;
// 	let t_hash;
// 	let h_h = document.querySelector(".header").clientHeight; // scrollToの位置の差異を作る

// 	if(hash==="#") {
// 		t_hash = 0;
// 	} else {
// 		t_hash = $scroll;
// 	}
// 	gsap.to(window, {duration:$speed, scrollTo:t_hash-h_h});
// }

/* -----------------------------------------------
 * ページトップ スクロール
 * ----------------------------------------------- */
$pageTop.addEventListener('click', (e) => {
	e.preventDefault();
	if (!is_pageTop) {
		is_pageTop = true;
		gsap.to(window, {duration:userSet.pageTop.duration, scrollTo: 0 , onComplete: () => {is_pageTop = false;}});
	}
});

/* -----------------------------------------------
 * SP メニュー
 * ----------------------------------------------- */
$menuBtn.addEventListener('click', (e) => {
	let h_gnav = Number(window.innerHeight);
	if (!is_gnav) {
		if (!is_open) {
			is_open = true;
			$menuBtn.setAttribute(userSet.globalNav.openState,true);
			if(!userSet.globalNav.isBtnOnly){
				is_gnav = true;
				menuBtnTop = document.documentElement.scrollTop || document.body.scrollTop;
				$wrapper.style.position = "fixed";
				$wrapper.style.top = "-" + menuBtnTop + "px";
				$wrapper.style.left = 0;
				gsap.to($gnav, {duration:.3, height:h_gnav, onComplete: () => {is_gnav = false;}});
			}
		} else {
			is_open = false;
			$menuBtn.setAttribute(userSet.globalNav.openState,false);
			if(!userSet.globalNav.isBtnOnly){
				is_gnav = false;
				$wrapper.removeAttribute('style');
				window.scrollTo({top:menuBtnTop});
				gsap.to($gnav, {duration:.3, height:0, onComplete: () => {is_gnav = false;}});
			}
		}
	}
});

/* -----------------------------------------------
 * - スクロール -
 * ----------------------------------------------- */
window.addEventListener('scroll', (e) => {
	e.preventDefault();
	_sTop = document.body.scrollTop || document.documentElement.scrollTop;
	wh = window.innerHeight;
	let _sMdl = _sTop + wh / 2;
	let _sBtm = _sTop + wh;
	let diffVal = 100

	/* sliSL */
	for (let i = 0; i < sliSLArr.length; i++) {
		if (!sliSLFlagArr[i] && sliSLTopArr[i] <= _sBtm - diffVal) {
			sliSLFlagArr[i] = true;
			sliSLAnime(sliSLArr[i]);
		}
	}
	/* stgSL */
	for (let i = 0; i < stgSLArr.length; i++) {
		if (!stgSLFlagArr[i] && stgSLTopArr[i] <= _sBtm - diffVal) {
			stgSLFlagArr[i] = true;
			stgSLInAnime(stgSLArr[i]);
		}
	}

	if (_sTop > wh/2) {
		$pageTop.setAttribute(userSet.pageTop.currentState, true);
	}else{
		$pageTop.setAttribute(userSet.pageTop.currentState, false);
	}
});

/* -----------------------------------------------
 * ウィンドウ Resize
 * ----------------------------------------------- */
window.addEventListener("resize", (e) => {
	ww = window.innerWidth;
	wh = window.innerHeight;
	if (ww > w_breakPoint) {
		_SP = false;
	} else {
		_SP = true;
	}
});

/* -----------------------------------------------
 * sliSL stgSL
 * ----------------------------------------------- */
/* 単発slide */
for(let sliSLCount = 0; sliSLCount < $sliSL.length; sliSLCount++) {
	let $this = $sliSL[sliSLCount];
	sliSLArr[sliSLCount] = $this;
	sliSLFlagArr[sliSLCount] = false;
	sliSLTopArr[sliSLCount] = $this.getBoundingClientRect().top;
}
let sliSLAnime = ($obj) => {
	gsap.killTweensOf($obj);
	let SLIdur = userSet.slide.duration;
	let SLIval = userSet.slide.value;
	let SLIdelay = userSet.slide.delay;
	if($obj.getAttribute(userSet.slide.data.sliDuration)){ SLIdur = Number($obj.getAttribute(userSet.slide.data.sliDuration)); }
	if($obj.getAttribute(userSet.slide.data.sliValue)){ SLIval = Number($obj.getAttribute(userSet.slide.data.sliValue)); }
	if($obj.getAttribute(userSet.slide.data.sliDelay)){ SLIdelay = Number($obj.getAttribute(userSet.slide.data.sliDelay)); }
	if($obj.classList.contains(userSet.slide.singleClass+"-left")){
		gsap.fromTo($obj, {duration:SLIdur, x:-1*SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-left");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-right")){
		gsap.fromTo($obj, {duration:SLIdur, x:SLIval,opacity:0},{x:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-right");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-top")){
		gsap.fromTo($obj, {duration:SLIdur, y:-1*SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-top");
		}});
	}else if($obj.classList.contains(userSet.slide.singleClass+"-bottom")){
		gsap.fromTo($obj, {duration:SLIdur, y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass, userSet.slide.singleClass+"-bottom");
		}});
	}else{
		gsap.fromTo($obj, {duration:SLIdur, y:SLIval,opacity:0},{y:0,opacity:1,delay:SLIdelay,onComplete: () => {
			$obj.removeAttribute("style");
			$obj.classList.remove(userSet.slide.singleClass);
		}});
	}
}

/* 連続したslide */
for (let stgSLCount = 0; stgSLCount < $stgSL.length; stgSLCount++) {
  let $this = $stgSL[stgSLCount];
  stgSLArr[stgSLCount] = $this;
  stgSLFlagArr[stgSLCount] = false;
  stgSLTopArr[stgSLCount] = $this.getBoundingClientRect().top;
}
let stgSLInAnime = ($obj) => {
	let stgSLIdur = userSet.slide.stgDur;
	let stgSLIval = userSet.slide.stgVal;
	let stgSLIdelay = userSet.slide.stgDelay;
	let stgSLIfrom = "start"
	if($obj.getAttribute(userSet.slide.data.sliDuration)) stgSLIdur = Number($obj.getAttribute(userSet.slide.data.sliDuration));
	if($obj.getAttribute(userSet.slide.data.sliValue)) stgSLIval = Number($obj.getAttribute(userSet.slide.data.sliValue));
	if($obj.getAttribute(userSet.slide.data.sliDelay)) stgSLIdelay = Number($obj.getAttribute(userSet.slide.data.sliDelay));
	if($obj.getAttribute(userSet.slide.data.sliFrom)) stgSLIfrom = $obj.getAttribute(userSet.slide.data.sliFrom);
	if($obj.classList.contains(userSet.slide.multiClass+"-left")){
		gsap.fromTo($obj.children, {duration:stgSLIdur, x:-1*stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay, stagger:{amount:stgSLIdur,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-left");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-right")){
		gsap.fromTo($obj.children, {duration:stgSLIdur, x:stgSLIval,opacity:0},{x:0,opacity:1,delay:stgSLIdelay, stagger:{amount:stgSLIdur,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-right");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-top")){
		gsap.fromTo($obj.children, {duration:stgSLIdur, y:-1*stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:stgSLIdur,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-top");
		}});
	}else if($obj.classList.contains(userSet.slide.multiClass+"-bottom")){
		gsap.fromTo($obj.children, {duration:stgSLIdur, y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:stgSLIdur,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass, userSet.slide.multiClass+"-bottom");
		}});
	}else{
		gsap.fromTo($obj.children, {duration:stgSLIdur, y:stgSLIval,opacity:0},{y:0,opacity:1,delay:stgSLIdelay, stagger:{amount:stgSLIdur,from:stgSLIfrom}, onComplete:function(){
			for(let i = 0; i < $obj.children.length; i++){
				$obj.children[i].removeAttribute("style");
			}
			$obj.classList.remove(userSet.slide.multiClass);
		}});
	}
}
