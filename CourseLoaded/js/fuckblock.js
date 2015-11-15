// Function called if AdBlock is not detected
function adBlockNotDetected() {
    console.log('not detected');
    $('#ad-block-alert').show();
    $('#thumb').hide();
}
// Function called if AdBlock is detected
function adBlockDetected() {
    console.log('detected');

    $('#thumb').show();
    $('#ad-block-alert').hide();
}

// Recommended audit because AdBlock lock the file 'fuckadblock.js' 
// If the file is not called, the variable does not exist 'fuckAdBlock'
// This means that AdBlock is present
if(typeof fuckAdBlock === 'undefined') {
    console.log('ayo');
    adBlockDetected();
} else {
    console.log('ayfafo');

    fuckAdBlock.onDetected(adBlockDetected);
    fuckAdBlock.onNotDetected(adBlockNotDetected);
    // and|or
    fuckAdBlock.on(true, adBlockDetected);
    fuckAdBlock.on(false, adBlockNotDetected);
    // and|or
    fuckAdBlock.on(true, adBlockDetected).onNotDetected(adBlockNotDetected);
    // Change the options
    fuckAdBlock.setOption('checkOnLoad', false);
    // and|or
    fuckAdBlock.setOption({
        debug: true,
        checkOnLoad: false,
        resetOnEnd: false
});
}
    