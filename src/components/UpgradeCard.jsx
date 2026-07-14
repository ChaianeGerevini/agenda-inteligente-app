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

⭐ Premium

</div>



<div style={styles.icon}>

🔒

</div>



<h2>

{titulo}

</h2>


<p style={styles.descricao}>

{descricao}

</p>




<div style={styles.lista}>


<div>
✨ Profissionais ilimitados
</div>

<div>
📊 Relatórios avançados
</div>

<div>
🏆 Ranking da equipe
</div>

<div>
🚫 Sem anúncios
</div>

<div>
🎧 Suporte prioritário
</div>


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

background:

"rgba(255,255,255,.75)",


backdropFilter:

"blur(20px)",


borderRadius:28,


padding:30,


boxShadow:

"0 25px 60px rgba(0,0,0,.15)",


textAlign:"center",


border:

"1px solid rgba(255,255,255,.5)"


},



card:{


maxWidth:420,

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

width:180,

height:180,

background:"#4A6FFF",

filter:"blur(80px)",

opacity:.25,

top:-60,

right:-60


},



badge:{


position:"absolute",

top:15,

right:15,

background:"#4A6FFF",

color:"#fff",

padding:"6px 12px",

borderRadius:20,

fontSize:12,

fontWeight:700


},



icon:{


fontSize:50,

marginBottom:10


},



descricao:{


color:"#64748b",

lineHeight:1.5

},



lista:{


textAlign:"left",

background:"#EEF2FF",

padding:20,

borderRadius:18,

lineHeight:2


},



preco:{


fontSize:28,

fontWeight:800,

marginTop:20,

color:"#111827"


},



botao:{


width:"100%",


marginTop:20,


padding:15,


borderRadius:16,


border:"none",


background:

"linear-gradient(135deg,#4A6FFF,#2563eb)",


color:"#fff",


fontWeight:700,


fontSize:16,


cursor:"pointer"


}



}


export default UpgradeCard;