

var x_path_captions="/html/body/div[1]/c-wiz/div[1]/div/div[8]/div[3]/div[5]";

var x_path_captionsbutton="/html/body/div[1]/c-wiz/div[1]/div/div[8]/div[3]/div[9]/div[3]/div[2]/div/span/span/div";
var x_path_endcallbutton="/html/body/div[1]/c-wiz/div[1]/div/div[8]/div[3]/div[9]/div[2]/div[2]/div/div[1]";
var x_path_body=         "/html/body/div[1]/c-wiz/div[1]/div/div[8]/div[3]/div[1]/div[1]";
var x_path_rejoin="/html/body/div[1]/c-wiz/div/div[3]/div[1]";
var x_path_postmessage="/html/body/div[1]/c-wiz/div/div[1]";



var meeting_id='';
var meeting_name='';
var meeting_link='';
var notes_container;
var fresh='';
var head =null;
var loose_text='';
var old_obj=null;
var flush=null;
var zebra_stripe=0;


// Hackday Functions ----------------------------------------------//
var momiser_meeting_id = Date.now();
var momiser_service_endpoint = 'http://localhost:9090'
var log_dialogue_url = momiser_service_endpoint+'/hackday/log'


//-------------------------------- HTTP functions ------------------------------
function http_post(url,jsonRequest,callback){
var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader("Accept", "application/json")
      xhr.setRequestHeader('Access-Control-Allow-Origin', '*')


      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var json = JSON.parse(xhr.responseText);
          callback(json)
        }
      };
      xhr.send(JSON.stringify(jsonRequest));
}

function http_get(url,callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json")
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      callback(json)
    }
  };
  xhr.send(null);
}

function http_put(url,jsonRequest,callback){
  var xhr = new XMLHttpRequest();
  xhr.open("PUT", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Accept", "application/json")
  xhr.setRequestHeader('Access-Control-Allow-Origin', '*')
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var json = JSON.parse(xhr.responseText);
      callback(json)
    }
  };
  xhr.send(JSON.stringify(jsonRequest));
}
 //-------------------------------------
function simple_test_logger(response){
  console.log(response);
}

function log_dialogue(user,content){
  console.log(user+"\t"+content)
  http_post(log_dialogue_url,{"userName":user,"content":content,"meetingId":momiser_meeting_id},simple_test_logger)
}


//------------------- Hackday functions End -------------------------












function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

const captionButtonShown = setInterval(() => {
  
  let captions_button = getElementByXpath(x_path_captionsbutton);

  if (captions_button) {

    turnon_captions();
    hide_captions_button();
    clearInterval(captionButtonShown);
  }
}, 10);

const callJoined = setInterval(() => {
  
  // endCallButton = document.querySelector('[jsname="CQylAd"]')
  endCallButton =  getElementByXpath(x_path_endcallbutton);
  let where_to_add=getElementByXpath(x_path_body);
  
  if (endCallButton&&where_to_add) {
    
    

    add_notes_section();

    var s = document.createElement('script');

    s.src = chrome.runtime.getURL('scripts/script.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.body).appendChild(s);
    
    clearInterval(callJoined);
  }
}, 10);

const callEnded = setInterval(() => {

  //here you are in the call  and are checking for rejoin button


  if(meeting_link=='')
  {
    meeting_link=document.querySelector("link[rel='canonical']").href;
  }
  if(meeting_id=='')
  {
    meeting_id=meeting_link.split("_meet/")[1];
  } 
  if(meeting_name==''||meeting_name=='Meet'||meeting_name.includes(meeting_id))
  {
    meeting_name=document.title;
  }

 /* var myEle = document.getElementById("notes")!== null;
 // var where_to_add=document.querySelector('[jscontroller="J3CtX"]')!== null;
  
  //var where_to_add=body_div!== null;
  if(!myEle&&where_to_add!==null){
    console.log(where_to_add);
  
  }*/

  //push captions to queue if not empty
  if(getElementByXpath(x_path_captions))
  {
    // var html_content=document.querySelector('[jscontroller="D1tHje"]').innerHTML;
    var html_element=getElementByXpath(x_path_captions);
   
    var html_content=html_element.innerHTML;
    // if(document.querySelector('[jscontroller="LM3KPc"]').textContent!="")
    {
     
      fresh=$( "<div>"+html_content +"</div>").children('div').last();
      fresh.find("*").removeClass();
      process_realtime(fresh);
      notes_container=$("#notes_container").html();
     
    }
     

   }


  rejoinButton = getElementByXpath(x_path_rejoin);


  if (rejoinButton) {
      
    //add the post call section
    let postmessage=getElementByXpath(x_path_postmessage);
    postmessage.textContent ="You left the meeting. Take some time out to review your notes and save what you need";
    var node = document.createElement("div");     
    node.id="notes_container_post";
    node.style.padding="10px";
    node.contentEditable=true;
    node.innerHTML=notes_container;
    node.backgroundColor="#efefef";
    node.style.overflow="auto";
    node.boxShadow="box-shadow: 1px 2px 3px 3px #cdcdcd";
    node.style.width="700px";
    node.style.maxHeight="900px";
    postmessage.parentElement.insertBefore(node, document.querySelector('[jsname="r4nke"]').nextSibling);
    document.getElementById("notes_header").style.fontSize="2.2em";
    document.getElementById("notes_header").style.boxShadow="none";
    document.getElementById("toggle_collapse").style.display="none";
    document.getElementById("notes").style.display="block";
    document.getElementById("notes_footer").style.boxShadow="none";
    node.style.border= "2px solid #eeeeee";
    document.getElementById("notes").style.textAlign="left";
    document.getElementById("print_notes").id="print_notes_post";
    
    var s = document.createElement('script');

    s.src = chrome.runtime.getURL('scripts/script_post.js');
    s.onload = function() {
        this.remove();
    };
    (document.head || document.body).appendChild(s);
    
    var head = document.getElementsByTagName('head')[0];

    var style = document.createElement('link');
    style.href = chrome.runtime.getURL('scripts/print.css');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.media="print";
    head.append(style);
    
    clearInterval(callEnded);
}
}, 100);


function turnon_captions()
{


  let captions_button = getElementByXpath(x_path_captionsbutton);
  captions_button.click();
 

}

function hide_captions_button()
{

  let captions_button = document.querySelector('[jsname="r8qRAd"]');
  
  captions_button.disabled=true;
  captions_button.style.display="none";
 

}



function process_realtime(new_obj)
{
 
  

   // var q1=old_obj;
   var  speaker1='';
    var  speaker2='';
    var  text1='';
    var  text2='';
    var t1_len='';
    var t2_len='';
  
    if(!old_obj)
    {
      old_obj=new_obj;
      return;
    }
    else if(new_obj.text()==''&&old_obj.text()=='')
    {
      return;
    }

    else if(new_obj.text()==''&&old_obj.text()!='')
    {
      speaker1= get_speaker(old_obj);
    speaker2= '';
    text1= get_text(old_obj);
    text2= '';
    t1_len=text1.length;
    t2_len=0;
  }
    
    else{

    var  speaker1= get_speaker(old_obj);
    var  speaker2= get_speaker(new_obj);
    var  text1= get_text(old_obj);
    var  text2= get_text(new_obj);
    var t1_len=text1.length;
    var t2_len=text2.length;
  }

    if(!speaker1&&!speaker2)
    {
     
      return
    }
    if(!speaker1)
    {
      old_obj=new_obj;
      return;
    }
    //ignore if s1 is empt and s2 isnt
   if(speaker1!=speaker2||!speaker2)
    {
    //  console.log("p1 .. speaker change or no speaker2");
     // console.log("speaker 1"+speaker1);
    //  console.log("speaker 2"+speaker2);
      if(!head)
      {
        head=new_obj;
        return;
      }
      let today = new Date();
      let hours=today.getHours();
      let mins =today.getMinutes();
      if(hours<10)
      {hours="0"+hours.toString();}
      if(mins<10)
      {mins="0"+mins.toString();}
     
      let time = hours+":"+mins;
      let zebra_css='';
      if(zebra_stripe==0)
      {
        zebra_stripe=1;
        zebra_css="rgba(0,121,107,0.15)";

      }
      else
      {
        zebra_stripe=0
        zebra_css="rgba(121,0,107,0.15)";

      }
      current_speaker = head.find('div').first().html()
      content = Object.assign({},{"val": loose_text});
      head.find('div').first().after("<div style='"+zebra_css+";'>"+loose_text+"</div><div style='float:right; max-width:24px;'><img style='cursor:pointer; max-width:24px;' class='inline_edit' src='"+chrome.runtime.getURL('scripts/edit.png')+"' /></div>");
      head.find('div').first().css("display","inline");
      head.find('div').first().css("line-height","40px");
      head.find('div').first().css("vertical-align","text-bottom");
      head.find('div').first().html(head.find('div').first().html()+" - "+time);
      head.css("background-color",zebra_css);
      log_dialogue(current_speaker,content["val"])
      loose_text='';
      var myEle = document.getElementById("notes");  
      if(head.text()!==""&&myEle)
      {

        myEle.appendChild(head[0]);}
      
      head=null;
      notes_container=$("#notes_container").html();
      
    }
    else
    {
      if(compare_strings(text1.substring(0,20),text2.substring(0,20))>10||(t1_len&&t2_len&&t1_len<20))
      {
        head=new_obj;
      //  console.log("p2 .. betterment .. no scroll");
      // guessing ths is betterment.. no scroll
      }
      else
      {
       
        var t1=get_text(head);
        var t2=get_text(new_obj);
     
        var breaker =0;
        while(breaker<500)
        {
          if(compare_strings(t1.substring(breaker,30+breaker),t2.substring(0,30))>7)
          {
            break;
          }
          breaker++;
        }
      
        //q2.find('div').first().append("<div>"+t1.substring(0,breaker)+"</div>")
        loose_text=loose_text+" "+t1.substring(0,breaker);
        console.log(loose_text);
      //  console.log("p3 ..scroll");
        head=new_obj;

      }
      //if first 20 characters have 90% match ints a continuation..keep q2 as the latest
      //else its a scroll
      //addition - head is q2
      //continuation head is q2 with additions fom q1
    }
    
    
    old_obj=new_obj;

}



function get_speaker(obj)
{
  return obj.find('img').attr("src");
}

function get_text(obj)
{
  var lobj=obj.clone();
  lobj.find('div').first().text("");
  return lobj.text();
}

function compare_strings(s1,s2)
{
  var pointer=0;
  for(var i=0;i<s1.length;i++)
  {
    if(s1[i]==s2[i])
    {
      pointer++;
    }
    else
    {
      pointer--;
    }

  }
  return pointer;
}

function add_notes_section()
{
  
  
         
  var div = document.createElement('div');
  div.id = 'notes_container';
  div.style.position = 'absolute';
  div.style.top = '10%';
  div.style.right = '0px';
  div.style.width = '18%';   
  div.style.color = 'black'; 
  div.style.height = '100%';
  div.style.marginRight = '1%';  
  div.style.borderRadius = '4px'; 
  
  
  div.style.backgroundColor = 'white';
  let date = new Date();
  let res = date.toISOString();
  div.style.zIndex = '10';
  div.contentEditable=false;
  div.innerHTML='<div id="toggle_collapse" contenteditable="false" style =" background-color: white; float: left;  margin-left: -25px;  font-size: 30px;  width: 30px;  text-align: center;  border-radius: 5px;  vertical-align: middle;  cursor: pointer;" class="expanded"  >&#x25B2;</div><div id="notes_header" style=" height:10%; font-size:1.2em; width:100%; text-align:center;box-shadow:0px 3px 4px 2px #88888885" contenteditable="false"><div style="padding-top:5%">'+meeting_name+' - '+ res.substring(0, 10) + '</div></div><div id="notes" style="margin-top:1%; overflow-y:scroll; overflow-x:hidden; height: 80%; "></div><div contenteditable="false" id="notes_footer" style="height:9%; box-shadow:0px -3px 4px 2px #88888885; text-align:center; "><a id="print_notes"><img style="height:80%; max-height:30px; margin-top:5px;" src="'+chrome.runtime.getURL('scripts/print.jpg')+'" /></a><a id="minimize"></a></div>';
 

  //document.body.appendChild( div );
  var where_to_add=getElementByXpath(x_path_body);
  where_to_add.after( div );
  where_to_add.style.width="80%";    

  
  var head = document.getElementsByTagName('head')[0];

  var style = document.createElement('link');
  style.href = chrome.runtime.getURL('scripts/print.css');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.media="print";
  head.append(style);

  $("#notes_container").draggable({ handle: "#notes_header" });
  $("#notes_container").resizable({aspectRatio: true,
    handles: 'n, e, s, w'});
}

$.fn.outerHTML = function(){
 
  // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
  return (!this.length) ? this : (this[0].outerHTML || (
    function(el){
        var div = document.createElement('div');
        div.appendChild(el.cloneNode(true));
        var contents = div.innerHTML;
        div = null;
        return contents;
  })(this[0]));

}
