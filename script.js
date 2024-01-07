var baguettes = 0;
var epicbaguettes = 0;
var bakeryUnlocked = false;
var bakeries = 0;
var bakeryCM = 1.1;

/*
PROGRESSION:

Bakery

Factory


*/

function loadGame()
{
    load();

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function furnaceClick()
{
    baguettes += 10;

    updateBaguetteCounters();

    //Play Animation
    playAnimation(document.getElementById("furnace-button"), "furnaceClick");
}

function updateBaguetteCounters()
{
    //Update Baguette Counters
    document.getElementById("baguette-count").textContent = baguettes;
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;

    //Update Automated Counters
    if (document.getElementById("bakery-count") != null) {document.getElementById("bakery-count").textContent = bakeries;}
    if (document.getElementById("bakery-production") != null) {document.getElementById("bakery-production").textContent = bakeries*1;}

    //Update Automated Costs
    if (document.getElementById("bakery-cost") != null) {document.getElementById("bakery-cost").textContent = Math.floor(100*Math.pow(bakeryCM, bakeries));}

}

function goFurnace()
{
    save();
    window.location.href = 'index.html';
}

function goBakery()
{
    if (bakeryUnlocked)
    {
        save();
        window.location.href = 'bakeries.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 100)
    {
        baguettes -= 100;
        bakeryUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("bakery-locked-text"), "cantPurchase");
    }
}

function playAnimation(element, animation)
{
    if (element.classList.contains(animation)) {element.classList.remove(animation);}
    void element.offsetWidth; //Resets something idk
    element.classList.add(animation);
}

function updateUnlockedFeatures()
{
    if (bakeryUnlocked && document.getElementById("bakery-locked-text") != null)
    {
        document.getElementById("bakery-locked-text").textContent = "Go to Bakery";
        document.getElementById("bakery-locked-text").style.color = "#00ff00";
    }
}

function buyBakery() 
{
    var cost = Math.floor(100*Math.pow(bakeryCM, bakeries));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        bakeries += 1;
        playAnimation(document.getElementById("buy-bakery-button"), "furnaceClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-bakery-title"), "cantPurchase");
    }
}



function save()
{
    //Dictionary of variables
    var save = {
        baguettes: baguettes,
        epicbaguettes: epicbaguettes,
        bakeryUnlocked: bakeryUnlocked,
        bakeries: bakeries
    }

    localStorage.setItem("save", JSON.stringify(save));
    console.log("Game Saved!");
}

function load()
{
    var savedata = JSON.parse(localStorage.getItem("save"));

    if (typeof savedata.baguettes !== "undefined") {baguettes = savedata.baguettes;}else {baguettes = 0;}
    if (typeof savedata.epicbaguettes !== "undefined") {epicbaguettes = savedata.epicbaguettes;}else {epicbaguettes = 0;}
    if (typeof savedata.bakeryUnlocked !== "undefined") {bakeryUnlocked = savedata.bakeryUnlocked;}else {bakeryUnlocked = false;}
    if (typeof savedata.bakeries !== "undefined") {bakeries = savedata.bakeries;}else {bakeries = 0;}
}





//Bakery Generation
setInterval(function bakeryGenerate() {
    baguettes += 1*bakeries;
    updateBaguetteCounters();
}, 1000);

//Auto save
setInterval(function autoSave() {
    save();
}, 10000);


