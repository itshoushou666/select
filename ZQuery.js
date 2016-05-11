'use strict';
function ZQuery(arg){		//主要是用来存东西的
	this.elements = [];		
	
	this.domString = '';
	
	switch(typeof arg){
		case 'function':
			domReady(arg);
			break;
		case 'string':
			if(arg.indexOf('<')!=-1){
				this.domString = arg;
			}else{
				this.elements = getEle(arg);
				this.length = this.elements.length;
			}
			break;
		default:
			this.elements.push(arg);
			break;
	}
}

ZQuery.prototype.css=function(name,value){
	if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].style[name]=value;
		}
	}else{
		if(typeof name=='string'){
			return getStyle(this.elements[0],name);
		}else{
			var json = name;
			for(var i=0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].style[name]=json[name];
				}
			}
		}
	}
	return this;
};
ZQuery.prototype.attr=function(name,value){
	if(arguments.length==2){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].setAttribute(name,value);
		}
	}else{
		if(typeof name=='string'){
			return this.elements[0].getAttribute(name);
		}else{
			var json = name;
			for(var i=0;i<this.elements.length;i++){
				for(var name in json){
					this.elements[i].setAttribute(name,json[name]);
				}
			}
		}
	}
	return this;
};

ZQuery.prototype.val=function(str){
	if(str||str==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].value=str;
		}
	}else{
		return this.elements[0].value;
	}
	return this;
};
ZQuery.prototype.html=function(str){
	if(str||str==''){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].innerHTML=str;
		}
	}else{
		return this.elements[0].innerHTML;
	}
	return this;
};
ZQuery.prototype.addClass=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className){
			var reg = new RegExp('\\b'+str+'\\b');
			if(this.elements[i].className.search(reg)==-1){
				this.elements[i].className+=' '+str;
			}
		}else{
			this.elements[i].className=str;
		}
	}
	return this;
};
ZQuery.prototype.removeClass=function(str){
	for(var i=0;i<this.elements.length;i++){
		if(this.elements[i].className){
			var reg = new RegExp('\\b'+str+'\\b','g');
			if(this.elements[i].className.search(reg)!=-1){
				this.elements[i].className = this.elements[i].className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
				if(!this.elements[i].className){
					this.elements[i].removeAttribute('class');
				}
			}
		}
	}
	return this;
};

ZQuery.prototype.animate=function(json,options){
	for(var i=0;i<this.elements.length;i++){
		move(this.elements[i],json,options);
	}
	return this;
};

;'click mouseover mouseout dblclick contextmenu mousedown mouseup mousemove keydown keyup'.replace(/\w+/g,function(str){
	ZQuery.prototype[str]=function(fn){
		for(var i=0;i<this.elements.length;i++){
			addEvent(this.elements[i],str,fn);
		}
	};
});

ZQuery.prototype.eq=function(n){
	return $(this.elements[n]);
};
ZQuery.prototype.get=function(n){
	return this.elements[n];
};
ZQuery.prototype.index=function(){
	var aSibling = this.elements[0].parentNode.children;
	for(var i=0;i<aSibling.length;i++){
		if(aSibling[i]==this.elements[0]){
			return i;
		}
	}
};
ZQuery.prototype.insertAfter=function(str){
	var aParent = getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('afterEnd',this.domString);
	}
	return this;
};
ZQuery.prototype.prependTo=function(str){
	var aParent = getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('afterBegin',this.domString);
	}
	return this;
};
ZQuery.prototype.insertBefore=function(str){
	var aParent = getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
	}
	return this;
};
ZQuery.prototype.appendTo=function(str){
	var aParent = getEle(str);
	for(var i=0;i<aParent.length;i++){
		aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
	}
	return this;
};
ZQuery.prototype.remove=function(){
	for(var i=0;i<this.elements.length;i++){
		this.elements[i].parentNode.removeChild(this.elements[i]);
	}
	return this;
};

ZQuery.prototype.mouseenter=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseover',function(ev){
			var oFrom = ev.fromElement||ev.relatedTarget;
			if(this.contains(oFrom))return;
			fn&&fn.apply(this,arguments);
		});
	}
};
ZQuery.prototype.mouseleave=function(fn){
	for(var i=0;i<this.elements.length;i++){
		addEvent(this.elements[i],'mouseout',function(ev){
			var oTo = ev.toElement||ev.relatedTarget;
			if(this.contains(oTo))return;
			fn&&fn.apply(this,arguments);
		});
	}
};
ZQuery.prototype.hover=function(fn1,fn2){
	this.mouseenter(fn1);
	this.mouseleave(fn2);
};
ZQuery.prototype.toggle=function(){
	var _this = this;
	var arg = arguments;
	for(var i=0;i<this.elements.length;i++){
		(function(count){
			addEvent(_this.elements[i],'click',function(){
				arg[count%arg.length].apply(this,arguments);
				count++;
			});
		})(0);
	}
};

function $(arg){
	return new ZQuery(arg);
}
$.ajax=function(json){
	ajax(json);
};
$.jsonp=function(json){
	jsonp(json);
};

$.fn = ZQuery.prototype;
$.fn.extend=function(json){
	for(var name in json){
		ZQuery.prototype[name]=json[name];
	}
};


function jsonp(json){
	json = json || {};
	if(!json.url)return;
	json.cbName = json.cbName||'cb';
	json.data = json.data||{};
	
	json.data[json.cbName] = 'show'+Math.random();
	json.data[json.cbName] = json.data[json.cbName].replace('.','');
	
	var arr = [];
	for(var i in json.data){
		arr.push(i+'='+encodeURIComponent(json.data[i]));
	}
	var str = arr.join('&');
	
	window[json.data[json.cbName]]=function(result){
		json.success&&json.success(result);
		oH.removeChild(oS);
		window[json.data[json.cbName]]=null;
	};
	var oH = document.getElementsByTagName('head')[0];
	var oS = document.createElement('script');
	oS.src=json.url+'?'+str;
	oH.appendChild(oS);
}


function json2url(json){
	var arr = [];
	for(var name in json){
		arr.push(name+'='+encodeURIComponent(json[name]));
	}
	return arr.join('&');
}
function ajax(json){
	json = json||{};
	if(!json.url)return;
	json.data = json.data||{};
	json.type = json.type||'get';
	
	
	if(window.XMLHttpRequest){
		var oAjax = new XMLHttpRequest();
	}else{
		var oAjax = new ActiveXObject('Microsoft.XMLHTTP');
	}
	
	switch(json.type.toLowerCase()){
		case 'get':
			oAjax.open('GET',json.url+'?'+json2url(json.data),true);
			oAjax.send();
			break;
		case 'post':
			oAjax.open('POST',json.url,true);
			oAjax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
			oAjax.send(json2url(json.data));
			break;
	}
	oAjax.onreadystatechange=function(){
		if(oAjax.readyState==4){
			if(oAjax.status>=200&&oAjax.status<300||oAjax.status==304){
				json.success&&json.success(oAjax.responseText);
			}else{
				json.error&&json.error(oAjax.status);
			}
		}
	};
}
function addEvent(obj,sEv,fn){
	if(obj.addEventListener){
		obj.addEventListener(sEv,function(ev){
			var oEvent = ev||event;
			if(fn.call(obj,oEvent)==false){
				oEvent.cancelBubble=true;
				oEvent.preventDefault();
			}
		},false);
	}else{
		obj.attachEvent('on'+sEv,function(ev){
			var oEvent = ev||event;
			if(fn.call(obj,oEvent)==false){
				oEvent.cancelBubble=true;
				return false;
			}
		});
	}
}


function getStyle(obj,sName){
	return (obj.currentStyle||getComputedStyle(obj,false))[sName];
}

function move(obj,json,options){
	options = options||{};
	options.duration = options.duration||700;
	options.easing = options.easing||'linear';
	
	var start = {};
	var dis = {};
	for(var name in json){
		start[name] = parseFloat(getStyle(obj,name));
		if(isNaN(start[name])){
			switch(name){
				case 'width':
					start[name] = obj.offsetWidth;
					break;
				case 'height':
					start[name] = obj.offsetHeight;
					break;
				case 'left':
					start[name] = obj.offsetLeft;
					break;
				case 'top':
					start[name] = obj.offsetTop;
					break;
				case 'opacity':
					start[name] = 1;
					break;
				case 'borderWidth':
					start[name] = 0;
					break;
			}
		}
		dis[name] = json[name]-start[name];
	}
	var count = Math.floor(options.duration/30);
	var n =0;
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		n++;
		for(var name in json){
			switch(options.easing){
				case 'linear':
					var cur = start[name]+dis[name]*n/count;
					break;
				case 'easeIn':
					var a = n/count;
					var cur = start[name]+dis[name]*Math.pow(a,3);
					break;
				case 'easeOut':
					var a = 1-n/count;
					var cur = start[name]+dis[name]*(1-Math.pow(a,3));
					break;
			}
			if(name=='opacity'){
				obj.style.opacity=cur;
				obj.style.filter='alpha(opacity:'+cur*100+')';
			}else{
				obj.style[name]=cur+'px';
			}
		}
		if(n==count){
			clearInterval(obj.timer);
			options.complete&&options.complete();
		}
	},30);
}

function domReady(fn){
	if(document.addEventListener){
		document.addEventListener('DOMContentLoaded',function(){
			fn&&fn();
		},false);
	}else{
		document.attachEvent('onreadystatechange',function(){
			if(document.readyState=='complete'){
				fn&&fn();
			}
		});
	}
}
function getByClass(oParent,sClass){
	if(oParent.getElementsByClassName){
		return oParent.getElementsByClassName(sClass);
	}else{
		var aResult = [];
		var aEle = oParent.getElementsByTagName('*');
		var re = new RegExp('\\b'+sClass+'\\b');
		for(var i=0;i<aEle.length;i++){
			if(aEle[i].className.search(re)){
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	}
}
function getByStr(aParent,str){
	var aChild = [];
	for(var i=0;i<aParent.length;i++){
		switch(str.charAt(0)){
			case '#':
				var obj = document.getElementById(str.substring(1));
				aChild.push(obj);
				break;
			case '.':
				var aEle = getByClass(aParent[i],str.substring(1));
				for(var j=0;j<aEle.length;j++){
					aChild.push(aEle[j]);
				}
				break;
			default:
				if(/\w+\:\w+(\(\d+\))?/.test(str)){//li:first  li:eq(2) \w+\:\w+(\(\d+\))?
					var aStr = str.split(/\:|\(|\)/);
					var aEle = aParent[i].getElementsByTagName(aStr[0]);
					switch(aStr[1]){
						case 'first':
							aChild.push(aEle[0]);
							break;
						case 'last':
							aChild.push(aEle[aEle.length-1]);
							break;
						case 'eq':
							for(var j=0;j<aEle.length;j++){
								if(j==aStr[2]){
									aChild.push(aEle[j]);
								}
							}
							break;
						case 'lt':
							for(var j=0;j<aStr[2];j++){
								aChild.push(aEle[j]);
							}
							break;
						case 'gt':
							for(var j=parseInt(aStr[2])+1;j<aEle.length;j++){
								aChild.push(aEle[j]);
							}
							break;
						case 'even':
							for(var j=0;j<aEle.length;j+=2){
								aChild.push(aEle[j]);
							}
							break;
						case 'odd':
							for(var j=1;j<aEle.length;j+=2){
								aChild.push(aEle[j]);
							}
							break;
					}
				}else if(/\w+\[\w+=\w+\]/.test(str)){//input[type=button] \w+\[\w+=\w+\]
					var aStr = str.split(/\[|=|\]/);
					var aEle = aParent[i].getElementsByTagName(aStr[0]);
					for(var j=0;j<aEle.length;j++){
						if(aEle[j].getAttribute(aStr[1])==aStr[2]){
							aChild.push(aEle[j]);
						}
					}
				}else if(/\w+\.\w+/.test(str)){//li.on		\w+\.\w+
					var aStr = str.split('.');
					var aEle = aParent[i].getElementsByTagName(aStr[0]);
					var re = new RegExp('\\b'+aStr[1]+'\\b');
					for(var j=0;j<aEle.length;j++){
						if(aEle[j].className.search(re)){
							aChild.push(aEle[j]);
						}
					}
				}else{
					var aEle = aParent[i].getElementsByTagName(str);
					for(var j=0;j<aEle.length;j++){
						aChild.push(aEle[j]);
					}
				}
				break;
		}
	}
	return aChild;
}
function getEle(str){
	var arr = str.replace(/^\s+|\s+$/g,'').split(/\s+/);
	var aParent = [document];	//默认刚上来的时候没有父级用document
	var aChild = [];
	for(var i=0;i<arr.length;i++){
		aChild = getByStr(aParent,arr[i]);
		//每次获取到的结果都是下一次获取的父级
		aParent = aChild;
	}
	return aChild;
}