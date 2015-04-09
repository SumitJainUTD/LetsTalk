function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }    

    function validateTopMenu(){
      var username = getCookie("username");
      console.log(username);
          if(username){
             $('#userWelcome').text("Welcome, "+username);
            $('#userWelcome').show();
            $('#sideBar').show();
            $('#topMenu').show();
            $('#signout').text('Sign out');
            return true;
          }else{
             $('#sideBar').hide();
            $('#userWelcome').hide();
            $('#topMenu').hide();
            $('#signout').text('Sign In');
            return false;
          }
    }

    function clickLogout(){
      if($('#signout').text()=="Sign In"){
                window.location.href = "/login.html";
            }else{
              $.ajax({
              type: "GET",
              url: "/sumit/users/logout",
                // data: JSON.stringify(objJSON),
                contentType: "application/json",
                success: function(data) {  
                    window.location.href = "/Posts.html";
                    $('#signout').text('Sign In');
                  }                    
                });
            }  
    }