window.onload = initBoard;

function initBoard() {
    var x = 1,
        y = 0;

    var id = "col"+x+y;
    console.log(id);
    var obj = document.getElementById(id);
    console.log(obj);    
    obj.textContent = 'AS';
}