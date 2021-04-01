const generateID = document.querySelector('#generatePasscode');
const passcode= document.querySelector('#passcode');

generateID.addEventListener('click', function(e){
    e.preventDefault();
    const newPassword = candidatePassword => Math.floor(Math.random() * 999999) + 10000;
    passcode.value = `LOC${newPassword()}`;
    
});