function getCookie(e){let t=e+"=",i=decodeURIComponent(document.cookie).split(";");for(let n=0;n<i.length;n++){let o=i[n];for(;" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}
function setCookie(e,t,i){let n=new Date;n.setTime(n.getTime()+864e5*i);let o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"}
async function get_session(){
    var e="";
    e=await fetch("http://zero-network.duckdns.org/analytics/",{headers:{Accept:"application/json"}})
    .then(e=>e.json());
    setCookie("znid",e.znid,1)
    $("#session").text(e.znid)
}
var znid=getCookie("znid")
znid?($("#session").text(znid)):get_session()