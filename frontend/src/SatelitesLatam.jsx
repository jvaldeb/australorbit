import React, { useState, useEffect, useRef } from "react";
import { usePageMeta } from "./usePageMeta.js";
import { useGeoLocation } from "./useGeoLocation.js";
import GeoSplash from "./GeoSplash.jsx";

const API = "https://australorbit-production.up.railway.app";

/* ─────────────────────────────────────────────────────────────────
   BASE DE DATOS COMPLETA — SATÉLITES LATAM
───────────────────────────────────────────────────────────────── */
const COUNTRIES_DATA = [
  {
    id: "CL", name: "Chile", flag: "🇨🇱",
    color: "#C47B48",
    accentColor: "#C47B48",
    desc: "30 años de historia espacial. Desde el fallido FASat-Alfa en 1995 hasta LEMU NGE lanzado por SpaceX en 2024.",
    agency: "FACH · U. de Chile · Lemu SpaceTech",
    stats: [["9","satélites lanzados"],["1995","primer intento"],["5","en órbita"]],
    sats: [
      {
        id:"FASAT_ALFA", norad:null, name:"FASat-Alfa", full:"Fuerza Aérea Satélite Alfa",
        year:1995, launch:"31 Ago 1995", cohete:"Tsyklon-3", base:"Plesetsk, Rusia",
        agency:"FACH / Surrey Satellite Technology (UK)",
        orbit:"No logró separarse", mass:"~50 kg", type:"Microsatélite",
        color:"#64748b", badge:"FALLIDO", badgeColor:"#64748b", status:"FALLIDO",
        mission:"Primer intento de Chile en el espacio. Lanzado junto al satélite ucraniano Sich-1, nunca logró separarse de su satélite madre por una falla pirotécnica. A pesar del fracaso, fue el punto de partida del programa espacial chileno.",
        facts:["Primer satélite chileno — 1995","Nunca se separó del Sich-1 ucraniano","Diseñado para estudios geográficos","Sentó las bases del programa FACH"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Sich-1_satellite.jpg/800px-Sich-1_satellite.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
        specs:[["Lanzamiento","31 Ago 1995"],["Cohete","Tsyklon-3"],["Base","Plesetsk, Rusia"],["Masa","~50 kg"],["Resultado","Misión fallida"],["Estado","Adherido a Sich-1"],["Operador","FACH"],["Tipo","Microsatélite"]],
      },
      {
        id:"FASAT_BRAVO", norad:25490, name:"FASat-Bravo", full:"Fuerza Aérea Satélite Bravo",
        year:1998, launch:"10 Jul 1998", cohete:"Zenit-2", base:"Baikonur, Kazajistán",
        agency:"FACH / Surrey Satellite Technology (UK)",
        orbit:"820 km · SSO", mass:"~50 kg", type:"Microsatélite",
        color:"#94a3b8", badge:"REINGRESÓ 2023", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite chileno que llegó exitosamente al espacio. Operó durante 3 años enviando más de 1.000 fotografías de Chile y el mundo. Falló por problema de energía en 2001, y finalmente reingresó a la atmósfera en 2023.",
        facts:["Primer satélite chileno en órbita exitosamente","Envió más de 1.000 fotografías","Operó 3 años antes de fallar","Reingresó y se desintegró en 2023"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
        specs:[["NORAD ID","25490"],["Lanzamiento","10 Jul 1998"],["Cohete","Zenit-2"],["Base","Baikonur, Kazajistán"],["Masa","~50 kg"],["Operación","1998–2001"],["Reingreso","2023"],["Tipo","Microsatélite"]],
      },
      {
        id:"SSOT", norad:38011, name:"FASat-Charlie / SSOT", full:"Sistema Satelital para Observación de la Tierra",
        year:2011, launch:"17 Dic 2011", cohete:"Soyuz-STA/Fregat", base:"Kourou, Guayana Francesa",
        agency:"FACH / EADS Astrium (Francia)",
        orbit:"629 km · SSO", mass:"117 kg", type:"Satélite de observación",
        color:"#C47B48", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El primer gran satélite chileno. Encargado por USD 72.5 millones a EADS Astrium Francia, captura imágenes de 1.45 m de resolución. Usado en respuesta a terremotos, erupciones volcánicas e inundaciones. Lleva más de 13 años operando, superando su vida útil.",
        facts:["Resolución 1.45 m — puede verse un auto","Usado en emergencias: terremotos y volcanes","13+ años en órbita, supera vida útil estimada","Primer satélite del sistema nacional SNSat"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
        specs:[["NORAD ID","38011"],["Lanzamiento","17 Dic 2011"],["Cohete","Soyuz-STA/Fregat"],["Base","Kourou, GF"],["Masa","117 kg"],["Resolución","1.45 m"],["Inclinación","97.88°"],["Período","97.17 min"]],
      },
      {
        id:"SUCHAI1", norad:42788, name:"SUCHAI-1", full:"Satellite of U. of Chile for Aerospace Investigation",
        year:2017, launch:"23 Jun 2017", cohete:"PSLV-C38", base:"Sriharikota, India",
        agency:"U. de Chile / UTFSM / USACH",
        orbit:"500 km · SSO (reingresó 2023)", mass:"~1 kg", type:"CubeSat 1U — Educacional",
        color:"#818CF8", badge:"REINGRESÓ 2023", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer CubeSat construido íntegramente en Chile, por estudiantes de tres universidades. Operó 457 días enviando datos científicos. Fue el primer CubeSat universitario de Latinoamérica y demostró que Chile podía hacer tecnología espacial propia.",
        facts:["Primer satélite construido 100% en Chile","Primer CubeSat universitario de Latinoamérica","Operó 457 días con datos científicos","Reingresó y se desintegró en 2023"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        specs:[["NORAD ID","42788"],["Lanzamiento","23 Jun 2017"],["Cohete","PSLV-C38"],["Base","Sriharikota, India"],["Masa","~1 kg"],["Tipo","CubeSat 1U"],["Operación","2017–2018"],["Reingreso","2023"]],
      },
      {
        id:"PLANTSAT", norad:52188, name:"PlantSat", full:"Plant Satellite — Experimento Biológico",
        year:2022, launch:"1 Abr 2022", cohete:"Falcon 9 · Transporter-4", base:"Vandenberg, California",
        agency:"Universidad de Chile — Lab. SPEL",
        orbit:"550 km · SSO", mass:"~3 kg", type:"CubeSat 3U — Biológico",
        color:"#86efac", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El primer satélite chileno con experimento de biología espacial. Llevó semillas de plantas del desierto de Atacama para estudiar su supervivencia en microgravedad, con miras a futuras misiones a Marte.",
        facts:["Primer experimento biológico chileno en el espacio","Lleva plantas del desierto de Atacama","Misión orientada a colonización de Marte","Parte de la constelación de 3 sats con SUCHAI-2 y 3"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
        specs:[["NORAD ID","52188"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Inclinación","97.5°"],["Período","95.6 min"]],
      },
      {
        id:"SUCHAI2", norad:57757, name:"SUCHAI-2", full:"Satellite of U. of Chile for Aerospace Investigation 2",
        year:2022, launch:"1 Abr 2022", cohete:"Falcon 9 · Transporter-4", base:"Vandenberg, California",
        agency:"Universidad de Chile — Lab. SPEL",
        orbit:"550 km · SSO", mass:"~3 kg", type:"CubeSat 3U — Óptico",
        color:"#A78BFA", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"Monitorea la contaminación lumínica nocturna sobre los observatorios astronómicos del norte de Chile. Chile alberga el 40% de la observación astronómica mundial, y sus datos ayudan a proteger ese recurso único.",
        facts:["Monitorea contaminación lumínica en observatorios","Chile tiene el 40% de observación astronómica mundial","Sus datos protegen el cielo del norte de Chile","Lanzado junto a SUCHAI-3 y PlantSat"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=1200&q=80",
        specs:[["NORAD ID","57757"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Inclinación","97.5°"],["Período","95.6 min"]],
      },
      {
        id:"SUCHAI3", norad:57758, name:"SUCHAI-3", full:"Satellite of U. of Chile for Aerospace Investigation 3",
        year:2022, launch:"1 Abr 2022", cohete:"Falcon 9 · Transporter-4", base:"Vandenberg, California",
        agency:"Universidad de Chile — Lab. SPEL",
        orbit:"550 km · SSO", mass:"~3 kg", type:"CubeSat 3U + 2 femtosats",
        color:"#F472B6", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El más complejo de la constelación. Desplegó 2 femtosatélites propios que miden el campo magnético terrestre — la primera vez que Chile lanza un satélite que a su vez despliega satélites más pequeños.",
        facts:["Desplegó 2 femtosatélites — sats dentro de un sat","Primera constelación de sats universitarios de Chile","Los femtosats miden el campo magnético terrestre","Hito tecnológico histórico para la ingeniería chilena"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80",
        specs:[["NORAD ID","57758"],["Lanzamiento","1 Abr 2022"],["Cohete","Falcon 9"],["Misión","Transporter-4"],["Masa","~3 kg"],["Tipo","CubeSat 3U"],["Femtosats","2 desplegados"],["Período","95.6 min"]],
      },
      {
        id:"FASAT_DELTA", norad:null, name:"FASat-Delta", full:"Sistema Nacional Satelital — Alta Resolución",
        year:2023, launch:"12 Jun 2023", cohete:"Falcon 9", base:"Vandenberg, California",
        agency:"FACH / ImageSat International (Israel)",
        orbit:"SSO", mass:"~90 kg", type:"SmallSat — Observación",
        color:"#f59e0b", badge:"CANCELADO", badgeColor:"#ef4444", status:"CANCELADO",
        mission:"Primer satélite del Sistema Nacional Satelital (SNSat), programa que planea poner 10 satélites en órbita. Lanzado en 2023, tuvo problemas de calibración. En diciembre de 2024, la FACH canceló el proyecto por incumplimiento del fabricante israelí.",
        facts:["Primer satélite del programa SNSat de 10 sats","Cancelado dic 2024 por fallas del fabricante","Costo: varios millones de dólares fiscales","Impulsó el desarrollo de capacidad espacial propia"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/SSOT_satellite.jpg/1280px-SSOT_satellite.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
        specs:[["Lanzamiento","12 Jun 2023"],["Cohete","Falcon 9"],["Base","Vandenberg, CA"],["Masa","~90 kg"],["Fabricante","ImageSat Intl. (Israel)"],["Estado","Cancelado Dic 2024"],["Programa","SNSat"],["Tipo","SmallSat"]],
      },
      {
        id:"LEMU", norad:60532, name:"LEMU NGE", full:"Ojo del Bosque — Primer Satélite Privado Chileno",
        year:2024, launch:"16 Ago 2024", cohete:"Falcon 9 · Transporter-11", base:"Vandenberg, California",
        agency:"Lemu SpaceTech — Startup chilena",
        orbit:"550 km · SSO", mass:"~8 kg", type:"CubeSat 6U — Hiperespectral",
        color:"#6EE7B7", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El primer satélite privado de Chile y de la Patagonia. Lleva cámara hiperespectral para analizar la composición química de vegetación, agua y suelo. Su nombre en mapudungun significa 'ojo del bosque'.",
        facts:["Primer satélite privado de Chile — SpaceX 2024","Nombre en mapudungun: 'ojo del bosque'","Cámara hiperespectral ve más allá del ojo humano","Monitorea biodiversidad y ecosistemas chilenos"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/SpaceX_Transporter-11_mission_patch.png/800px-SpaceX_Transporter-11_mission_patch.png",
        bgPhoto:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
        specs:[["NORAD ID","60532"],["Lanzamiento","16 Ago 2024"],["Cohete","Falcon 9"],["Misión","Transporter-11"],["Masa","~8 kg"],["Sensor","Cámara hiperespectral"],["Inclinación","97.5°"],["Período","95.6 min"]],
      },
    ],
  },
  {
    id:"AR", name:"Argentina", flag:"🇦🇷",
    color:"#60a5fa",
    accentColor:"#60a5fa",
    desc:"El programa espacial más robusto de Latinoamérica. INVAP fabrica satélites propios de clase mundial y CONAE opera una de las agencias espaciales más desarrolladas de la región.",
    agency:"CONAE · INVAP · ARSAT",
    stats:[["8+","satélites lanzados"],["1996","primer satélite"],["5","en órbita activa"]],
    sats:[
      {
        id:"LUSAT", norad:20442, name:"LUSat-1", full:"Liga Uruguayo-Argentina de Satélites",
        year:1990, launch:"22 Ene 1990", cohete:"Ariane 4", base:"Kourou, Guayana Francesa",
        agency:"AMSAT / Radio aficionados argentinos",
        orbit:"800 km (reingresó 2020)", mass:"~9 kg", type:"Microsatélite — Radio",
        color:"#475569", badge:"REINGRESÓ 2020", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"Primer satélite argentino, construido por radioaficionados. Fue parte de la misión OSCAR (Orbiting Satellite Carrying Amateur Radio). Operó durante 30 años retransmitiendo señales de radioaficionados de todo el mundo antes de reingresara en 2020.",
        facts:["Primer satélite argentino — 1990","Construido por radioaficionados de AMSAT","Operó 30 años retransmitiendo señales","Reingresó a la atmósfera en 2020"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
        specs:[["NORAD ID","20442"],["Lanzamiento","22 Ene 1990"],["Cohete","Ariane 4"],["Masa","~9 kg"],["Operación","1990–2020"],["Tipo","Microsatélite radio"],["Operador","AMSAT Argentina"],["Reingreso","2020"]],
      },
      {
        id:"SAC_B", norad:null, name:"SAC-B", full:"Satélite de Aplicaciones Científicas B",
        year:1996, launch:"4 Nov 1996", cohete:"Pegasus XL", base:"Vandenberg, California",
        agency:"CONAE (Argentina) / NASA",
        orbit:"No alcanzó órbita", mass:"191 kg", type:"Satélite científico — Rayos X",
        color:"#64748b", badge:"FALLIDO", badgeColor:"#64748b", status:"FALLIDO",
        mission:"Primer satélite científico de CONAE en colaboración con NASA. Diseñado para estudiar destellos de rayos gamma. El vehículo Pegasus tuvo una falla en la última etapa y el satélite no pudo alcanzar la órbita correcta.",
        facts:["Primera misión científica de CONAE con NASA","Diseñado para estudiar rayos gamma","Pegasus XL falló en la última etapa","La falla impulsó el desarrollo propio de CONAE"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
        specs:[["Lanzamiento","4 Nov 1996"],["Cohete","Pegasus XL"],["Masa","191 kg"],["Agencias","CONAE + NASA"],["Resultado","No alcanzó órbita"],["Misión","Rayos gamma / X"],["Tipo","Científico"],["Estado","Fallido"]],
      },
      {
        id:"SAC_A", norad:25635, name:"SAC-A", full:"Satélite de Aplicaciones Científicas A",
        year:1998, launch:"4 Dic 1998", cohete:"Transbordador Endeavour STS-88", base:"Kennedy, Florida",
        agency:"CONAE (Argentina)",
        orbit:"400 km (reingresó 2002)", mass:"68 kg", type:"Satélite tecnológico",
        color:"#7dd3fc", badge:"REINGRESÓ 2002", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"Primer satélite argentino lanzado exitosamente desde el transbordador espacial de NASA. Demostró tecnología de paneles solares y sistemas de control de actitud. Fue el primer satélite íntegramente argentino en llegar al espacio exitosamente.",
        facts:["Lanzado desde el transbordador Endeavour de NASA","Primer sat argentino en órbita exitosamente","Demostró tecnología propia de CONAE","Reingresó a la atmósfera en 2002"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
        specs:[["NORAD ID","25635"],["Lanzamiento","4 Dic 1998"],["Cohete","STS-88 Endeavour"],["Masa","68 kg"],["Operación","1998–2000"],["Reingreso","2002"],["Fabricante","CONAE"],["Tipo","Tecnológico"]],
      },
      {
        id:"SAC_C", norad:26958, name:"SAC-C", full:"Satélite de Aplicaciones Científicas C",
        year:2000, launch:"21 Nov 2000", cohete:"Delta II", base:"Vandenberg, California",
        agency:"CONAE (Argentina) / NASA / ASI / DLR",
        orbit:"705 km · SSO", mass:"485 kg", type:"Satélite de observación terrestre",
        color:"#38bdf8", badge:"REINGRESÓ 2013", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite de observación terrestre de CONAE, en colaboración con NASA, ASI (Italia) y DLR (Alemania). Monitoreó cambios en el uso del suelo, desastres naturales y el campo magnético terrestre durante 10 años antes de fallar.",
        facts:["Primera colaboración multiespacial de CONAE","Monitoreó glaciares argentinos y patagónicos","Cooperación con NASA, Italia y Alemania","Operó 10 años con datos de alta calidad"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        specs:[["NORAD ID","26958"],["Lanzamiento","21 Nov 2000"],["Cohete","Delta II"],["Masa","485 kg"],["Órbita","705 km SSO"],["Operación","2000–2013"],["Agencias","CONAE+NASA+ASI+DLR"],["Tipo","Observación terrestre"]],
      },
      {
        id:"ARSAT1", norad:40272, name:"ARSAT-1", full:"Primer Satélite Geoestacionario Argentino",
        year:2014, launch:"16 Oct 2014", cohete:"Ariane 5", base:"Kourou, Guayana Francesa",
        agency:"INVAP (fabricante) / ARSAT (operador)",
        orbit:"35,786 km · GEO 71.8° W", mass:"2,900 kg", type:"Telecomunicaciones GEO",
        color:"#60a5fa", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El mayor logro tecnológico de Argentina: primer satélite geoestacionario diseñado y fabricado íntegramente en Latinoamérica. INVAP, la empresa estatal que también hace reactores nucleares, demostró al mundo que la región puede hacer satélites de telecomunicaciones de clase mundial.",
        facts:["Primer geoestacionario hecho en Latinoamérica","Fabricado íntegramente por INVAP Argentina","Cubre Argentina, Chile y Uruguay","Da TV, internet y telefonía satelital"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80",
        specs:[["NORAD ID","40272"],["Lanzamiento","16 Oct 2014"],["Cohete","Ariane 5"],["Fabricante","INVAP · Argentina"],["Posición GEO","71.8° W"],["Masa","2,900 kg"],["Transponders","24 Ku-band"],["Vida útil","15 años"]],
      },
      {
        id:"ARSAT2", norad:40941, name:"ARSAT-2", full:"Segundo Satélite Geoestacionario Argentino",
        year:2015, launch:"30 Sep 2015", cohete:"Ariane 5", base:"Kourou, Guayana Francesa",
        agency:"INVAP (fabricante) / ARSAT (operador)",
        orbit:"35,786 km · GEO 81° W", mass:"~3,000 kg", type:"Telecomunicaciones GEO",
        color:"#93c5fd", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"Segundo satélite geoestacionario argentino, también fabricado por INVAP. Amplía la cobertura hasta Norteamérica y el Atlántico Norte, consolidando a Argentina como potencia regional en telecomunicaciones satelitales.",
        facts:["Segundo geoestacionario hecho en Argentina","Amplía cobertura hasta Norteamérica","Conecta Argentina con el mundo","Consolidó a INVAP como fabricante espacial"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
        specs:[["NORAD ID","40941"],["Lanzamiento","30 Sep 2015"],["Cohete","Ariane 5"],["Fabricante","INVAP · Argentina"],["Posición GEO","81° W"],["Cobertura","América + Atlántico N"],["Banda","Ku + C"],["Vida útil","15 años"]],
      },
      {
        id:"ARSAT3", norad:44507, name:"ARSAT-SG1", full:"Tercer Satélite Geoestacionario Argentino",
        year:2019, launch:"18 Mar 2019", cohete:"Falcon 9", base:"Cabo Cañaveral, Florida",
        agency:"SSL (fabricante) / ARSAT (operador)",
        orbit:"35,786 km · GEO 81.1° W", mass:"~4,400 kg", type:"Telecomunicaciones GEO",
        color:"#bfdbfe", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"Tercer satélite geoestacionario argentino, pero fabricado por SSL de EE.UU. a diferencia de los dos anteriores hechos por INVAP. Complementa a ARSAT-2 en la posición 81° W con mayor capacidad en banda Ka para internet de alta velocidad.",
        facts:["Tercer geoestacionario argentino","Fabricado por SSL (EE.UU.) — no por INVAP","Lanzado en Falcon 9 de SpaceX","Mayor capacidad Ka para internet rural"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
        specs:[["NORAD ID","44507"],["Lanzamiento","18 Mar 2019"],["Cohete","Falcon 9"],["Fabricante","SSL · EE.UU."],["Posición GEO","81.1° W"],["Banda","C + Ku + Ka"],["Masa","~4,400 kg"],["Operador","ARSAT"]],
      },
    ],
  },
  {
    id:"BR", name:"Brasil", flag:"🇧🇷",
    color:"#4ade80",
    accentColor:"#4ade80",
    desc:"El programa espacial más antiguo de Sudamérica, con agencia propia desde 1961. INPE es referencia mundial en monitoreo ambiental y deforestación amazónica.",
    agency:"INPE · AEB · Telebras",
    stats:[["10+","satélites lanzados"],["1985","primer satélite"],["3","en órbita activa"]],
    sats:[
      {
        id:"BRASILSAT_A1", norad:15652, name:"Brasilsat A1", full:"Primer Satélite de Telecomunicaciones Brasileño",
        year:1985, launch:"8 Feb 1985", cohete:"Ariane 3", base:"Kourou, Guayana Francesa",
        agency:"Embratel / Hughes (EE.UU.)",
        orbit:"GEO (retirado 2002)", mass:"670 kg", type:"Telecomunicaciones GEO",
        color:"#475569", badge:"RETIRADO", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite de Brasil, lanzado en 1985 para proveer televisión y telefonía a todo el país. Fabricado por Hughes Aircraft de EE.UU., fue operado por Embratel. Cubrió Brasil durante más de 15 años y fue reemplazado gradualmente por satélites más modernos.",
        facts:["Primer satélite brasileño — 1985","Fabricado por Hughes Aircraft de EE.UU.","Cubrió Brasil con TV y telefonía","Fue reemplazado en 2002"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80",
        specs:[["NORAD ID","15652"],["Lanzamiento","8 Feb 1985"],["Cohete","Ariane 3"],["Fabricante","Hughes · EE.UU."],["Operador","Embratel"],["Masa","670 kg"],["Operación","1985–2002"],["Tipo","GEO Telecom"]],
      },
      {
        id:"SGDC", norad:42692, name:"SGDC-1", full:"Satélite Geoestacionario de Defensa y Comunicaciones",
        year:2017, launch:"4 May 2017", cohete:"Ariane 5", base:"Kourou, Guayana Francesa",
        agency:"Thales Alenia Space (fabricante) / Telebras + FAB (operadores)",
        orbit:"35,786 km · GEO 75° W", mass:"6,000 kg", type:"Telecomunicaciones dual (civil/militar)",
        color:"#86efac", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"Satélite geoestacionario dual de Brasil: provee internet por banda Ka a comunidades remotas (civil) y comunicaciones seguras a las Fuerzas Armadas brasileñas (militar). Cubre todo el territorio nacional incluyendo la Amazonía.",
        facts:["Dual civil y militar — único en Latinoamérica","Internet banda Ka para amazonia remota","Comunicaciones seguras para Fuerzas Armadas","Cubre todo el territorio brasileño"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=1200&q=80",
        specs:[["NORAD ID","42692"],["Lanzamiento","4 May 2017"],["Cohete","Ariane 5"],["Fabricante","Thales Alenia Space"],["Operador","Telebras + FAB"],["Posición GEO","75° W"],["Banda","Ka (civil) + X (mil)"],["Masa","6,000 kg"]],
      },
      {
        id:"AMAZONIA1", norad:47699, name:"Amazonia-1", full:"Satélite de Observación Amazónica",
        year:2021, launch:"28 Feb 2021", cohete:"PSLV-C51", base:"Sriharikota, India",
        agency:"INPE — Instituto Nacional de Pesquisas Espaciais",
        orbit:"752 km · SSO", mass:"637 kg", type:"Satélite de observación terrestre",
        color:"#4ade80", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El primer satélite óptico completamente desarrollado por Brasil. Diseñado y construido íntegramente por INPE, monitorea la deforestación amazónica con una cámara multiespectral de 60m de resolución capaz de fotografiar una franja de 850 km de ancho.",
        facts:["Primer satélite óptico 100% brasileño","Monitorea deforestación con 60m de resolución","Franja de 850 km de ancho — ve casi todo Brasil","Construido completamente por INPE"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=80",
        specs:[["NORAD ID","47699"],["Lanzamiento","28 Feb 2021"],["Cohete","PSLV-C51 · India"],["Fabricante","INPE · Brasil"],["Órbita","752 km SSO"],["Resolución","60 m"],["Ancho franja","850 km"],["Misión","Monitoreo Amazonas"]],
      },
    ],
  },
  {
    id:"MX", name:"México", flag:"🇲🇽",
    color:"#fbbf24",
    accentColor:"#fbbf24",
    desc:"Tres generaciones de satélites geoestacionarios Morelos para conectar un país de 130 millones de personas, incluyendo las zonas rurales más remotas.",
    agency:"SCT · AEM",
    stats:[["6+","satélites lanzados"],["1985","primer satélite"],["2","en órbita activa"]],
    sats:[
      {
        id:"MORELOS1", norad:15868, name:"Morelos-1", full:"Primer Satélite Mexicano de Telecomunicaciones",
        year:1985, launch:"17 Jun 1985", cohete:"Transbordador Discovery STS-51-G", base:"Kennedy, Florida",
        agency:"SCT México / Hughes (EE.UU.)",
        orbit:"GEO (retirado 1996)", mass:"654 kg", type:"Telecomunicaciones GEO",
        color:"#475569", badge:"RETIRADO", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite mexicano, lanzado desde el transbordador Discovery de NASA. Proveyó televisión, telefonía y datos a México y Centroamérica durante más de 10 años. Su nombre honra a José María Morelos, héroe de la independencia mexicana.",
        facts:["Primer satélite mexicano — lanzado desde Discovery","Nombrado por el héroe de independencia Morelos","Cubrió México y Centroamérica","Retirado en 1996 tras 11 años de servicio"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
        specs:[["Lanzamiento","17 Jun 1985"],["Cohete","STS-51-G Discovery"],["Fabricante","Hughes · EE.UU."],["Masa","654 kg"],["Operación","1985–1996"],["Posición GEO","116.8° W"],["Tipo","Telecom GEO"],["Operador","SCT México"]],
      },
      {
        id:"MORELOS3", norad:41036, name:"Morelos-3", full:"Tercer Satélite Mexicano de Telecomunicaciones",
        year:2015, launch:"2 Oct 2015", cohete:"Falcon 9", base:"Cabo Cañaveral, Florida",
        agency:"Boeing (fabricante) / SCT México (operador)",
        orbit:"35,786 km · GEO 116.8° W", mass:"~5,384 kg", type:"Telecomunicaciones GEO",
        color:"#fbbf24", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El tercer satélite mexicano Morelos, fabricado por Boeing y lanzado en el primer Falcon 9 con propósito comercial reutilizado. Provee conectividad a las zonas más remotas de México en bandas Ku y Ka, y fue el primer satélite comercial lanzado por SpaceX.",
        facts:["Lanzado en el primer Falcon 9 comercial de SpaceX","Fabricado por Boeing — el más grande hasta hoy","Conectividad para zonas rurales de México","Bandas Ku + Ka para máxima cobertura"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=1200&q=80",
        specs:[["NORAD ID","41036"],["Lanzamiento","2 Oct 2015"],["Cohete","Falcon 9"],["Fabricante","Boeing · EE.UU."],["Posición GEO","116.8° W"],["Banda","Ku + Ka"],["Masa","~5,384 kg"],["Potencia","25 kW"]],
      },
    ],
  },
  {
    id:"BO", name:"Bolivia", flag:"🇧🇴",
    color:"#f97316",
    accentColor:"#f97316",
    desc:"El satélite Túpac Katari, único satélite boliviano, lleva el nombre del líder indígena aimara y conecta a las comunidades más remotas de los Andes.",
    agency:"ABE — Agencia Boliviana Espacial",
    stats:[["1","satélite lanzado"],["2013","primer satélite"],["1","en órbita"]],
    sats:[
      {
        id:"TUPAC", norad:39217, name:"Túpac Katari", full:"Satélite de Telecomunicaciones de Bolivia",
        year:2013, launch:"20 Dic 2013", cohete:"Long March 3B", base:"Xichang, China",
        agency:"CAST China (fabricante) / ABE Bolivia (operador)",
        orbit:"35,786 km · GEO 87.2° W", mass:"5,100 kg", type:"Telecomunicaciones GEO",
        color:"#f97316", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El único satélite de Bolivia, nombrado por el líder indígena aimara que lideró una rebelión contra la corona española en el siglo XVIII. Fabricado en China por CAST, provee televisión directa, internet y telefonía a comunidades andinas y amazónicas bolivianas.",
        facts:["Único satélite boliviano — fabricado en China","Nombrado por el líder aimara Túpac Katari","Conecta comunidades andinas y amazónicas","Bolivia pagó USD 302 millones por el proyecto"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        specs:[["NORAD ID","39217"],["Lanzamiento","20 Dic 2013"],["Cohete","Long March 3B"],["Fabricante","CAST · China"],["Posición GEO","87.2° W"],["Banda","C + Ku"],["Masa","5,100 kg"],["Costo","USD ~302 M"]],
      },
    ],
  },
  {
    id:"VE", name:"Venezuela", flag:"🇻🇪",
    color:"#f87171",
    accentColor:"#f87171",
    desc:"Venezuela lanzó su primer satélite en 2008 bautizándolo Simón Bolívar. Su estado operativo actual es incierto, reflejo de la situación del país.",
    agency:"ABAE — Agencia Bolivariana para Actividades Espaciales",
    stats:[["2","satélites lanzados"],["2008","primer satélite"],["1","activo (dudoso)"]],
    sats:[
      {
        id:"VENESAT", norad:33410, name:"VENESAT-1", full:"Satélite Simón Bolívar",
        year:2008, launch:"29 Oct 2008", cohete:"Long March 3B", base:"Xichang, China",
        agency:"CAST China (fabricante) / ABAE Venezuela (operador)",
        orbit:"35,786 km · GEO 78° W", mass:"~5,000 kg", type:"Telecomunicaciones GEO",
        color:"#f87171", badge:"ESTADO INCIERTO", badgeColor:"#f59e0b", status:"EN ÓRBITA",
        mission:"Único satélite venezolano, bautizado Simón Bolívar en honor al Libertador. Fabricado en China, proveyó TV e internet a Venezuela. Con la vida útil vencida (15 años) y la crisis venezolana, su estado operativo actual es desconocido.",
        facts:["Nombrado Simón Bolívar — el Libertador","Fabricado en China por CAST","Vida útil de 15 años vencida en 2023","Estado operativo incierto por crisis venezolana"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1200&q=80",
        specs:[["NORAD ID","33410"],["Lanzamiento","29 Oct 2008"],["Cohete","Long March 3B"],["Fabricante","CAST · China"],["Posición GEO","78° W"],["Banda","C + Ku + Ka"],["Masa","~5,000 kg"],["Vida útil","15 años (vencida 2023)"]],
      },
    ],
  },
  {
    id:"PE", name:"Perú", flag:"🇵🇪",
    color:"#f87171",
    accentColor:"#ef4444",
    desc:"PerúSAT-1, el único satélite peruano, es uno de los más avanzados de Latinoamérica con resolución sub-métrica para combatir la minería ilegal y la deforestación.",
    agency:"CONIDA — Comisión Nacional de Investigación y Desarrollo Aeroespacial",
    stats:[["1","satélite activo"],["2016","primer satélite"],["1","en órbita"]],
    sats:[
      {
        id:"PERUSAT1", norad:41818, name:"PerúSAT-1", full:"Satélite Peruano de Observación Terrestre",
        year:2016, launch:"16 Sep 2016", cohete:"Vega", base:"Kourou, Guayana Francesa",
        agency:"Airbus DS (fabricante) / CONIDA Perú (operador)",
        orbit:"670 km · SSO", mass:"~430 kg", type:"Satélite de observación de alta resolución",
        color:"#f87171", badge:"EN ÓRBITA", badgeColor:"#4ade80", status:"EN ÓRBITA",
        mission:"El único satélite de Perú y uno de los más avanzados de Latinoamérica. Con resolución de 0.7 m puede identificar vehículos, edificaciones ilegales y campamentos de minería. Fabricado por Airbus DS, es operado por CONIDA para vigilar el territorio peruano.",
        facts:["Resolución 0.7m — identifica vehículos y estructuras","Combate minería ilegal y deforestación","El sat de observación más avanzado de LATAM","Perú entrenó a sus propios técnicos en Francia"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&q=80",
        specs:[["NORAD ID","41818"],["Lanzamiento","16 Sep 2016"],["Cohete","Vega · ESA"],["Fabricante","Airbus DS · Francia"],["Órbita","670 km SSO"],["Resolución","0.7 m pancro."],["Ancho franja","14 km"],["Vida útil","10 años"]],
      },
    ],
  },
  {
    id:"CO", name:"Colombia", flag:"🇨🇴",
    color:"#fde047",
    accentColor:"#fde047",
    desc:"Colombia tiene una historia espacial emergente. Su primer satélite Libertad-1 fue breve, pero hoy el país invierte en el desarrollo de nuevas capacidades universitarias.",
    agency:"U. Sergio Arboleda · UNAL · CCCP",
    stats:[["2","satélites lanzados"],["2007","primer satélite"],["0","actualmente en órbita"]],
    sats:[
      {
        id:"LIBERTAD1", norad:31128, name:"Libertad-1", full:"Primer Satélite Colombiano",
        year:2007, launch:"17 Abr 2007", cohete:"Dnepr", base:"Baikonur, Kazajistán",
        agency:"Universidad Sergio Arboleda (Colombia)",
        orbit:"LEO (reingresó 2008)", mass:"~1 kg", type:"CubeSat 1U — Educacional",
        color:"#fde047", badge:"REINGRESÓ 2008", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite colombiano, desarrollado por estudiantes de la Universidad Sergio Arboleda. Operó brevemente transmitiendo señales de radio antes de reingresara la atmósfera en 2008. Marcó el inicio de la era espacial colombiana.",
        facts:["Primer satélite colombiano — 2007","Desarrollado por estudiantes universitarios","Transmitió señales de radio brevemente","Reingresó a la atmósfera en 2008"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1200&q=80",
        specs:[["NORAD ID","31128"],["Lanzamiento","17 Abr 2007"],["Cohete","Dnepr"],["Masa","~1 kg"],["Operación","2007 (breve)"],["Estado","Reingresó 2008"],["Universidad","Sergio Arboleda"],["Tipo","CubeSat 1U"]],
      },
    ],
  },
  {
    id:"EC", name:"Ecuador", flag:"🇪🇨",
    color:"#a3e635",
    accentColor:"#a3e635",
    desc:"Ecuador fue pionero con su primer satélite en 2013. La Fundación EXA continúa desarrollando nuevas generaciones de satélites pequeños.",
    agency:"EXA — Agencia Espacial Civil Ecuatoriana",
    stats:[["2","satélites lanzados"],["2013","primer satélite"],["0","actualmente en órbita"]],
    sats:[
      {
        id:"PEGASO", norad:38760, name:"NEE-01 Pegaso", full:"Primer Satélite Ecuatoriano",
        year:2013, launch:"26 Abr 2013", cohete:"Dnepr", base:"Dombarovsky, Rusia",
        agency:"Fundación EXA (Ecuador)",
        orbit:"LEO (reingresó Jun 2013)", mass:"~1.2 kg", type:"CubeSat — Radio/Video",
        color:"#a3e635", badge:"REINGRESÓ 2013", badgeColor:"#475569", status:"REINGRESÓ",
        mission:"El primer satélite ecuatoriano, desarrollado por la Fundación EXA con apoyo del gobierno. Transmitió imágenes de video en vivo desde el espacio y señales de audio antes de reingresara la atmósfera apenas 2 meses después del lanzamiento.",
        facts:["Primer satélite ecuatoriano — Fundación EXA","Transmitió video en vivo desde el espacio","Solo operó 2 meses antes de reingresara","Ecuador fue el país más pequeño con sat propio"],
        photo:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/CubeSat_in_orbit.jpg/1280px-CubeSat_in_orbit.jpg",
        bgPhoto:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80",
        specs:[["NORAD ID","38760"],["Lanzamiento","26 Abr 2013"],["Cohete","Dnepr"],["Fabricante","Fundación EXA"],["Masa","~1.2 kg"],["Operación","Abr–Jun 2013"],["Estado","Reingresó Jun 2013"],["Tipo","CubeSat"]],
      },
    ],
  },
];

const ACTIVE_NORADS = COUNTRIES_DATA.flatMap(c =>
  c.sats.filter(s => s.norad && s.status === "EN ÓRBITA").map(s => ({ id: s.id, norad: s.norad }))
);

const LINKS = [
  ["Rastreo",            "/"],
  ["Satélites LATAM",    "/satelites-chilenos"],
  ["Lanzamientos",       "/lanzamientos"],
  ["Clima espacial",     "/espacio"],
  ["Noticias",           "/noticias"],
  ["Contacto",           "/contacto"],
];

/* ─────────────────────────────────────────────
   COMPONENTES
───────────────────────────────────────────── */
function SatCard({ sat, pos, accentColor, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const [tilt, setTilt]         = useState({ x:0, y:0 });
  const cardRef = useRef(null);
  const isLive = sat.norad && pos && sat.status === "EN ÓRBITA";
  const color = sat.color || accentColor;

  function onMouseMove(e) {
    if (expanded) return;
    const r = cardRef.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left)  / r.width  - 0.5) * 7;
    const y = -((e.clientY - r.top)   / r.height - 0.5) * 7;
    setTilt({ x, y });
  }
  function onMouseLeave() { setTilt({ x:0, y:0 }); }

  return (
    <div
      ref={cardRef}
      onClick={() => setExpanded(e => !e)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position:"relative", borderRadius:20, overflow:"hidden",
        border:`1px solid ${color}${expanded?"44":"22"}`,
        cursor:"pointer",
        background:"rgba(0,0,0,0.55)",
        transform: expanded
          ? "none"
          : `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: expanded
          ? "transform 0.3s ease, border-color 0.25s"
          : "border-color 0.25s, box-shadow 0.25s",
        boxShadow: expanded ? "none" : `0 ${4+Math.abs(tilt.y)}px ${16+Math.abs(tilt.x)*2}px rgba(0,0,0,0.3)`,
        animation:`slideUp 0.4s ease ${index*0.07}s both`,
      }}
    >
      {/* Imagen de fondo */}
      <div style={{ height: expanded ? 260 : 180, overflow:"hidden", position:"relative", transition:"height 0.4s ease" }}>
        <img src={sat.bgPhoto} alt={sat.name}
          style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.3, display:"block", transition:"opacity 0.3s, transform 0.4s" }}
          onError={e => { e.target.style.display = "none"; }}
        />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to bottom, ${color}08 0%, rgba(0,0,0,0.9) 100%)` }}/>

        {/* Año */}
        <div style={{ position:"absolute", top:14, left:16, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:"0.18em" }}>{sat.year}</div>

        {/* Badge estado */}
        <div style={{ position:"absolute", top:14, right:14, fontFamily:"'IBM Plex Mono',monospace", fontSize:8, letterSpacing:"0.14em", padding:"3px 9px", borderRadius:99, background:sat.badgeColor+"22", border:`1px solid ${sat.badgeColor}44`, color:sat.badgeColor }}>{sat.badge}</div>

        {/* Live dot */}
        {isLive && (
          <div style={{ position:"absolute", bottom:14, right:14, display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, background:"rgba(0,0,0,0.6)", border:`1px solid ${color}40` }}>
            <span style={{ display:"block", width:4, height:4, borderRadius:"50%", background:"#4ade80", animation:"livePulse 2s infinite" }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color:"#4ade80", letterSpacing:"0.1em" }}>EN VIVO</span>
          </div>
        )}

        {/* Nombre */}
        <div style={{ position:"absolute", bottom:14, left:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(18px,3vw,26px)", fontWeight:800, color:"#fff", lineHeight:1 }}>{sat.name}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:12, color, marginTop:3 }}>{sat.type}</div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", padding:"16px 18px" }}>
        {/* Meta rápida */}

        {/* Año */}
        <div style={{ position:"absolute", top:14, left:16, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.25)", letterSpacing:"0.18em" }}>{sat.year}</div>

        {/* Badge estado */}
        <div style={{ position:"absolute", top:14, right:14, fontFamily:"'IBM Plex Mono',monospace", fontSize:8, letterSpacing:"0.14em", padding:"3px 9px", borderRadius:99, background:sat.badgeColor+"22", border:`1px solid ${sat.badgeColor}44`, color:sat.badgeColor }}>{sat.badge}</div>

        {/* Live dot */}
        {isLive && (
          <div style={{ position:"absolute", bottom:14, right:14, display:"flex", alignItems:"center", gap:5, padding:"3px 9px", borderRadius:99, background:"rgba(0,0,0,0.6)", border:`1px solid ${color}40` }}>
            <span style={{ display:"block", width:4, height:4, borderRadius:"50%", background:"#4ade80", animation:"livePulse 2s infinite" }}/>
            <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color:"#4ade80", letterSpacing:"0.1em" }}>EN VIVO</span>
          </div>
        )}

        {/* Nombre */}
        <div style={{ position:"absolute", bottom:14, left:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(18px,3vw,26px)", fontWeight:800, color:"#fff", lineHeight:1 }}>{sat.name}</div>
          <div style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic", fontSize:12, color, marginTop:3 }}>{sat.type}</div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", padding:"16px 18px" }}>
        {/* Meta rápida */}
        <div style={{ display:"flex", gap:16, marginBottom:12, flexWrap:"wrap" }}>
          {[["Lanzamiento", sat.launch], ["Cohete", sat.cohete?.split(" · ")[0]], ["Órbita", sat.orbit]].map(([l, v]) => v && (
            <div key={l}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color:"rgba(255,255,255,0.22)", letterSpacing:"0.1em", marginBottom:1 }}>{l.toUpperCase()}</div>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.65)" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Misión */}
        <p style={{ fontSize:12.5, color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:10, display:expanded?"block":"-webkit-box", WebkitLineClamp:expanded?undefined:2, WebkitBoxOrient:"vertical", overflow:expanded?"visible":"hidden" }}>
          {sat.mission}
        </p>

        {/* Expandido */}
        {expanded && (
          <div style={{ animation:"fadeUp 0.25s ease both" }}>
            {/* Hechos */}
            <div style={{ marginBottom:16, padding:"12px 14px", background:color+"0a", borderRadius:12, border:`1px solid ${color}20` }}>
              <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color, letterSpacing:"0.14em", marginBottom:9 }}>HECHOS DESTACADOS</div>
              {sat.facts.map((f,i) => (
                <div key={i} style={{ display:"flex", gap:7, marginBottom:6, alignItems:"flex-start" }}>
                  <span style={{ color, fontSize:9, marginTop:2, flexShrink:0 }}>→</span>
                  <span style={{ fontSize:11.5, color:"rgba(255,255,255,0.55)", lineHeight:1.5 }}>{f}</span>
                </div>
              ))}
            </div>

            {/* Specs */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5, marginBottom:14 }}>
              {sat.specs.map(([label, val]) => (
                <div key={label} style={{ padding:"7px 10px", background:"rgba(255,255,255,0.03)", borderRadius:8, border:"1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7, color:"rgba(255,255,255,0.22)", letterSpacing:"0.1em", marginBottom:1 }}>{label.toUpperCase()}</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.65)" }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Posición en vivo */}
            {isLive && pos && (
              <div style={{ padding:"10px 14px", background:"rgba(74,222,128,0.05)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:10, marginBottom:12 }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:7 }}>
                  <span style={{ display:"block", width:4, height:4, borderRadius:"50%", background:"#4ade80", animation:"livePulse 2s infinite" }}/>
                  <span style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:8, color:"#4ade80", letterSpacing:"0.12em" }}>POSICIÓN EN VIVO</span>
                </div>
                <div style={{ display:"flex", gap:18, flexWrap:"wrap" }}>
                  {[["Latitud", `${pos.lat?.toFixed(2)}°`], ["Longitud", `${pos.lon?.toFixed(2)}°`], ["Altitud", `${pos.alt_km?.toFixed(0)} km`]].map(([l,v]) => (
                    <div key={l}>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>{l}</div>
                      <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:13, color:"#4ade80", fontWeight:600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Rastrear */}
            {sat.norad && sat.status === "EN ÓRBITA" && (
              <a href="/" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:7, padding:"10px 18px", borderRadius:10, background:color+"14", border:`1px solid ${color}35`, color, fontFamily:"'IBM Plex Mono',monospace", fontSize:10, letterSpacing:"0.1em", textDecoration:"none", transition:"all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = color+"22"; }}
                onMouseLeave={e => { e.currentTarget.style.background = color+"14"; }}
              >
                🛰 Rastrear {sat.name} en tiempo real →
              </a>
            )}
          </div>
        )}

        {/* Toggle */}
        <div style={{ textAlign:"center", marginTop:10, fontFamily:"'IBM Plex Mono',monospace", fontSize:8.5, color:"rgba(255,255,255,0.18)", letterSpacing:"0.1em" }}>
          {expanded ? "▲ MOSTRAR MENOS" : "▼ VER DETALLES"}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────────── */
export default function SatelitesLatam() {
  usePageMeta({
    title:       "Satélites de Latinoamérica — Historia espacial de LATAM",
    description: "Todos los satélites de Chile, Argentina, Brasil, México, Bolivia, Venezuela, Perú, Colombia y Ecuador. Historia, misión, specs y posición en vivo.",
    url:         "https://australorbit.com/satelites-chilenos",
  });

  const { userCountryCode, userCountry, geoPrompt, setGeoPrompt, requestGeo } = useGeoLocation();

  // Elegir país activo — default al país del usuario si está en LATAM, si no Chile
  const defaultCountry = COUNTRIES_DATA.find(c => c.id === userCountryCode)?.id || "CL";
  const [activeCountry, setActiveCountry] = useState(defaultCountry);

  // Actualizar cuando llega la geolocalización
  useEffect(() => {
    const found = COUNTRIES_DATA.find(c => c.id === userCountryCode);
    if (found) setActiveCountry(found.id);
  }, [userCountryCode]);

  const [positions, setPositions]   = useState({});
  const [logoError, setLogoError]   = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [filterStatus, setFilterStatus] = useState("todos"); // todos | orbita | historico

  const country = COUNTRIES_DATA.find(c => c.id === activeCountry) || COUNTRIES_DATA[0];

  // Polling posiciones en vivo
  useEffect(() => {
    ACTIVE_NORADS.forEach(({ id }) => {
      const go = () => {
        fetch(`${API}/position/${id}`)
          .then(r => r.json())
          .then(pos => setPositions(p => ({ ...p, [id]: pos })))
          .catch(() => {});
      };
      go();
      const t = setInterval(go, 12000);
      return () => clearInterval(t);
    });
  }, []);

  const filteredSats = country.sats.filter(s => {
    if (filterStatus === "orbita")    return s.status === "EN ÓRBITA";
    if (filterStatus === "historico") return s.status !== "EN ÓRBITA";
    return true;
  });

  const inOrbitCount    = country.sats.filter(s => s.status === "EN ÓRBITA").length;
  const historicalCount = country.sats.filter(s => s.status !== "EN ÓRBITA").length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=IBM+Plex+Mono:wght@400;500&family=Outfit:wght@300;400;500&family=Playfair+Display:ital,wght@1,400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        body{background:#000;color:#E0E8F0;font-family:'Outfit',sans-serif;min-height:100vh;overflow-x:hidden;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:#111;}
        a{color:inherit;} button{cursor:pointer;border:none;background:none;font-family:inherit;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.2;transform:scale(1.6)}}
        @keyframes earthDrift{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.02)}}
        @keyframes earthFadeIn{from{opacity:0}to{opacity:1}}
        @keyframes accentSlide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
        @keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gradientBorder{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        .country-btn{transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;}
        .country-btn:hover{transform:translateY(-4px) scale(1.06);}
        .country-btn:active{transform:scale(0.92);}
        .nav-link{text-decoration:none;transition:opacity 0.2s;white-space:nowrap;}
        .nav-hamburger{display:none;align-items:center;justify-content:center;width:40px;height:40px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;flex-direction:column;gap:5px;padding:0;}
        .nav-hamburger span{display:block;width:18px;height:1.5px;background:rgba(255,255,255,0.8);border-radius:2px;transition:all 0.25s;}
        .sat-card-enter{animation:slideUp 0.4s ease both;}
        @media(max-width:700px){
          .nav-desktop{display:none!important;}
          .nav-hamburger{display:flex!important;}
          .page-pad{padding:0 14px!important;}
          .sats-grid{grid-template-columns:1fr!important;}
          .country-picker{gap:8px!important;}
          .country-btn .flag-label{display:none;}
        }
      `}</style>

      {geoPrompt && <GeoSplash onAccept={requestGeo} onSkip={() => setGeoPrompt(false)} accentColor={country.accentColor}/>}

      {/* Fondo dinámico según país */}
      <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none", transition:"all 1s" }}>
        <div style={{ position:"absolute", inset:0, background:"#000" }}/>
        <div style={{ position:"absolute", inset:0, animation:"earthFadeIn 2.5s ease both" }}>
          <img src="/earth-bg.png" alt="" style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"90vmin", height:"90vmin", objectFit:"contain", opacity:0.07, animation:"earthDrift 55s ease-in-out infinite", filter:`saturate(0.5) brightness(0.7) hue-rotate(${COUNTRIES_DATA.indexOf(country)*15}deg)` }}/>
        </div>
        <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 100% 80% at 70% 20%, ${country.accentColor}08 0%, transparent 55%)`, transition:"background 1s" }}/>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 120% 90% at 50% 50%, transparent 0%, rgba(0,0,0,0.8) 60%, rgba(0,0,0,0.97) 100%)" }}/>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.012 }}>
          <defs><pattern id="pg" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse"><path d="M 90 0 L 0 0 0 90" fill="none" stroke={country.accentColor} strokeWidth="0.5"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#pg)"/>
        </svg>
        <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
          {Array.from({length:60},(_,i) => (
            <circle key={i} cx={`${(i*137.5)%100}%`} cy={`${(i*97.3)%100}%`} r={i%7===0?1.1:0.45} fill="white" opacity={0.08+(i%5)*0.04}/>
          ))}
        </svg>
      </div>

      <div className="page-pad" style={{ position:"relative", zIndex:1, padding:"0 22px", minHeight:"100vh" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          {/* Mobile drawer */}
          {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position:"fixed", inset:0, zIndex:140, background:"rgba(0,0,0,0.6)" }}/>}
          {menuOpen && (
            <div style={{ position:"fixed", top:0, left:0, right:0, zIndex:150, background:"rgba(0,0,0,0.97)", borderBottom:"1px solid rgba(255,255,255,0.08)", backdropFilter:"blur(30px)", padding:"80px 24px 24px", display:"flex", flexDirection:"column", gap:4, animation:"fadeUp 0.2s ease both" }}>
              {LINKS.map(([label,href]) => (
                <a key={href} href={href} style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:700, color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.55)", textDecoration:"none", padding:"14px 0", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>{label}</a>
              ))}
            </div>
          )}

          {/* Nav */}
          <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 0 14px", borderBottom:"1px solid rgba(255,255,255,0.07)", animation:"fadeIn 0.7s ease both", gap:16, position:"relative", zIndex:160 }}>
            <a href="/" style={{ display:"flex", alignItems:"center", gap:12, textDecoration:"none", flexShrink:0 }}>
              {!logoError
                ? <img src="/logo.png" alt="Austral Orbit" onError={() => setLogoError(true)} style={{ height:48, width:"auto", objectFit:"contain", filter:"drop-shadow(0 2px 16px rgba(10,28,80,0.6)) brightness(1.08)" }}/>
                : <span style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:800, color:"#fff" }}>AO</span>
              }
              <div>
                <div style={{ display:"flex", alignItems:"baseline", gap:7 }}>
                  <span style={{ fontFamily:"'Syne',sans-serif", fontSize:15, fontWeight:800, letterSpacing:"0.06em", color:"#fff" }}>AUSTRAL</span>
                  <span style={{ fontFamily:"'Playfair Display',serif", fontSize:15, fontStyle:"italic", color:country.accentColor, transition:"color 0.6s" }}>Orbit</span>
                </div>
                <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7, letterSpacing:"0.28em", color:"rgba(255,255,255,0.2)", textTransform:"uppercase", marginTop:1 }}>Satélites LATAM</div>
              </div>
            </a>
            <div className="nav-desktop" style={{ display:"flex", alignItems:"center", gap:2, flex:1, justifyContent:"center" }}>
              {LINKS.map(([label,href]) => (
                <a key={href} href={href} className="nav-link"
                  style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, letterSpacing:"0.08em", color:href==="/satelites-chilenos"?"#fff":"rgba(255,255,255,0.5)", padding:"8px 16px", borderRadius:99, background:href==="/satelites-chilenos"?"rgba(255,255,255,0.06)":"transparent", border:href==="/satelites-chilenos"?"1px solid rgba(255,255,255,0.12)":"1px solid transparent", textDecoration:"none" }}>{label}</a>
              ))}
            </div>
            <button className="nav-hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menú">
              <span style={{ transform:menuOpen?"rotate(45deg) translate(4.5px,4.5px)":"none" }}/>
              <span style={{ opacity:menuOpen?0:1 }}/>
              <span style={{ transform:menuOpen?"rotate(-45deg) translate(4.5px,-4.5px)":"none" }}/>
            </button>
          </nav>

          {/* Hero */}
          <div style={{ padding:"48px 0 36px", animation:"fadeUp 0.8s ease both" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"4px 13px", borderRadius:99, background:`${country.accentColor}12`, border:`1px solid ${country.accentColor}28`, marginBottom:20, transition:"all 0.6s" }}>
              <span style={{ display:"block", width:4, height:4, borderRadius:"50%", background:country.accentColor, animation:"livePulse 2.2s infinite", transition:"background 0.6s" }}/>
              <span style={{ fontSize:8.5, fontFamily:"'IBM Plex Mono',monospace", color:country.accentColor, letterSpacing:"0.2em", textTransform:"uppercase", transition:"color 0.6s" }}>
                Programas espaciales de Latinoamérica
              </span>
            </div>
            <h1 style={{ lineHeight:1.05, letterSpacing:"-0.02em", marginBottom:14 }}>
              <span style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(28px,4.5vw,56px)", fontWeight:800, color:"#fff", display:"block" }}>El espacio</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px,4.8vw,60px)", fontStyle:"italic", color:country.accentColor, display:"block", transition:"color 0.6s", animation:"accentSlide 0.5s ease both" }}>latinoamericano</span>
            </h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.3)", lineHeight:1.8, fontWeight:300, maxWidth:560, marginBottom:0 }}>
              Todos los satélites de Chile, Argentina, Brasil, México y más — historia, misión y posición en vivo.
            </p>
          </div>

          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${country.accentColor}50,transparent)`, transition:"background 0.6s", marginBottom:32 }}/>

          {/* ── SELECTOR DE PAÍSES ── */}
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:8, fontFamily:"'IBM Plex Mono',monospace", color:"rgba(255,255,255,0.2)", letterSpacing:"0.18em", textTransform:"uppercase", marginBottom:14 }}>Elige un país</div>
            <div className="country-picker" style={{ display:"flex", gap:10, overflowX:"auto", scrollbarWidth:"none", paddingBottom:4 }}>
              {COUNTRIES_DATA.map(c => {
                const isActive = c.id === activeCountry;
                return (
                  <button key={c.id} className="country-btn"
                    onClick={() => { setActiveCountry(c.id); setFilterStatus("todos"); }}
                    style={{
                      flexShrink:0,
                      padding:"10px 14px",
                      borderRadius:14,
                      background: isActive ? `${c.accentColor}16` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${isActive ? c.accentColor+"50" : "rgba(255,255,255,0.07)"}`,
                      boxShadow: isActive ? `0 0 20px ${c.accentColor}18` : "none",
                      transition:"all 0.2s",
                    }}
                  >
                    <span style={{ fontSize:26, display:"block", lineHeight:1 }}>{c.flag}</span>
                    <span className="flag-label" style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color: isActive ? c.accentColor : "rgba(255,255,255,0.3)", letterSpacing:"0.06em", marginTop:4, transition:"color 0.2s", whiteSpace:"nowrap" }}>
                      {c.name}
                    </span>
                    {c.sats.some(s => s.status === "EN ÓRBITA") && (
                      <span style={{ display:"block", width:4, height:4, borderRadius:"50%", background:"#4ade80", margin:"2px auto 0", opacity:0.8 }}/>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── PANEL DEL PAÍS ACTIVO ── */}
          <div key={activeCountry} style={{ animation:"fadeUp 0.4s ease both" }}>

            {/* Header del país */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, alignItems:"start", marginBottom:28, padding:"22px 26px", borderRadius:20, background:`${country.accentColor}08`, border:`1px solid ${country.accentColor}20` }}>
              <div>
                <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                  <span style={{ fontSize:36 }}>{country.flag}</span>
                  <div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, color:"#fff" }}>{country.name}</div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:9, color:country.accentColor, letterSpacing:"0.1em" }}>{country.agency}</div>
                  </div>
                </div>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.4)", lineHeight:1.7, maxWidth:520 }}>{country.desc}</p>
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:10, flexShrink:0 }}>
                {country.stats.map(([n, l]) => (
                  <div key={l} style={{ textAlign:"right" }}>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:22, fontWeight:600, color:country.accentColor }}>{n}</div>
                    <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:7.5, color:"rgba(255,255,255,0.22)", letterSpacing:"0.08em", textTransform:"uppercase" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filtro de estado */}
            <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
              {[
                ["todos",     `Todos (${country.sats.length})`],
                ["orbita",    `En órbita (${inOrbitCount})`],
                ["historico", `Históricos (${historicalCount})`],
              ].map(([id, label]) => (
                <button key={id}
                  onClick={() => setFilterStatus(id)}
                  style={{
                    padding:"5px 14px", borderRadius:99, fontSize:10,
                    fontFamily:"'IBM Plex Mono',monospace", letterSpacing:"0.06em",
                    background: filterStatus===id ? `${country.accentColor}16` : "transparent",
                    border: `1px solid ${filterStatus===id ? country.accentColor+"44" : "rgba(255,255,255,0.07)"}`,
                    color: filterStatus===id ? country.accentColor : "rgba(255,255,255,0.35)",
                    transition:"all 0.18s",
                  }}
                >{label}</button>
              ))}
            </div>

            {/* Grid de satélites */}
            <div className="sats-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, paddingBottom:56 }}>
              {filteredSats.map((sat, i) => (
                <div key={sat.id} className="sat-card-enter" style={{ animationDelay:`${i*0.07}s` }}>
                  <SatCard sat={sat} pos={positions[sat.id]} accentColor={country.accentColor} index={i}/>
                </div>
              ))}
              {filteredSats.length === 0 && (
                <div style={{ gridColumn:"1/-1", padding:48, textAlign:"center", border:"1px dashed rgba(255,255,255,0.05)", borderRadius:14 }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>🛰</div>
                  <div style={{ fontFamily:"'IBM Plex Mono',monospace", fontSize:10, color:"rgba(255,255,255,0.2)" }}>
                    Sin satélites en esta categoría
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${country.accentColor}25,transparent)`, transition:"background 0.6s" }}/>
          <div style={{ padding:"14px 0 22px", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
            <div style={{ fontSize:7.5, color:"rgba(255,255,255,0.12)", fontFamily:"'IBM Plex Mono',monospace" }}>Owner: Joaquín Valdebenito Palma</div>
            <div style={{ fontSize:8, color:"rgba(255,255,255,0.12)", fontFamily:"'IBM Plex Mono',monospace" }}>Datos verificados: NORAD · CelesTrak · Wikipedia</div>
          </div>
        </div>
      </div>
    </>
  );
}
