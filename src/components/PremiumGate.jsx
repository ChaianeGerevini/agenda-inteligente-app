import { useState } from "react";
import { useUser } from "../contexts/UserContext";
import UpgradeCard from "./UpgradeCard";
import { motion } from "framer-motion";


function PremiumGate({
  children,
  recurso="Recurso Premium"
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


<div style={styles.blur}>

{children}

</div>



<div style={styles.overlay}>

<UpgradeCard

titulo={recurso}

descricao="Esse recurso faz parte do plano Premium."

variant="modal"

/>

</div>


</div>

)

}



const styles={


container:{

position:"relative",

width:"100%",

minHeight:"70vh",

},


blur:{


filter:"blur(5px)",

pointerEvents:"none",

userSelect:"none",

opacity:.5


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
"blur(3px)",


zIndex:10,


padding:20


}


}



export default PremiumGate;