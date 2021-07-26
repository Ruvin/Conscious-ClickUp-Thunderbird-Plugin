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

 const URL_SET = "https://api.clickup.com/api/v2/";
 const MAIL_ACCOUNT_ID = "randamid123";

/*
* WINDOW INIT
* store gobel variables
*/
 const load = () => {
// Load First...
browser.storage.local.get([MAIL_ACCOUNT_ID]).then(accountInfo => {
sessionStorage.setItem('API_KEY', accountInfo[MAIL_ACCOUNT_ID].clk_api_key);
sessionStorage.setItem('TEAM_ID', accountInfo[MAIL_ACCOUNT_ID].clk_team_id);

// Load Next...
 continueCode();
});
}
window.onload = load;



/*
* Window Load after INIT
*/
async function continueCode(){
but_insideList.classList.add('disabled');
but_outsideList.classList.add('disabled');
but_seachTaskSubmit.classList.add('disabled');
but_insideList.disabled = true;
but_outsideList.disabled = true;
but_seachTaskSubmit.disabled = true;
document.getElementById("cuSearchOption1").checked= true;
radioChangeHandler();
onLoadSpaces();
folderless_onLoadSpaces();
}


async function getMsgFull(itemId) {
  return await browser.messages.getFull(itemId);

};



/*
* Search Button Task submit
*/

document.getElementById("but_seachTaskSubmit").onclick = async () => {

let selectedVal = '';
if(document.querySelector('input[name="searchTaskName"]:checked')){
   selectedVal = document.querySelector('input[name="searchTaskName"]:checked').value ;
}
 
let url = 'task/'+selectedVal+'/comment';
let messageList = await browser.mailTabs.getSelectedMessages();
if (messageList.messages.length == 0) {
  alert('Please Select least one email!');
    return;
}
if (selectedVal == '') {
  alert('Please Select a Task!');
    return;
}



await messageList.messages.forEach(function(item, index) {
 getMsgFull(item.id).then(data => {
 let emailBodyText = data.parts[0].parts[0].body;


sendData = {
  "comment_text":emailBodyText, 
  "notify_all": false
};


 postData(url, sendData)
  .then(data => {
if(data == undefined){
  this.window.close();
}else{
alert('Mail List Successfully Synced!');
}
 });
});
 });
};







/*
* Submit button inside list
*/
document.getElementById("but_insideList").onclick = async () => {
 let selected_val = document.querySelector('#listOf_task').value ;
 let url = 'task/'+selected_val+'/comment';

let messageList = await browser.mailTabs.getSelectedMessages();
if (messageList.messages.length == 0) {
  alert('Please Select least one email!');
  return;
}
if (selected_val == '') {
  alert('Please Select a Task from drop-down');
  return;
}


await messageList.messages.forEach(function(item, index) {
 getMsgFull(item.id).then(data => {
 let emailBodyText = data.parts[0].parts[0].body;


let sendData = {
  "comment_text":emailBodyText, 
  "notify_all": false
};


 postData(url, sendData)
  .then(data => {
 
if(data == undefined){
  this.window.close();
   //location.reload();
}else{
alert('Mail List Successfully Synced!');
}
 });
});
 });

};

/*
* Submit button outside List
*/
document.getElementById("but_outsideList").onclick = async () => {
 let selected_val = document.querySelector('#folderless_listOf_task').value ;
 let url = 'task/'+selected_val+'/comment';

let messageList = await browser.mailTabs.getSelectedMessages();
if (messageList.messages.length == 0) {
  alert('Please Select least one email!');
  return;
}
if (selected_val == '') {
  alert('Please Select a Task from drop-down');
  return;
}


await messageList.messages.forEach(function(item, index) {
 getMsgFull(item.id).then(data => {
 let emailBodyText = data.parts[0].parts[0].body;


sendData = {
  "comment_text":emailBodyText, 
  "notify_all": false
};


 postData(url, sendData)
  .then(data => {
 
if(data == undefined){
  this.window.close();
   //location.reload();
}else{
alert('Mail List Successfully Synced!');
}
 });
});
 });

};



/*
* Close buttons
*/
document.querySelector("#but_close1").onclick = async () => {
this.window.close();
};
document.querySelector("#but_close2").onclick = async () => {
this.window.close();
};
document.querySelector("#but_close3").onclick = async () => {
this.window.close();
};


/*
* Search button by Custom Task ID
*/
document.getElementById("but_searchByTskName").onclick = async () => {
let TEAM_ID = sessionStorage.getItem('TEAM_ID');
 let custom_id = document.querySelector('#search_task_name').value;
  taskResults =  'task/'+custom_id+'?custom_task_ids=true&team_id='+TEAM_ID;

 if (custom_id == '') {
    let option = document.createElement("P");
  option.innerHTML =  '<span style="color: crimson">Please Enter Task-ID or Custom Task-ID</span>'; 
  document.querySelector('#customIdTaskList_results').innerHTML= option.innerHTML;
  searchedResultsubmit.style.display = 'none';
  return;
}




  getData(taskResults)
    .then(data => {
     document.querySelector("#customIdTaskList_results").innerHTML = "";
 
if(data.id){
let option = document.createElement("DIV");
option.setAttribute("class", "radioItem"); 

 let radioNo = document.createElement("input");  
            radioNo.setAttribute("type", "radio");  
            radioNo.setAttribute("id", "searchTaskId1" );  
            radioNo.setAttribute("name", "searchTaskName" ); 
            radioNo.setAttribute("value", data.id ); 

 let lblNo = document.createElement("label");  
  lblNo.setAttribute("for", "searchTaskId1"  ); 
            lblNo.innerHTML =  data.name;  
            option.appendChild(radioNo);  
            option.appendChild(lblNo); 
      document.querySelector('#customIdTaskList_results').appendChild(option);
      searchedResultsubmit.style.display = 'flex';
 }else{
  let option = document.createElement("P");
  option.innerHTML =  '<span style="color: #31871c">No matching results found. please check the Task ID or Custom Task ID !<span>'; 
  document.querySelector('#customIdTaskList_results').appendChild(option); 
  searchedResultsubmit.style.display = 'none';
 }

      });
};


/*
* Dependant drop-down: Generation Spaces when page load : folderless
*/
async function folderless_onLoadSpaces() {
let TEAM_ID = sessionStorage.getItem('TEAM_ID');
let spaceListUrl = 'team/'+TEAM_ID+'/space?archived=false';

  getData(spaceListUrl)
    .then(data => {  
     document.querySelector("#folderless_space_list").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select Space -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#folderless_space_list').appendChild(option);


     data.spaces.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#folderless_space_list').appendChild(option);
    });
      });
};

/*
* Dependant drop-down: Generation Lists : folderless
*/
document.getElementById("folderless_space_list").addEventListener("change", function() {
//call function here
let space_id = document.querySelector('#folderless_space_list').value;
let get_folderless_lists = 'space/'+space_id+'/list?archived=false';

  getData(get_folderless_lists)
    .then(data => {  
     document.querySelector("#folderless_listOf_list").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select List -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#folderless_listOf_list').appendChild(option);


     data.lists.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#folderless_listOf_list').appendChild(option);
    });
      });
});


/*
* Dependant drop-down: Generation Tasks : folderless
*/
document.getElementById("folderless_listOf_list").addEventListener("change", function() {
//call function here
let list_id = document.querySelector('#folderless_listOf_list').value;
let get_folderless_list = 'list/'+list_id+'/task?archived=false';

  getData(get_folderless_list)
    .then(data => {  
     document.querySelector("#folderless_listOf_task").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select List -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#folderless_listOf_task').appendChild(option);

     data.tasks.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#folderless_listOf_task').appendChild(option);
    });
      });
});




/*
* Radio buttons options
*/
var radios = document.querySelectorAll('input[type=radio][name="cuSearchOption"]');
Array.prototype.forEach.call(radios, function(radio) {
   radio.addEventListener('change', radioChangeHandler);

});


function radioChangeHandler(event) {
   if ( this.value === '1' ) {
 listinsidefolders.style.display = 'block';
  listoutsidefolders.style.display = 'none';
  listsearchbyTask.style.display = 'none';
  but_insideList.classList.add('disabled');
but_outsideList.classList.add('disabled');
but_seachTaskSubmit.classList.add('disabled');
but_insideList.disabled = true;
but_outsideList.disabled = true;
but_seachTaskSubmit.disabled = true;

document.querySelector("#listOf_task").selectedIndex = 0;
document.querySelector("#folderless_listOf_task").selectedIndex = 0;

   } else if ( this.value === '2' ) {
 listoutsidefolders.style.display = 'block';
 listinsidefolders.style.display = 'none';
  listsearchbyTask.style.display = 'none';
  but_insideList.classList.add('disabled');
but_outsideList.classList.add('disabled');
but_seachTaskSubmit.classList.add('disabled');
document.querySelector("#listOf_task").selectedIndex = 0;
document.querySelector("#folderless_listOf_task").selectedIndex = 0;
but_insideList.disabled = true;
but_outsideList.disabled = true;
but_seachTaskSubmit.disabled = true;

   
   }  else if( this.value === '3' ) {
  listsearchbyTask.style.display = 'block';
  listinsidefolders.style.display = 'none';
  listoutsidefolders.style.display = 'none';
  but_insideList.classList.add('disabled');
but_outsideList.classList.add('disabled');
but_seachTaskSubmit.classList.remove('disabled');
document.querySelector("#listOf_task").selectedIndex = 0;
document.querySelector("#folderless_listOf_task").selectedIndex = 0;
but_insideList.disabled = true;
but_outsideList.disabled = true;
but_seachTaskSubmit.disabled = false;
   }else{
    //default
     listinsidefolders.style.display = 'block';
  listoutsidefolders.style.display = 'none';
  listsearchbyTask.style.display = 'none';
  but_insideList.classList.add('disabled');
but_outsideList.classList.add('disabled');
but_seachTaskSubmit.classList.add('disabled');
document.querySelector("#listOf_task").selectedIndex = 0;
document.querySelector("#folderless_listOf_task").selectedIndex = 0;
but_insideList.disabled = true;
but_outsideList.disabled = true;
but_seachTaskSubmit.disabled = true;

   }
}



/*
* If change Enable the sync button
*/
document.getElementById("listOf_task").addEventListener("change", function() {
but_insideList.classList.toggle('disabled');
but_insideList.disabled = false;
});
document.getElementById("folderless_listOf_task").addEventListener("change", function() {
but_outsideList.classList.toggle('disabled');
but_outsideList.disabled = false;
});


/*
* Dependant drop-down: Generation Tasks : inside folders
*/
document.getElementById("listOf_list").addEventListener("change", function() {
//call function here
let list_id = document.querySelector('#listOf_list').value;
let get_listOf_folders = 'list/'+list_id+'/task?archived=false';

  getData(get_listOf_folders)
    .then(data => {  
     document.querySelector("#listOf_task").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select List -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#listOf_task').appendChild(option);


     data.tasks.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#listOf_task').appendChild(option);
    });
      });
});



/*
* Dependant drop-down: Generation Lists : inside folders
*/
document.getElementById("foder_list").addEventListener("change", function() {
//call function here
let folder_id = document.querySelector('#foder_list').value;
let get_listOf_folders = 'folder/'+folder_id+'/list?archived=false';

  getData(get_listOf_folders)
    .then(data => {  
     document.querySelector("#listOf_list").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select List -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#listOf_list').appendChild(option);


     data.lists.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#listOf_list').appendChild(option);
    });
      });
});




/*
* Dependant drop-down: Generation Folders : inside folders
*/
document.getElementById("space_list").addEventListener("change", function() {
//call function here
let space_id = document.querySelector('#space_list').value;
let get_listOf_folders = 'space/'+space_id+'/folder?archived=false';

  getData(get_listOf_folders)
    .then(data => {  
     document.querySelector("#foder_list").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select Folder -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#foder_list').appendChild(option);


     data.folders.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#foder_list').appendChild(option);
    });
      });
});



/*
* Dependant drop-down: Generation Spaces when page load : inside folders
*/
async function onLoadSpaces() {
  let TEAM_ID = sessionStorage.getItem('TEAM_ID');
let spaceListUrl = 'team/'+TEAM_ID+'/space?archived=false';

  getData(spaceListUrl)
    .then(data => {  
     document.querySelector("#space_list").innerHTML = "";
      let option = document.createElement("OPTION");
      let name = document.createTextNode('- Select Space -');
      option.value = ''
      option.appendChild(name);
      document.querySelector('#space_list').appendChild(option);

     data.spaces.forEach(function(item, index) {     
      let option = document.createElement("OPTION");
      let name = document.createTextNode(item.name);
      option.value = item.id;
      option.appendChild(name);
      document.querySelector('#space_list').appendChild(option);
    });
      });


};




  //  GET method implementation:
  async function getData(url_endpoint = '') {
  let API_KEY = sessionStorage.getItem('API_KEY');
  let urlSet = new URL(url_endpoint, URL_SET);
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

  //  POST method implementation:
  async function postData(url_endpoint = '', data = {}) {
  let API_KEY = sessionStorage.getItem('API_KEY');
  let urlSet = new URL(url_endpoint, URL_SET);
  let loader = document.querySelector('#loader');
  loader.style.display = 'block'

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", API_KEY);
  try{
  let response = await fetch(urlSet, {
  method: 'POST', // *GET, POST, PUT, DELETE, etc.
  headers: myHeaders,
  redirect: 'follow', // manual, *follow, error
  body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  loader.style.display = 'none';
  return await response.json(); // parses JSON response into native JavaScript objects
  }catch(err){
  console.error('Error:', err);
  // Handle errors here
  }
  }

