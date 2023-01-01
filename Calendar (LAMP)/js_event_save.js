$(document).ready(function(){
    var selectedIndex; 

    $("#submit_form").submit(async function(event) {
        event.preventDefault();
        // alert("form is submitted"); 
        // if the form is submitted, close the dialog. 
        if ($("#submit_form").hasClass('ui-dialog-content')){
            $("#submit_form").dialog('close');
        }

        // console.log("refresh token: ", refresh_token); 
        // console.log("login toke: ", login_token); 
        let save_event_token = refresh_token;
        if (login_token){
            save_event_token = login_token; 
        }

        const myForm = document.getElementById('submit_form');
        var event_title = $("#event_title").val();
        var id = $("#user_id").val(); 
        var event_start_at = $("#start_at").val();
        var event_end_at = $('#end_at').val();
        var event_id_submit = $('#submit_event_id').val(); 
        var event_date = $('#date').val();
        var ourput_data; 
        if ($('#shared_user_0').val()){
            var event_shared_username = $('#shared_user_0').val(); 
            data = {
                username: event_shared_username,
                token: save_event_token
            };
           
            // to access data within fetch I had to use promise. 
            const getData = async() => {
                try {
                    let response = await fetch("./username_check.php", {
                        method: "POST",
                        body: JSON.stringify(data)
                        });
                    let result = await response.json(); 
                    return JSON.parse(JSON.stringify(result));
                }
                catch(e){
                    console.log("error", e);
                }
            }

            // to extract PromiseResult out of https://stackoverflow.com/questions/48908930/function-returns-promise-object-instead-of-value-async-await
            output_data = await getData();
            console.log("getData: ", output_data);
            // prevent submission if user enters wrong shared_username. 
            if (output_data.success == false) {
                alert(output_data.message); 
                return false; 
            }
        }
        else{
            event_shared_username = null; 
        }
        if (document.getElementById("category").selectedIndex) {
            selectedIndex = document.getElementById("category").selectedIndex; 
        }
        else {
            selectedIndex = 0; 
        }
        let options = document.getElementById("category").options; 
        console.log("selectedIndex: ", selectedIndex);
        let selectedOption = options[selectedIndex].value;
        console.log("selectedOption: ",selectedOption);


        var pathToPhpFile; 
        
        alert(event_title);
         // to update event
        if (event_id_submit){
            console.log("update event mode. event_id: ", event_id_submit); 
            data = {
                user_id: id,
                event: event_title,
                date: event_date,
                start_at: event_start_at,
                end_at: event_end_at,
                event_id: event_id_submit,
                category: selectedOption,
                shared_username: event_shared_username,
                token: save_event_token
            };
            pathToPhpFile = './event_update.php';
        }
   
          // to save event
        else {
            console.log("save event mode event_id: ", event_id_submit);


            
            data = {
                user_id: id,
                event: event_title,
                date: event_date,
                start_at: event_start_at,
                end_at: event_end_at,
                category: selectedOption,
                shared_username: event_shared_username,
                token: save_event_token
            };
            pathToPhpFile = './event_save.php';

            
        }
        
      
        fetch(pathToPhpFile, {
            method: "POST",
            body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(function(data){
                console.log("save data loaded: ", JSON.stringify(data));
                jsonData = JSON.parse(JSON.stringify(data)); 
                if (jsonData.success){
                    console.log("You've submitted event_save form successfully");
                    // when log in is successful -> update entire calendar
                    
                    console.log("data submitted: ", data);
                    updateCalendar();
    
                }
                else{
                    alert(`Submission unsuccessful ${data.message}`); 
                }
            })
            .catch(err => console.error(err));
    });
    
        
        
});

 