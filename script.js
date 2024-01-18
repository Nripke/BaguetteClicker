var baguettes = 0;
var epicbaguettes = 0;
var researchbaguettes = 0;

/*
    Research Baguettes are hard to obtain, but provide massive boosts to production
    For each research baguette you have, they provide a passive boost to your furnace, and bakery buildings

    Furnace: 1.05x

    Bakery: 1.1x
    Market: 1.05x
    Factory: 1.03x
    ...
*/

var bakeryUnlocked = false;
var researchUnlocked = false;

var bakeries = 0;
var bakeryCM = 1.1;
var bakeryCost = 100;
var bakeryProduction = 2;

var markets = 0;
var marketCM = 1.13;
var marketCost = 1000;
var marketProduction = 15;

var factories = 0;
var factoryCM = 1.15;
var factoryCost = 12000;
var factoryProduction = 130;

var alchemyLabs = 0;
var alchemyCM = 1.175;
var alchemyCost = 180000;
var alchemyProduction = 1000;

var planets = 0;
var planetCM = 1.2;
var planetCost = 3600000;
var planetProduction = 7900;

var labs = 0;
var labCM = 2;
var labCost = 10;

var labSpeedCost = 100000;
var labSpeed = 1000; //In Milliseconds
var labSpeedUpgrades = 0;
var labSpeedCM = 1.4;
var labSpeedMultiplier = 0.99;

var clickAmount = 1;
var clickerCM = 1.2;

var researchPercent = 1; //Any number less than this will earn a research baguette from ranNum from 1-100
var researchCM = 100;

/*
PROGRESSION:

Bakery
Market
Factory
Alchemy
Planet

*/

function loadGame()
{
    load();

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function furnaceClick()
{
    baguettes += Math.floor(clickAmount*(1+.15*researchbaguettes));

    updateBaguetteCounters();

    //Play Animation
    playAnimation(document.getElementById("furnace-button"), "furnaceClick");
}

function buyFurnaceUpgrade()
{
    var cost = Math.floor(25*Math.pow(clickerCM, clickAmount));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        clickAmount += 1;
        playAnimation(document.getElementById("buy-clicker-button"), "furnaceUpgradeClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-clicker-title"), "cantPurchase");
    }
}

function buyResearchUpgrade()
{
    var cost = Math.floor(100*Math.pow(researchCM, researchPercent));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        researchPercent += 1;
        playAnimation(document.getElementById("buy-research-button"), "furnaceUpgradeClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-research-title"), "cantPurchase");
    }
}

function updateBaguetteCounters()
{
    //Update Baguette Counters
    document.getElementById("baguette-count").textContent = baguettes;
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;
    document.getElementById("researchbaguette-count").textContent = researchbaguettes;

    //Update Automated Counters
    if (document.getElementById("bakery-count") != null) {document.getElementById("bakery-count").textContent = bakeries;}
    if (document.getElementById("bakery-production") != null) {document.getElementById("bakery-production").textContent = Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(researchbaguettes, epicbaguettes+1)));}

    if (document.getElementById("market-count") != null) {document.getElementById("market-count").textContent = markets;}
    if (document.getElementById("market-production") != null) {document.getElementById("market-production").textContent = Math.floor(marketProduction*markets*(1+0.05*Math.pow(researchbaguettes, epicbaguettes+1)));}

    if (document.getElementById("factory-count") != null) {document.getElementById("factory-count").textContent = factories;}
    if (document.getElementById("factory-production") != null) {document.getElementById("factory-production").textContent = Math.floor(factoryProduction*factories*(1+0.03*Math.pow(researchbaguettes, epicbaguettes+1)));}

    if (document.getElementById("alchemy-count") != null) {document.getElementById("alchemy-count").textContent = alchemyLabs;}
    if (document.getElementById("alchemy-production") != null) {document.getElementById("alchemy-production").textContent = Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(researchbaguettes, epicbaguettes+1)));}

    if (document.getElementById("planet-count") != null) {document.getElementById("planet-count").textContent = planets;}
    if (document.getElementById("planet-production") != null) {document.getElementById("planet-production").textContent = Math.floor(planetProduction*planets*(1+0.015*Math.pow(researchbaguettes, epicbaguettes+1)));}


    if (document.getElementById("lab-count") != null) {document.getElementById("lab-count").textContent = labs;}
    if (document.getElementById("labSpeed-count") != null) {document.getElementById("labSpeed-count").textContent = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}

    //Update Automated Costs
    if (document.getElementById("bakery-cost") != null) {document.getElementById("bakery-cost").textContent = Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries));}
    if (document.getElementById("market-cost") != null) {document.getElementById("market-cost").textContent = Math.floor(marketCost*Math.pow(marketCM, markets));}
    if (document.getElementById("factory-cost") != null) {document.getElementById("factory-cost").textContent = Math.floor(factoryCost*Math.pow(factoryCM, factories));}
    if (document.getElementById("alchemy-cost") != null) {document.getElementById("alchemy-cost").textContent = Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs));}
    if (document.getElementById("planet-cost") != null) {document.getElementById("planet-cost").textContent = Math.floor(planetCost*Math.pow(planetCM, planets));}

    if (document.getElementById("lab-cost") != null) {document.getElementById("lab-cost").textContent = Math.floor(labCost*Math.pow(labCM, labs));}
    if (document.getElementById("labSpeed-cost") != null) {document.getElementById("labSpeed-cost").textContent = Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades));}

    //Update Furnace Information
    if (document.getElementById("furnace-cost") != null) {document.getElementById("furnace-cost").textContent = Math.floor(25*Math.pow(clickerCM, clickAmount));}

    //Update Research Information
    if (document.getElementById("research-upgrade-cost") != null) {document.getElementById("research-upgrade-cost").textContent = Math.floor(100*Math.pow(researchCM, researchPercent));}
    if (document.getElementById("research-cost") != null) {document.getElementById("research-cost").textContent = Math.floor(Math.pow(10, researchPercent));}
    if (document.getElementById("research-percent") != null) {document.getElementById("research-percent").textContent = researchPercent + "%";}
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

function goResearch()
{
    if (researchUnlocked)
    {
        save();
        window.location.href = 'research.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 10000)
    {
        baguettes -= 10000;
        researchUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("research-locked-text"), "cantPurchase");
    }
}

function researchClick()
{
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    if (baguettes < Math.pow(10, researchPercent)) {return;} //Can't afford
    
    baguettes -= Math.floor(Math.pow(10, researchPercent));
    if (randomNumber <= researchPercent) //Roll success
    {
        researchbaguettes += 1;
        playAnimation(document.getElementById("research-button"), "furnaceClick");
    }
    updateBaguetteCounters();
}

function playAnimation(element, animation)
{
    if (element == null) {return;}
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

    if (researchUnlocked && document.getElementById("research-locked-text") != null)
    {
        document.getElementById("research-locked-text").textContent = "Go to Research";
        document.getElementById("research-locked-text").style.color = "#00ff00";
    }
}

function buyBakery() 
{
    var cost = Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries));
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

function buyMarket()
{
    var cost = Math.floor(marketCost*Math.pow(marketCM, markets));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        markets += 1;
        playAnimation(document.getElementById("buy-market-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-market-title"), "cantPurchase");
    }
}

function buyFactory()
{
    var cost = Math.floor(factoryCost*Math.pow(factoryCM, factories));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        factories += 1;
        playAnimation(document.getElementById("buy-factory-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-factory-title"), "cantPurchase");
    }
}

function buyAlchemy()
{
    var cost = Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        alchemyLabs += 1;
        playAnimation(document.getElementById("buy-alchemy-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-alchemy-title"), "cantPurchase");
    }
}

function buyPlanet()
{
    var cost = Math.floor(planetCost*Math.pow(planetCM, planets));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        planets += 1;
        playAnimation(document.getElementById("buy-planet-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-planet-title"), "cantPurchase");
    }
}

function buyLab()
{
    var cost = Math.floor(labCost*Math.pow(labCM, labs));
    if (researchbaguettes >= cost)
    {
        researchbaguettes -= cost;
        labs += 1;
        playAnimation(document.getElementById("buy-lab-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-lab-title"), "cantPurchase");
    }
}

function buyLabSpeedUpgrade()
{
    var cost = Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        labSpeedUpgrades += 1;
        playAnimation(document.getElementById("buy-labSpeed-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-labSpeed-title"), "cantPurchase");
    }
}

function altarSacrifice()
{
    if (baguettes < 2000000)
    {
        //Needs to sacrifice at least 2 Million baguettes (To sacrifice 1 million)
        return;
    }

    //Sacrifice half of baguettes
    var bagSac = baguettes/2;

    baguettes -= Math.floor(bagSac);

    var sacResult = Math.floor(Math.log10(bagSac)-5)*.00001;

    epicbaguettes += sacResult;
    epicbaguettes = Math.round(epicbaguettes*100000)/100000;

    updateBaguetteCounters();
}

function save()
{
    //Dictionary of variables
    var save = {
        baguettes: baguettes,
        epicbaguettes: epicbaguettes,
        bakeryUnlocked: bakeryUnlocked,
        bakeries: bakeries,
        markets: markets,
        clickAmount: clickAmount,
        researchbaguettes: researchbaguettes,
        researchPercent: researchPercent,
        researchUnlocked: researchUnlocked,
        factories: factories,
        labs: labs,
        alchemyLabs: alchemyLabs,
        labSpeedUpgrades: labSpeedUpgrades,
        planets: planets
    }

    localStorage.setItem("save", JSON.stringify(save));
    console.log("Game Saved!");

    clearInterval(researchInterval);

    researchInterval = setInterval(function generateResearch() {
        for (let i = 0; i<labs; i++) //Auto Lab research
        {
            researchClick();
        }
        
        updateBaguetteCounters();
    }, labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades));
}

function load()
{
    var savedata = JSON.parse(localStorage.getItem("save"));

    if (typeof savedata.baguettes !== "undefined") {baguettes = savedata.baguettes;}else {baguettes = 0;}
    if (typeof savedata.epicbaguettes !== "undefined") {epicbaguettes = savedata.epicbaguettes;}else {epicbaguettes = 0;}
    if (typeof savedata.bakeryUnlocked !== "undefined") {bakeryUnlocked = savedata.bakeryUnlocked;}else {bakeryUnlocked = false;}
    if (typeof savedata.bakeries !== "undefined") {bakeries = savedata.bakeries;}else {bakeries = 0;}
    if (typeof savedata.markets !== "undefined") {markets = savedata.markets;}else {markets = 0;}
    if (typeof savedata.clickAmount !== "undefined") {clickAmount = savedata.clickAmount;}else {clickAmount = 1;}
    if (typeof savedata.researchbaguettes !== "undefined") {researchbaguettes = savedata.researchbaguettes;}else {researchbaguettes = 0;}
    if (typeof savedata.researchPercent !== "undefined") {researchPercent = savedata.researchPercent;}else {researchPercent = 1;}
    if (typeof savedata.researchUnlocked !== "undefined") {researchUnlocked = savedata.researchUnlocked;}else {researchUnlocked = false;}
    if (typeof savedata.factories !== "undefined") {factories = savedata.factories;}else {factories = 0;}
    if (typeof savedata.labs !== "undefined") {labs = savedata.labs;}else {labs = 0;}
    if (typeof savedata.alchemyLabs !== "undefined") {alchemyLabs = savedata.alchemyLabs;}else {alchemyLabs = 0;}
    if (typeof savedata.labSpeedUpgrades !== "undefined") {labSpeedUpgrades = savedata.labSpeedUpgrades;}else {labSpeedUpgrades = 0;}
    if (typeof savedata.planets !== "undefined") {planets = savedata.planets;}else {planets = 0;}
}

function reset()
{
    baguettes = 0;
    epicbaguettes = 0;
    bakeryUnlocked = false;
    bakeries = 0;
    markets = 0;
    clickAmount = 1;
    researchbaguettes = 0;
    researchPercent = 1;
    researchUnlocked = false;
    factories = 0;
    labs = 0;
    alchemyLabs = 0;
    labSpeedUpgrades = 0;
    planets = 0;

    updateBaguetteCounters();
    updateUnlockedFeatures();
}



//Auto Generation
setInterval(function generateBaguettes() {
    baguettes += Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(researchbaguettes, epicbaguettes+1)));
    baguettes += Math.floor(marketProduction*markets*(1+0.05*Math.pow(researchbaguettes, epicbaguettes+1)));
    baguettes += Math.floor(factoryProduction*factories*(1+0.03*Math.pow(researchbaguettes, epicbaguettes+1)));
    baguettes += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(researchbaguettes, epicbaguettes+1)));
    baguettes += Math.floor(planetProduction*planets*(1+0.015*Math.pow(researchbaguettes, epicbaguettes+1)));
    updateBaguetteCounters();
}, 1000);

//Research Generation
researchInterval = setInterval(function generateResearch() {
    for (let i = 0; i<labs; i++) //Auto Lab research
    {
        researchClick();
    }

    updateBaguetteCounters();
}, labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades));


//Auto save
setInterval(function autoSave() {
    save();
}, 10000);


