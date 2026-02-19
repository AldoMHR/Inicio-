/* CONFIG FIREBASE */
const API_URL="https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo";

/* VARIABLE GLOBAL */
let listaUsuarios=[];

/* CARGAR USUARIOS */
async function cargarUsuarios(){
 const tabla=document.getElementById("tablaUsuarios");
 if(!tabla)return;
 try{
  const res=await fetch(API_URL);
  const data=await res.json();
  if(!data.documents){tabla.innerHTML="<tr><td>No hay usuarios</td></tr>";return;}
  listaUsuarios=data.documents;
  mostrarUsuarios(listaUsuarios);
 }catch(e){console.log(e);}
}

/* MOSTRAR USUARIOS */
function mostrarUsuarios(usuarios){
 const tabla=document.getElementById("tablaUsuarios");
 tabla.innerHTML="";
 usuarios.forEach(doc=>{
  const id=doc.name.split('/').pop();
  const nombre=doc.fields.nombre?.stringValue||"";
  const correo=doc.fields.correo?.stringValue||"";
  const telefono=doc.fields.telefono?.stringValue||"";
  tabla.innerHTML+=`
  <tr class="border-b">
   <td class="p-2">${nombre}</td>
   <td class="p-2">${correo}</td>
   <td class="p-2">${telefono}</td>
   <td class="p-2 space-x-2">
    <button onclick="editarUsuario('${id}','${nombre}','${correo}','${telefono}')" class="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
    <button onclick="eliminarUsuario('${id}')" class="bg-red-500 text-white px-2 py-1 rounded">Eliminar</button>
   </td>
  </tr>`;
 });
}

/* BUSCAR */
function buscarUsuarios(){
 const texto=document.getElementById("buscarUsuario").value.toLowerCase();
 const filtrados=listaUsuarios.filter(doc=>{
  const nombre=doc.fields.nombre?.stringValue||"";
  return nombre.toLowerCase().includes(texto);
 });
 mostrarUsuarios(filtrados);
}

/* FORMULARIO */
function abrirFormulario(){document.getElementById("modalFormulario").classList.remove("hidden");}
function cerrarFormulario(){document.getElementById("modalFormulario").classList.add("hidden");}

/* CREAR */
async function guardarUsuario(){
 const nombre=document.getElementById("nombre").value;
 const correo=document.getElementById("correo").value;
 const telefono=document.getElementById("telefono").value;
 const password=document.getElementById("password").value;
 if(!nombre||!correo||!telefono||!password){alert("Complete todos los campos");return;}
 const data={fields:{
  nombre:{stringValue:nombre},
  correo:{stringValue:correo},
  telefono:{stringValue:telefono},
  password:{stringValue:password}
 }};
 await fetch(API_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 alert("Usuario creado");
 cerrarFormulario();
 cargarUsuarios();
}

/* EDITAR */
async function editarUsuario(id,nombreActual,correoActual,telefonoActual){
 const nuevoNombre=prompt("Nuevo nombre:",nombreActual); if(!nuevoNombre)return;
 const nuevoCorreo=prompt("Nuevo correo:",correoActual); if(!nuevoCorreo)return;
 const nuevoTelefono=prompt("Nuevo telefono:",telefonoActual); if(!nuevoTelefono)return;
 const nuevoPassword=prompt("Nueva contraseña:"); if(!nuevoPassword)return;
 const URL=`https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?updateMask.fieldPaths=nombre&updateMask.fieldPaths=correo&updateMask.fieldPaths=telefono&updateMask.fieldPaths=password&key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;
 const data={fields:{
  nombre:{stringValue:nuevoNombre},
  correo:{stringValue:nuevoCorreo},
  telefono:{stringValue:nuevoTelefono},
  password:{stringValue:nuevoPassword}
 }};
 await fetch(URL,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
 alert("Usuario actualizado");
 cargarUsuarios();
}

/* ELIMINAR */
async function eliminarUsuario(id){
 if(!confirm("Eliminar usuario?"))return;
 const URL=`https://firestore.googleapis.com/v1/projects/anssad-7f1ad/databases/(default)/documents/usuarios/${id}?key=AIzaSyCVduieCevakadTPLqsQZISrSPfVviJBWo`;
 await fetch(URL,{method:"DELETE"});
 alert("Usuario eliminado");
 cargarUsuarios();
}

/* INICIO */
window.onload=cargarUsuarios;
