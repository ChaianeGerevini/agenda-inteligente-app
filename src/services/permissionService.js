export function podeAdicionarMembro(usuario, totalEquipe){

    if(usuario?.plano === "premium"){
        return true;
    }


    return totalEquipe < 1;

}