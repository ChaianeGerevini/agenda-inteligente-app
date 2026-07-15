import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";


function UpgradeCard({
  titulo = "Desbloqueie o Premium",
  descricao = "Recursos avançados para seu negócio",
  variant = "card",
  showPrice = true,
}) {


const { usuario } = useUser();

const [checkoutUrl,setCheckoutUrl]=useState(null);
const [loading,setLoading]=useState(false);



useEffect(()=>{


async function prepararCheckout(){


try{


const res = await fetch(

"https://backend-agenda-hgrd.onrender.com/checkout",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

plano:"premium",

email:usuario?.email,

userId:usuario?.uid,

})

}

);



const data=await res.json();


if(data.url){

setCheckoutUrl(data.url);

}


}catch(error){

console.log(
"Erro preparando checkout"
);

}


}



if(usuario?.email){

prepararCheckout();

}


},[usuario]);





async function iniciarCheckout(){


try{


if(checkoutUrl){

window.location.href=checkoutUrl;

return;

}



const res=await fetch(

"https://backend-agenda-hgrd.onrender.com/checkout",

{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

plano:"premium",

email:usuario.email,

userId:usuario.uid

})

}

);



const data=await res.json();



if(data.url){

window.location.href=data.url;

}



}catch(error){

alert(
"Erro ao iniciar checkout"
);


}


}




return (

<motion.div


initial={{
opacity:0,
scale:.9
}}

animate={{
opacity:1,
scale:1
}}

transition={{
duration:.3
}}


style={{
...styles.container,
...styles[variant]
}}


>


<div style={styles.glow}/>



<div style={styles.badge}>
Plano Premium
</div>



<h2>

{titulo}

</h2>


<p style={styles.descricao}>

{descricao}

</p>




<div style={styles.lista}>

<div>✓ Profissionais ilimitados</div>

<div>✓ Ranking da equipe</div>

<div>✓ Relatórios avançados</div>

<div>✓ Sem anúncios</div>

</div>




{
showPrice &&

<div style={styles.preco}>

R$ 19,90
<span>
 /mês
</span>


</div>

}

<button


disabled={loading}


style={styles.botao}


onClick={async()=>{


setLoading(true);


try{

await iniciarCheckout();


}finally{

setLoading(false);

}


}}


>


{
loading

?

"Abrindo checkout..."

:

"Assinar Premium 🚀"

}


</button>



</motion.div>


)

}



const styles={


container:{
position:"relative",
overflow:"hidden",
background:"#ffffff",
borderRadius:24,
padding:28,
boxShadow:
"0 20px 50px rgba(0,0,0,.12)",
textAlign:"center",
border:
"1px solid #e5e7eb"
},

card:{
maxWidth:380,
margin:"auto"
},

modal:{
width:"100%",
maxWidth:380

},



banner:{
display:"flex",
alignItems:"center",
gap:20

},



glow:{
position:"absolute",
width:150,
height:150,
background:"#4A6FFF",
filter:"blur(70px)",
opacity:.15,
top:-50,
right:-50

},

badge:{
display:"inline-block",
background:"#EEF2FF",
color:"#4A6FFF",
padding:"6px 14px",
borderRadius:20,
fontSize:12,
fontWeight:700,
marginBottom:15
},

descricao:{
color:"#64748b",
lineHeight:1.5,
fontSize:14
},

lista:{
marginTop:20,
background:"#F8FAFF",
padding:15,
borderRadius:14,
textAlign:"left",
lineHeight:2,
fontSize:14,
color:"#374151"
},

preco:{
marginTop:20,
fontSize:26,
fontWeight:800,
color:"#111827"
},

botao:{
width:"100%",
marginTop:20,
padding:14,
borderRadius:14,
border:"none",
background:
"linear-gradient(135deg,#4A6FFF,#2563EB)",
color:"#fff",
fontWeight:700,
fontSize:15,
cursor:"pointer"

}


}


export default UpgradeCard;