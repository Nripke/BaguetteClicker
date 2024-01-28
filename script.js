var baguettes = 0;
var epicbaguettes = 0;
var researchbaguettes = 0;
var divinebaguettes = 0;
var baguettesGenerated = 0;

var prestiges = 0;
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
var altarUnlocked = false;

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
var planetCM = 1.21;
var planetCost = 3600000;
var planetProduction = 7900;

var tesseracts = 0;
var tesseractCM = 1.25;
var tesseractCost = 800000000;
var tesseractProduction = 60000;

var galaxies = 0;
var galaxyCM = 1.3;
var galaxyCost = 24000000000;
var galaxyProduction = 435000;

var blackholes = 0;
var blackholeCM = 1.36;
var blackholeCost = 1000000000000;
var blackholeProduction = 3500000;

var labs = 0;
var labCM = 1.5;
var labCost = 10;

var labSpeedCost = 100000;
var labSpeed = 1000; //In Milliseconds
var labSpeedUpgrades = 0;
var labSpeedCM = 1.35;
var labSpeedMultiplier = 0.9875;

var clickAmount = 1;
var clickerCM = 1.2;

var researchPercent = 1; //Any number less than this will earn a research baguette from ranNum from 1-100
var researchCM = 100;

var researchClickUpgrade = 1; //Divine upgrade, lasts through prestiges
var researchClickCM = 5;

//Interesting stat variables:
var timePlayed = 0; //In seconds
var clicks = 0;

/*
PROGRESSION:

Bakery
Market
Factory
Alchemy
Planet
Tesseract
Galaxy
Black Hole

*/

function loadGame()
{
    load();

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function format(num) 
{
    if (num < 1000) {return num;}
    const suffixes = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion"];

    const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
    const scaledNum = num / Math.pow(10, suffixIndex * 3);

    const formattedNum = scaledNum.toFixed(3).replace(/\.0$/, ''); // Remove trailing zeroes
    const suffix = suffixes[suffixIndex];

    return `${formattedNum} ${suffix}`;
}

function divineBaguetteCalculator()
{
    var db = Math.floor(Math.pow(baguettesGenerated/1000000000, 0.5));
    if (db <= 0) {return 0;}

    return db;
}

function checkPrestige()
{
    var dB = divineBaguetteCalculator();

    if (dB <= divinebaguettes)
    {
        //Can't prestige if you get no divine baguettes
        return;
    }
    //"Are you sure you want to sacrifice EVERYTHING for " + dB + " Divine Baguettes?"
    var confirm = window.confirm("Are you sure you want to sacrifice EVERYTHING for " + (dB-divinebaguettes) + " Divine Baguettes?");
    if (confirm == true) {prestige();}
}

function prestige()
{
    
    //Calculate divine baguettes
    var dB = divineBaguetteCalculator();

    if (dB <= divinebaguettes)
    {
        //Can't prestige if you get no divine baguettes
        return;
    }

    dB -= divinebaguettes;
    divinebaguettes += dB;
    prestiges += 1;

    reset();
    save();
    goFurnace();
}


function furnaceClick()
{
    baguettes += Math.floor(clickAmount*(1+.15*Math.pow(researchbaguettes, epicbaguettes+1)))*Math.floor(1+divinebaguettes/10);
    baguettesGenerated += Math.floor(clickAmount*(1+.15*Math.pow(researchbaguettes, epicbaguettes+1)))*Math.floor(1+divinebaguettes/10);
    clicks++;
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

function buyResearchClickUpgrade()
{
    var cost = Math.floor(2*Math.pow(researchClickCM, researchClickUpgrade)); //Cost in divine baguettes
    if (divinebaguettes >= cost)
    {
        divinebaguettes -= cost;
        researchClickUpgrade += 1;
        playAnimation(document.getElementById("buy-researchclick-button"), "furnaceUpgradeClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-researchclick-title"), "cantPurchase");
    }
}

function updateBaguetteCounters()
{
    var resBoost = Math.pow(researchbaguettes, epicbaguettes+1);
    var divBoost = 1+0.01*divinebaguettes;

    //Update Baguette Counters
    document.getElementById("baguette-count").textContent = format(baguettes);
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;
    document.getElementById("researchbaguette-count").textContent = format(researchbaguettes);

    document.getElementById("BPS-count").textContent = format(calculateBPS());
    document.getElementById("RBoost-count").textContent = calculateResearchBoost();

    if (document.getElementById("TP-count") != null) {document.getElementById("TP-count").textContent = timePlayed;}

    //Update Automated Counters
    if (document.getElementById("bakery-count") != null) {document.getElementById("bakery-count").textContent = bakeries;}
    if (document.getElementById("bakery-production") != null) {document.getElementById("bakery-production").textContent = format(Math.floor(bakeryProduction*bakeries*(1+0.1*resBoost)*divBoost));}

    if (document.getElementById("market-count") != null) {document.getElementById("market-count").textContent = markets;}
    if (document.getElementById("market-production") != null) {document.getElementById("market-production").textContent = format(Math.floor(marketProduction*markets*(1+0.05*resBoost)*divBoost));}

    if (document.getElementById("factory-count") != null) {document.getElementById("factory-count").textContent = factories;}
    if (document.getElementById("factory-production") != null) {document.getElementById("factory-production").textContent = format(Math.floor(factoryProduction*factories*(1+0.03*resBoost)*divBoost));}

    if (document.getElementById("alchemy-count") != null) {document.getElementById("alchemy-count").textContent = alchemyLabs;}
    if (document.getElementById("alchemy-production") != null) {document.getElementById("alchemy-production").textContent = format(Math.floor(alchemyProduction*alchemyLabs*(1+0.02*resBoost)*divBoost));}

    if (document.getElementById("planet-count") != null) {document.getElementById("planet-count").textContent = planets;}
    if (document.getElementById("planet-production") != null) {document.getElementById("planet-production").textContent = format(Math.floor(planetProduction*planets*(1+0.015*resBoost)*divBoost));}

    if (document.getElementById("tesseract-count") != null) {document.getElementById("tesseract-count").textContent = tesseracts;}
    if (document.getElementById("tesseract-production") != null) {document.getElementById("tesseract-production").textContent = format(Math.floor(tesseractProduction*tesseracts*(1+0.013*resBoost)*divBoost));}

    if (document.getElementById("galaxy-count") != null) {document.getElementById("galaxy-count").textContent = galaxies;}
    if (document.getElementById("galaxy-production") != null) {document.getElementById("galaxy-production").textContent = format(Math.floor(galaxyProduction*galaxies*(1+0.011*resBoost)*divBoost));}

    if (document.getElementById("blackhole-count") != null) {document.getElementById("blackhole-count").textContent = blackholes;}
    if (document.getElementById("blackhole-production") != null) {document.getElementById("blackhole-production").textContent = format(Math.floor(blackholeProduction*blackholes*(1+0.01*resBoost)*divBoost));}


    if (document.getElementById("lab-count") != null) {document.getElementById("lab-count").textContent = labs;}
    if (document.getElementById("labSpeed-count") != null) {document.getElementById("labSpeed-count").textContent = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}

    //Update Automated Costs
    if (document.getElementById("bakery-cost") != null) {document.getElementById("bakery-cost").textContent = format(Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries)));}
    if (document.getElementById("market-cost") != null) {document.getElementById("market-cost").textContent = format(Math.floor(marketCost*Math.pow(marketCM, markets)));}
    if (document.getElementById("factory-cost") != null) {document.getElementById("factory-cost").textContent = format(Math.floor(factoryCost*Math.pow(factoryCM, factories)));}
    if (document.getElementById("alchemy-cost") != null) {document.getElementById("alchemy-cost").textContent = format(Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs)));}
    if (document.getElementById("planet-cost") != null) {document.getElementById("planet-cost").textContent = format(Math.floor(planetCost*Math.pow(planetCM, planets)));}
    if (document.getElementById("tesseract-cost") != null) {document.getElementById("tesseract-cost").textContent = format(Math.floor(tesseractCost*Math.pow(tesseractCM, tesseracts)));}
    if (document.getElementById("galaxy-cost") != null) {document.getElementById("galaxy-cost").textContent = format(Math.floor(galaxyCost*Math.pow(galaxyCM, galaxies)));}
    if (document.getElementById("blackhole-cost") != null) {document.getElementById("blackhole-cost").textContent = format(Math.floor(blackholeCost*Math.pow(blackholeCM, blackholes)));}

    if (document.getElementById("lab-cost") != null) {document.getElementById("lab-cost").textContent = format(Math.floor(labCost*Math.pow(labCM, labs)));}
    if (document.getElementById("labSpeed-cost") != null) {document.getElementById("labSpeed-cost").textContent = format(Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades)));}

    //Update Furnace Information
    if (document.getElementById("furnace-cost") != null) {document.getElementById("furnace-cost").textContent = format(Math.floor(25*Math.pow(clickerCM, clickAmount)));}
    if (document.getElementById("furnace-count") != null) {document.getElementById("furnace-count").textContent = format(Math.floor(clickAmount*(1+.15*resBoost))*Math.floor(1+divinebaguettes/10));}

    //Update Research Information
    if (document.getElementById("research-upgrade-cost") != null) {document.getElementById("research-upgrade-cost").textContent = format(Math.floor(100*Math.pow(researchCM, researchPercent)));}
    if (document.getElementById("research-cost") != null) {document.getElementById("research-cost").textContent = format(Math.floor(Math.pow(10, researchPercent)));}
    if (document.getElementById("research-percent") != null) {document.getElementById("research-percent").textContent = researchPercent + "%";}
    if (document.getElementById("research-count") != null) {document.getElementById("research-count").textContent = researchClickUpgrade;}
    if (document.getElementById("researchclick-upgrade-cost") != null) {document.getElementById("researchclick-upgrade-cost").textContent = format(Math.floor(2*Math.pow(researchClickCM, researchClickUpgrade)));}

    //Update Altar Information
    if (document.getElementById("altar-cost") != null) {document.getElementById("altar-cost").textContent = format(Math.floor(altarCost()));}

    //Update Prestige Information
    var db = divineBaguetteCalculator();
    if (db > divinebaguettes)
    {
        db -= divinebaguettes;
    }else {
        db = 0;
    }
    if (document.getElementById("db-count") != null) {document.getElementById("db-count").textContent = format(db);}

    if (document.getElementById("db-total") != null) {document.getElementById("db-total").textContent = format(divinebaguettes);}
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

function goAltar()
{
    if (altarUnlocked)
    {
        save();
        window.location.href = 'altar.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 1000000)
    {
        baguettes -= 1000000;
        altarUnlocked = true;

        updateBaguetteCounters();
        updateUnlockedFeatures();

        save();
    }else {
        playAnimation(document.getElementById("altar-locked-text"), "cantPurchase");
    }
}

function goPrestige()
{
    save();
    window.location.href = 'prestige.html';
    return;
}

function researchClick()
{
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    if (baguettes < Math.pow(10, researchPercent)) {return;} //Can't afford
    
    baguettes -= Math.floor(Math.pow(10, researchPercent));
    if (randomNumber <= researchPercent) //Roll success
    {
        researchbaguettes += researchClickUpgrade;
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

    if (altarUnlocked && document.getElementById("altar-locked-text") != null)
    {
        document.getElementById("altar-locked-text").textContent = "Go to Epic Altar";
        document.getElementById("altar-locked-text").style.color = "#00ff00";
    }

    if (prestiges >= 1 && document.getElementById("db-text") != null)
    {
        document.getElementById("db-text").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("blackhole-container") != null)
    {
        document.getElementById("blackhole-container").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("buy-researchclick-container") != null)
    {
        document.getElementById("buy-researchclick-container").style.visibility = "visible";
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

function buyTesseract()
{
    var cost = Math.floor(tesseractCost*Math.pow(tesseractCM, tesseracts));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        tesseracts += 1;
        playAnimation(document.getElementById("buy-tesseract-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-tesseract-title"), "cantPurchase");
    }
}

function buyGalaxy()
{
    var cost = Math.floor(galaxyCost*Math.pow(galaxyCM, galaxies));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        galaxies += 1;
        playAnimation(document.getElementById("buy-galaxy-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-galaxy-title"), "cantPurchase");
    }
}

function buyBlackhole()
{
    var cost = Math.floor(blackholeCost*Math.pow(blackholeCM, blackholes));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        blackholes += 1;
        playAnimation(document.getElementById("buy-blackhole-button"), "marketClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-blackhole-title"), "cantPurchase");
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
    /*
    * 0 - Base Cost: 1 Million
    * 0.1 - Base Cost: 1 Billion
    * 0.2 - Base Cost: 1 Trillion
    * ...
    * 
    * Each purchase gives 0.0001 --> Takes one thousand purchases to reach next base cost
    */
    var totalCost = altarCost();
    
    if (baguettes < totalCost)
    {
        return;
    }

    clicks++;
    baguettes -= Math.floor(totalCost);
    epicbaguettes += 0.0001;
    epicbaguettes = Math.round(epicbaguettes*10000)/10000;

    updateBaguetteCounters();

    playAnimation(document.getElementById("altar-button"), "furnaceClick");
}

function altarCost()
{
    var baseCost = 1000000*Math.pow(1000,Math.floor(epicbaguettes*10));
    var inBetween = epicbaguettes*10000 - 1000*Math.floor(epicbaguettes*10);

    return baseCost*(inBetween+1);
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
        planets: planets,
        tesseracts: tesseracts,
        altarUnlocked: altarUnlocked,
        galaxies: galaxies,
        prestiges: prestiges,
        divinebaguettes: divinebaguettes,
        baguettesGenerated: baguettesGenerated,
        timePlayed: timePlayed,
        clicks: clicks,
        blackholes: blackholes,
        researchClickUpgrade: researchClickUpgrade
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
    if (typeof savedata.tesseracts !== "undefined") {tesseracts = savedata.tesseracts;}else {tesseracts = 0;}
    if (typeof savedata.altarUnlocked !== "undefined") {altarUnlocked = savedata.altarUnlocked;}else {altarUnlocked = false;}
    if (typeof savedata.galaxies !== "undefined") {galaxies = savedata.galaxies;}else {galaxies = 0;}
    if (typeof savedata.prestiges !== "undefined") {prestiges = savedata.prestiges;}else {prestiges = 0;}
    if (typeof savedata.divinebaguettes !== "undefined") {divinebaguettes = savedata.divinebaguettes;}else {divinebaguettes = 0;}
    if (typeof savedata.baguettesGenerated !== "undefined") {baguettesGenerated = savedata.baguettesGenerated;}else {baguettesGenerated = 0;}
    if (typeof savedata.timePlayed !== "undefined") {timePlayed = savedata.timePlayed;}else {timePlayed = 0;}
    if (typeof savedata.clicks !== "undefined") {clicks = savedata.clicks;}else {clicks = 0;}
    if (typeof savedata.blackholes !== "undefined") {blackholes = savedata.blackholes;}else {blackholes = 0;}
    if (typeof savedata.researchClickUpgrade !== "undefined") {researchClickUpgrade = savedata.researchClickUpgrade;}else {researchClickUpgrade = 1;}
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
    tesseracts = 0;
    altarUnlocked = false;
    galaxies = 0;
    baguettesGenerated = 0;
    blackholes = 0;

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function calculateBPS()
{
    var sum = 0;
    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(marketProduction*markets*(1+0.05*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(factoryProduction*factories*(1+0.03*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(planetProduction*planets*(1+0.015*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*Math.pow(researchbaguettes, epicbaguettes+1)));
    sum += Math.floor(blackholeProduction*blackholes*(1+0.01*Math.pow(researchbaguettes, epicbaguettes+1)));

    //Divine Baguette Boost
    sum *= 1+.01*divinebaguettes; //Each gives +1% boost to BPS
    return sum;
}

function calculateBPSVariable(research, epic, divine)
{
    var sum = 0;
    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*Math.pow(research, epic+1)));
    sum += Math.floor(marketProduction*markets*(1+0.05*Math.pow(research, epic+1)));
    sum += Math.floor(factoryProduction*factories*(1+0.03*Math.pow(research, epic+1)));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*Math.pow(research, epic+1)));
    sum += Math.floor(planetProduction*planets*(1+0.015*Math.pow(research, epic+1)));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*Math.pow(research, epic+1)));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*Math.pow(research, epic+1)));
    sum += Math.floor(blackholeProduction*blackholes*(1+0.01*Math.pow(research, epic+1)));

    //Divine Baguette Boost
    sum *= 1+.01*divine; //Each gives +1% boost to BPS
    return sum;
}

function calculateResearchBoost()
{
    if (calculateBPSVariable(0, epicbaguettes, divinebaguettes) == 0) {return 1;}
    var ratio = calculateBPSVariable(researchbaguettes, epicbaguettes, divinebaguettes)/calculateBPSVariable(0, epicbaguettes, divinebaguettes);
    ratio = Math.floor(ratio*100)/100;

    return ratio;
}


//Auto Generation
setInterval(function generateBaguettes() {
    baguettes += calculateBPS();
    baguettesGenerated += calculateBPS();
    timePlayed++;

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


