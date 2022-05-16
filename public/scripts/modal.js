        // Get the modal
        var modal = document.getElementById("myModal");

        // Get the button that opens the modal
        var btnconf = document.getElementById("btnmodalConf");
        var btncom = document.getElementById("btnmodalCom");    

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        // When the user clicks the button, open the modal 
        btnconf.onclick = function () {
            modal.style.display = "block";
            document.getElementById("botonCom").style.display = "none";
            document.getElementById("botonConf").style.display = "block";

        }
        btncom.onclick = function () {
            modal.style.display = "block";
            document.getElementById("botonConf").style.display = "none";
            document.getElementById("botonCom").style.display = "block";
        }


        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }