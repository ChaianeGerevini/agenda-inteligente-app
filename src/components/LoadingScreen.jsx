import logo from "/src/assets/agendly-logo.jpg";


export default function LoadingScreen(){

return (

<div style={styles.container}>

<img
src={logo}
style={styles.logo}
/>

<p>
Carregando Agendly...
</p>

</div>

)

}


const styles={

container:{
height:"100vh",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
background:"#F4F7FF",
},

logo:{
width:90,
height:90,
borderRadius:"50%"
}

}