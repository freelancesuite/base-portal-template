/* ==========================================
   FreelanceSuite Dashboard
   dashboard.js
   Part 1
========================================== */

/* ==========================================
   CONFIG
========================================== */

const API_URL =
"https://script.google.com/macros/s/AKfycbwmNAEO5TAqMQEMd6nYrpANeuhVk1Y32VKRWg92GU65RkZj2dmWtpT33i8RoCUc6WXuvQ/exec";

/* ==========================================
   STATE
========================================== */

const APP = {

    repoName : "",

    clients : [],

    invoices : [],

    currentClient : null,

    currentInvoice : null,

    stats : {

        totalClients : 0,

        totalInvoices : 0,

        unpaid : 0,

        paid : 0

    }

};

/* ==========================================
   SHORTCUTS
========================================== */

const $ = id => document.getElementById(id);

const $$ = selector => document.querySelectorAll(selector);

/* ==========================================
   INIT
========================================== */

document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard(){

    detectRepository();

    updateDate();

    bindButtons();

    loadDashboard();

}

/* ==========================================
   DETECT REPOSITORY
========================================== */

function detectRepository(){

    /*
        Example:

        https://freelancesuite.github.io/john-portal/dashboard.html

        repo = john-portal
    */

    const path =
    window.location.pathname
    .split("/")
    .filter(Boolean);

    APP.repoName =
    path.length>0 ? path[0] : "";

    console.log("Repository:",APP.repoName);

}

/* ==========================================
   DATE
========================================== */

function updateDate(){

    const el = $("todayDate");

    if(!el) return;

    const d = new Date();

    el.innerHTML =
    d.toLocaleDateString(
        "en-PH",
        {
            weekday:"long",
            year:"numeric",
            month:"long",
            day:"numeric"
        }
    );

}

/* ==========================================
   API
========================================== */

async function api(action,data={}){

    showLoader();

    try{

        const res =
        await fetch(API_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action,

                repoName:APP.repoName,

                ...data

            })

        });

        const json =
        await res.json();

        hideLoader();

        return json;

    }

    catch(err){

        hideLoader();

        toast(
            err.message,
            "error"
        );

        return{

            status:"error",

            message:err.message

        };

    }

}

/* ==========================================
   LOADER
========================================== */

function showLoader(){

    const loader =
    $("loader");

    if(loader){

        loader.classList.add("show");

    }

}

function hideLoader(){

    const loader =
    $("loader");

    if(loader){

        loader.classList.remove("show");

    }

}

/* ==========================================
   TOAST
========================================== */

function toast(message,type="success"){

    let div =
    document.createElement("div");

    div.className =
    "toast "+type;

    div.innerHTML =
    message;

    document.body.appendChild(div);

    setTimeout(()=>{

        div.classList.add("show");

    },100);

    setTimeout(()=>{

        div.classList.remove("show");

    },3500);

    setTimeout(()=>{

        div.remove();

    },4000);

}

/* ==========================================
   BUTTON EVENTS
========================================== */

function bindButtons(){

    if($("btnNewClient")){

        $("btnNewClient")
        .onclick=openClientModal;

    }

    if($("btnRefresh")){

        $("btnRefresh")
        .onclick=loadDashboard;

    }

}

/* ==========================================
   LOAD DASHBOARD
========================================== */

async function loadDashboard(){

    console.log("Loading dashboard...");

    await loadStatistics();

    await loadClients();

    await loadInvoices();

}

/* ==========================================
   LOAD STATISTICS
========================================== */

async function loadStatistics(){

    const res =
    await api(
        "dashboardStats"
    );

    if(res.status!="success")
        return;

    APP.stats =
    res.stats;

    if($("statClients"))
        $("statClients").innerHTML=
        res.stats.totalClients;

    if($("statInvoices"))
        $("statInvoices").innerHTML=
        res.stats.totalInvoices;

    if($("statPaid"))
        $("statPaid").innerHTML=
        res.stats.paid;

    if($("statUnpaid"))
        $("statUnpaid").innerHTML=
        res.stats.unpaid;

}

/* ==========================================
   PLACE HOLDERS
========================================== */

async function loadClients(){

    console.log("Loading clients...");

}

async function loadInvoices(){

    console.log("Loading invoices...");

}

function openClientModal(){

    console.log("Open Client Modal");

}