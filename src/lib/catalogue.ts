import type {Locale} from './content';
// No invented inventory or reviews. Add confirmed records here and provide all three translations.
type Localized = Record<Locale,string>;
export type Product = {id:string; name:Localized; description:Localized; image:string; category:'sale'|'rent'|'clothing'; details?: Localized; availability?: Localized};
// A permission-cleared reposted Instagram story, stored locally (not an expiring embed).
export type Review = {id:string; name:string; image:string; alt:Localized; caption?:Localized; sourceUrl?:string};
export const products: Product[] = [];
export const reviews: Review[] = [];

// Concept images from the original brand kit are not actual inventory. They are displayed only in previews.
export const shopCopy = {
 en:{communityTitle:'From our community',boardFinal:'Find the right board.',clothingFinal:'Find your Península style.',backShop:'Back to the surf shop',saleLabel:'Buy a board',rentLabel:'Rent a board',concept:'Brand concept · not confirmed stock',empty:'Ask Cristian for current availability.',conceptIntro:'Collection concepts from the brand kit. Actual products and availability to be confirmed.',items:['Graphic tee','Surf tee','Caps','Beach tote'],itemCta:'Ask about this style',saleFacts:'Tell us your level, preferred board type and budget.',rentFacts:'Tell us your dates, surfing level and preferred board.',productCta:'Enquire about this item',browse:'Explore the collection'},
 es:{communityTitle:'Nuestra comunidad',boardFinal:'Encuentra la tabla ideal.',clothingFinal:'Encuentra tu estilo Península.',backShop:'Volver a la tienda de surf',saleLabel:'Compra una tabla',rentLabel:'Alquila una tabla',concept:'Concepto de marca · stock no confirmado',empty:'Consulta la disponibilidad actual con Cristian.',conceptIntro:'Conceptos de la colección de la marca. Productos y disponibilidad por confirmar.',items:['Camiseta gráfica','Camiseta de surf','Gorras','Bolso de playa'],itemCta:'Consulta este estilo',saleFacts:'Cuéntanos tu nivel, tipo de tabla y presupuesto.',rentFacts:'Indícanos tus fechas, nivel y tipo de tabla preferido.',productCta:'Consulta este producto',browse:'Explora la colección'},
 fr:{communityTitle:'Notre communauté',boardFinal:'Trouvez la bonne planche.',clothingFinal:'Trouvez votre style Península.',backShop:'Retour à la boutique de surf',saleLabel:'Acheter une planche',rentLabel:'Louer une planche',concept:'Concept de marque · stock non confirmé',empty:'Demandez les disponibilités à Cristian.',conceptIntro:'Concepts de la collection de la marque. Produits et disponibilités à confirmer.',items:['T-shirt graphique','T-shirt surf','Casquettes','Sac de plage'],itemCta:'Se renseigner sur ce style',saleFacts:'Indiquez votre niveau, type de planche et budget.',rentFacts:'Indiquez vos dates, votre niveau et le type de planche souhaité.',productCta:'Se renseigner sur cet article',browse:'Découvrir la collection'}
};
