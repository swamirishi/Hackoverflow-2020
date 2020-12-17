function printDiv() { 

  var divContents = document.getElementById("notes_container").innerHTML; 
  var a = window.open('', '', 'height=500, width=700'); 
  a.document.write('<html>'); 
  a.document.write('<body >'); 
  a.document.write(divContents); 
  
  a.document.write('</body></html>'); 
  a.document.getElementById("notes").style.overflowX="unset";
  a.document.getElementById("notes").style.overflowY="unset";
  a.document.getElementById("notes_footer").style.display="none";
  a.document.getElementById("notes_header").style.boxShadow="none";
  a.document.getElementById("toggle_collapse").style.display="none";
  a.print(); 
  a.document.close(); 
 
} 


function toggleCollapse() { 
 
  var toggle_icon = document.getElementById("toggle_collapse");

  if(toggle_icon.classList.contains("expanded"))
  {

    toggle_icon.className = '';
    toggle_icon.classList.add("collapsed");
    let notes=document.getElementById("notes");
    let notes_footer=document.getElementById("notes_footer");
    let notes_header=document.getElementById("notes_header");
    notes.style.display="none";
    notes_footer.style.display="none";
    notes_header.style.display="none";
    toggle_icon.innerHTML="&#x25BC;";
    let notes_container=document.getElementById("notes_container");
    notes_container.style.minHeight="0px";
    notes_container.style.height="0px";
  }
  else{
    toggle_icon.className = '';
    toggle_icon.classList.add("expanded");
    
    let notes=document.getElementById("notes");
    let notes_footer=document.getElementById("notes_footer");
    let notes_container=document.getElementById("notes_container");
    let notes_header=document.getElementById("notes_header");
    notes_header.style.display="block";
    notes_container.style.minHeight="600px";
    notes.style.display="block";
    notes_footer.style.display="block";
    toggle_icon.innerHTML="&#x25B2;";

  }
  
 
} 


document.getElementById("print_notes").addEventListener("click", printDiv);

document.getElementById("toggle_collapse").addEventListener("click", toggleCollapse);

function live (eventType, elementQuerySelector, cb) {
  document.addEventListener(eventType, function (event) {

      var qs = document.querySelectorAll(elementQuerySelector);

      if (qs) {
          var el = event.target, index = -1;
          while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
              el = el.parentElement;
          }

          if (index > -1) {
              cb.call(el, event);
          }
      }
  });
}

live('click', '.inline_edit', function(event) { 
  
  
  event.srcElement.parentNode.nextSibling.classList.add("editable_space");
  event.srcElement.parentNode.nextSibling.style.backgroundColor="white";
  event.srcElement.parentNode.nextSibling.contentEditable="true";
  event.srcElement.parentNode.nextSibling.focus();
  setEndOfContenteditable(event.srcElement.parentNode.nextSibling);
});



live('focusout', '.editable_space', function(event) { 
  

  event.srcElement.style.backgroundColor="initial";
});

function setEndOfContenteditable(contentEditableElement)
{
    var range,selection;
    if(document.createRange)//Firefox, Chrome, Opera, Safari, IE 9+
    {
        range = document.createRange();//Create a range (a range is a like the selection but invisible)
        range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        selection = window.getSelection();//get the selection object (allows you to change selection)
        selection.removeAllRanges();//remove any selections already made
        selection.addRange(range);//make the range you have just created the visible selection
    }
    else if(document.selection)//IE 8 and lower
    { 
        range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
        range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
        range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
        range.select();//Select the range (make it the visible selection
    }
}