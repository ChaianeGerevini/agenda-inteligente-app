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
const premium = usuario?.plano === "premium";

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



if (usuario?.email && !premium) {
    prepararCheckout();
}


}, [usuario, premium]);




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

async function abrirPortalStripe() {
  try {
    const res = await fetch(
  "https://backend-agenda-hgrd.onrender.com/checkout/customer-portal",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: usuario.uid,
        }),
      }
    );

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    }
  } catch (err) {
    alert("Erro ao abrir gerenciamento da assinatura.");
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
  {premium ? "Assinatura" : "Plano Premium"}
</div>

<h2>
  {premium ? "Sua assinatura está ativa" : titulo}
</h2>

<p style={styles.descricao}>
  {premium
    ? "Gerencie sua assinatura e seus benefícios."
    : descricao}
</p>




{premium ? (
  <div style={styles.lista}>
    <div>🟢 Status: Ativa</div>
    <div>⭐ Plano: Premium</div>
    <div>✓ Profissionais ilimitados</div>
    <div>✓ Relatórios avançados</div>
  </div>
) : (
  <div style={styles.lista}>
    <div>✓ Profissionais ilimitados</div>
    <div>✓ Ranking da equipe</div>
    <div>✓ Relatórios avançados</div>
    <div>✓ Sem anúncios</div>
  </div>
)}




{
showPrice && !premium &&
<div style={styles.preco}>

R$ 19,90
<span>
 /mês
</span>


</div>

}

{premium ? (
  <button
    style={styles.botao}
    onClick={abrirPortalStripe}
  >
    Gerenciar assinatura
  </button>
) : (
  <button
    disabled={loading}
    style={styles.botao}
    onClick={async () => {
      setLoading(true);

      try {
        await iniciarCheckout();
      } finally {
        setLoading(false);
      }
    }}
  >
    {loading
      ? "Abrindo checkout..."
      : "Assinar Premium 🚀"}
  </button>
)}



</motion.div>


)

}



const styles={


container:{
  position:"relative",
  width:"100%",
  boxSizing:"border-box",
  background:"#ffffff",
  borderRadius:24,
  padding:20,
  boxShadow:"0 20px 50px rgba(0,0,0,.12)",
  textAlign:"center",
  border:"1px solid #e5e7eb",
  overflow:"hidden"
},

card:{
  width:"100%",
  maxWidth:"100%",
  margin:"auto",
  boxSizing:"border-box"
},

modal:{
  width:"100%",
  maxWidth:"100%",
  boxSizing:"border-box"
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
  right:-50,
  pointerEvents:"none"
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