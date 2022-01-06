/**********************************************************************
 * Portions written by (C) Ruvin Roshan,
 * Conscious Solutions Ltd.
 * 
 * This file is part of the Conscious Solutions ClickUp Thunderbird Plugin.
 *
 * The Conscious Solutions ClickUp Thunderbird Plugin
 * is Freeware:you can redistribute it and use for free.
 *
 * The Conscious Solutions ClickUp Thunderbird Plugin
 * is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *********************************************************************/ 
 
  let apiInput =  document.querySelector("#clickup_api_key");
  let TeamidInput =  document.querySelector("#clickup_team_id");
  let button = document.querySelector("button");
  let accountId = 'randamid123';

  browser.storage.local.get([accountId]).then(accountInfo => {
  if ("clk_api_key" in accountInfo[accountId]) {
  apiInput.value = accountInfo[accountId].clk_api_key;
  }
  if ("clk_team_id" in accountInfo[accountId]) {
  TeamidInput.value = accountInfo[accountId].clk_team_id;
  }
  });

/*
* Click SAVE button
*/
  document.getElementById("clk_save").onclick = async () => {
  
if(apiInput.value != "" && TeamidInput.value !=""){
  apiInput.disabled =  button.disabled = true;
  TeamidInput.disabled = true;
  let start = Date.now();
  await browser.storage.local.set({ [accountId]: { clk_api_key: apiInput.value,clk_team_id: TeamidInput.value  } });
  setTimeout(() => {
  apiInput.disabled = button.disabled = false;
  TeamidInput.disabled = false;

  }, Math.max(0, start + 500 - Date.now()));
 // alert('Successfully Saved!');
   swal(
      'Success!',
      'Successfully Saved!',
    
    );
}else{
 //alert('Please Enter Required Values!'); 
 swal(
      'Oops...!',
      'Please Enter Required (*) Values!',
   
    );

}


  };


/*
* Test the connection when click the button: Test 
*/
  document.getElementById("clk_test_connection").onclick = async () => {
 
  let api_key = '';
  let team_id = '';
  browser.storage.local.get([accountId]).then(accountInfo => {
  if ("clk_api_key" in accountInfo[accountId]) {
 api_key = accountInfo[accountId].clk_api_key;
  }
  if ("clk_team_id" in accountInfo[accountId]) {
 team_id = accountInfo[accountId].clk_team_id;
  }

// Call API
  getTestData(api_key, team_id)
    .then(data => {  
if(data.err){
// alert('Incorrect API Key or TeamID.\nPlease check and try again!');
 swal(
      'Incorrect API Key or TeamID!',
      'Please check and try again!',
    
    );

}

if(data.teams){
     data.teams.forEach(function(item, index) { 
if(item.id== team_id){
 // alert('Connection has been successfully established with the ClickUp!\nTeam Name: '+item.name);
   swal(
      'Success!',
      'Connection has been successfully established with the ClickUp!\nTeam Name: '+item.name,
     
    );
}else{
 // alert('Incorrect API Key or TeamID.\nPlease check and try again!');
  swal(
      'Incorrect API Key or TeamID!',
      'Please check and try again!',
     
    );

}
  });
}
  });
  });
  };



async function getTestData(apikey, teamid) {
  let API_KEY = apikey;
  let urlSet = new URL('team', 'https://api.clickup.com/api/v2/');
  let loader = document.querySelector('#loader');
  loader.style.display = 'block'

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", API_KEY);
  loader.style.display = 'block';
  try{
  // Default options are marked with *
  let response = await fetch(urlSet, {
  method: 'GET', // *GET, POST, PUT, DELETE, etc.
  headers: myHeaders,
  redirect: 'follow', // manual, *follow, error
  });
  loader.style.display = 'none';
  return await response.json(); // parses JSON response into native JavaScript objects
  }catch(err){
  console.error('Error:', err);
  // Handle errors here
  }
  }