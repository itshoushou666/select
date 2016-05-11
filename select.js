'use strict';


function $ (str) {
  var arr = str.replace(/^\s+|\s+$/g, '').split(/\s+/);
  var aParent = [document];
  var aChild = [];

  for (var i = 0, len = arr.length; i < len; i++) {
    aChild = getByStr(aParent, arr[i]);
    aParent = aChild;
  }
  return aChild;
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
        if(/\w+\:\w+(\(\d+\))?/.test(str)){
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
        }else if(/\w+\[\w+=\w+\]/.test(str)){
          var aStr = str.split(/\[|=|\]/);
          var aEle = aParent[i].getElementsByTagName(aStr[0]);
          for(var j=0;j<aEle.length;j++){
            if(aEle[j].getAttribute(aStr[1])==aStr[2]){
              aChild.push(aEle[j]);
            }
          }
        }else if(/\w+\.\w+/.test(str)){
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

function getByClass (oParent, aClass) {
  if (oParent.getElementsByClassName) {
    return oParent.getElementsByClassName(aClass);
  } else {
    var result = [];
    var aEle = oParent.getElementsByTagName('*');
    var re = new RegExp('\\b'+sClass+'\\b');
    for (var i = 0, len = aEle.length; i < len; i++) {
      if (aEle[i].className.search(re)) {
        result.push(aEle[i]);
      }
    }
    return result;
  }
}