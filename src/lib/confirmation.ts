// Only standalone affirmative responses to a visible, pending proposal count.
// Corrections, conditions and negations are never treated as approval.
export function isConfirmation(value:string):boolean {
 if(value.includes('?'))return false;
 const s=value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’‘]/g,"'").trim().replace(/[.!¡¿,;:]+/g,' ').replace(/\s+/g,' ').trim();
 return /^(?:yes|yeah|yep|yup|sure|ok|okay|confirmed|confirm|proceed|go ahead|do it|save it|send it|looks good|that's correct|that is correct|correct|perfect|sounds good|that's fine|that's right|all good|(?:yes|yeah|yep|sure|ok|okay) (?:please|confirm|proceed|go ahead|do it|save it|send it|that's correct|that is correct|looks good|sounds good|that's fine|that's right|confirmed|correct)|si|claro|vale|dale|de una|ta bien|listo|perfecto|correcto|confirmo|confirmar|confirmado|adelante|de acuerdo|esta bien|hazlo|guardalo|envialo|(?:si|claro|vale|dale) (?:por favor|confirmo|confirmar|adelante|dale|esta bien)|oui|ouais|d'accord|parfait|confirme|confirmer|confirmez|c'est bon|allez-y|vas-y|oui (?:merci|je confirme))$/.test(s);
}
