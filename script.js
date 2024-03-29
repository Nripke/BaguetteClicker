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
var canTravel = false; //Variable used to make sure people save their progress before loading an unloaded game (Courtesy of all the people who complained about losing their progress ._.)
var legendaryUnlocked = false; 

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

var frances = 0;
var franceCM = 1.42;
var franceCost = 50000000000000;
var franceProduction = 25000000;

var dimensions = 0;
var dimensionCM = 1.48;
var dimensionCost = 5000000000000000;
var dimensionProduction = 150000000;

var labs = 0;
var labCM = 0.5; //In actuality, its 1.5
var labCost = 10;

var labSpeedCost = 100000;
var labSpeed = 1000; //In Milliseconds
var labSpeedUpgrades = 0;
var labSpeedCM = 1.35;
var labSpeedMultiplier = 0.9875;

var labSpeedMinimized = 1000; //Cap the speed at 1 ms, from that point on, simply do an average calculation

var labCostUpgrades = 0;
var labCUCost = 5;
var labCUCM = 2;
var labCUMultiplier = 0.975;

var clickAmount = 1;
var clickerCM = 1.2;

var researchPercent = 1; //Any number less than this will earn a research baguette from ranNum from 1-100
var researchCM = 100;

var researchClickUpgrade = 1; //Divine upgrade, lasts through prestiges
var researchClickCM = 5;

//Legendary Baguette Variables

//Each worker contributes one "tick"
var baguetteWorkers = 0;
var divineWorkers = 0;
var researchWorkers = 0;

var legendarybaguettes = 0;

var bwCost = 1000000000000000000;
var dwCost = 1000;
var rwCost = 100;

var bwCM = 2;
var dwCM = 1.35;
var rwCM = 1.15;

var bTM = 1.5;
var dTM = 1.5;
var rTM = 1.5;

var btStart = 3000;
var dtStart = 1000;
var rtStart = 2000;

var baguetteTicks = 0;
var divineTicks = 0;
var researchTicks = 0;

/*
* Equations for calculating ticks needed to complete construction
*
* Baguette Construction: 3000*(bTM^legendarybaguettes)
*
* Divine Construction: 1000*(dTM^legendarybaguettes)
*
* Research Construction: 2000*(rTM^legendarybaguettes)
*/

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
Dimension 

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
    const suffixes = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion", "decillion", "undecillion", "duodecillion", "tredecillion", "quattuordecillion", "quindecillion", "sexdecillion", "septendecillion", "octodecillion", "novemdecillion", "vigintillion"];

    const suffixIndex = Math.floor(Math.log10(Math.abs(num)) / 3);
    var suffix = suffixes[suffixIndex];
    if (suffixIndex > suffixes.length-1)
    {
        suffix = "10E"+(suffixIndex*3);
    }

    const scaledNum = num / Math.pow(10, suffixIndex * 3);

    const formattedNum = scaledNum.toFixed(3).replace(/\.0$/, ''); // Remove trailing zeroes
    

    return `${formattedNum} ${suffix}`;
}

function getLegendaryBaguette()
{
    if (baguetteTicks < btStart*Math.pow(bTM, legendarybaguettes)) {return;}
    if (divineTicks < dtStart*Math.pow(dTM, legendarybaguettes)) {return;}
    if (researchTicks < rtStart*Math.pow(rTM, legendarybaguettes)) {return;}

    //If ticks are all sufficient
    legendarybaguettes += 1;

    baguetteTicks = 0;
    divineTicks = 0;
    researchTicks = 0;

    updateBaguetteCounters();
}

function divineBaguetteCalculator()
{
    var db = Math.floor(Math.pow(baguettesGenerated/1000000000, 0.5*Math.pow(1.01, legendarybaguettes)));
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
    var divBoost = 1+(0.01*(1+legendarybaguettes))*divinebaguettes;

    //Update Baguette Counters
    document.getElementById("baguette-count").textContent = format(baguettes);
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;
    document.getElementById("researchbaguette-count").textContent = format(researchbaguettes);

    document.getElementById("BPS-count").textContent = format(calculateBPS());
    document.getElementById("RBoost-count").textContent = format(calculateResearchBoost()) + " ";

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

    if (document.getElementById("france-count") != null) {document.getElementById("france-count").textContent = frances;}
    if (document.getElementById("france-production") != null) {document.getElementById("france-production").textContent = format(Math.floor(franceProduction*frances*(1+0.009*resBoost)*divBoost));}

    if (document.getElementById("dimension-count") != null) {document.getElementById("dimension-count").textContent = dimensions;}
    if (document.getElementById("dimension-production") != null) {document.getElementById("dimension-production").textContent = format(Math.floor(dimensionProduction*dimensions*(1+0.007*resBoost)*divBoost));}


    if (document.getElementById("lab-count") != null) {document.getElementById("lab-count").textContent = labs;}
    if (document.getElementById("labSpeed-count") != null) {document.getElementById("labSpeed-count").textContent = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}
    if (document.getElementById("labCost-count") != null) {document.getElementById("labCost-count").textContent = labCostUpgrades;}

    //Update Automated Costs
    if (document.getElementById("bakery-cost") != null) {document.getElementById("bakery-cost").textContent = format(Math.floor(bakeryCost*Math.pow(bakeryCM, bakeries)));}
    if (document.getElementById("market-cost") != null) {document.getElementById("market-cost").textContent = format(Math.floor(marketCost*Math.pow(marketCM, markets)));}
    if (document.getElementById("factory-cost") != null) {document.getElementById("factory-cost").textContent = format(Math.floor(factoryCost*Math.pow(factoryCM, factories)));}
    if (document.getElementById("alchemy-cost") != null) {document.getElementById("alchemy-cost").textContent = format(Math.floor(alchemyCost*Math.pow(alchemyCM, alchemyLabs)));}
    if (document.getElementById("planet-cost") != null) {document.getElementById("planet-cost").textContent = format(Math.floor(planetCost*Math.pow(planetCM, planets)));}
    if (document.getElementById("tesseract-cost") != null) {document.getElementById("tesseract-cost").textContent = format(Math.floor(tesseractCost*Math.pow(tesseractCM, tesseracts)));}
    if (document.getElementById("galaxy-cost") != null) {document.getElementById("galaxy-cost").textContent = format(Math.floor(galaxyCost*Math.pow(galaxyCM, galaxies)));}
    if (document.getElementById("blackhole-cost") != null) {document.getElementById("blackhole-cost").textContent = format(Math.floor(blackholeCost*Math.pow(blackholeCM, blackholes)));}
    if (document.getElementById("france-cost") != null) {document.getElementById("france-cost").textContent = format(Math.floor(franceCost*Math.pow(franceCM, frances)));}
    if (document.getElementById("dimension-cost") != null) {document.getElementById("dimension-cost").textContent = format(Math.floor(dimensionCost*Math.pow(dimensionCM, dimensions)));}

    if (document.getElementById("lab-cost") != null) {document.getElementById("lab-cost").textContent = format(Math.floor(labCost*Math.pow(1+labCM*Math.pow(labCUMultiplier, labCostUpgrades), labs)));}
    if (document.getElementById("labSpeed-cost") != null) {document.getElementById("labSpeed-cost").textContent = format(Math.floor(labSpeedCost*Math.pow(labSpeedCM, labSpeedUpgrades)));}
    if (document.getElementById("labCost-cost") != null) {document.getElementById("labCost-cost").textContent = format(Math.floor(labCUCost*Math.pow(labCUCM, labCostUpgrades)));}

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

    //Update Legendary Information

    var btRatio = Math.floor(10000*(baguetteTicks/(btStart*Math.pow(bTM, legendarybaguettes))))/100;
    var dtRatio = Math.floor(10000*(divineTicks/(dtStart*Math.pow(dTM, legendarybaguettes))))/100;
    var rtRatio = Math.floor(10000*(researchTicks/(rtStart*Math.pow(rTM, legendarybaguettes))))/100;

    if (btRatio >= 100) {btRatio = 100;} if (dtRatio >= 100) {dtRatio = 100;} if (rtRatio >= 100) {rtRatio = 100;}


    if (document.getElementById("baguette-percentage") != null) {document.getElementById("baguette-percentage").textContent = btRatio + "%";}
    if (document.getElementById("divine-percentage") != null) {document.getElementById("divine-percentage").textContent = dtRatio + "%";}
    if (document.getElementById("research-percentage") != null) {document.getElementById("research-percentage").textContent = rtRatio + "%";}

    if (document.getElementById("baguette-worker-count") != null) {document.getElementById("baguette-worker-count").textContent = baguetteWorkers;}
    if (document.getElementById("divine-worker-count") != null) {document.getElementById("divine-worker-count").textContent = divineWorkers;}
    if (document.getElementById("research-worker-count") != null) {document.getElementById("research-worker-count").textContent = researchWorkers;}

    if (document.getElementById("baguette-worker-cost") != null) {document.getElementById("baguette-worker-cost").textContent = format(Math.floor(bwCost*Math.pow(bwCM, baguetteWorkers)));}
    if (document.getElementById("divine-worker-cost") != null) {document.getElementById("divine-worker-cost").textContent = format(Math.floor(dwCost*Math.pow(dwCM, divineWorkers)));}
    if (document.getElementById("research-worker-cost") != null) {document.getElementById("research-worker-cost").textContent = format(Math.floor(rwCost*Math.pow(rwCM, researchWorkers)));}

    if (document.getElementById("legendary-baguette-count") != null) {document.getElementById("legendary-baguette-count").textContent = legendarybaguettes;}

    if (document.getElementById("div-boost") != null) {document.getElementById("div-boost").textContent = (1+legendarybaguettes)+"%";}
}

function goFurnace()
{
    if (!canTravel) {return;}
    save();
    window.location.href = 'index.html';
}

function goBakery()
{
    if (bakeryUnlocked && canTravel)
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
    if (researchUnlocked && canTravel)
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
    if (altarUnlocked && canTravel)
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

function goRiddle()
{
    if (!canTravel) {return;}

    save();
    window.location.href = 'riddle.html';
    return;
}

function goPrestige()
{
    if (!canTravel) {return;}

    save();
    window.location.href = 'prestige.html';
    return;
}

function goLegendary()
{
    if (!canTravel) {return;}

    save();
    window.location.href = 'legendary.html';
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

    if (legendaryUnlocked && document.getElementById("legendary-arrow") != null)
    {
        document.getElementById("legendary-text-container").style.visibility = "visible";
        document.getElementById("legendary-container").style.visibility = "visible";
    }

    if (prestiges >= 3 && document.getElementById("riddle-text-container") != null)
    {
        document.getElementById("riddle-text-container").style.visibility = "visible";
        document.getElementById("riddle-container").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("db-text") != null)
    {
        document.getElementById("db-text").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("blackhole-container") != null)
    {
        document.getElementById("blackhole-container").style.visibility = "visible";
    }

    if (prestiges >= 2 && document.getElementById("france-container") != null)
    {
        document.getElementById("france-container").style.visibility = "visible";
    }

    if (prestiges >= 3 && document.getElementById("dimension-container") != null)
    {
        document.getElementById("dimension-container").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("buy-researchclick-container") != null)
    {
        document.getElementById("buy-researchclick-container").style.visibility = "visible";
    }

    if (prestiges >= 1 && document.getElementById("lab-cost-container") != null)
    {
        document.getElementById("lab-cost-container").style.visibility = "visible";
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

function buyFrance()
{
    var cost = Math.floor(franceCost*Math.pow(franceCM, frances));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        frances += 1;
        playAnimation(document.getElementById("buy-france-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-france-title"), "cantPurchase");
    }
}

function buyDimension()
{
    var cost = Math.floor(dimensionCost*Math.pow(dimensionCM, dimensions));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        dimensions += 1;
        playAnimation(document.getElementById("buy-dimension-button"), "dimensionClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-dimension-title"), "cantPurchase");
    }
}

function buyLab()
{
    var cost = Math.floor(labCost*Math.pow(1+labCM*Math.pow(labCUMultiplier, labCostUpgrades), labs));
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

function buyLabCostUpgrade()
{
    var cost = Math.floor(labCUCost*Math.pow(labCUCM, labCostUpgrades));
    if (divinebaguettes >= cost)
    {
        divinebaguettes -= cost;
        labCostUpgrades += 1;
        playAnimation(document.getElementById("buy-labCost-button"), "labClick");
        updateBaguetteCounters();
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-labCost-title"), "cantPurchase");
    }
}

function buyBaguetteWorker()
{
    var cost = Math.floor(bwCost*Math.pow(bwCM, baguetteWorkers));
    if (baguettes >= cost)
    {
        baguettes -= cost;
        baguetteWorkers += 1;
        updateBaguetteCounters();
    }
}

function buyDivineWorker()
{
    var cost = Math.floor(dwCost*Math.pow(dwCM, divineWorkers));
    if (divinebaguettes >= cost)
    {
        divinebaguettes -= cost;
        divineWorkers += 1;
        updateBaguetteCounters();
    }
}

function buyResearchWorker()
{
    var cost = Math.floor(rwCost*Math.pow(rwCM, researchWorkers));
    if (researchbaguettes >= cost)
    {
        researchbaguettes -= cost;
        researchWorkers += 1;
        updateBaguetteCounters();
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
    if (epicbaguettes >= 6) {epicbaguettes = 6; return;} //Make a cap on epicbaguettes
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

    var cost = baseCost*(inBetween+1);
    if (epicbaguettes >= 1)
    {
        cost = Math.pow(cost, 1+epicbaguettes/7);
    }
    return cost;
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
        researchClickUpgrade: researchClickUpgrade,
        frances: frances,
        dimensions: dimensions,
        labCostUpgrades: labCostUpgrades,
        legendaryUnlocked: legendaryUnlocked,
        legendarybaguettes: legendarybaguettes,
        baguetteWorkers: baguetteWorkers,
        divineWorkers: divineWorkers,
        researchWorkers: researchWorkers,
        baguetteTicks: baguetteTicks,
        divineTicks: divineTicks,
        researchTicks: researchTicks
    }

    localStorage.setItem("save", JSON.stringify(save));
    console.log("Game Saved!");

    if (labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades) <= 1) {labSpeedMinimized = 1;}else {labSpeedMinimized = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}

    clearInterval(researchInterval);

    researchInterval = setInterval(function generateResearch() {
        if (labs >= 150 || labSpeedMinimized <= 1) //To prevent lag, we just average the probabilities once you get enough labs
        {
            var totalCalls = labs*(1/(labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades)));
            if (baguettes < totalCalls*Math.pow(10, researchPercent)) {return;} //Can't afford
    
            baguettes -= Math.floor(Math.pow(10, researchPercent)*totalCalls);

            researchbaguettes += researchClickUpgrade*Math.floor(totalCalls*(researchPercent/100)); //Just average the results

            playAnimation(document.getElementById("research-button"), "furnaceClick");
            updateBaguetteCounters();
            return;
        }

        for (let i = 0; i<labs; i++) //Auto Lab research
        {
            researchClick();
        }
        
        updateBaguetteCounters();
    }, labSpeedMinimized);
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
    if (typeof savedata.frances !== "undefined") {frances = savedata.frances;}else {frances = 0;}
    if (typeof savedata.dimensions !== "undefined") {dimensions = savedata.dimensions;}else {dimensions = 0;}
    if (typeof savedata.labCostUpgrades !== "undefined") {labCostUpgrades = savedata.labCostUpgrades;}else {labCostUpgrades = 0;}
    if (typeof savedata.legendaryUnlocked !== "undefined") {legendaryUnlocked = savedata.legendaryUnlocked;}else {legendaryUnlocked = false;}
    if (typeof savedata.legendarybaguettes !== "undefined") {legendarybaguettes = savedata.legendarybaguettes;}else {legendarybaguettes = 0;}
    if (typeof savedata.baguetteWorkers !== "undefined") {baguetteWorkers = savedata.baguetteWorkers;}else {baguetteWorkers = 0;}
    if (typeof savedata.divineWorkers !== "undefined") {divineWorkers = savedata.divineWorkers;}else {divineWorkers = 0;}
    if (typeof savedata.researchWorkers !== "undefined") {researchWorkers = savedata.researchWorkers;}else {researchWorkers = 0;}
    if (typeof savedata.baguetteTicks !== "undefined") {baguetteTicks = savedata.baguetteTicks;}else {baguetteTicks = 0;}
    if (typeof savedata.divineTicks !== "undefined") {divineTicks = savedata.divineTicks;}else {divineTicks = 0;}
    if (typeof savedata.researchTicks !== "undefined") {researchTicks = savedata.researchTicks;}else {researchTicks = 0;}

    if (researchClickUpgrade == 0) {researchClickUpgrade = 1;} //Fix stupid issue

    //Set the cap on labSpeedMinimized
    if (labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades) <= 1) {labSpeedMinimized = 1;}else {labSpeedMinimized = labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades);}

    canTravel = true; //Only allow traveling after you have loaded past progress! This prevents save() being called without having loaded

    clearInterval(researchInterval);

    researchInterval = setInterval(function generateResearch() {
        if (labs >= 150 || labSpeedMinimized <= 1) //To prevent lag, we just average the probabilities once you get enough labs
        {
            var totalCalls = labs*(1/(labSpeed*Math.pow(labSpeedMultiplier, labSpeedUpgrades)));
            if (baguettes < totalCalls*Math.pow(10, researchPercent)) {return;} //Can't afford
    
            baguettes -= Math.floor(Math.pow(10, researchPercent)*totalCalls);

            researchbaguettes += researchClickUpgrade*Math.floor(totalCalls*(researchPercent/100)); //Just average the results

            playAnimation(document.getElementById("research-button"), "furnaceClick");
            updateBaguetteCounters();
            return;
        }

        for (let i = 0; i<labs; i++) //Auto Lab research
        {
            researchClick();
        }
        
        updateBaguetteCounters();
    }, labSpeedMinimized);
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
    frances = 0;
    dimensions = 0;
    labSpeedMinimized = 1000;

    updateBaguetteCounters();
    updateUnlockedFeatures();
}

function calculateBPS()
{
    var sum = 0;
    var researchBoost = Math.pow(researchbaguettes, epicbaguettes+1);

    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*researchBoost));
    sum += Math.floor(marketProduction*markets*(1+0.05*researchBoost));
    sum += Math.floor(factoryProduction*factories*(1+0.03*researchBoost));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*researchBoost));
    sum += Math.floor(planetProduction*planets*(1+0.015*researchBoost));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*researchBoost));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*researchBoost));
    sum += Math.floor(blackholeProduction*blackholes*(1+0.01*researchBoost));
    sum += Math.floor(franceProduction*frances*(1+0.009*researchBoost));
    sum += Math.floor(dimensionProduction*dimensions*(1+0.007*researchBoost));

    //Divine Baguette Boost
    sum *= 1+(.01*(legendarybaguettes+1))*divinebaguettes; //Each gives +1% boost to BPS, but +1% extra for each legendary baguette
    return sum;
}

function calculateBPSVariable(research, epic, divine)
{
    var sum = 0;
    var researchBoost = Math.pow(research, epic+1);

    sum += Math.floor(bakeryProduction*bakeries*(1+0.1*researchBoost));
    sum += Math.floor(marketProduction*markets*(1+0.05*researchBoost));
    sum += Math.floor(factoryProduction*factories*(1+0.03*researchBoost));
    sum += Math.floor(alchemyProduction*alchemyLabs*(1+0.02*researchBoost));
    sum += Math.floor(planetProduction*planets*(1+0.015*researchBoost));
    sum += Math.floor(tesseractProduction*tesseracts*(1+0.013*researchBoost));
    sum += Math.floor(galaxyProduction*galaxies*(1+0.011*researchBoost));
    sum += Math.floor(blackholeProduction*blackholes*(1+0.01*researchBoost));
    sum += Math.floor(franceProduction*frances*(1+0.009*researchBoost));
    sum += Math.floor(dimensionProduction*dimensions*(1+0.007*researchBoost));

    //Divine Baguette Boost
    sum *= 1+(.01*(legendarybaguettes+1))*divine; //Each gives +1% boost to BPS, but +1% extra for each legendary baguette
    return sum;
}

function calculateResearchBoost()
{
    if (calculateBPSVariable(0, epicbaguettes, divinebaguettes) == 0) {return 1;}
    var ratio = calculateBPSVariable(researchbaguettes, epicbaguettes, divinebaguettes)/calculateBPSVariable(0, epicbaguettes, divinebaguettes);
    ratio = Math.floor(ratio*100)/100;

    return ratio;
}

function tryRiddle()
{
    var response = prompt("Enter your guess here: ");

    if (response.toLowerCase() == "legendary")
    {
        //Correct Answer
        legendaryUnlocked = true;
        updateUnlockedFeatures();
        alert("Correct! For your efforts, I let you into my Legendary Factory.");
    }else {
        alert("Incorrect!");
    }
}




//Auto Generation
setInterval(function generateBaguettes() {
    baguettes += calculateBPS();
    baguettesGenerated += calculateBPS();
    timePlayed++;

    //Legendary Baguette Stuff
    baguetteTicks += baguetteWorkers;
    divineTicks += divineWorkers;
    researchTicks += researchWorkers;
    getLegendaryBaguette();

    updateBaguetteCounters();
}, 1000);


//Research Generation
researchInterval = setInterval(function generateResearch() {
    if (labs >= 150) //To prevent lag, we just average the probabilities once you get enough labs
    {
        if (baguettes < labs*Math.pow(10, researchPercent)) {return;} //Can't afford
    
        baguettes -= Math.floor(Math.pow(10, researchPercent)*labs);

        researchbaguettes += researchClickUpgrade*Math.floor(labs*(researchPercent/100)); //Just average the results

        playAnimation(document.getElementById("research-button"), "furnaceClick");
        updateBaguetteCounters();
        return;
    }

    for (let i = 0; i<labs; i++) //Auto Lab research
    {
        researchClick();
    }

    updateBaguetteCounters();
}, labSpeedMinimized);


//Auto save
setInterval(function autoSave() {
    save();
}, 10000);


