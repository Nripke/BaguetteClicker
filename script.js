var baguettes;
var epicbaguettes;
var bakeryUnlocked;
var bakeries;
function loadGame()
{
    baguettes = 0;
    epicbaguettes = 0;
    bakeryUnlocked = false;
    bakeries = 0;

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
    document.getElementById("baguette-count").textContent = baguettes;
    document.getElementById("epicbaguette-count").textContent = epicbaguettes;
}

function goBakery()
{
    if (bakeryUnlocked)
    {
        window.location.href = 'bakeries.html';
        return;
    }

    //If bakery isnt unlocked, allow purchase

    if (baguettes >= 100)
    {
        baguettes -= 100;
        updateBaguetteCounters();
        bakeryUnlocked = true;
        updateUnlockedFeatures();
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
    if (bakeryUnlocked)
    {
        document.getElementById("bakery-locked-text").textContent = "Go to Bakery";
        document.getElementById("bakery-locked-text").style.color = "#00ff00";
    }
}

function buyBakery() 
{
    if (baguettes >= 0)
    {
        baguettes -= 0;
        bakeries += 1;
        playAnimation(document.getElementById("buy-bakery-button"), "furnaceClick");
    } else {
        //Play 'cannot afford' animation
        playAnimation(document.getElementById("buy-bakery-title"), "cantPurchase");
    }
}


//Bakery Generation
setInterval(function bakeryGenerate() {
    baguettes += 1*bakeries;
    updateBaguetteCounters();
}, 1000)


