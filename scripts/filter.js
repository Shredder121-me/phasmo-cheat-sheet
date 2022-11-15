function getCookie(e){let t=e+"=",i=decodeURIComponent(document.cookie).split(";");for(let n=0;n<i.length;n++){let o=i[n];for(;" "==o.charAt(0);)o=o.substring(1);if(0==o.indexOf(t))return o.substring(t.length,o.length)}return""}
function setCookie(e,t,i){let n=new Date;n.setTime(n.getTime()+864e5*i);let o="expires="+n.toUTCString();document.cookie=e+"="+t+";"+o+";path=/"}

const all_evidence = ["DOTs","EMF 5","Fingerprints","Freezing","Ghost Orbs","Writing","Spirit Box"]
const all_ghosts = ["Spirit","Wraith","Phantom","Poltergeist","Banshee","Jinn","Mare","Revenant","Shade","Demon","Yurei","Oni","Yokai","Hantu","Goryo","Myling","Onryo","The Twins","Raiju","Obake","The Mimic","Moroi","Deogen","Thaye"]

var state = {"evidence":{},"speed":{"Slow":0,"Normal":0,"Fast":0},"ghosts":{}}

$(window).on('load', function() {
    var start_state = getCookie("state")

    for (var i = 0; i < all_evidence.length; i++){
        state["evidence"][all_evidence[i]] = 0
    }
    for (var i = 0; i < all_ghosts.length; i++){
        state["ghosts"][all_ghosts[i]] = 1
    }
    
    if (!start_state){
        start_state = state;
    }
    else{
        start_state = JSON.parse(start_state)
    }

    for (const [key, value] of Object.entries(start_state["ghosts"])){ 
        if (value == 0){
            fade(document.getElementById(key));
        }
        else if (value == -1){
            remove(document.getElementById(key));
        }
        else if (value == 2){
            select(document.getElementById(key));
        }
    }
    for (const [key, value] of Object.entries(start_state["evidence"])){ 
        if (value == 1){
            tristate(document.getElementById(key));
        }
        else if (value == -1){
            tristate(document.getElementById(key));
            tristate(document.getElementById(key));
        }
    }
    for (const [key, value] of Object.entries(start_state["speed"])){ 
        if (value == 1){
            $("#"+key)[0].click();
        }
    }
});

function tristate(elem){
    var checkbox = $(elem).find("#checkbox");
    var label = $(elem).find(".label");

    if (checkbox.hasClass("disabled")){
        return;
    }

    if (checkbox.hasClass("neutral")){
        checkbox.removeClass("neutral")
        checkbox.addClass("good")
    }
    else if (checkbox.hasClass("good")){
        checkbox.removeClass("good")
        checkbox.addClass("bad")
        label.addClass("strike")
    }
    else if (checkbox.hasClass("bad")){
        checkbox.removeClass("bad")
        label.removeClass("strike")
        checkbox.addClass("neutral")
    }

    filter()
}

function select(elem){
    if (!$(elem).hasClass("faded")){
        var on = $(elem).hasClass("selected")

        var selected = $(".selected");
        for (var i = 0 ; i < selected.length; i++){
            $(selected[i]).removeClass("selected");
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 1;
        }
        if ($(elem).hasClass("faded")){
            $(elem).removeClass("selected");
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 0;
        }
        else if (!on){
            $(elem).addClass("selected");
            state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 2;
        }
        setCookie("state",JSON.stringify(state),1)
        heartbeat()
    }
}

function fade(elem){
    if (state["ghosts"][$(elem).find(".ghost_name")[0].innerText] != 0){
        state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 0;
    }
    else{
        state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = 1;
    }
    $(elem).toggleClass("faded");
    $(elem).removeClass("selected");
    $(elem).find(".ghost_name").toggleClass("strike");
    setCookie("state",JSON.stringify(state),1)
    heartbeat()
}

function remove(elem){
    state["ghosts"][$(elem).find(".ghost_name")[0].innerText] = -1;
    $(elem).addClass("permhidden");
    setCookie("state",JSON.stringify(state),1)
    heartbeat()
}

function filter(){
    state["evidence"] = {}
    state["speed"] = {"Slow":0,"Normal":0,"Fast":0}
    for (var i = 0; i < all_evidence.length; i++){
        state["evidence"][all_evidence[i]] = 0
    }

    // Get values of checkboxes
    var base_speed = 1.7;
    var evi_array = [];
    var not_evi_array = [];
    var spe_array = [];
    var good_checkboxes = document.querySelectorAll(('#checkbox.good'));
    var bad_checkboxes = document.querySelectorAll(('#checkbox.bad'));
    var speed_checkboxes = document.querySelectorAll(('input[type=checkbox]:checked'));

    for (var i = 0; i < good_checkboxes.length; i++) {
        evi_array.push(good_checkboxes[i].parentElement.value);
        state["evidence"][good_checkboxes[i].parentElement.value] = 1;
    }

    for (var i = 0; i < bad_checkboxes.length; i++) {
        not_evi_array.push(bad_checkboxes[i].parentElement.value);
        state["evidence"][bad_checkboxes[i].parentElement.value] = -1;
    }

    for (var i = 0; i < speed_checkboxes.length; i++) {
        spe_array.push(speed_checkboxes[i].value);
        state["speed"][speed_checkboxes[i].value] = 1;
    }


    // Filter other evidences
    for (var i = 0; i < all_evidence.length; i++){
        var checkbox = document.getElementById(all_evidence[i]);
        $(checkbox).removeClass("block")
        $(checkbox).find("#checkbox").removeClass(["block","disabled"])
        $(checkbox).find(".label").removeClass("disabled-text")
    }

    // Get all ghosts
    var ghosts = document.getElementsByClassName("ghost_card")
    var keep_evidence = new Set();

    for (var i = 0; i < ghosts.length; i++){
        var keep = true;

        //Check for evidence
        if (evi_array.length > 0){
            var evidence = ghosts[i].getElementsByClassName("ghost_evidence")[0];
            evi_array.forEach(function (item,index){
                if(!evidence.textContent.includes(item)){
                    keep = false
                }
            });
        }

        // Check for not evidence
        if (not_evi_array.length > 0){
            var evidence = ghosts[i].getElementsByClassName("ghost_evidence")[0];
            not_evi_array.forEach(function (item,index){
                if(evidence.textContent.includes(item)){
                    keep = false
                }
            });
        }

        //Check for speed
        if (spe_array.length > 0){
            var speed = ghosts[i].getElementsByClassName("ghost_speed")[0].textContent;
            if (speed.includes('|')){
                var speeds = speed.split('|')
            }
            else if(speed.includes('-')){
                var speeds = speed.split('-')
            }
            else{
                var speeds = [speed]
            }

            var min_speed = parseFloat(speeds[0].replaceAll(" m/s",""))
            if (speeds.length > 1){
                var max_speed = parseFloat(speeds[1].replaceAll(" m/s",""))
            }
            else{
                var max_speed = min_speed
            }

            var skeep = false,nkeep = false,fkeep = false;
            spe_array.forEach(function (item,index){
                if (item === "Slow" && min_speed < base_speed){
                    skeep = true;
                }
                if (item === "Normal" && (min_speed === base_speed || max_speed === base_speed)){
                    nkeep = true;
                }
                if (item === "Fast" && max_speed > base_speed){
                    fkeep = true;
                }
            });

            if(!skeep && !nkeep && !fkeep){
                keep = false;
            }
        }

        ghosts[i].className = ghosts[i].className.replaceAll(" hidden","");
        if (!keep){
            ghosts[i].className += " hidden";
        }
        else{
            var evidence = ghosts[i].getElementsByClassName("ghost_evidence")[0];
            for (var e =0; e < evidence.textContent.split('|').length; e++){
                keep_evidence.add(evidence.textContent.split('|')[e].trim())
            }
        }
    }

    if (evi_array.length > 0){
        all_evidence.filter(evi => !keep_evidence.has(evi)).forEach(function(item){
            if (!not_evi_array.includes(item)){
                var checkbox = document.getElementById(item);
                $(checkbox).addClass("block")
                $(checkbox).find("#checkbox").removeClass(["good","bad"])
                $(checkbox).find("#checkbox").addClass(["neutral","block","disabled"])
                $(checkbox).find(".label").addClass("disabled-text")
                $(checkbox).find(".label").removeClass("strike")
            }
        })
    }

    
    setCookie("state",JSON.stringify(state),1)
    heartbeat()
}

function showGlobe(){
    $("#world").fadeToggle(400)
    reloadData()
    scale()
}

function playSound(resource){
    var snd = new Audio(resource);
    snd.play()
}

function reset(){
    var uuid = getCookie("znid")
    fetch("https://zero-network.duckdns.org/analytics/"+uuid+"/end",{method:"POST",body:JSON.stringify(state),signal: AbortSignal.timeout(8000)})
    .then((response) => {
        setCookie("znid",uuid,-1)
        setCookie("state",JSON.stringify(state),-1)
        location.reload()
    })
    .catch((response) => {
        setCookie("znid",uuid,-1)
        setCookie("state",JSON.stringify(state),-1)
        location.reload()
    });
}