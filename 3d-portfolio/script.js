import * as THREE from "three";

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

window.addEventListener("load", () => {
  gsap.to(".loader-bar span",{scaleX:0,duration:1,ease:"power3.inOut"});
  gsap.to("#loader",{opacity:0,duration:.7,delay:.75,onComplete:()=>$("#loader").remove()});
});

const menuBtn=$("#menu-btn"), nav=$("#nav-menu");
menuBtn?.addEventListener("click",()=>nav.classList.toggle("active"));
$$(".navbar nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("active")));

const typed=$("#typed");
const roles=["AI/ML Developer","Web Developer","3D Experience Designer","Computer Vision Enthusiast"];
let role=0, char=0, deleting=false;
function typeLoop(){
  const word=roles[role];
  typed.textContent=deleting ? word.slice(0, --char) : word.slice(0, ++char);
  let delay=deleting?45:80;
  if(!deleting && char===word.length){deleting=true;delay=1200}
  else if(deleting && char===0){deleting=false;role=(role+1)%roles.length;delay=350}
  setTimeout(typeLoop,delay);
}
typeLoop();

const canvas=$("#webgl");
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000);
camera.position.set(0,0,7);
const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace;

scene.add(new THREE.AmbientLight(0xffffff,.55));
const key=new THREE.PointLight(0xffffff,7,25);key.position.set(4,3,5);scene.add(key);
const fill=new THREE.PointLight(0xffffff,4,25);fill.position.set(-5,-2,2);scene.add(fill);

const group=new THREE.Group();scene.add(group);
const core=new THREE.Mesh(new THREE.IcosahedronGeometry(1.25,2),new THREE.MeshStandardMaterial({color:0x161616,metalness:.95,roughness:.16}));
group.add(core);
const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.33,2),new THREE.MeshBasicMaterial({color:0xffffff,wireframe:true,transparent:true,opacity:.14}));
group.add(wire);
const torus1=new THREE.Mesh(new THREE.TorusGeometry(1.9,.012,12,100),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.24}));
torus1.rotation.x=Math.PI/2.2;group.add(torus1);
const torus2=torus1.clone();torus2.scale.setScalar(1.18);torus2.rotation.y=Math.PI/2.5;group.add(torus2);

const pg=new THREE.BufferGeometry(), count=1500, pos=new Float32Array(count*3);
for(let i=0;i<count;i++){const r=5+Math.random()*7,t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1);pos[i*3]=r*Math.sin(p)*Math.cos(t);pos[i*3+1]=r*Math.sin(p)*Math.sin(t);pos[i*3+2]=r*Math.cos(p)}
pg.setAttribute("position",new THREE.BufferAttribute(pos,3));
scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0xffffff,size:.014,transparent:true,opacity:.55})));

const mouse={x:0,y:0};
addEventListener("mousemove",e=>{
  mouse.x=e.clientX/innerWidth*2-1;
  mouse.y=-(e.clientY/innerHeight)*2+1;
  const glow=$(".cursor-glow"); if(glow){glow.style.left=e.clientX+"px";glow.style.top=e.clientY+"px";}
});

const clock=new THREE.Clock();
function render(){
  requestAnimationFrame(render);
  const t=clock.getElapsedTime();
  core.rotation.x=t*.22;core.rotation.y=t*.33;
  wire.rotation.x=-t*.16;wire.rotation.y=-t*.25;
  torus1.rotation.z=t*.18;torus2.rotation.z=-t*.13;
  group.position.x+=(mouse.x*.9-group.position.x)*.025;
  group.position.y+=(mouse.y*.65-group.position.y)*.025;
  camera.position.x+=(mouse.x*.25-camera.position.x)*.018;
  camera.position.y+=(mouse.y*.18-camera.position.y)*.018;
  camera.lookAt(0,0,0);
  renderer.render(scene,camera);
}
render();

addEventListener("resize",()=>{
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
  renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
});

gsap.registerPlugin(ScrollTrigger);
gsap.timeline({delay:1.15})
.from(".status",{opacity:0,y:20,duration:.6})
.from(".eyebrow",{opacity:0,y:20,duration:.5},"-=.3")
.from(".hero h1",{opacity:0,y:70,duration:1,ease:"power4.out"},"-=.25")
.from(".typing-line",{opacity:0,x:-20,duration:.5},"-=.5")
.from(".hero-text",{opacity:0,y:20,duration:.5},"-=.25")
.from(".hero-actions,.socials",{opacity:0,y:15,duration:.5},"-=.2")
.from(".hero-photo-wrap",{opacity:0,scale:.86,rotate:4,duration:1.1,ease:"power3.out"},"-=.8");

$$(".section-head").forEach(h=>gsap.from(h.children,{scrollTrigger:{trigger:h,start:"top 82%"},opacity:0,y:45,stagger:.12,duration:.8,ease:"power3.out"}));
$$(".skill").forEach((c,i)=>gsap.from(c,{scrollTrigger:{trigger:c,start:"top 88%"},opacity:0,y:35,rotateX:10,duration:.65,delay:i*.04}));
$$(".project").forEach((p,i)=>gsap.from(p,{scrollTrigger:{trigger:p,start:"top 82%"},opacity:0,y:70,duration:.9,delay:i*.08,ease:"power3.out"}));
$$(".time-item").forEach((x,i)=>gsap.from(x,{scrollTrigger:{trigger:x,start:"top 88%"},opacity:0,x:-45,duration:.7,delay:i*.08}));
gsap.from(".contact-box",{scrollTrigger:{trigger:".contact-box",start:"top 80%"},opacity:0,scale:.94,duration:1});

$$(".skill,.project-media").forEach(el=>{
  el.addEventListener("mouseenter",()=>gsap.to(el,{y:-5,duration:.3}));
  el.addEventListener("mouseleave",()=>gsap.to(el,{y:0,duration:.3}));
});

$$(".project").forEach(card=>{
  card.addEventListener("mousemove",e=>{
    const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    gsap.to(card,{rotateY:x*2.5,rotateX:-y*2.5,transformPerspective:1200,duration:.25});
  });
  card.addEventListener("mouseleave",()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.5}));
});