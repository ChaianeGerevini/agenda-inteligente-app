export function isPremium(usuario){

    return usuario?.plano === "premium";

}


export function hasAccess(usuario){

    return isPremium(usuario);

}


export function isBlocked(usuario){

    return !isPremium(usuario);

}