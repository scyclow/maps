const t=(t,g,r,n)=>{if(n){const o=n.useElevation?10*J(t,g):dist(t,g,n.focalPoint.x,n.focalPoint.y)/dist(L,B,R,T),i=e(D(hue(r)+map(o,0,1,0,n.hue)),saturation(r)+map(o,0,1,0,n.sat),brightness(r)+map(o,0,1,0,n.brt));stroke(i),fill(i)}else stroke(r),fill(r)},g=t=>t>=90&&t<=150||t>=270&&t<=330;function e(t,e,r,n){t=D(t);let o=0;return g(t)&&(o=1-abs(120-t%180)/30),e=map(o,0,1,e,.65*e),color(t,e,r)}const r=()=>{};function n(t,g){const e=g37<.4&&g37>=.3?.05:g37<.3?.35-g37:0;return map(e,0,.15,t,g)}const o=({x:t,y:g})=>[t,g];function i(t,g,e){if(!e.length)return!1;const r=o(t),n=o(g);return e.some(e=>{if(e.coords.length<10)return u(o(t),o(g),o(e.coords[0]),o(w(e.coords)));const i=e.coords.length<20?2:e.coords.length<40?4:e.coords.length<70?7:10;for(let t=0;t<e.coords.length;t+=i){const g=o(e.coords[t]),a=o(e.coords[t+i]||w(e.coords)),c=u(r,n,g,a);if(c)return c}return!1})}const a=t=>(g,e)=>g<L+t+p(-g14,g14)||g>R-t+p(-g14,g14)||e<T+t+p(-g14,g14)||e>B-t+p(-g14,g14);function c(t,g,e,n,o,i=r,a=!1){const{d:c,angle:s}=d(t,g,e,n);let l=t,h=g;for(let t=0;t<=c;t++){if(a&&t>=.6*c)return;i(l,h)||g34&&y(.7)||g19&&y(.2)||o(l,h,t/c,s),[l,h]=b(s,1,l,h)}}function s(t,g,e,r,n){c(t-e/2,g-r/2,t+e/2,g-r/2,n),c(t-e/2,g+r/2,t+e/2,g+r/2,n),c(t-e/2,g-r/2,t-e/2,g+r/2,n),c(t+e/2,g-r/2,t+e/2,g+r/2,n)}function l(...t){const g=t.reduce((t,g)=>t+g[0],0),e=p();let r=0;for(let n=0;n<t.length;n++)if(e<=(r+=t[n][0]/g))return t[n][1]}const d=(t,g,e,r)=>({d:dist(t,g,e,r),angle:atan2(e-t,r-g)});function h(t,g){if(dist(t[0],t[1],g.x,g.y)>g.r)return!1;const e=[2*width,2*height];return g.coords.reduce((r,n,o)=>{const i=(o+1)%g.coords.length,a=g.coords[i];return u(t,e,n,a)?r+1:r},0)%2==1}function u([t,g],[e,r],[n,o],[i,a]){const c=(e-t)*(a-o)-(i-n)*(r-g);if(0===c)return!1;const s=((a-o)*(i-t)+(n-i)*(a-g))/c,l=((g-r)*(i-t)+(e-t)*(a-g))/c;return s>0&&s<1&&l>0&&l<1?[t+s*(e-t),g+s*(r-g)]:null}function b(t,g,e=0,r=0){return[sin(t)*g+e,cos(t)*g+r]}function f(t,g){const e=[];for(let r=0;r<t;r++)e.push(g(r));return e}let A=parseInt(tokenData.hash.slice(50,58),16);const k=(t,g)=>int(p(t,g));function p(t,g){A^=A<<13,A^=A>>17;const e=((A^=A<<5)<0?1+~A:A)%1e3/1e3;return null!=g?t+e*(g-t):null!=t?e*t:e}function m(t){const g=tokenData.hash.slice(2+2*t,4+2*t);return parseInt(g,16)/255}const y=t=>p()<t,I=(t,g,e,r)=>e+noise(t/15,g/15)*(r-e)+p(-.25,.25),P=()=>y(.5)?1:-1,x=t=>t[int(p(t.length))],_=t=>!!t,w=t=>t[t.length-1],D=t=>(t%360+360)%360,E=t=>(299*red(t)+587*green(t)+114*blue(t))/1e3,S=(t,g)=>(E(t)-E(g))/255;function C(g,e){push();const{primaryAveCoords:r,secondaryAveCoords:n,tertiaryAveCoords:o,quarternaryAveCoords:i,streetCoords:a}=F(),c=g19?1.75:.5,s=g19?1.25:0,l=.4*c,d=1.6*s,h=.8*c,u=1.2*s;a.forEach((r,n)=>v(r.coords,(r,n)=>{const o=r+p(-l,l)+g,i=n+p(-l,l)+e,a=G(o,i);a.hideStreets||U(a.ix)||(t(o,i,a.colors.street,a.gradient),g1?f(g34?2:5,()=>{const t=I(o,i,0,20);circle(o+p(-t,t),i+p(-t,t),p(1*g30,1*g31))}):circle(o,i,I(o,i,g30,g31)+d))},g,e)),i.forEach(r=>v(r.coords,(r,n)=>{const o=r+p(-h,h)+g,i=n+p(-h,h)+e,a=G(o,i);a.hideStreets||U(a.ix)||(t(o,i,a.colors.quarternary,a.gradient),circle(o,i,I(o,i,2*g30,2*g31)+u))},g,e)),o.forEach(r=>v(r.coords,(r,n)=>{const o=r+p(-c,c)+g,i=n+p(-c,c)+e,a=G(o,i);a.hideStreets||U(a.ix)||(t(o,i,a.colors.tertiary,a.gradient),circle(o,i,I(o,i,3.5*g30,3.5*g31)+s))},g,e)),n.forEach(r=>v(r.coords,(r,n)=>{const o=r+p(-c,c)+g,i=n+p(-c,c)+e,a=G(o,i);a.hideStreets||U(a.ix)||(t(o,i,a.colors.secondary,a.gradient),circle(o,i,I(o,i,5*g30,5*g31)+s))},g,e)),v(r.coords,(r,n)=>{const o=r+p(-c,c)+g,i=n+p(-c,c)+e,a=G(o,i);a.hideStreets||U(a.ix)||(t(o,i,a.colors.primary,a.gradient),circle(o,i,I(o,i,6.25*g30,6.25*g31)+s))},g,e),pop()}function v(g,e,r=0,n=0){const o=a(g8),i=y(g22);g.forEach((a,s)=>{const{x:l,y:d}=a;if(s>0){const{x:t,y:r}=g[s-1];c(t,r,l,d,e,o,i)}if(!o(l,d)&&s===g.length-1&&!g2&&!g1){push();const g=G(l+r,d+n);if(g.hideStreets||U(g.ix)||g34&&y(.8))return;t(l+r,d+n,g.colors.circle,g.gradient);const e=g19;f(10,t=>{const g=g26&&y(.001)?Y:circle,o=g34?p(1,6):8;g(l+p(-e,e)+r,d+p(-e,e)+n,o)}),pop()}})}function F(){const t=map(g37,.2,1.2,.1,.17),g=0===g33?.05:2===g33&&.5,e=(t,e,r,n=1)=>g?g*n:t+(e-t)*(1-J(r.x,r.y));SECONDARY_PRB=g||p(t,.2),TERTIARY_PRB=g?1.5*g:p(t,.2),QUARTERNARY_PRB=g?1.5*g:p(2*t,.4),STREET_PRB=g?2*g:p(.25,1),STREET_BLOCK_HEIGHT=20;const r=g5?100:n(17,24);PRIMARY_DRIFT=HALF_PI/r,SECONDARY_DRIFT=HALF_PI/p(r,2*r),TERTIARY_DRIFT=HALF_PI/(g16?2:p(3*r,6*r)),QUARTERNARY_DRIFT=HALF_PI/(g16?2:p(3*r,6*r)),STREET_DRIFT=HALF_PI/(g16?2:p(3*r,6*r));const o=p(T,B),i=p(L,R),a=M(...l([.25,[i,B+25,d(i,B,0,0).angle]],[.25,[i,T-25,d(i,T,0,0).angle]],[.25,[L-25,o,d(L,o,0,0).angle]],[.25,[R+25,o,d(R,o,0,0).angle]]),{driftAmt:PRIMARY_DRIFT,maxLen:300,ix:0});let c=0,s={};const h=a.coords.map((g,r)=>{const n=e(t,.2,g);if(y(n)&&r<250){const t=c++,e=p()<.5?1:-1;if(s[e]&&s[e]+3>r)return;s[e]=r;const n=-1===e?HALF_PI:PI+HALF_PI;return M(g.x,g.y,g.angle+n,{direction:e,branch:t,driftAmt:SECONDARY_DRIFT,maxLen:200})}}).filter(_),u=h.flatMap((g,r)=>{return g.coords.map(g=>{const n=e(t,.2,g,1.5);if(y(n)&&r<150){const t=p()<.5?1:-1,e=-1===t?HALF_PI:PI+HALF_PI,r={direction:t,driftAmt:TERTIARY_DRIFT,stopAtIntersections:[a,...h]};return M(g.x,g.y,g.angle+e,r)}}).filter(_)}),b=u.flatMap(g=>g.coords.map(g=>{const r=e(2*t,.4,g,1.5);if(y(r)){const t=p()<.5?1:-1,e=-1===t?HALF_PI:PI+HALF_PI,r={direction:t,driftAmt:QUARTERNARY_DRIFT,stopAtIntersections:[a,...h,...u]};return M(g.x,g.y,g.angle+e,r)}}).filter(_)),f=h.flatMap(t=>t.coords.flatMap(t=>{const g={driftAmt:STREET_DRIFT,stopAtIntersections:[a,...h,...u,...b]},r=e(.25,1,t,2);return[y(r)&&M(t.x,t.y,t.angle+HALF_PI,g),y(r)&&M(t.x,t.y,t.angle+HALF_PI+PI,g)].filter(_)}));return{primaryAveCoords:a,secondaryAveCoords:h,tertiaryAveCoords:u,quarternaryAveCoords:b,streetCoords:f}}function M(t,g,e,r={}){const n=r.driftAmt||HALF_PI/16,o=r.stopAtIntersections||[],c=r.maxLen||150,s=a(-180/g37);let l=t,d=g,h=e;const u=[];for(let t=0;t<c;t++){const g=b((h=map(noise(l+g12,d+g12),0,1,h-n,h+n))+(g0&&G(l,d).ix>0?g0:0),STREET_BLOCK_HEIGHT,l,d),e=g[0],r=g[1];if(t){if(i({x:l,y:d},{x:e,y:r},o))break}if(l=e,d=r,u.push({x:l,y:d,angle:h}),s(l,d))break}return{coords:u,direction:r.direction||0,branch:r.branch||0}}const Y=(t,g,e)=>{push();const r=r=>b(r*TWO_PI/10,r%2==0?e/2:e,t,g);beginShape(),curveVertex(...r(-1)),f(12,t=>{curveVertex(...r(t))}),endShape(),pop()};function q(){if(g17){const g=g8<50?p(1.7,2.1):p(1.98,2.02);s(g39,g40,W-g8*g,H-g8*g,(g,e)=>{const r=g13?G(g,e,!0):g35[0];r.hideStreets||U(r.ix)||(t(g+g39,e+g40,r.colors.circle,r.gradient),circle(g,e,I(g,e,g4/g37,2.5*g4/g37)))})}}function N(){const{elevationAverage:t,elevationMin:g}=V(),e=O(),r=p(360);g35=[{ix:0,threshold:g32>=30?g:t,hideStreets:!1,...e[g21](r,g15/p(3,15),0,g11)}];const n=["whiteAndBlack","paper"].includes(g21),o=["bright","faded"].includes(g21),i=5===g18&&o?x(["bright","whiteAndBlack"]):!(5!==g18||!n)&&"bright";let a=0;const c=K(r),s=(t,g,r)=>{const n=y(.2)&&!g3,o=r===g32-1?g15/p(3,8):g15;let s;if(5!==g18||r%2)if(5===g18&&r%2){l([1,20],[1,120],[1,180]);const g=D(t.baseHue+20);s=e[i](g,o,r,t.isDark)}else{const g=l(...t.neighbors),n="blackAndWhite"===g||"whiteAndBlack"===g?t.baseHue:(t=>"path"===g27?t+g24:c[a++%c.length])(t.baseHue);s=e[g](n,o,r,t.isDark)}else s=g35[0];return{hideStreets:n,...s,ix:r,threshold:g}};for(let t=1;t<g32;t++){const g=g35[t-1],e=t===g32-1?1:g.threshold+.02;g35.push(s(g,e,t))}}const O=()=>{const t=color(0,0,10),g=color(0,0,90),r=color(0,0,85),n=(t,g=360)=>p()<.09||t?{focalPoint:{x:p(L,R),y:p(T,B)},useElevation:p()<.9,hue:p(g/4,g)*P(),sat:2,brt:1}:null;return{blackAndWhite:(g,e,n,o)=>{let i;return i=[2,4].includes(g18)?"light":3===g18?"dark":4===g18?"color":"all",{name:"blackAndWhite",baseHue:g,colors:{bg:t,primary:r,secondary:r,tertiary:r,quarternary:r,street:r,circle:r},neighbors:{contrast:[[1,"whiteAndBlack"],[1,"bright"]],light:[[8,"whiteAndBlack"],[2,"bright"]],dark:[[1,"neon"]],color:[[1,"bright"]],all:[[7,"whiteAndBlack"],[3,"bright"],[3,"neon"]]}[i],gradient:null,isDark:!0,isColor:!1,isLight:!1}},whiteAndBlack:(e,r,n,o)=>{let i;i=1===g18?"contrast":3===g18?"dark":[2,4].includes(g18)?"color":"all";const a={contrast:[[g32>3?1:0,"bright"],[3,"blackAndWhite"]],dark:[[5,"blackAndWhite"],[5,"neon"]],color:[[1,"bright"]],all:[[6,"blackAndWhite"],[5,"neon"],[5,"bright"]]}[i];return{name:"whiteAndBlack",baseHue:e,colors:{bg:g,primary:t,secondary:t,tertiary:t,quarternary:t,street:t,circle:t},neighbors:a,gradient:null,isDark:!1,isColor:!1,isLight:!0}},neon:(t,g,r,o)=>{const i=e(t,30,o?22:12);let a,c=e(t,55,92);return S(i,c)>-.5&&(c=j(i,c,-.5)),{name:"neon",baseHue:t,colors:{bg:i,primary:c,secondary:c,tertiary:c,quarternary:c,street:c,circle:c},neighbors:{contrast:[[1,"bright"]],dark:[[2,"blackAndWhite"],[1,"neon"]],light:[[2,"whiteAndBlack"],[1,"bright"]],color:[[1,"bright"]],all:[[4,"bright"],[5,"blackAndWhite"],[3,"whiteAndBlack"],[2,"neon"]]}[a=2===g32?"color":1===g18?"contrast":2===g18?"light":3===g18?"dark":4===g18?"color":"all"],gradient:n(g7,g),isDark:!0,isColor:!1,isLight:!1}},bright:(t,g,r,o)=>{const i=g9&&r,a=e(t,55,95),c=i>0?Q(t+180,50,85,a):color(D(t+180),30,15);let s;return s=1===g18?"contrast":2===g18?"light":3===g18?"dark":4===g18?"color":"all",{name:"bright",baseHue:t,colors:{bg:a,primary:c,secondary:c,tertiary:c,quarternary:c,street:c,circle:c},neighbors:{contrast:[[3,"blackAndWhite"],[g32>3?1:0,"whiteAndBlack"],[3,"neon"]],dark:[[2,"blackAndWhite"],[1,"neon"]],light:[[1,"whiteAndBlack"]],color:[[1,"bright"]],all:[[4,"blackAndWhite"],[2,"whiteAndBlack"],[1,"neon"]]}[s],invertStreets:i,gradient:n(g7,g),isDark:!1,isColor:!0,isLight:!1}},paper:(t,g,e,r)=>{const o=color(D(t),8,91),i=Q(t+g24,60,30,o),a=Q(t+g24-10,40,35,o),c=Q(t+g24-20,40,35,o);let s;return s=2===g18?"light":3===g18?"dark":4===g18?"color":"all",{name:"paper",baseHue:t,colors:{bg:o,primary:i,secondary:i,tertiary:a,quarternary:a,street:c,circle:c},neighbors:{dark:[[1,"blackAndWhite"],[g32>2?1:0,"neon"],[1,"burnt"]],light:[[1,"whiteAndBlack"],[1,"bright"],[1,"faded"]],color:[[1,"bright"],[1,"faded"]],all:[[6,"blackAndWhite"],[g32>2?6:0,"neon"],[7,"burnt"],[1,"whiteAndBlack"],[1,"bright"],[2,"faded"]]}[s],gradient:n(!0,g7?g:p(90)),isDark:!1,isColor:!1,isLight:!0}},faded:(t,g,r,o)=>{const i=e(t,35,95),a=Q(t+g24,85,30,i),c=Q(t+g24-10,85,30,i),s=Q(t+g24-20,85,30,i);let l;return{name:"faded",baseHue:t,colors:{bg:i,primary:a,secondary:a,tertiary:c,quarternary:c,street:s,circle:s},neighbors:{dark:[[1,"blackAndWhite"],[1,"neon"],[2,"burnt"]],light:[[1,"whiteAndBlack"],[1,"bright"],[2,"paper"]],color:[[1,"bright"]],all:[[2,"burnt"],[2,"paper"],[12,"blackAndWhite"],[5,"neon"],[5,"whiteAndBlack"],[1,"bright"]]}[l=2===g18?"light":3===g18?"dark":4===g18?"color":"all"],gradient:n(g7,g7?g:p(75)),isDark:!1,isColor:!0,isLight:!1}},burnt:(t,g,e,r)=>{const o=color(D(t),35,r?17:15),i=g24>0?1:-1,a=color(D(t+g24),50,85),c=color(D(t+g24-30*i),50,85),s=color(D(t+g24-60*i),50,85);let l;return{name:"burnt",baseHue:t,colors:{bg:o,primary:a,secondary:a,tertiary:c,quarternary:c,street:s,circle:s},neighbors:{dark:[[3,"blackAndWhite"],[2,"neon"]],light:[[2,"whiteAndBlack"],[1,"bright"],[2,"faded"]],color:[[1,"bright"],[2,"faded"]],all:[[6,"whiteAndBlack"],[4,"faded"],[8,"blackAndWhite"],[4,"neon"],[7,"bright"]]}[l=2===g32?"color":2===g18?"light":3===g18?"dark":4===g18?"color":"all"],gradient:n(g7,g),isDark:!0,isColor:!1,isLight:!1}}}};function Q(t,e,r,n){const o=D(t),i=g(hue)?.9:.7;return j(n,color(o,e,r),i)}function U(t){return g37>=1&&g19&&t<g32-1&&t>0}function G(t,g){const e=J(t,g);for(let t=0;t<g35.length;t++)if(e<g35[t].threshold)return g35[t];return g35[g35.length-1]}function K(t){switch(abs(g24)){case 0:return[t];case 10:return[t,t+10,t+20,t+30,t+40,t+50,t+60];case 20:return[t,t+20,t-20];case 100:return[t,t+120,t+180];case 120:return[t,t+120,t-120];case 150:return[t,t+150,t+210];case 180:return[t,t+180]}}function V(){let t=0,g=0,e=1,r=0;const n=30/g37;for(let o=L;o<R;o+=n)for(let i=T;i<B;i+=n){const n=J(o,i);t+=n,n<e&&(e=n),n>r&&(r=n),g++}return{elevationAverage:t/g,elevationMin:e,elevationMax:r}}function J(t,g){return noise(t/g10+g12,g/g10+g12)}const j=(t,g,e=.4)=>{const r=(e-S(t,g))/.3;return color(hue(g),saturation(g)+20*r,brightness(g)-30*r)};function z(t,g,e,r){push();const n=g35[0];background(n.colors.bg);const o=a(g8),i=2/g37,c=g35.map((t,g)=>{const e=t.isColor&&n.isDark,r=t.isLight&&n.isDark,o=n.isColor&&t.isDark,i=e||o,a=n.isLight&&t.isDark,c=0===g||g===g35.length-1;return{potentialMismatch:i||a,multiplier:c&&t.gradient?map(g37,.2,1.2,2.6,1.5):c&&o?max(1,1.1/g37):c&&e?max(1,.75/g37):c&&a?max(1,1.5/g37):i?max(1,1/g37):a?max(1,.7/g37):r?max(1,.7/g37):1}}),s=5/g37;for(let n=t-s;n<g+s;n+=i){let t=i;for(let g=e-s;g<r+s;g+=t){const e=!g13&&g8>0&&o(g,n)?g35[0]:G(g,n);X(g,n,e,t=i/c[e.ix].multiplier,c[e.ix])}}pop()}function X(t,g,r,n,o){if(g34&&y(.5))return;const i=p(n,2*n)*o.multiplier/3.5,a=o.multiplier>1?2*i:0,c=J(t,g);strokeWeight(i);let s=0,l=0,d=0;if(r.gradient){const e=r.gradient.useElevation?10*c:dist(t,g,r.gradient.focalPoint.x,r.gradient.focalPoint.y)/dist(L,B,R,T);s=map(e,0,1,0,r.gradient.hue),l=map(e,0,1,0,r.gradient.sat),d=map(e,0,1,0,r.gradient.brt)}const{bShadow:h,sShadow:u}=Z(t,g,c,r),f=45*g41+3,A=10*g41+5,k=5*g41*(o.potentialMismatch?0:1);stroke(e(D(hue(r.colors.bg)+s+p(-f,f)),saturation(r.colors.bg)+l+p(-A,A)+u,brightness(r.colors.bg)+d+p(-10-k,0)-h));const m=noise(t+g12,g+g12),[I,P]=b(PI+m+p(g23,g42),5,t+p(-a,a+g36),g+p(-a,a)),[x,_]=b(m+p(g23,g42),5,t,g);line(I,P,x,_)}function Z(t,g,e,r){const n=max(0,J(t+g28,g+g29)-e)*g6*(g10*g37)/300,o=map(E(r.colors.bg),0,255,.5,1),i=r.gradient?4*min(abs(r.gradient.hue)/50,1):1;let a=0,c=0;return r.isDark?(a=500*n,c=500*n):r.isColor?(magnitude=150*i*o,a=n*magnitude,c=n*magnitude*(r.gradient?4:2)):r.isLight&&(a=100*n*i,c=100*n*i),{sShadow:c,bShadow:a}}function $(){83===keyCode&&saveCanvas(__canvas,"maps-"+Date.now(),"png")}function setup(){g43=min(innerWidth,innerHeight),__canvas=createCanvas(g43,g43),noiseSeed(p(1e6)+p(1e6)+p(1e3)),g37=p()+.2,g20=g43/800;const t=g37*g20;W=width/t,H=height/t,L=round(-width/(2*t),4),R=round(width/(2*t),4),T=round(-height/(2*t),4),B=round(height/(2*t),4),colorMode(HSB,360,100,100),tt(),N(),console.log(JSON.stringify({g44:tokenData.hash,g37:g37,g18:g18,g32:g32,g21:g21,g24:g24,g7:g7,g16:g16,g22:g22.toPrecision(2),g1:g1,g10:(g10*g37).toPrecision(4),g33:g33,g19:g19,g2:g2,g0:g0,g17:g17,g13:g13,g14:(g14*g37).toPrecision(4),g4:g4.toPrecision(2),g8:(g8*g37).toPrecision(4),g25:g25.toPrecision(2),g5:g5,g39:g39,g40:g40,g3:g3,g15:g15,g41:g41,g36:g36,g26:g26,g34:g34,g27:g27,g28:g28,g29:g29,g6:g6},null,2)),console.log(g35)}function draw(){noLoop();const t=Date.now();translate(width/2,height/2),scale(g37*g20);const g=1.5*max(abs(g39),abs(g40));rotate(g3),z(T-g,B+g,L-g,R+g),rotate(g25),C(g39,g40),q(),console.log(Date.now()-t)}function tt(){g19=y(.15),g1=y(.1),g2=y(.1),g16=y(.05),g5=y(n(.05,.1)),g26=y(.02),g34=y(.01),g36=y(.01)?p(30,100):0,g0=y(.15)?p(QUARTER_PI/2,QUARTER_PI)*P():0,g10=p(150,750)/g37,g33=l([.015,0],[.935,1],[.05,2]),g22=y(.125)?p(.05,.2):0,g18=l([40,0],[15,1],[5,2],[11,3],[27,4],[g37>=1&&g19?0:2,5]);const t=g1||g16?10:map(g37,1.2,.2,1,15);g32=l([t,1],[6,2],[36,3],[34,k(4,7)],[g16?0:10,k(7,10)],[g16?0:4,k(10,15)],[g16?0:1,30]),g21=l([g32<=4?20:0,"paper"],[g32<=4?20:0,"faded"],[g32<=4?15:0,"burnt"],[g32<=4?10:5,"bright"],[6,"whiteAndBlack"],[4,"blackAndWhite"],[g37<=.3?0:4,"neon"]),g24=l([3,0],[2,20],[1,100],[2,120],[1,150],[3,180])*P(),g7=y(.02),g15=y(.025)?p(720,3e3):200,g9=!1,g11=!1,g27=x(["path","preset"]),1===g18?(g24=0,g32=l([6,3],[1,4],[1,5]),g21=l([7,"bright"],[3,"whiteAndBlack"],[5,"blackAndWhite"],[5,"neon"])):3===g18?(g21=l([20,"burnt"],[5,"blackAndWhite"],[5,"neon"]),g19=p()<.4,g1=p()<.3,g11=!0):4===g18?(g21=l([20,"faded"],[30,"bright"],[10,"paper"],[30,"whiteAndBlack"]),g32=l([25,3],[35,k(4,6)],[25,k(6,9)],[g16?0:10,k(9,15)],[g16?0:5,k(15,30)]),g24=l([g32>=12?2:1,10],[4,20],[g32>=12?1:2,100],[3,120],[g32>=12?1:3,150],[3,180])*P(),y(.05)?(g7=!0,g9=!0):y(.5)&&g32<=4&&(g9=!0)):5===g18&&(g10=p(350,1e3)/g37,g32=50,g21=l([1,"paper"],[1,"faded"],[1,"bright"],[1,"whiteAndBlack"]),g24=l([6,0],[2,20],[1,120],[1,180])*P()),("blackAndWhite"===g21||"neon"===g21&&g32>2&&3!==g18)&&(g24=l([1,0],[2,180])*P()),2===g32&&["neon","burnt"].includes(g21)&&(g24=l([5,0],[1,100],[1,120],[1,150],[1,180])*P());const g=n(1,1.6)*(g34?.7:1);if(g30=.7*g,g31=1.3*g,g41=p()<.5||["blackAndWhite","neon","burnt"].includes(g21)?0:p(.2,.7),g39=0,g40=0,g3=0,g13=y(.5),g17=g13||y(.8),g8=l([5,p(175,200)],[75,p(30,60)],[20,p(20,30)])/g37,g4=map(g37,.2,1.2,1.6,2.8)+p(-.2,.2),g14=l([5,0],[3,p(3)/g37],[1,p(3,g8/2)/g37]),g25=p(-5e-4,5e-4),g39=p(-2,2)/g37,g40=p(-2,2)/g37,IS_MISPRINT=y(.015),!g17&&g8*g37<=30&&(g14=g8-5/g37,g17=!1,g13=!1),IS_MISPRINT){g17=!0,g13=!0,g4=p(1.4,3),g14=l([5,0],[3,p(3)/g37],[1,p(3,g8/2)/g37]);const t=y(.333)?2:1;g39=p(-250,250)/(t*g37),g40=p(-250,250)/(t*g37),g3=p(-QUARTER_PI,QUARTER_PI)/(4*t)}g14=min(180/g37,g14),g28=5*P(),g29=5*P(),g6=l([15,0],[64,1],[20,2],[g15>200?20:1,10])}g42=Math.PI/4,g23=-Math.PI/4,g35=[],g12=1e5;