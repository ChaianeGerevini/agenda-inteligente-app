import { useUser } from "../contexts/UserContext";
import { motion } from "framer-motion";


function PremiumGate({
  children,
  recurso="Recurso Premium",
  descricao="Essa funcionalidade está disponível no plano Premium."
}) {


const {
 usuario,
 loadingUser,
 isPremium
}=useUser();



if(loadingUser){

return null;

}


if(!usuario){

return null;

}



if(isPremium()){

return children;

}



return (

<div style={styles.container}>


<div style={styles.contentBlur}>

{children}

</div>



<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

style={styles.overlay}

>


<div style={styles.card}>


<div style={styles.lock}>

🔒

</div>



<h2>

{recurso}

</h2>


<p>

{descricao}

</p>



<button style={styles.button}>

Fazer Upgrade Premium

</button>


</div>


</motion.div>


</div>

)


}




const styles={


container:{

position:"relative",

width:"100%",

minHeight:"70vh",

overflow:"hidden"

},


contentBlur:{


filter:"blur(10px)",

opacity:.35,

pointerEvents:"none",

userSelect:"none"


},



overlay:{


position:"absolute",

inset:0,


display:"flex",

alignItems:"center",

justifyContent:"center",


background:

"rgba(255,255,255,.35)",


backdropFilter:

"blur(4px)",


zIndex:5


},



card:{


width:"280px",

background:

"rgba(255,255,255,.85)",


backdropFilter:

"blur(20px)",


borderRadius:20,


padding:25,


textAlign:"center",


boxShadow:

"0 20px 50px rgba(0,0,0,.15)",


border:

"1px solid rgba(255,255,255,.5)"


},



lock:{

fontSize:28,

marginBottom:10

},



button:{


width:"100%",


padding:13,


border:"none",


borderRadius:12,


background:"#4A6FFF",


color:"#fff",


fontWeight:700,


cursor:"pointer"


}


}



export default PremiumGate;