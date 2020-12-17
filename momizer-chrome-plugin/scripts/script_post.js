function post_printDiv() { 

  var divContents = document.getElementById("notes_container_post").innerHTML; 
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


document.getElementById("print_notes_post").addEventListener("click", post_printDiv);
