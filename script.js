function checkSymptoms(){
let headache=document.getElementById("headache").checked
let swelling=document.getElementById("swelling").checked
let bleeding=document.getElementById("bleeding").checked
let bp=document.getElementById("bp").checked
let movement=document.getElementById("movement").checked

let result=document.getElementById("result")

if(bleeding || movement){
result.innerHTML="High Risk: Seek medical attention immediately!"
result.className="result high"
}
else if(headache && swelling && bp){
result.innerHTML="High Risk: Possible Preeclampsia. Visit doctor immediately."
result.className="result high"
}
else if(headache || swelling){
result.innerHTML="Medium Risk: Monitor symptoms and consult doctor if persistent."
result.className="result medium"
}
else{
result.innerHTML="Low Risk: Symptoms appear normal but continue monitoring."
result.className="result low"
}
}

function checkKicks(){
let kicks=document.getElementById("kicks").value
let result=document.getElementById("kickResult")

if(kicks===""){
result.innerHTML="Please enter number of kicks"
return
}

if(kicks<5){
result.innerHTML="Alert: Baby movement is low. Contact doctor."
result.className="result high"
}else{
result.innerHTML="Baby movement appears normal"
result.className="result low"
}
}
