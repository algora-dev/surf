'use client';
import * as React from 'react';
import {copy,type Locale} from '../lib/content';
const extra=[
 ['beach-group-warmup','Group warming up on the beach','Grupo calentando en la playa','Échauffement collectif sur la plage'],
 ['one-to-one-beach-instruction','One-to-one surf instruction on the sand','Instrucción individual de surf en la arena','Cours individuel de surf sur le sable'],
 ['group-beach-briefing','Surf group listening to beach instruction','Grupo escuchando instrucciones en la playa','Groupe écoutant les consignes sur la plage'],
 ['group-pop-up-practice','Surfers practising their stance on the beach','Surfistas practicando la postura en la playa','Surfeurs travaillant leur position sur la plage'],
 ['young-surfers-with-boards','Young surfers with their boards','Jóvenes surfistas con sus tablas','Jeunes surfeurs avec leurs planches'],
 ['surf-lesson-from-above','Surf lesson in turquoise water viewed from above','Clase de surf en agua turquesa vista desde arriba','Cours de surf dans une eau turquoise vu du ciel'],
 ['surfers-with-green-boards','Surf group with green boards on the beach','Grupo con tablas verdes en la playa','Groupe avec des planches vertes sur la plage']
] as const;
export const lessonSlides=(locale:Locale)=>{
 const a=copy[locale].alt,n=locale==='en'?1:locale==='es'?2:3;
 const gallery=[{src:'/media/instruction.webp',alt:a[5]},{src:'/media/group.webp',alt:a[4]},{src:'/media/student.webp',alt:a[6]}];
 return [gallery[0],...extra.map(item=>({src:`/media/lessons-gallery/${item[0]}.webp`,alt:item[n]})),...gallery.slice(1)];
};
const portraitFiles=new Set(['beach-group-warmup','one-to-one-beach-instruction','group-pop-up-practice','young-surfers-with-boards'].map(name=>`/media/lessons-gallery/${name}.webp`));
const labels={en:{region:'Surf lesson photos',prev:'Previous photo',next:'Next photo',pause:'Pause slideshow',play:'Play slideshow',slide:'Photo'},es:{region:'Fotos de clases de surf',prev:'Foto anterior',next:'Foto siguiente',pause:'Pausar fotos',play:'Reproducir fotos',slide:'Foto'},fr:{region:'Photos des cours de surf',prev:'Photo précédente',next:'Photo suivante',pause:'Mettre en pause',play:'Lancer le diaporama',slide:'Photo'}};
const boardAlts={en:['Two people with a white surfboard','Two longboards outdoors','Surfer holding a white board','Two people with a black board','A lineup of surfboards','Surfboards in a display area','A collection of white surfboards','Two surfboards by the sea','A white surfboard outdoors','A row of boards under palm trees','A yellow surfboard','A surfboard outdoors'],es:['Dos personas con una tabla blanca','Dos tablas largas al aire libre','Surfista con una tabla blanca','Dos personas con una tabla negra','Una fila de tablas de surf','Tablas en una zona de exposición','Colección de tablas blancas','Dos tablas junto al mar','Tabla blanca al aire libre','Tablas bajo las palmeras','Tabla amarilla','Tabla al aire libre'],fr:['Deux personnes avec une planche blanche','Deux longboards en extérieur','Surfeur avec une planche blanche','Deux personnes avec une planche noire','Une rangée de planches','Planches en exposition','Collection de planches blanches','Deux planches près de la mer','Planche blanche en extérieur','Planches sous les palmiers','Planche jaune','Planche en extérieur']};
export const boardSlides=(locale:Locale)=>[5,10,1,2,3,4,6,7,8,9,11,12].map(n=>({src:`/media/boards-gallery/board-${String(n).padStart(2,'0')}.webp`,alt:boardAlts[locale][n-1]}));
export const CAROUSEL_INTERVAL=3575;
function ControlIcon({kind}:{kind:'prev'|'next'|'play'|'pause'}){return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{kind==='prev'?<path d="m14 6-6 6 6 6"/>:kind==='next'?<path d="m10 6 6 6-6 6"/>:kind==='pause'?<path d="M9 5v14M15 5v14"/>:<path d="m9 5 10 7-10 7Z"/>}</svg>}
type Props={locale:Locale;asset:(path:string)=>string;gallery?:'lessons'|'boards'};
type State={index:number;playing:boolean;ready:boolean};
export default class LessonCarousel extends React.Component<Props,State>{
 state:State={index:0,playing:false,ready:false};
 timer:ReturnType<typeof setInterval>|undefined;
 motion:MediaQueryList|null=null;
 componentDidMount(){this.motion=window.matchMedia('(prefers-reduced-motion: reduce)');this.setState({ready:true,playing:!this.motion.matches});this.motion.addEventListener?.('change',this.motionChange);document.addEventListener('visibilitychange',this.syncTimer);}
 componentDidUpdate(_p:Props,prev:State){if(prev.playing!==this.state.playing||prev.ready!==this.state.ready)this.syncTimer();}
 componentWillUnmount(){this.stopTimer();this.motion?.removeEventListener?.('change',this.motionChange);document.removeEventListener('visibilitychange',this.syncTimer);}
 motionChange=()=>{if(this.motion?.matches)this.setState({playing:false});};
 stopTimer=()=>{if(this.timer!==undefined){clearInterval(this.timer);this.timer=undefined;}};
 slides=()=>this.props.gallery==='boards'?boardSlides(this.props.locale):lessonSlides(this.props.locale);
 syncTimer=()=>{this.stopTimer();if(this.state.playing&&!document.hidden)this.timer=setInterval(()=>this.setState(s=>({index:(s.index+1)%this.slides().length})),CAROUSEL_INTERVAL);};
 move=(delta:number)=>{const total=this.slides().length;this.setState(s=>({index:(s.index+delta+total)%total,playing:false}));};
 render(){const {locale,asset}=this.props,{index,playing}=this.state,l=labels[locale],slides=this.slides(),region=this.props.gallery==='boards'?({en:'Surfboard photos',es:'Fotos de tablas de surf',fr:'Photos de planches de surf'}[locale]):l.region;return <section className="lesson-carousel" aria-label={region} onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();this.move(e.key==='ArrowLeft'?-1:1);}}}><div className="lesson-carousel-frame" aria-live={playing?'off':'polite'}>{slides.map((slide,i)=><div className={`lesson-slide ${(this.props.gallery==='boards'?!/board-(05|10)\.webp$/.test(slide.src):portraitFiles.has(slide.src))?'portrait':'landscape'} ${i===index?'active':''}`} key={slide.src} aria-hidden={i!==index}><div className="lesson-slide-backdrop" aria-hidden="true" style={{backgroundImage:`url(${asset(slide.src)})`}}/><img src={asset(slide.src)} alt={slide.alt} loading={i===0?'eager':'lazy'} decoding="async"/></div>)}</div><div className="lesson-carousel-controls"><button type="button" aria-label={l.prev} onClick={()=>this.move(-1)}><ControlIcon kind="prev"/></button><span className="lesson-slide-count" aria-label={`${l.slide} ${index+1} / ${slides.length}`}>{index+1} / {slides.length}</span><button type="button" aria-label={l.next} onClick={()=>this.move(1)}><ControlIcon kind="next"/></button><button type="button" aria-label={playing?l.pause:l.play} onClick={()=>this.setState(s=>({playing:!s.playing}))}><ControlIcon kind={playing?'pause':'play'}/></button></div></section>;}
}
